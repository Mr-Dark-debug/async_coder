import Bull from 'bull';
import { redis } from '@/config/redis';
import { logger } from '@/utils/logger';
import { TaskExecutorService } from './task-executor';
import type { JobData, JobResult, TaskPriority } from '@/types';

// Queue configuration
const QUEUE_NAME = 'task-processing';
const REDIS_CONFIG = {
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
    password: process.env.REDIS_PASSWORD,
    db: parseInt(process.env.REDIS_DB || '0'),
  },
};

// Create task queue
export const taskQueue = new Bull(QUEUE_NAME, REDIS_CONFIG);

// Priority mapping
const PRIORITY_MAP: Record<TaskPriority, number> = {
  low: 1,
  medium: 5,
  high: 10,
};

// Job options
const DEFAULT_JOB_OPTIONS = {
  attempts: 3,
  backoff: {
    type: 'exponential',
    delay: 2000,
  },
  removeOnComplete: 50, // Keep last 50 completed jobs
  removeOnFail: 100, // Keep last 100 failed jobs
};

export class TaskQueueService {
  /**
   * Initialize queue processors
   */
  static initialize(): void {
    // Process task execution jobs
    taskQueue.process('execute-task', 5, this.processTaskExecution);

    // Process cleanup jobs
    taskQueue.process('cleanup-task', 1, this.processTaskCleanup);

    // Set up event listeners
    this.setupEventListeners();

    logger.info('Task queue initialized successfully');
  }

  /**
   * Add task to execution queue
   */
  static async queueTask(
    taskId: string,
    userId: string,
    priority: TaskPriority = 'medium',
    metadata?: Record<string, any>
  ): Promise<Bull.Job<JobData>> {
    try {
      const jobData: JobData = {
        taskId,
        userId,
        priority,
        metadata,
      };

      const job = await taskQueue.add('execute-task', jobData, {
        ...DEFAULT_JOB_OPTIONS,
        priority: PRIORITY_MAP[priority],
        delay: priority === 'low' ? 5000 : 0, // Delay low priority tasks by 5 seconds
        jobId: `task-${taskId}`, // Unique job ID to prevent duplicates
      });

      logger.task('Task queued for execution', {
        taskId,
        userId,
        priority,
        jobId: job.id,
      });

      return job;
    } catch (error) {
      logger.error('Failed to queue task:', { taskId, userId, error });
      throw new Error('Failed to queue task for execution');
    }
  }

  /**
   * Add cleanup task to queue
   */
  static async queueCleanup(
    taskId: string,
    workspaceId: string,
    delay: number = 60000 // 1 minute delay
  ): Promise<Bull.Job> {
    try {
      const job = await taskQueue.add(
        'cleanup-task',
        { taskId, workspaceId },
        {
          delay,
          attempts: 2,
          removeOnComplete: 10,
          removeOnFail: 10,
        }
      );

      logger.task('Cleanup task queued', {
        taskId,
        workspaceId,
        jobId: job.id,
        delay,
      });

      return job;
    } catch (error) {
      logger.error('Failed to queue cleanup task:', { taskId, workspaceId, error });
      throw new Error('Failed to queue cleanup task');
    }
  }

  /**
   * Get task job status
   */
  static async getTaskJobStatus(taskId: string): Promise<{
    status: string;
    progress: number;
    data?: any;
    error?: string;
  } | null> {
    try {
      const job = await taskQueue.getJob(`task-${taskId}`);
      
      if (!job) {
        return null;
      }

      const state = await job.getState();
      const progress = job.progress();

      return {
        status: state,
        progress: typeof progress === 'number' ? progress : 0,
        data: job.returnvalue,
        error: job.failedReason,
      };
    } catch (error) {
      logger.error('Failed to get task job status:', { taskId, error });
      return null;
    }
  }

  /**
   * Cancel task job
   */
  static async cancelTask(taskId: string): Promise<boolean> {
    try {
      const job = await taskQueue.getJob(`task-${taskId}`);
      
      if (!job) {
        return false;
      }

      await job.remove();
      
      logger.task('Task job cancelled', { taskId, jobId: job.id });
      return true;
    } catch (error) {
      logger.error('Failed to cancel task job:', { taskId, error });
      return false;
    }
  }

  /**
   * Get queue statistics
   */
  static async getQueueStats(): Promise<{
    waiting: number;
    active: number;
    completed: number;
    failed: number;
    delayed: number;
  }> {
    try {
      const [waiting, active, completed, failed, delayed] = await Promise.all([
        taskQueue.getWaiting(),
        taskQueue.getActive(),
        taskQueue.getCompleted(),
        taskQueue.getFailed(),
        taskQueue.getDelayed(),
      ]);

      return {
        waiting: waiting.length,
        active: active.length,
        completed: completed.length,
        failed: failed.length,
        delayed: delayed.length,
      };
    } catch (error) {
      logger.error('Failed to get queue stats:', error);
      return {
        waiting: 0,
        active: 0,
        completed: 0,
        failed: 0,
        delayed: 0,
      };
    }
  }

  /**
   * Process task execution job
   */
  private static async processTaskExecution(job: Bull.Job<JobData>): Promise<JobResult> {
    const { taskId, userId, metadata } = job.data;

    try {
      logger.task('Starting task execution', {
        taskId,
        userId,
        jobId: job.id,
      });

      // Update job progress
      await job.progress(10);

      // Execute the task
      const result = await TaskExecutorService.executeTask(taskId, {
        onProgress: async (progress: number) => {
          await job.progress(Math.min(progress, 90));
        },
        metadata,
      });

      // Final progress update
      await job.progress(100);

      logger.task('Task execution completed', {
        taskId,
        userId,
        jobId: job.id,
        success: result.success,
      });

      return result;
    } catch (error) {
      logger.error('Task execution failed:', {
        taskId,
        userId,
        jobId: job.id,
        error,
      });

      throw error;
    }
  }

  /**
   * Process cleanup job
   */
  private static async processTaskCleanup(job: Bull.Job): Promise<void> {
    const { taskId, workspaceId } = job.data;

    try {
      logger.task('Starting task cleanup', {
        taskId,
        workspaceId,
        jobId: job.id,
      });

      // Cleanup task workspace and temporary files
      await TaskExecutorService.cleanupTask(taskId, workspaceId);

      logger.task('Task cleanup completed', {
        taskId,
        workspaceId,
        jobId: job.id,
      });
    } catch (error) {
      logger.error('Task cleanup failed:', {
        taskId,
        workspaceId,
        jobId: job.id,
        error,
      });

      throw error;
    }
  }

  /**
   * Set up queue event listeners
   */
  private static setupEventListeners(): void {
    // Job completed
    taskQueue.on('completed', (job: Bull.Job, result: JobResult) => {
      logger.task('Job completed', {
        jobId: job.id,
        taskId: job.data.taskId,
        success: result.success,
      });
    });

    // Job failed
    taskQueue.on('failed', (job: Bull.Job, error: Error) => {
      logger.error('Job failed', {
        jobId: job.id,
        taskId: job.data.taskId,
        error: error.message,
        attempts: job.attemptsMade,
      });
    });

    // Job stalled
    taskQueue.on('stalled', (job: Bull.Job) => {
      logger.warn('Job stalled', {
        jobId: job.id,
        taskId: job.data.taskId,
      });
    });

    // Job progress
    taskQueue.on('progress', (job: Bull.Job, progress: number) => {
      logger.debug('Job progress', {
        jobId: job.id,
        taskId: job.data.taskId,
        progress,
      });
    });

    // Queue error
    taskQueue.on('error', (error: Error) => {
      logger.error('Queue error:', error);
    });

    // Queue ready
    taskQueue.on('ready', () => {
      logger.info('Task queue ready');
    });
  }

  /**
   * Graceful shutdown
   */
  static async shutdown(): Promise<void> {
    try {
      logger.info('Shutting down task queue...');
      
      // Wait for active jobs to complete (with timeout)
      await taskQueue.close(30000); // 30 seconds timeout
      
      logger.info('Task queue shutdown completed');
    } catch (error) {
      logger.error('Error during task queue shutdown:', error);
    }
  }

  /**
   * Clean up old jobs
   */
  static async cleanupOldJobs(): Promise<void> {
    try {
      // Clean completed jobs older than 24 hours
      await taskQueue.clean(24 * 60 * 60 * 1000, 'completed');
      
      // Clean failed jobs older than 7 days
      await taskQueue.clean(7 * 24 * 60 * 60 * 1000, 'failed');
      
      logger.info('Old jobs cleaned up successfully');
    } catch (error) {
      logger.error('Failed to cleanup old jobs:', error);
    }
  }

  /**
   * Retry failed job
   */
  static async retryFailedJob(jobId: string): Promise<boolean> {
    try {
      const job = await taskQueue.getJob(jobId);
      
      if (!job) {
        return false;
      }

      await job.retry();
      
      logger.task('Job retried', { jobId });
      return true;
    } catch (error) {
      logger.error('Failed to retry job:', { jobId, error });
      return false;
    }
  }

  /**
   * Get job details
   */
  static async getJobDetails(jobId: string): Promise<any> {
    try {
      const job = await taskQueue.getJob(jobId);
      
      if (!job) {
        return null;
      }

      const state = await job.getState();
      
      return {
        id: job.id,
        data: job.data,
        state,
        progress: job.progress(),
        createdAt: new Date(job.timestamp),
        processedAt: job.processedOn ? new Date(job.processedOn) : null,
        finishedAt: job.finishedOn ? new Date(job.finishedOn) : null,
        attempts: job.attemptsMade,
        failedReason: job.failedReason,
        returnValue: job.returnvalue,
      };
    } catch (error) {
      logger.error('Failed to get job details:', { jobId, error });
      return null;
    }
  }
}
