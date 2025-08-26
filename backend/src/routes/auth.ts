import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { AuthService } from '@/config/auth';
import { UserService } from '@/services/user';
import { GitHubService } from '@/utils/github';
import { CacheService } from '@/config/redis';
import { logger } from '@/utils/logger';
import { authRateLimit } from '@/middleware/rate-limit';
import { validateConnectGitHub } from '@/middleware/validation';
import { clerkWebhookMiddleware } from '@/middleware/auth';
import type { AuthenticatedUser } from '@/types';

export default async function authRoutes(fastify: FastifyInstance) {
  // Login with Clerk token
  fastify.post('/login', {
    preHandler: [authRateLimit],
    schema: {
      body: {
        type: 'object',
        required: ['clerkToken'],
        properties: {
          clerkToken: { type: 'string' },
        },
      },
    },
  }, async (request: FastifyRequest<{
    Body: { clerkToken: string };
  }>, reply: FastifyReply) => {
    try {
      const { clerkToken } = request.body;

      // Verify Clerk token
      const clerkSession = await AuthService.verifyClerkToken(clerkToken);
      
      if (!clerkSession) {
        return reply.status(401).send({
          success: false,
          error: {
            code: 'INVALID_CLERK_TOKEN',
            message: 'Invalid Clerk session token',
          },
        });
      }

      // Get user from Clerk
      const clerkUser = await AuthService.getClerkUser(clerkSession.sub);
      
      // Find or create user in our database
      let user = await UserService.getUserByClerkId(clerkSession.sub);
      
      if (!user) {
        // Create new user
        user = await UserService.createUser({
          clerkId: clerkSession.sub,
          email: clerkUser.emailAddresses[0]?.emailAddress || '',
          username: clerkUser.username || clerkUser.emailAddresses[0]?.emailAddress.split('@')[0] || '',
          displayName: clerkUser.firstName && clerkUser.lastName ? 
            `${clerkUser.firstName} ${clerkUser.lastName}` : undefined,
          avatarUrl: clerkUser.imageUrl,
        });
      }

      // Generate JWT token
      const authUser: AuthenticatedUser = {
        id: user.id,
        clerkId: user.clerkId,
        email: user.email,
        username: user.username,
      };

      const token = AuthService.generateToken(authUser);
      const refreshToken = AuthService.generateRefreshToken(authUser);

      // Create session
      const sessionId = AuthService.generateSessionId();
      await CacheService.setSession(sessionId, authUser, 86400); // 24 hours

      logger.auth('User logged in successfully', {
        userId: user.id,
        email: user.email,
        sessionId,
      });

      return reply.send({
        success: true,
        data: {
          user: {
            id: user.id,
            email: user.email,
            username: user.username,
            displayName: user.displayName,
            avatarUrl: user.avatarUrl,
            credits: user.credits,
            subscriptionTier: user.subscriptionTier,
            isGithubConnected: user.isGithubConnected,
          },
          token,
          refreshToken,
          sessionId,
        },
      });
    } catch (error) {
      logger.error('Login failed:', error);
      return reply.status(500).send({
        success: false,
        error: {
          code: 'LOGIN_FAILED',
          message: 'Login failed',
        },
      });
    }
  });

  // Refresh token
  fastify.post('/refresh', {
    preHandler: [authRateLimit],
    schema: {
      body: {
        type: 'object',
        required: ['refreshToken'],
        properties: {
          refreshToken: { type: 'string' },
        },
      },
    },
  }, async (request: FastifyRequest<{
    Body: { refreshToken: string };
  }>, reply: FastifyReply) => {
    try {
      const { refreshToken } = request.body;

      // Verify refresh token
      const payload = AuthService.verifyToken(refreshToken);
      
      // Get user
      const user = await UserService.getUserById(payload.userId);
      
      if (!user) {
        return reply.status(401).send({
          success: false,
          error: {
            code: 'USER_NOT_FOUND',
            message: 'User not found',
          },
        });
      }

      // Generate new tokens
      const authUser: AuthenticatedUser = {
        id: user.id,
        clerkId: user.clerkId,
        email: user.email,
        username: user.username,
      };

      const newToken = AuthService.generateToken(authUser);
      const newRefreshToken = AuthService.generateRefreshToken(authUser);

      logger.auth('Token refreshed successfully', {
        userId: user.id,
      });

      return reply.send({
        success: true,
        data: {
          token: newToken,
          refreshToken: newRefreshToken,
        },
      });
    } catch (error) {
      logger.error('Token refresh failed:', error);
      return reply.status(401).send({
        success: false,
        error: {
          code: 'TOKEN_REFRESH_FAILED',
          message: 'Token refresh failed',
        },
      });
    }
  });

  // Connect GitHub account
  fastify.post('/github/connect', {
    preHandler: [authRateLimit, validateConnectGitHub],
    schema: {
      body: {
        type: 'object',
        required: ['code'],
        properties: {
          code: { type: 'string' },
          state: { type: 'string' },
        },
      },
    },
  }, async (request: FastifyRequest<{
    Body: { code: string; state?: string };
  }>, reply: FastifyReply) => {
    try {
      const { code } = request.body;

      // Exchange code for access token
      const tokenData = await GitHubService.exchangeCodeForToken(code);
      
      // Get GitHub user info
      const github = new GitHubService(tokenData.accessToken);
      const githubUser = await github.getAuthenticatedUser();

      // Get user email if not provided
      let email = githubUser.email;
      if (!email) {
        email = await github.getUserPrimaryEmail();
      }

      // Find or create user
      let user = await UserService.getUserByEmail(email);
      
      if (!user) {
        // Create new user with GitHub data
        user = await UserService.createUser({
          clerkId: `github_${githubUser.id}`, // Temporary Clerk ID
          email,
          username: githubUser.login,
          displayName: githubUser.name,
          avatarUrl: githubUser.avatar_url,
        });
      }

      // Connect GitHub account
      await UserService.connectGitHub(user.id, {
        githubId: githubUser.id,
        accessToken: tokenData.accessToken,
      });

      logger.auth('GitHub account connected', {
        userId: user.id,
        githubId: githubUser.id,
        githubUsername: githubUser.login,
      });

      return reply.send({
        success: true,
        data: {
          message: 'GitHub account connected successfully',
          githubUser: {
            id: githubUser.id,
            login: githubUser.login,
            name: githubUser.name,
            avatar_url: githubUser.avatar_url,
          },
        },
      });
    } catch (error) {
      logger.error('GitHub connection failed:', error);
      return reply.status(500).send({
        success: false,
        error: {
          code: 'GITHUB_CONNECTION_FAILED',
          message: 'Failed to connect GitHub account',
        },
      });
    }
  });

  // Logout
  fastify.post('/logout', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const sessionId = request.cookies?.async_coder_session;
      
      if (sessionId) {
        await CacheService.deleteSession(sessionId);
      }

      logger.auth('User logged out', {
        sessionId,
        userId: request.user?.id,
      });

      return reply.send({
        success: true,
        data: {
          message: 'Logged out successfully',
        },
      });
    } catch (error) {
      logger.error('Logout failed:', error);
      return reply.status(500).send({
        success: false,
        error: {
          code: 'LOGOUT_FAILED',
          message: 'Logout failed',
        },
      });
    }
  });

  // Clerk webhook handler
  fastify.post('/webhooks/clerk', {
    preHandler: [clerkWebhookMiddleware],
  }, async (request: FastifyRequest<{
    Body: any;
  }>, reply: FastifyReply) => {
    try {
      const { type, data } = request.body;

      logger.webhook('Clerk webhook received', { type, userId: data.id });

      switch (type) {
        case 'user.created':
          // Handle user creation
          await handleUserCreated(data);
          break;
        
        case 'user.updated':
          // Handle user update
          await handleUserUpdated(data);
          break;
        
        case 'user.deleted':
          // Handle user deletion
          await handleUserDeleted(data);
          break;
        
        default:
          logger.warn('Unhandled Clerk webhook type:', { type });
      }

      return reply.send({ success: true });
    } catch (error) {
      logger.error('Clerk webhook processing failed:', error);
      return reply.status(500).send({
        success: false,
        error: {
          code: 'WEBHOOK_PROCESSING_FAILED',
          message: 'Webhook processing failed',
        },
      });
    }
  });
}

// Webhook handlers
async function handleUserCreated(clerkUser: any): Promise<void> {
  try {
    const existingUser = await UserService.getUserByClerkId(clerkUser.id);
    
    if (!existingUser) {
      await UserService.createUser({
        clerkId: clerkUser.id,
        email: clerkUser.email_addresses[0]?.email_address || '',
        username: clerkUser.username || clerkUser.email_addresses[0]?.email_address.split('@')[0] || '',
        displayName: clerkUser.first_name && clerkUser.last_name ? 
          `${clerkUser.first_name} ${clerkUser.last_name}` : undefined,
        avatarUrl: clerkUser.image_url,
      });
    }
  } catch (error) {
    logger.error('Failed to handle user created webhook:', error);
  }
}

async function handleUserUpdated(clerkUser: any): Promise<void> {
  try {
    const user = await UserService.getUserByClerkId(clerkUser.id);
    
    if (user) {
      await UserService.updateUser(user.id, {
        displayName: clerkUser.first_name && clerkUser.last_name ? 
          `${clerkUser.first_name} ${clerkUser.last_name}` : undefined,
        avatarUrl: clerkUser.image_url,
      });
    }
  } catch (error) {
    logger.error('Failed to handle user updated webhook:', error);
  }
}

async function handleUserDeleted(clerkUser: any): Promise<void> {
  try {
    const user = await UserService.getUserByClerkId(clerkUser.id);
    
    if (user) {
      await UserService.deleteUser(user.id);
    }
  } catch (error) {
    logger.error('Failed to handle user deleted webhook:', error);
  }
}
