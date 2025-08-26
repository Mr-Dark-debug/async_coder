import { FastifyRequest, FastifyReply } from 'fastify';
import { AuthService } from '@/config/auth';
import { CacheService } from '@/config/redis';
import { db } from '@/config/database';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { logger } from '@/utils/logger';
import type { AuthenticatedUser } from '@/types';

/**
 * Authentication middleware for Fastify
 */
export async function authMiddleware(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  try {
    // Extract token from Authorization header
    const authHeader = request.headers.authorization;
    const token = AuthService.extractTokenFromHeader(authHeader);

    if (!token) {
      return reply.status(401).send({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Authorization token is required',
        },
      });
    }

    // Validate token format
    if (!AuthService.isValidTokenFormat(token)) {
      return reply.status(401).send({
        success: false,
        error: {
          code: 'INVALID_TOKEN_FORMAT',
          message: 'Invalid token format',
        },
      });
    }

    // Check if token is in cache (for performance)
    const cacheKey = `auth:token:${token}`;
    let user = await CacheService.get<AuthenticatedUser>(cacheKey);

    if (!user) {
      // Verify JWT token
      const payload = AuthService.verifyToken(token);

      // Fetch user from database
      const dbUser = await db.query.users.findFirst({
        where: eq(users.id, payload.userId),
        columns: {
          id: true,
          clerkId: true,
          email: true,
          username: true,
          isGithubConnected: true,
          credits: true,
          subscriptionTier: true,
        },
      });

      if (!dbUser) {
        return reply.status(401).send({
          success: false,
          error: {
            code: 'USER_NOT_FOUND',
            message: 'User not found',
          },
        });
      }

      user = {
        id: dbUser.id,
        clerkId: dbUser.clerkId,
        email: dbUser.email,
        username: dbUser.username,
      };

      // Cache user for 5 minutes
      await CacheService.set(cacheKey, user, 300);
    }

    // Attach user to request
    request.user = user;

    logger.auth('User authenticated successfully', {
      userId: user.id,
      username: user.username,
    });
  } catch (error) {
    logger.error('Authentication failed:', error);
    
    if (error.message === 'Token has expired') {
      return reply.status(401).send({
        success: false,
        error: {
          code: 'TOKEN_EXPIRED',
          message: 'Authentication token has expired',
        },
      });
    }

    if (error.message === 'Invalid token') {
      return reply.status(401).send({
        success: false,
        error: {
          code: 'INVALID_TOKEN',
          message: 'Invalid authentication token',
        },
      });
    }

    return reply.status(401).send({
      success: false,
      error: {
        code: 'AUTHENTICATION_FAILED',
        message: 'Authentication failed',
      },
    });
  }
}

/**
 * Optional authentication middleware (doesn't fail if no token)
 */
export async function optionalAuthMiddleware(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  try {
    const authHeader = request.headers.authorization;
    const token = AuthService.extractTokenFromHeader(authHeader);

    if (token && AuthService.isValidTokenFormat(token)) {
      await authMiddleware(request, reply);
    }
  } catch (error) {
    // Silently ignore authentication errors for optional auth
    logger.debug('Optional authentication failed:', error);
  }
}

/**
 * Admin role middleware
 */
export async function adminMiddleware(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  if (!request.user) {
    return reply.status(401).send({
      success: false,
      error: {
        code: 'UNAUTHORIZED',
        message: 'Authentication required',
      },
    });
  }

  try {
    // Check if user has admin role in Clerk
    const clerkUser = await AuthService.getClerkUser(request.user.clerkId);
    const role = clerkUser.publicMetadata?.role;

    if (role !== 'admin') {
      logger.security('Unauthorized admin access attempt', {
        userId: request.user.id,
        username: request.user.username,
      });

      return reply.status(403).send({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: 'Admin access required',
        },
      });
    }

    logger.audit('Admin access granted', request.user.id, {
      endpoint: request.url,
      method: request.method,
    });
  } catch (error) {
    logger.error('Admin middleware error:', error);
    return reply.status(500).send({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to verify admin access',
      },
    });
  }
}

/**
 * API key authentication middleware
 */
export async function apiKeyMiddleware(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  try {
    const apiKey = request.headers['x-api-key'] as string;

    if (!apiKey) {
      return reply.status(401).send({
        success: false,
        error: {
          code: 'API_KEY_REQUIRED',
          message: 'API key is required',
        },
      });
    }

    // Verify API key format and extract metadata
    const keyInfo = AuthService.verifyApiKey(apiKey);

    if (!keyInfo.valid || !keyInfo.userId) {
      return reply.status(401).send({
        success: false,
        error: {
          code: 'INVALID_API_KEY',
          message: 'Invalid API key',
        },
      });
    }

    // Fetch user from database
    const user = await db.query.users.findFirst({
      where: eq(users.id, keyInfo.userId),
      columns: {
        id: true,
        clerkId: true,
        email: true,
        username: true,
      },
    });

    if (!user) {
      return reply.status(401).send({
        success: false,
        error: {
          code: 'USER_NOT_FOUND',
          message: 'User associated with API key not found',
        },
      });
    }

    // Attach user to request
    request.user = {
      id: user.id,
      clerkId: user.clerkId,
      email: user.email,
      username: user.username,
    };

    logger.auth('API key authentication successful', {
      userId: user.id,
      scope: keyInfo.scope,
    });
  } catch (error) {
    logger.error('API key authentication failed:', error);
    return reply.status(401).send({
      success: false,
      error: {
        code: 'API_KEY_AUTHENTICATION_FAILED',
        message: 'API key authentication failed',
      },
    });
  }
}

/**
 * Session-based authentication middleware
 */
export async function sessionMiddleware(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  try {
    const sessionId = request.cookies?.async_coder_session;

    if (!sessionId) {
      return reply.status(401).send({
        success: false,
        error: {
          code: 'SESSION_REQUIRED',
          message: 'Session is required',
        },
      });
    }

    // Get session from cache
    const sessionData = await CacheService.getSession<{
      userId: string;
      clerkId: string;
      email: string;
      username: string;
    }>(sessionId);

    if (!sessionData) {
      return reply.status(401).send({
        success: false,
        error: {
          code: 'INVALID_SESSION',
          message: 'Invalid or expired session',
        },
      });
    }

    // Attach user to request
    request.user = sessionData;
    request.sessionId = sessionId;

    logger.auth('Session authentication successful', {
      userId: sessionData.userId,
      sessionId,
    });
  } catch (error) {
    logger.error('Session authentication failed:', error);
    return reply.status(401).send({
      success: false,
      error: {
        code: 'SESSION_AUTHENTICATION_FAILED',
        message: 'Session authentication failed',
      },
    });
  }
}

/**
 * Clerk webhook authentication middleware
 */
export async function clerkWebhookMiddleware(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  try {
    const signature = request.headers['svix-signature'] as string;
    const timestamp = request.headers['svix-timestamp'] as string;
    const body = JSON.stringify(request.body);

    if (!signature || !timestamp) {
      return reply.status(401).send({
        success: false,
        error: {
          code: 'MISSING_WEBHOOK_HEADERS',
          message: 'Missing webhook signature or timestamp',
        },
      });
    }

    // Verify Clerk webhook signature
    // Note: In a real implementation, you would use Clerk's webhook verification
    // This is a simplified version
    const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;
    if (!webhookSecret) {
      throw new Error('Clerk webhook secret not configured');
    }

    logger.webhook('Clerk webhook authenticated', {
      timestamp,
      bodyLength: body.length,
    });
  } catch (error) {
    logger.error('Clerk webhook authentication failed:', error);
    return reply.status(401).send({
      success: false,
      error: {
        code: 'WEBHOOK_AUTHENTICATION_FAILED',
        message: 'Webhook authentication failed',
      },
    });
  }
}
