import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { db } from '@/config/database';
import { repositories, userRepositoryAccess } from '@/db/schema';
import { eq, and, or, ilike, desc } from 'drizzle-orm';
import { authMiddleware } from '@/middleware/auth';
import { generalRateLimit } from '@/middleware/rate-limit';
import { validatePagination, validateRepositoryParams } from '@/middleware/validation';
import { UserService } from '@/services/user';
import { GitHubService } from '@/utils/github';
import { logger } from '@/utils/logger';

export default async function repositoryRoutes(fastify: FastifyInstance) {
  // All routes require authentication
  fastify.addHook('preHandler', authMiddleware);

  // Get user's repositories
  fastify.get('/', {
    preHandler: [generalRateLimit, validatePagination],
    schema: {
      querystring: {
        type: 'object',
        properties: {
          page: { type: 'number', minimum: 1 },
          limit: { type: 'number', minimum: 1, maximum: 100 },
          search: { type: 'string', maxLength: 255 },
          connected: { type: 'boolean' },
          language: { type: 'string', maxLength: 50 },
          sortBy: { type: 'string', enum: ['name', 'createdAt', 'updatedAt'] },
          sortOrder: { type: 'string', enum: ['asc', 'desc'] },
        },
      },
    },
  }, async (request: FastifyRequest<{
    Querystring: {
      page?: number;
      limit?: number;
      search?: string;
      connected?: boolean;
      language?: string;
      sortBy?: string;
      sortOrder?: 'asc' | 'desc';
    };
  }>, reply: FastifyReply) => {
    try {
      const userId = request.user!.id;
      const {
        page = 1,
        limit = 20,
        search,
        connected,
        language,
        sortBy = 'updatedAt',
        sortOrder = 'desc',
      } = request.query;

      const offset = (page - 1) * limit;

      // Build where conditions
      const conditions = [
        or(
          eq(repositories.ownerId, userId),
          eq(userRepositoryAccess.userId, userId)
        ),
        eq(repositories.isActive, true)
      ];

      if (search) {
        conditions.push(
          or(
            ilike(repositories.name, `%${search}%`),
            ilike(repositories.fullName, `%${search}%`),
            ilike(repositories.description, `%${search}%`)
          )
        );
      }

      if (language) {
        conditions.push(eq(repositories.language, language));
      }

      const whereClause = and(...conditions);

      // Get repositories with access information
      const userRepos = await db.query.repositories.findMany({
        where: whereClause,
        with: {
          userAccess: {
            where: eq(userRepositoryAccess.userId, userId),
          },
        },
        orderBy: sortOrder === 'desc' ? desc(repositories[sortBy]) : repositories[sortBy],
        limit,
        offset,
      });

      // Filter by connection status if specified
      let filteredRepos = userRepos;
      if (typeof connected === 'boolean') {
        const user = await UserService.getUserById(userId);
        const isGithubConnected = user?.isGithubConnected || false;
        
        if (connected && !isGithubConnected) {
          filteredRepos = [];
        } else if (!connected && isGithubConnected) {
          filteredRepos = [];
        }
      }

      // Transform repositories to include access level
      const transformedRepos = filteredRepos.map(repo => {
        const isOwner = repo.ownerId === userId;
        const accessLevel = isOwner ? 'admin' : 
          repo.userAccess[0]?.accessLevel || 'read';

        return {
          id: repo.id,
          githubId: repo.githubId,
          name: repo.name,
          fullName: repo.fullName,
          description: repo.description,
          isPrivate: repo.isPrivate,
          defaultBranch: repo.defaultBranch,
          language: repo.language,
          url: repo.url,
          isActive: repo.isActive,
          accessLevel,
          isOwner,
          createdAt: repo.createdAt,
          updatedAt: repo.updatedAt,
        };
      });

      return reply.send({
        success: true,
        data: {
          repositories: transformedRepos,
        },
        meta: {
          page,
          limit,
          total: transformedRepos.length,
          totalPages: Math.ceil(transformedRepos.length / limit),
        },
      });
    } catch (error) {
      logger.error('Failed to get repositories:', error);
      return reply.status(500).send({
        success: false,
        error: {
          code: 'REPOSITORIES_FETCH_FAILED',
          message: 'Failed to fetch repositories',
        },
      });
    }
  });

  // Sync repositories from GitHub
  fastify.post('/sync', {
    preHandler: [generalRateLimit],
    schema: {
      body: {
        type: 'object',
        properties: {
          force: { type: 'boolean' },
        },
      },
    },
  }, async (request: FastifyRequest<{
    Body: { force?: boolean };
  }>, reply: FastifyReply) => {
    try {
      const userId = request.user!.id;
      const { force = false } = request.body;

      // Check if user has GitHub connected
      const user = await UserService.getUserById(userId);
      
      if (!user?.isGithubConnected) {
        return reply.status(400).send({
          success: false,
          error: {
            code: 'GITHUB_NOT_CONNECTED',
            message: 'GitHub account not connected',
          },
        });
      }

      // Get GitHub access token
      const accessToken = await UserService.getGitHubAccessToken(userId);
      
      if (!accessToken) {
        return reply.status(400).send({
          success: false,
          error: {
            code: 'GITHUB_TOKEN_NOT_FOUND',
            message: 'GitHub access token not found',
          },
        });
      }

      // Fetch repositories from GitHub
      const github = new GitHubService(accessToken);
      const githubRepos = await github.getUserRepositories({
        type: 'all',
        sort: 'updated',
        per_page: 100,
      });

      let synced = 0;
      let added = 0;
      let updated = 0;

      for (const githubRepo of githubRepos) {
        try {
          // Check if repository already exists
          const existingRepo = await db.query.repositories.findFirst({
            where: eq(repositories.githubId, githubRepo.id),
          });

          if (existingRepo) {
            // Update existing repository
            await db
              .update(repositories)
              .set({
                name: githubRepo.name,
                fullName: githubRepo.full_name,
                description: githubRepo.description,
                isPrivate: githubRepo.private,
                defaultBranch: githubRepo.default_branch,
                language: githubRepo.language,
                url: githubRepo.html_url,
                cloneUrl: githubRepo.clone_url,
                isActive: true,
                updatedAt: new Date(),
              })
              .where(eq(repositories.id, existingRepo.id));

            updated++;
          } else {
            // Create new repository
            await db.insert(repositories).values({
              githubId: githubRepo.id,
              name: githubRepo.name,
              fullName: githubRepo.full_name,
              description: githubRepo.description,
              isPrivate: githubRepo.private,
              defaultBranch: githubRepo.default_branch,
              language: githubRepo.language,
              url: githubRepo.html_url,
              cloneUrl: githubRepo.clone_url,
              ownerId: githubRepo.owner.id === user.githubId ? userId : null,
              isActive: true,
            });

            added++;
          }

          synced++;
        } catch (error) {
          logger.error('Failed to sync repository:', {
            githubId: githubRepo.id,
            fullName: githubRepo.full_name,
            error,
          });
        }
      }

      logger.info('Repositories synced successfully', {
        userId,
        synced,
        added,
        updated,
      });

      return reply.send({
        success: true,
        data: {
          synced,
          added,
          updated,
          message: 'Repositories synced successfully',
        },
      });
    } catch (error) {
      logger.error('Failed to sync repositories:', error);
      return reply.status(500).send({
        success: false,
        error: {
          code: 'REPOSITORY_SYNC_FAILED',
          message: 'Failed to sync repositories',
        },
      });
    }
  });

  // Get repository details
  fastify.get('/:repositoryId', {
    preHandler: [generalRateLimit, validateRepositoryParams],
    schema: {
      params: {
        type: 'object',
        required: ['repositoryId'],
        properties: {
          repositoryId: { type: 'string', format: 'uuid' },
        },
      },
    },
  }, async (request: FastifyRequest<{
    Params: { repositoryId: string };
  }>, reply: FastifyReply) => {
    try {
      const userId = request.user!.id;
      const { repositoryId } = request.params;

      const repository = await db.query.repositories.findFirst({
        where: eq(repositories.id, repositoryId),
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

      // Check access
      const isOwner = repository.ownerId === userId;
      const hasAccess = isOwner || repository.userAccess.length > 0;

      if (!hasAccess) {
        return reply.status(403).send({
          success: false,
          error: {
            code: 'REPOSITORY_ACCESS_DENIED',
            message: 'Access denied to repository',
          },
        });
      }

      const accessLevel = isOwner ? 'admin' : 
        repository.userAccess[0]?.accessLevel || 'read';

      return reply.send({
        success: true,
        data: {
          ...repository,
          accessLevel,
          isOwner,
          userAccess: undefined, // Remove internal field
        },
      });
    } catch (error) {
      logger.error('Failed to get repository:', error);
      return reply.status(500).send({
        success: false,
        error: {
          code: 'REPOSITORY_FETCH_FAILED',
          message: 'Failed to fetch repository',
        },
      });
    }
  });

  // Get repository branches
  fastify.get('/:repositoryId/branches', {
    preHandler: [generalRateLimit, validateRepositoryParams],
    schema: {
      params: {
        type: 'object',
        required: ['repositoryId'],
        properties: {
          repositoryId: { type: 'string', format: 'uuid' },
        },
      },
    },
  }, async (request: FastifyRequest<{
    Params: { repositoryId: string };
  }>, reply: FastifyReply) => {
    try {
      const userId = request.user!.id;
      const { repositoryId } = request.params;

      // Get repository and verify access
      const repository = await db.query.repositories.findFirst({
        where: eq(repositories.id, repositoryId),
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

      // Check access
      const isOwner = repository.ownerId === userId;
      const hasAccess = isOwner || repository.userAccess.length > 0;

      if (!hasAccess) {
        return reply.status(403).send({
          success: false,
          error: {
            code: 'REPOSITORY_ACCESS_DENIED',
            message: 'Access denied to repository',
          },
        });
      }

      // Get GitHub access token
      const accessToken = await UserService.getGitHubAccessToken(userId);
      
      if (!accessToken) {
        return reply.status(400).send({
          success: false,
          error: {
            code: 'GITHUB_TOKEN_NOT_FOUND',
            message: 'GitHub access token not found',
          },
        });
      }

      // Fetch branches from GitHub
      const github = new GitHubService(accessToken);
      const [owner, repo] = repository.fullName.split('/');
      const branches = await github.getRepositoryBranches(owner, repo);

      return reply.send({
        success: true,
        data: {
          branches,
        },
      });
    } catch (error) {
      logger.error('Failed to get repository branches:', error);
      return reply.status(500).send({
        success: false,
        error: {
          code: 'BRANCHES_FETCH_FAILED',
          message: 'Failed to fetch repository branches',
        },
      });
    }
  });
}
