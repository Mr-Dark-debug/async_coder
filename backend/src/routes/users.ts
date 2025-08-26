import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { authMiddleware } from '@/middleware/auth';
import { generalRateLimit } from '@/middleware/rate-limit';
import { validateUpdateUser, validatePagination } from '@/middleware/validation';
import { UserService } from '@/services/user';
import { logger } from '@/utils/logger';

export default async function userRoutes(fastify: FastifyInstance) {
  // All routes require authentication
  fastify.addHook('preHandler', authMiddleware);

  // Get current user profile
  fastify.get('/me', {
    preHandler: [generalRateLimit],
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const userId = request.user!.id;
      const user = await UserService.getUserById(userId);

      if (!user) {
        return reply.status(404).send({
          success: false,
          error: {
            code: 'USER_NOT_FOUND',
            message: 'User not found',
          },
        });
      }

      // Don't expose sensitive data
      const { githubAccessToken, ...safeUser } = user;

      return reply.send({
        success: true,
        data: safeUser,
      });
    } catch (error) {
      logger.error('Failed to get user profile:', error);
      return reply.status(500).send({
        success: false,
        error: {
          code: 'USER_FETCH_FAILED',
          message: 'Failed to fetch user profile',
        },
      });
    }
  });

  // Update current user profile
  fastify.put('/me', {
    preHandler: [generalRateLimit, validateUpdateUser],
    schema: {
      body: {
        type: 'object',
        properties: {
          displayName: { type: 'string', minLength: 1, maxLength: 255 },
          avatarUrl: { type: 'string', format: 'uri' },
        },
      },
    },
  }, async (request: FastifyRequest<{
    Body: {
      displayName?: string;
      avatarUrl?: string;
    };
  }>, reply: FastifyReply) => {
    try {
      const userId = request.user!.id;
      const updates = request.body;

      const updatedUser = await UserService.updateUser(userId, updates);

      // Don't expose sensitive data
      const { githubAccessToken, ...safeUser } = updatedUser;

      logger.info('User profile updated', {
        userId,
        updatedFields: Object.keys(updates),
      });

      return reply.send({
        success: true,
        data: safeUser,
      });
    } catch (error) {
      logger.error('Failed to update user profile:', error);
      return reply.status(500).send({
        success: false,
        error: {
          code: 'USER_UPDATE_FAILED',
          message: 'Failed to update user profile',
        },
      });
    }
  });

  // Get user's credit transactions
  fastify.get('/me/credits/transactions', {
    preHandler: [generalRateLimit, validatePagination],
    schema: {
      querystring: {
        type: 'object',
        properties: {
          page: { type: 'number', minimum: 1 },
          limit: { type: 'number', minimum: 1, maximum: 100 },
          type: { 
            type: 'string', 
            enum: ['debit', 'credit', 'bonus', 'refund', 'purchase'] 
          },
          startDate: { type: 'string', format: 'date-time' },
          endDate: { type: 'string', format: 'date-time' },
        },
      },
    },
  }, async (request: FastifyRequest<{
    Querystring: {
      page?: number;
      limit?: number;
      type?: string;
      startDate?: string;
      endDate?: string;
    };
  }>, reply: FastifyReply) => {
    try {
      const userId = request.user!.id;
      const {
        page = 1,
        limit = 20,
        type,
        startDate,
        endDate,
      } = request.query;

      const options = {
        page,
        limit,
        type,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
      };

      const result = await UserService.getCreditTransactions(userId, options);

      return reply.send({
        success: true,
        data: result,
        meta: {
          page: result.page,
          limit: result.limit,
          total: result.total,
          totalPages: Math.ceil(result.total / result.limit),
        },
      });
    } catch (error) {
      logger.error('Failed to get credit transactions:', error);
      return reply.status(500).send({
        success: false,
        error: {
          code: 'TRANSACTIONS_FETCH_FAILED',
          message: 'Failed to fetch credit transactions',
        },
      });
    }
  });

  // Disconnect GitHub account
  fastify.delete('/me/github', {
    preHandler: [generalRateLimit],
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const userId = request.user!.id;

      const updatedUser = await UserService.disconnectGitHub(userId);

      logger.info('GitHub account disconnected', { userId });

      return reply.send({
        success: true,
        data: {
          message: 'GitHub account disconnected successfully',
          isGithubConnected: updatedUser.isGithubConnected,
        },
      });
    } catch (error) {
      logger.error('Failed to disconnect GitHub account:', error);
      return reply.status(500).send({
        success: false,
        error: {
          code: 'GITHUB_DISCONNECT_FAILED',
          message: 'Failed to disconnect GitHub account',
        },
      });
    }
  });

  // Get user statistics
  fastify.get('/me/stats', {
    preHandler: [generalRateLimit],
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const userId = request.user!.id;

      // Get user with basic stats
      const user = await UserService.getUserById(userId);
      
      if (!user) {
        return reply.status(404).send({
          success: false,
          error: {
            code: 'USER_NOT_FOUND',
            message: 'User not found',
          },
        });
      }

      // Get additional statistics from database
      const { db } = await import('@/config/database');
      const { tasks, repositories, userRepositoryAccess } = await import('@/db/schema');
      const { eq, sql, and } = await import('drizzle-orm');

      const [taskStats] = await db
        .select({
          totalTasks: sql`count(*)`,
          completedTasks: sql`count(*) filter (where status = 'completed')`,
          runningTasks: sql`count(*) filter (where status = 'running')`,
          pendingTasks: sql`count(*) filter (where status = 'pending')`,
        })
        .from(tasks)
        .where(eq(tasks.userId, userId));

      const [repoStats] = await db
        .select({
          totalRepositories: sql`count(distinct ${repositories.id})`,
        })
        .from(repositories)
        .leftJoin(userRepositoryAccess, eq(userRepositoryAccess.repositoryId, repositories.id))
        .where(
          and(
            eq(repositories.ownerId, userId),
            eq(repositories.isActive, true)
          )
        );

      const stats = {
        credits: {
          current: user.credits,
          totalUsed: user.totalCreditsUsed,
        },
        tasks: {
          total: Number(taskStats.totalTasks),
          completed: Number(taskStats.completedTasks),
          running: Number(taskStats.runningTasks),
          pending: Number(taskStats.pendingTasks),
        },
        repositories: {
          total: Number(repoStats.totalRepositories),
        },
        account: {
          subscriptionTier: user.subscriptionTier,
          isGithubConnected: user.isGithubConnected,
          memberSince: user.createdAt,
        },
      };

      return reply.send({
        success: true,
        data: stats,
      });
    } catch (error) {
      logger.error('Failed to get user statistics:', error);
      return reply.status(500).send({
        success: false,
        error: {
          code: 'STATS_FETCH_FAILED',
          message: 'Failed to fetch user statistics',
        },
      });
    }
  });

  // Delete user account
  fastify.delete('/me', {
    preHandler: [generalRateLimit],
    schema: {
      body: {
        type: 'object',
        required: ['confirmation'],
        properties: {
          confirmation: { type: 'string', const: 'DELETE_MY_ACCOUNT' },
        },
      },
    },
  }, async (request: FastifyRequest<{
    Body: { confirmation: string };
  }>, reply: FastifyReply) => {
    try {
      const userId = request.user!.id;
      const { confirmation } = request.body;

      if (confirmation !== 'DELETE_MY_ACCOUNT') {
        return reply.status(400).send({
          success: false,
          error: {
            code: 'INVALID_CONFIRMATION',
            message: 'Invalid confirmation string',
          },
        });
      }

      await UserService.deleteUser(userId);

      logger.audit('User account deleted', userId, {
        deletedAt: new Date().toISOString(),
      });

      return reply.send({
        success: true,
        data: {
          message: 'Account deleted successfully',
        },
      });
    } catch (error) {
      logger.error('Failed to delete user account:', error);
      return reply.status(500).send({
        success: false,
        error: {
          code: 'ACCOUNT_DELETION_FAILED',
          message: 'Failed to delete account',
        },
      });
    }
  });
}
