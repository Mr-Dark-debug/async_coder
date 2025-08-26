import { db, withTransaction } from '@/config/database';
import { tasks, taskResults, taskAnalytics, users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { logger } from '@/utils/logger';
import { GitHubService } from '@/utils/github';
import { UserService } from './user';
import { AIProviderService } from './ai-provider';
import type { Task, JobResult } from '@/types';
import fs from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

export class TaskExecutorService {
  /**
   * Execute a task
   */
  static async executeTask(
    taskId: string,
    options: {
      onProgress?: (progress: number) => Promise<void>;
      metadata?: Record<string, any>;
    } = {}
  ): Promise<JobResult> {
    const startTime = Date.now();
    let workspaceId: string | null = null;

    try {
      // Get task details
      const task = await db.query.tasks.findFirst({
        where: eq(tasks.id, taskId),
        with: {
          user: true,
          repository: true,
          aiModel: true,
        },
      });

      if (!task) {
        throw new Error('Task not found');
      }

      logger.task('Starting task execution', {
        taskId,
        userId: task.userId,
        type: task.type,
        repositoryId: task.repositoryId,
      });

      // Update task status to running
      await this.updateTaskStatus(taskId, 'running', { startedAt: new Date() });
      await options.onProgress?.(10);

      // Check user credits
      if (task.estimatedCredits && task.user.credits < task.estimatedCredits) {
        throw new Error('Insufficient credits');
      }

      // Create workspace
      workspaceId = await this.createWorkspace(taskId);
      await options.onProgress?.(20);

      // Clone repository
      await this.cloneRepository(task, workspaceId);
      await options.onProgress?.(40);

      // Execute AI task
      const aiResult = await this.executeAITask(task, workspaceId);
      await options.onProgress?.(70);

      // Apply changes and create PR if needed
      const result = await this.processTaskResult(task, aiResult, workspaceId);
      await options.onProgress?.(90);

      // Calculate and deduct credits
      const creditsUsed = await this.calculateCreditsUsed(task, aiResult);
      await this.deductCredits(task.userId, creditsUsed, taskId);

      // Update task completion
      await this.completeTask(taskId, creditsUsed, result);

      // Record analytics
      await this.recordTaskAnalytics(taskId, {
        executionTimeMs: Date.now() - startTime,
        tokensUsed: aiResult.tokensUsed || 0,
        linesOfCodeGenerated: result.linesOfCodeGenerated || 0,
        filesModified: result.filesModified || 0,
        successRate: 100,
      });

      logger.task('Task execution completed successfully', {
        taskId,
        creditsUsed,
        executionTime: Date.now() - startTime,
      });

      return {
        success: true,
        data: result,
        creditsUsed,
      };
    } catch (error) {
      logger.error('Task execution failed:', { taskId, error });

      // Update task status to failed
      await this.updateTaskStatus(taskId, 'failed', {
        completedAt: new Date(),
      });

      // Record failed analytics
      await this.recordTaskAnalytics(taskId, {
        executionTimeMs: Date.now() - startTime,
        errorCount: 1,
        successRate: 0,
      });

      return {
        success: false,
        error: error.message,
      };
    } finally {
      // Schedule cleanup
      if (workspaceId) {
        const { TaskQueueService } = await import('./task-queue');
        await TaskQueueService.queueCleanup(taskId, workspaceId);
      }
    }
  }

  /**
   * Create workspace for task execution
   */
  private static async createWorkspace(taskId: string): Promise<string> {
    const workspaceId = uuidv4();
    const workspacePath = path.join(process.cwd(), 'workspaces', workspaceId);

    try {
      await fs.mkdir(workspacePath, { recursive: true });
      
      logger.task('Workspace created', { taskId, workspaceId, workspacePath });
      return workspaceId;
    } catch (error) {
      logger.error('Failed to create workspace:', { taskId, error });
      throw new Error('Failed to create workspace');
    }
  }

  /**
   * Clone repository to workspace
   */
  private static async cloneRepository(task: Task & { repository: any }, workspaceId: string): Promise<void> {
    const workspacePath = path.join(process.cwd(), 'workspaces', workspaceId);
    const repoPath = path.join(workspacePath, 'repo');

    try {
      // Get user's GitHub access token
      const accessToken = await UserService.getGitHubAccessToken(task.userId);
      
      if (!accessToken) {
        throw new Error('GitHub access token not found');
      }

      // Clone repository using git command
      const { spawn } = require('child_process');
      
      await new Promise((resolve, reject) => {
        const cloneUrl = task.repository.cloneUrl.replace(
          'https://github.com/',
          `https://${accessToken}@github.com/`
        );

        const git = spawn('git', ['clone', '-b', task.branch, cloneUrl, repoPath], {
          stdio: 'pipe',
        });

        git.on('close', (code) => {
          if (code === 0) {
            resolve(void 0);
          } else {
            reject(new Error(`Git clone failed with code ${code}`));
          }
        });

        git.on('error', reject);
      });

      logger.task('Repository cloned successfully', {
        taskId: task.id,
        repository: task.repository.fullName,
        branch: task.branch,
      });
    } catch (error) {
      logger.error('Failed to clone repository:', { taskId: task.id, error });
      throw new Error('Failed to clone repository');
    }
  }

  /**
   * Execute AI task
   */
  private static async executeAITask(
    task: Task & { aiModel: any },
    workspaceId: string
  ): Promise<{
    content: string;
    tokensUsed?: number;
    metadata?: Record<string, any>;
  }> {
    try {
      const workspacePath = path.join(process.cwd(), 'workspaces', workspaceId, 'repo');

      // Read relevant files based on task type
      const context = await this.gatherTaskContext(task, workspacePath);

      // Execute AI task based on type
      const aiResult = await AIProviderService.executeTask(task.aiModel.name, {
        type: task.type,
        prompt: task.prompt,
        context,
        repository: task.repository,
        branch: task.branch,
      });

      logger.task('AI task executed successfully', {
        taskId: task.id,
        model: task.aiModel.name,
        tokensUsed: aiResult.tokensUsed,
      });

      return aiResult;
    } catch (error) {
      logger.error('AI task execution failed:', { taskId: task.id, error });
      throw new Error('AI task execution failed');
    }
  }

  /**
   * Gather context for AI task
   */
  private static async gatherTaskContext(
    task: Task,
    workspacePath: string
  ): Promise<{
    files: Array<{ path: string; content: string }>;
    structure: string;
  }> {
    try {
      const files: Array<{ path: string; content: string }> = [];
      
      // Read key files based on task type
      const filesToRead = await this.getRelevantFiles(task.type, workspacePath);
      
      for (const filePath of filesToRead) {
        try {
          const fullPath = path.join(workspacePath, filePath);
          const content = await fs.readFile(fullPath, 'utf-8');
          files.push({ path: filePath, content });
        } catch (error) {
          // Skip files that can't be read
          logger.debug('Could not read file:', { filePath, error });
        }
      }

      // Generate directory structure
      const structure = await this.generateDirectoryStructure(workspacePath);

      return { files, structure };
    } catch (error) {
      logger.error('Failed to gather task context:', { taskId: task.id, error });
      return { files: [], structure: '' };
    }
  }

  /**
   * Get relevant files for task type
   */
  private static async getRelevantFiles(taskType: string, workspacePath: string): Promise<string[]> {
    const commonFiles = ['README.md', 'package.json', 'requirements.txt', 'Cargo.toml', 'go.mod'];
    
    const typeSpecificPatterns = {
      debug: ['**/*.js', '**/*.ts', '**/*.py', '**/*.go', '**/*.rs'],
      documentation: ['**/*.md', '**/*.rst', '**/*.txt'],
      architect: ['**/*.json', '**/*.yaml', '**/*.yml', '**/*.toml'],
      pr_review: ['**/*'],
      ask: ['**/*'],
      async: ['**/*.js', '**/*.ts', '**/*.py'],
    };

    // This is a simplified implementation
    // In production, you'd use a proper file globbing library
    return commonFiles;
  }

  /**
   * Generate directory structure
   */
  private static async generateDirectoryStructure(workspacePath: string): Promise<string> {
    try {
      // This is a simplified implementation
      // In production, you'd generate a proper tree structure
      const { spawn } = require('child_process');
      
      return new Promise((resolve, reject) => {
        const tree = spawn('find', [workspacePath, '-type', 'f', '-name', '*.js', '-o', '-name', '*.ts', '-o', '-name', '*.py'], {
          stdio: 'pipe',
        });

        let output = '';
        tree.stdout.on('data', (data) => {
          output += data.toString();
        });

        tree.on('close', (code) => {
          if (code === 0) {
            resolve(output);
          } else {
            resolve('');
          }
        });

        tree.on('error', () => resolve(''));
      });
    } catch (error) {
      return '';
    }
  }

  /**
   * Process task result
   */
  private static async processTaskResult(
    task: Task & { repository: any },
    aiResult: any,
    workspaceId: string
  ): Promise<{
    type: string;
    content: string;
    filesModified?: number;
    linesOfCodeGenerated?: number;
    pullRequestUrl?: string;
  }> {
    try {
      const workspacePath = path.join(process.cwd(), 'workspaces', workspaceId, 'repo');

      // Apply changes based on task type
      if (task.type === 'debug' || task.type === 'async') {
        // Apply code changes
        const changes = await this.applyCodeChanges(aiResult.content, workspacePath);
        
        // Create PR if changes were made
        if (changes.filesModified > 0) {
          const prUrl = await this.createPullRequest(task, aiResult, workspaceId);
          return {
            type: 'code_changes',
            content: aiResult.content,
            filesModified: changes.filesModified,
            linesOfCodeGenerated: changes.linesOfCodeGenerated,
            pullRequestUrl: prUrl,
          };
        }
      }

      // Store result
      await db.insert(taskResults).values({
        taskId: task.id,
        resultType: this.getResultType(task.type),
        content: aiResult.content,
        summary: aiResult.summary || 'Task completed successfully',
        metadata: aiResult.metadata || {},
      });

      return {
        type: this.getResultType(task.type),
        content: aiResult.content,
      };
    } catch (error) {
      logger.error('Failed to process task result:', { taskId: task.id, error });
      throw error;
    }
  }

  /**
   * Apply code changes to repository
   */
  private static async applyCodeChanges(
    changes: string,
    workspacePath: string
  ): Promise<{ filesModified: number; linesOfCodeGenerated: number }> {
    // This is a simplified implementation
    // In production, you'd parse the AI response and apply specific changes
    return { filesModified: 1, linesOfCodeGenerated: 50 };
  }

  /**
   * Create pull request
   */
  private static async createPullRequest(
    task: Task & { repository: any },
    aiResult: any,
    workspaceId: string
  ): Promise<string> {
    try {
      const accessToken = await UserService.getGitHubAccessToken(task.userId);
      if (!accessToken) {
        throw new Error('GitHub access token not found');
      }

      const github = new GitHubService(accessToken);
      const [owner, repo] = task.repository.fullName.split('/');

      // Create a new branch for the changes
      const branchName = `async-coder-${task.id}`;
      
      // Commit and push changes (simplified)
      // In production, you'd implement proper git operations
      
      // Create PR
      const pr = await github.createPullRequest(owner, repo, {
        title: task.title,
        head: branchName,
        base: task.targetBranch,
        body: `Automated changes by Async Coder\n\n${task.description || ''}\n\n---\n\n${aiResult.content}`,
      });

      // Store PR information
      const { pullRequests } = await import('@/db/schema');
      await db.insert(pullRequests).values({
        taskId: task.id,
        repositoryId: task.repositoryId,
        githubPrId: pr.id,
        prNumber: pr.number,
        title: pr.title,
        description: pr.body,
        sourceBranch: branchName,
        targetBranch: task.targetBranch,
        status: 'open',
        url: pr.html_url,
      });

      return pr.html_url;
    } catch (error) {
      logger.error('Failed to create pull request:', { taskId: task.id, error });
      throw error;
    }
  }

  /**
   * Calculate credits used
   */
  private static async calculateCreditsUsed(task: Task, aiResult: any): Promise<number> {
    // Simple calculation based on tokens used
    const tokensUsed = aiResult.tokensUsed || 1000;
    const creditsPerToken = 0.001; // Configurable rate
    return Math.ceil(tokensUsed * creditsPerToken);
  }

  /**
   * Deduct credits from user
   */
  private static async deductCredits(userId: string, amount: number, taskId: string): Promise<void> {
    await UserService.updateCredits(userId, -amount, 'debit', 'Task execution', taskId);
  }

  /**
   * Update task status
   */
  private static async updateTaskStatus(
    taskId: string,
    status: string,
    updates: Record<string, any> = {}
  ): Promise<void> {
    await db
      .update(tasks)
      .set({
        status: status as any,
        updatedAt: new Date(),
        ...updates,
      })
      .where(eq(tasks.id, taskId));
  }

  /**
   * Complete task
   */
  private static async completeTask(
    taskId: string,
    creditsUsed: number,
    result: any
  ): Promise<void> {
    await db
      .update(tasks)
      .set({
        status: 'completed',
        creditsUsed,
        completedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(tasks.id, taskId));
  }

  /**
   * Record task analytics
   */
  private static async recordTaskAnalytics(
    taskId: string,
    analytics: Record<string, any>
  ): Promise<void> {
    try {
      await db.insert(taskAnalytics).values({
        taskId,
        ...analytics,
      });
    } catch (error) {
      logger.error('Failed to record task analytics:', { taskId, error });
    }
  }

  /**
   * Get result type based on task type
   */
  private static getResultType(taskType: string): string {
    const typeMap = {
      debug: 'code_changes',
      ask: 'analysis',
      documentation: 'documentation',
      architect: 'analysis',
      pr_review: 'analysis',
      async: 'code_changes',
    };
    return typeMap[taskType] || 'analysis';
  }

  /**
   * Cleanup task workspace
   */
  static async cleanupTask(taskId: string, workspaceId: string): Promise<void> {
    try {
      const workspacePath = path.join(process.cwd(), 'workspaces', workspaceId);
      await fs.rm(workspacePath, { recursive: true, force: true });
      
      logger.task('Task workspace cleaned up', { taskId, workspaceId });
    } catch (error) {
      logger.error('Failed to cleanup task workspace:', { taskId, workspaceId, error });
    }
  }
}
