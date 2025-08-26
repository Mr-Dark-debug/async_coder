import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { db } from '@/config/database';
import { users, tasks, repositories, aiModels } from '@/db/schema';
import { eq, desc, sql, and, gte, lte } from 'drizzle-orm';
import { authMiddleware, adminMiddleware } from '@/middleware/auth';
import { adminRateLimit } from '@/middleware/rate-limit';
import { validatePagination } from '@/middleware/validation';
import { TaskQueueService } from '@/services/task-queue';
import { UserService } from '@/services/user';
import { logger } from '@/utils/logger';

export default async function adminRoutes(fastify: FastifyInstance) {
  // All routes require authentication and admin role
  fastify.addHook('preHandler', authMiddleware);
  fastify.addHook('preHandler', adminMiddleware);

  // Get system statistics
  fastify.get('/stats', {
    preHandler: [adminRateLimit],
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      // Get user statistics
      const [userStats] = await db
        .select({
          totalUsers: sql`count(*)`,
          activeUsers: sql`count(*) filter (where ${users.createdAt} >= now() - interval '30 days')`,
          githubConnectedUsers: sql`count(*) filter (where ${users.isGithubConnected} = true)`,
          freeUsers: sql`count(*) filter (where ${users.subscriptionTier} = 'free')`,
          proUsers: sql`count(*) filter (where ${users.subscriptionTier} = 'pro')`,
          enterpriseUsers: sql`count(*) filter (where ${users.subscriptionTier} = 'enterprise')`,
        })
        .from(users);

      // Get task statistics
      const [taskStats] = await db
        .select({
          totalTasks: sql`count(*)`,
          pendingTasks: sql`count(*) filter (where ${tasks.status} = 'pending')`,
          runningTasks: sql`count(*) filter (where ${tasks.status} = 'running')`,
          completedTasks: sql`count(*) filter (where ${tasks.status} = 'completed')`,
          failedTasks: sql`count(*) filter (where ${tasks.status} = 'failed')`,
          tasksToday: sql`count(*) filter (where ${tasks.createdAt} >= current_date)`,
          tasksThisWeek: sql`count(*) filter (where ${tasks.createdAt} >= current_date - interval '7 days')`,
        })
        .from(tasks);

      // Get repository statistics
      const [repoStats] = await db
        .select({
          totalRepositories: sql`count(*)`,
          activeRepositories: sql`count(*) filter (where ${repositories.isActive} = true)`,
          privateRepositories: sql`count(*) filter (where ${repositories.isPrivate} = true)`,
        })
        .from(repositories);

      // Get queue statistics
      const queueStats = await TaskQueueService.getQueueStats();

      // Get AI model usage
      const modelUsage = await db
        .select({
          modelId: aiModels.id,
          modelName: aiModels.name,
          displayName: aiModels.displayName,
          provider: aiModels.provider,
          usageCount: sql`count(${tasks.id})`,
        })
        .from(aiModels)
        .leftJoin(tasks, eq(tasks.aiModelId, aiModels.id))
        .where(eq(aiModels.isActive, true))
        .groupBy(aiModels.id, aiModels.name, aiModels.displayName, aiModels.provider)
        .orderBy(desc(sql`count(${tasks.id})`));

      const stats = {
        users: {
          total: Number(userStats.totalUsers),
          active: Number(userStats.activeUsers),
          githubConnected: Number(userStats.githubConnectedUsers),
          byTier: {
            free: Number(userStats.freeUsers),
            pro: Number(userStats.proUsers),
            enterprise: Number(userStats.enterpriseUsers),
          },
        },
        tasks: {
          total: Number(taskStats.totalTasks),
          pending: Number(taskStats.pendingTasks),
          running: Number(taskStats.runningTasks),
          completed: Number(taskStats.completedTasks),
          failed: Number(taskStats.failedTasks),
          today: Number(taskStats.tasksToday),
          thisWeek: Number(taskStats.tasksThisWeek),
        },
        repositories: {
          total: Number(repoStats.totalRepositories),
          active: Number(repoStats.activeRepositories),
          private: Number(repoStats.privateRepositories),
        },
        queue: queueStats,
        aiModels: modelUsage.map(model => ({
          id: model.modelId,
          name: model.modelName,
          displayName: model.displayName,
          provider: model.provider,
          usageCount: Number(model.usageCount),
        })),
      };

      return reply.send({
        success: true,
        data: stats,
      });
    } catch (error) {
      logger.error('Failed to get admin statistics:', error);
      return reply.status(500).send({
        success: false,
        error: {
          code: 'STATS_FETCH_FAILED',
          message: 'Failed to fetch system statistics',
        },
      });
    }
  });

  // Get all users with pagination
  fastify.get('/users', {
    preHandler: [adminRateLimit, validatePagination],
    schema: {
      querystring: {
        type: 'object',
        properties: {
          page: { type: 'number', minimum: 1 },
          limit: { type: 'number', minimum: 1, maximum: 100 },
          search: { type: 'string', maxLength: 255 },
          subscriptionTier: { 
            type: 'string', 
            enum: ['free', 'pro', 'enterprise'] 
          },
          isGithubConnected: { type: 'boolean' },
          sortBy: { type: 'string', enum: ['createdAt', 'updatedAt', 'email', 'credits'] },
          sortOrder: { type: 'string', enum: ['asc', 'desc'] },
        },
      },
    },
  }, async (request: FastifyRequest<{
    Querystring: {
      page?: number;
      limit?: number;
      search?: string;
      subscriptionTier?: string;
      isGithubConnected?: boolean;
      sortBy?: string;
      sortOrder?: 'asc' | 'desc';
    };
  }>, reply: FastifyReply) => {
    try {
      const {
        page = 1,
        limit = 20,
        search,
        subscriptionTier,
        isGithubConnected,
        sortBy = 'createdAt',
        sortOrder = 'desc',
      } = request.query;

      const offset = (page - 1) * limit;

      // Build where conditions
      const conditions = [];
      
      if (search) {
        conditions.push(
          sql`(${users.email} ILIKE ${`%${search}%`} OR ${users.username} ILIKE ${`%${search}%`} OR ${users.displayName} ILIKE ${`%${search}%`})`
        );
      }
      
      if (subscriptionTier) {
        conditions.push(eq(users.subscriptionTier, subscriptionTier as any));
      }
      
      if (typeof isGithubConnected === 'boolean') {
        conditions.push(eq(users.isGithubConnected, isGithubConnected));
      }

      const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

      // Get users
      const allUsers = await db.query.users.findMany({
        where: whereClause,
        columns: {
          id: true,
          clerkId: true,
          email: true,
          username: true,
          displayName: true,
          avatarUrl: true,
          credits: true,
          totalCreditsUsed: true,
          subscriptionTier: true,
          isGithubConnected: true,
          createdAt: true,
          updatedAt: true,
        },
        orderBy: sortOrder === 'desc' ? desc(users[sortBy]) : users[sortBy],
        limit,
        offset,
      });

      // Get total count
      const [{ count }] = await db
        .select({ count: sql`count(*)` })
        .from(users)
        .where(whereClause);

      const totalPages = Math.ceil(Number(count) / limit);

      return reply.send({
        success: true,
        data: {
          users: allUsers,
        },
        meta: {
          page,
          limit,
          total: Number(count),
          totalPages,
        },
      });
    } catch (error) {
      logger.error('Failed to get users:', error);
      return reply.status(500).send({
        success: false,
        error: {
          code: 'USERS_FETCH_FAILED',
          message: 'Failed to fetch users',
        },
      });
    }
  });

  // Update user subscription tier
  fastify.put('/users/:userId/subscription', {
    preHandler: [adminRateLimit],
    schema: {
      params: {
        type: 'object',
        required: ['userId'],
        properties: {
          userId: { type: 'string', format: 'uuid' },
        },
      },
      body: {
        type: 'object',
        required: ['tier'],
        properties: {
          tier: { type: 'string', enum: ['free', 'pro', 'enterprise'] },
        },
      },
    },
  }, async (request: FastifyRequest<{
    Params: { userId: string };
    Body: { tier: 'free' | 'pro' | 'enterprise' };
  }>, reply: FastifyReply) => {
    try {
      const { userId } = request.params;
      const { tier } = request.body;

      const updatedUser = await UserService.updateSubscriptionTier(userId, tier);

      logger.audit('User subscription tier updated by admin', request.user!.id, {
        targetUserId: userId,
        newTier: tier,
        adminId: request.user!.id,
      });

      return reply.send({
        success: true,
        data: {
          message: 'User subscription tier updated successfully',
          user: {
            id: updatedUser.id,
            email: updatedUser.email,
            subscriptionTier: updatedUser.subscriptionTier,
          },
        },
      });
    } catch (error) {
      logger.error('Failed to update user subscription tier:', error);
      return reply.status(500).send({
        success: false,
        error: {
          code: 'SUBSCRIPTION_UPDATE_FAILED',
          message: 'Failed to update user subscription tier',
        },
      });
    }
  });

  // Add credits to user account
  fastify.post('/users/:userId/credits', {
    preHandler: [adminRateLimit],
    schema: {
      params: {
        type: 'object',
        required: ['userId'],
        properties: {
          userId: { type: 'string', format: 'uuid' },
        },
      },
      body: {
        type: 'object',
        required: ['amount'],
        properties: {
          amount: { type: 'number', minimum: 1, maximum: 10000 },
          description: { type: 'string', maxLength: 255 },
        },
      },
    },
  }, async (request: FastifyRequest<{
    Params: { userId: string };
    Body: { amount: number; description?: string };
  }>, reply: FastifyReply) => {
    try {
      const { userId } = request.params;
      const { amount, description = 'Admin credit adjustment' } = request.body;

      const result = await UserService.updateCredits(
        userId,
        amount,
        'bonus',
        description
      );

      logger.audit('Credits added by admin', request.user!.id, {
        targetUserId: userId,
        amount,
        description,
        adminId: request.user!.id,
      });

      return reply.send({
        success: true,
        data: {
          message: 'Credits added successfully',
          user: {
            id: result.user.id,
            credits: result.user.credits,
          },
          transaction: result.transaction,
        },
      });
    } catch (error) {
      logger.error('Failed to add credits:', error);
      return reply.status(500).send({
        success: false,
        error: {
          code: 'CREDITS_ADD_FAILED',
          message: 'Failed to add credits',
        },
      });
    }
  });

  // Get system logs
  fastify.get('/logs', {
    preHandler: [adminRateLimit],
    schema: {
      querystring: {
        type: 'object',
        properties: {
          level: { type: 'string', enum: ['error', 'warn', 'info', 'debug'] },
          startDate: { type: 'string', format: 'date-time' },
          endDate: { type: 'string', format: 'date-time' },
          limit: { type: 'number', minimum: 1, maximum: 1000 },
        },
      },
    },
  }, async (request: FastifyRequest<{
    Querystring: {
      level?: string;
      startDate?: string;
      endDate?: string;
      limit?: number;
    };
  }>, reply: FastifyReply) => {
    try {
      const {
        level = 'info',
        startDate,
        endDate,
        limit = 100,
      } = request.query;

      // This is a simplified implementation
      // In production, you'd integrate with your logging system
      const logs = [
        {
          timestamp: new Date().toISOString(),
          level: 'info',
          message: 'System operational',
          metadata: {},
        },
      ];

      return reply.send({
        success: true,
        data: {
          logs,
          filters: {
            level,
            startDate,
            endDate,
            limit,
          },
        },
      });
    } catch (error) {
      logger.error('Failed to get system logs:', error);
      return reply.status(500).send({
        success: false,
        error: {
          code: 'LOGS_FETCH_FAILED',
          message: 'Failed to fetch system logs',
        },
      });
    }
  });

  // Manage AI models
  fastify.get('/ai-models', {
    preHandler: [adminRateLimit],
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const models = await db.query.aiModels.findMany({
        orderBy: [desc(aiModels.createdAt)],
      });

      return reply.send({
        success: true,
        data: {
          models,
        },
      });
    } catch (error) {
      logger.error('Failed to get AI models:', error);
      return reply.status(500).send({
        success: false,
        error: {
          code: 'AI_MODELS_FETCH_FAILED',
          message: 'Failed to fetch AI models',
        },
      });
    }
  });

  // Toggle AI model status
  fastify.put('/ai-models/:modelId/toggle', {
    preHandler: [adminRateLimit],
    schema: {
      params: {
        type: 'object',
        required: ['modelId'],
        properties: {
          modelId: { type: 'string', format: 'uuid' },
        },
      },
    },
  }, async (request: FastifyRequest<{
    Params: { modelId: string };
  }>, reply: FastifyReply) => {
    try {
      const { modelId } = request.params;

      const model = await db.query.aiModels.findFirst({
        where: eq(aiModels.id, modelId),
      });

      if (!model) {
        return reply.status(404).send({
          success: false,
          error: {
            code: 'AI_MODEL_NOT_FOUND',
            message: 'AI model not found',
          },
        });
      }

      const [updatedModel] = await db
        .update(aiModels)
        .set({
          isActive: !model.isActive,
          updatedAt: new Date(),
        })
        .where(eq(aiModels.id, modelId))
        .returning();

      logger.audit('AI model status toggled by admin', request.user!.id, {
        modelId,
        modelName: model.name,
        newStatus: updatedModel.isActive,
        adminId: request.user!.id,
      });

      return reply.send({
        success: true,
        data: {
          message: `AI model ${updatedModel.isActive ? 'activated' : 'deactivated'} successfully`,
          model: updatedModel,
        },
      });
    } catch (error) {
      logger.error('Failed to toggle AI model status:', error);
      return reply.status(500).send({
        success: false,
        error: {
          code: 'AI_MODEL_TOGGLE_FAILED',
          message: 'Failed to toggle AI model status',
        },
      });
    }
  });
}
