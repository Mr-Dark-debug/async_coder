import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { db } from '@/config/database';
import { tasks, taskResults, aiModels, repositories } from '@/db/schema';
import { eq, desc, and, sql } from 'drizzle-orm';
import { authMiddleware } from '@/middleware/auth';
import { taskCreationRateLimit, generalRateLimit } from '@/middleware/rate-limit';
import { validateCreateTask, validatePagination, validateTaskParams } from '@/middleware/validation';
import { TaskQueueService } from '@/services/task-queue';
import { UserService } from '@/services/user';
import { logger } from '@/utils/logger';
import type { CreateTaskSchema } from '@/types';

export default async function taskRoutes(fastify: FastifyInstance) {
  // All routes require authentication
  fastify.addHook('preHandler', authMiddleware);

  // Create new task
  fastify.post('/', {
    preHandler: [taskCreationRateLimit, validateCreateTask],
    schema: {
      body: {
        type: 'object',
        required: ['repositoryId', 'aiModelId', 'title', 'prompt', 'branch', 'type'],
        properties: {
          repositoryId: { type: 'string', format: 'uuid' },
          aiModelId: { type: 'string', format: 'uuid' },
          title: { type: 'string', minLength: 1, maxLength: 255 },
          description: { type: 'string', maxLength: 1000 },
          prompt: { type: 'string', minLength: 1, maxLength: 10000 },
          branch: { type: 'string', minLength: 1, maxLength: 255 },
          targetBranch: { type: 'string', minLength: 1, maxLength: 255 },
          type: { 
            type: 'string', 
            enum: ['debug', 'ask', 'documentation', 'architect', 'pr_review', 'async'] 
          },
          priority: { type: 'string', enum: ['low', 'medium', 'high'] },
        },
      },
    },
  }, async (request: FastifyRequest<{
    Body: CreateTaskSchema;
  }>, reply: FastifyReply) => {
    try {
      const userId = request.user!.id;
      const taskData = request.body;

      // Verify repository access
      const repository = await db.query.repositories.findFirst({
        where: eq(repositories.id, taskData.repositoryId),
        with: {
          userAccess: {
            where: eq(userRepositoryAccess.userId, userId),
          },
        },
      });

      if (!repository) {
        return reply.status(404).send({
          success: false,
          error: {
            code: 'REPOSITORY_NOT_FOUND',
            message: 'Repository not found',
          },
        });
      }

      // Check if user has access to repository
      const hasAccess = repository.ownerId === userId || 
        repository.userAccess.some(access => access.userId === userId);

      if (!hasAccess) {
        return reply.status(403).send({
          success: false,
          error: {
            code: 'REPOSITORY_ACCESS_DENIED',
            message: 'Access denied to repository',
          },
        });
      }

      // Verify AI model exists and is active
      const aiModel = await db.query.aiModels.findFirst({
        where: and(
          eq(aiModels.id, taskData.aiModelId),
          eq(aiModels.isActive, true)
        ),
      });

      if (!aiModel) {
        return reply.status(404).send({
          success: false,
          error: {
            code: 'AI_MODEL_NOT_FOUND',
            message: 'AI model not found or inactive',
          },
        });
      }

      // Estimate credits required
      const estimatedCredits = Math.ceil(taskData.prompt.length * 0.01); // Simple estimation

      // Check user credits
      const user = await UserService.getUserById(userId);
      if (!user || user.credits < estimatedCredits) {
        return reply.status(400).send({
          success: false,
          error: {
            code: 'INSUFFICIENT_CREDITS',
            message: 'Insufficient credits to execute task',
            details: {
              required: estimatedCredits,
              available: user?.credits || 0,
            },
          },
        });
      }

      // Create task
      const [newTask] = await db.insert(tasks).values({
        userId,
        repositoryId: taskData.repositoryId,
        aiModelId: taskData.aiModelId,
        title: taskData.title,
        description: taskData.description,
        prompt: taskData.prompt,
        branch: taskData.branch,
        targetBranch: taskData.targetBranch || 'main',
        type: taskData.type,
        priority: taskData.priority || 'medium',
        estimatedCredits,
        status: 'pending',
      }).returning();

      // Queue task for execution
      await TaskQueueService.queueTask(
        newTask.id,
        userId,
        newTask.priority as any
      );

      logger.task('Task created and queued', {
        taskId: newTask.id,
        userId,
        type: newTask.type,
        repositoryId: newTask.repositoryId,
      });

      return reply.status(201).send({
        success: true,
        data: {
          id: newTask.id,
          title: newTask.title,
          description: newTask.description,
          status: newTask.status,
          type: newTask.type,
          priority: newTask.priority,
          estimatedCredits: newTask.estimatedCredits,
          createdAt: newTask.createdAt,
        },
      });
    } catch (error) {
      logger.error('Failed to create task:', error);
      return reply.status(500).send({
        success: false,
        error: {
          code: 'TASK_CREATION_FAILED',
          message: 'Failed to create task',
        },
      });
    }
  });

  // Get user's tasks
  fastify.get('/', {
    preHandler: [generalRateLimit, validatePagination],
    schema: {
      querystring: {
        type: 'object',
        properties: {
          page: { type: 'number', minimum: 1 },
          limit: { type: 'number', minimum: 1, maximum: 100 },
          status: { 
            type: 'string', 
            enum: ['pending', 'running', 'completed', 'failed', 'cancelled'] 
          },
          type: { 
            type: 'string', 
            enum: ['debug', 'ask', 'documentation', 'architect', 'pr_review', 'async'] 
          },
          repositoryId: { type: 'string', format: 'uuid' },
          sortBy: { type: 'string', enum: ['createdAt', 'updatedAt', 'title'] },
          sortOrder: { type: 'string', enum: ['asc', 'desc'] },
        },
      },
    },
  }, async (request: FastifyRequest<{
    Querystring: {
      page?: number;
      limit?: number;
      status?: string;
      type?: string;
      repositoryId?: string;
      sortBy?: string;
      sortOrder?: 'asc' | 'desc';
    };
  }>, reply: FastifyReply) => {
    try {
      const userId = request.user!.id;
      const {
        page = 1,
        limit = 20,
        status,
        type,
        repositoryId,
        sortBy = 'createdAt',
        sortOrder = 'desc',
      } = request.query;

      const offset = (page - 1) * limit;

      // Build where conditions
      const conditions = [eq(tasks.userId, userId)];
      
      if (status) {
        conditions.push(eq(tasks.status, status as any));
      }
      
      if (type) {
        conditions.push(eq(tasks.type, type as any));
      }
      
      if (repositoryId) {
        conditions.push(eq(tasks.repositoryId, repositoryId));
      }

      const whereClause = conditions.length > 1 ? and(...conditions) : conditions[0];

      // Get tasks with related data
      const userTasks = await db.query.tasks.findMany({
        where: whereClause,
        with: {
          repository: {
            columns: {
              id: true,
              name: true,
              fullName: true,
            },
          },
          aiModel: {
            columns: {
              id: true,
              name: true,
              displayName: true,
            },
          },
        },
        orderBy: sortOrder === 'desc' ? desc(tasks[sortBy]) : tasks[sortBy],
        limit,
        offset,
      });

      // Get total count
      const [{ count }] = await db
        .select({ count: sql`count(*)` })
        .from(tasks)
        .where(whereClause);

      const totalPages = Math.ceil(Number(count) / limit);

      return reply.send({
        success: true,
        data: {
          tasks: userTasks,
        },
        meta: {
          page,
          limit,
          total: Number(count),
          totalPages,
        },
      });
    } catch (error) {
      logger.error('Failed to get tasks:', error);
      return reply.status(500).send({
        success: false,
        error: {
          code: 'TASKS_FETCH_FAILED',
          message: 'Failed to fetch tasks',
        },
      });
    }
  });

  // Get task by ID
  fastify.get('/:taskId', {
    preHandler: [generalRateLimit, validateTaskParams],
    schema: {
      params: {
        type: 'object',
        required: ['taskId'],
        properties: {
          taskId: { type: 'string', format: 'uuid' },
        },
      },
    },
  }, async (request: FastifyRequest<{
    Params: { taskId: string };
  }>, reply: FastifyReply) => {
    try {
      const userId = request.user!.id;
      const { taskId } = request.params;

      const task = await db.query.tasks.findFirst({
        where: and(
          eq(tasks.id, taskId),
          eq(tasks.userId, userId)
        ),
        with: {
          repository: {
            columns: {
              id: true,
              name: true,
              fullName: true,
              defaultBranch: true,
            },
          },
          aiModel: {
            columns: {
              id: true,
              name: true,
              displayName: true,
              provider: true,
            },
          },
          results: {
            orderBy: [desc(taskResults.createdAt)],
          },
        },
      });

      if (!task) {
        return reply.status(404).send({
          success: false,
          error: {
            code: 'TASK_NOT_FOUND',
            message: 'Task not found',
          },
        });
      }

      // Get job status if task is running
      let jobStatus = null;
      if (task.status === 'running' || task.status === 'pending') {
        jobStatus = await TaskQueueService.getTaskJobStatus(taskId);
      }

      return reply.send({
        success: true,
        data: {
          ...task,
          jobStatus,
        },
      });
    } catch (error) {
      logger.error('Failed to get task:', error);
      return reply.status(500).send({
        success: false,
        error: {
          code: 'TASK_FETCH_FAILED',
          message: 'Failed to fetch task',
        },
      });
    }
  });

  // Cancel task
  fastify.put('/:taskId/cancel', {
    preHandler: [generalRateLimit, validateTaskParams],
    schema: {
      params: {
        type: 'object',
        required: ['taskId'],
        properties: {
          taskId: { type: 'string', format: 'uuid' },
        },
      },
    },
  }, async (request: FastifyRequest<{
    Params: { taskId: string };
  }>, reply: FastifyReply) => {
    try {
      const userId = request.user!.id;
      const { taskId } = request.params;

      // Verify task ownership
      const task = await db.query.tasks.findFirst({
        where: and(
          eq(tasks.id, taskId),
          eq(tasks.userId, userId)
        ),
      });

      if (!task) {
        return reply.status(404).send({
          success: false,
          error: {
            code: 'TASK_NOT_FOUND',
            message: 'Task not found',
          },
        });
      }

      if (task.status !== 'pending' && task.status !== 'running') {
        return reply.status(400).send({
          success: false,
          error: {
            code: 'TASK_NOT_CANCELLABLE',
            message: 'Task cannot be cancelled in current status',
          },
        });
      }

      // Cancel the job
      const cancelled = await TaskQueueService.cancelTask(taskId);

      if (cancelled) {
        // Update task status
        await db
          .update(tasks)
          .set({
            status: 'cancelled',
            completedAt: new Date(),
            updatedAt: new Date(),
          })
          .where(eq(tasks.id, taskId));

        logger.task('Task cancelled', { taskId, userId });

        return reply.send({
          success: true,
          data: {
            message: 'Task cancelled successfully',
          },
        });
      } else {
        return reply.status(400).send({
          success: false,
          error: {
            code: 'TASK_CANCELLATION_FAILED',
            message: 'Failed to cancel task',
          },
        });
      }
    } catch (error) {
      logger.error('Failed to cancel task:', error);
      return reply.status(500).send({
        success: false,
        error: {
          code: 'TASK_CANCELLATION_FAILED',
          message: 'Failed to cancel task',
        },
      });
    }
  });
}

// Import missing schema
import { userRepositoryAccess } from '@/db/schema/repositories';
