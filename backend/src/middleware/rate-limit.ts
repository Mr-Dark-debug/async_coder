import { FastifyRequest, FastifyReply } from 'fastify';
import { CacheService } from '@/config/redis';
import { logger } from '@/utils/logger';

interface RateLimitOptions {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Maximum requests per window
  keyGenerator?: (request: FastifyRequest) => string;
  skipSuccessfulRequests?: boolean;
  skipFailedRequests?: boolean;
  message?: string;
  statusCode?: number;
}

/**
 * Rate limiting middleware factory
 */
export function createRateLimitMiddleware(options: RateLimitOptions) {
  const {
    windowMs,
    maxRequests,
    keyGenerator = defaultKeyGenerator,
    skipSuccessfulRequests = false,
    skipFailedRequests = false,
    message = 'Too many requests, please try again later',
    statusCode = 429,
  } = options;

  return async function rateLimitMiddleware(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    try {
      const key = keyGenerator(request);
      const windowSeconds = Math.floor(windowMs / 1000);

      // Check current rate limit status
      const rateLimitInfo = await CacheService.checkRateLimit(
        key,
        maxRequests,
        windowSeconds
      );

      // Add rate limit headers
      reply.header('X-RateLimit-Limit', maxRequests);
      reply.header('X-RateLimit-Remaining', rateLimitInfo.remaining);
      reply.header('X-RateLimit-Reset', new Date(rateLimitInfo.resetTime).toISOString());

      if (!rateLimitInfo.allowed) {
        logger.security('Rate limit exceeded', {
          key,
          maxRequests,
          windowMs,
          ip: request.ip,
          userAgent: request.headers['user-agent'],
          userId: request.user?.id,
        });

        return reply.status(statusCode).send({
          success: false,
          error: {
            code: 'RATE_LIMIT_EXCEEDED',
            message,
            retryAfter: Math.ceil((rateLimitInfo.resetTime - Date.now()) / 1000),
          },
        });
      }

      // Track the request for rate limiting
      if (!skipSuccessfulRequests || !skipFailedRequests) {
        // We'll increment after the request completes
        reply.addHook('onSend', async (request, reply) => {
          const shouldSkip = 
            (skipSuccessfulRequests && reply.statusCode < 400) ||
            (skipFailedRequests && reply.statusCode >= 400);

          if (!shouldSkip) {
            await CacheService.increment(key, windowSeconds);
          }
        });
      }

      logger.debug('Rate limit check passed', {
        key,
        remaining: rateLimitInfo.remaining,
        resetTime: rateLimitInfo.resetTime,
      });
    } catch (error) {
      logger.error('Rate limit middleware error:', error);
      // Continue processing if rate limiting fails
    }
  };
}

/**
 * Default key generator (IP-based)
 */
function defaultKeyGenerator(request: FastifyRequest): string {
  return `rate_limit:${request.ip}`;
}

/**
 * User-based key generator
 */
export function userKeyGenerator(request: FastifyRequest): string {
  if (request.user?.id) {
    return `rate_limit:user:${request.user.id}`;
  }
  return `rate_limit:${request.ip}`;
}

/**
 * API key generator
 */
export function apiKeyGenerator(request: FastifyRequest): string {
  const apiKey = request.headers['x-api-key'] as string;
  if (apiKey) {
    return `rate_limit:api:${apiKey}`;
  }
  return `rate_limit:${request.ip}`;
}

/**
 * Endpoint-specific key generator
 */
export function endpointKeyGenerator(request: FastifyRequest): string {
  const baseKey = request.user?.id ? 
    `rate_limit:user:${request.user.id}` : 
    `rate_limit:${request.ip}`;
  
  return `${baseKey}:${request.method}:${request.url}`;
}

/**
 * Pre-configured rate limit middlewares
 */

// General API rate limiting (100 requests per 15 minutes)
export const generalRateLimit = createRateLimitMiddleware({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 100,
  keyGenerator: userKeyGenerator,
});

// Strict rate limiting for authentication endpoints (5 requests per 15 minutes)
export const authRateLimit = createRateLimitMiddleware({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 5,
  keyGenerator: defaultKeyGenerator,
  message: 'Too many authentication attempts, please try again later',
});

// Task creation rate limiting (10 tasks per hour)
export const taskCreationRateLimit = createRateLimitMiddleware({
  windowMs: 60 * 60 * 1000, // 1 hour
  maxRequests: 10,
  keyGenerator: userKeyGenerator,
  message: 'Too many tasks created, please try again later',
});

// GitHub webhook rate limiting (1000 requests per hour)
export const webhookRateLimit = createRateLimitMiddleware({
  windowMs: 60 * 60 * 1000, // 1 hour
  maxRequests: 1000,
  keyGenerator: (request) => `rate_limit:webhook:${request.ip}`,
});

// API key rate limiting (1000 requests per hour)
export const apiKeyRateLimit = createRateLimitMiddleware({
  windowMs: 60 * 60 * 1000, // 1 hour
  maxRequests: 1000,
  keyGenerator: apiKeyGenerator,
});

// Admin endpoints rate limiting (50 requests per hour)
export const adminRateLimit = createRateLimitMiddleware({
  windowMs: 60 * 60 * 1000, // 1 hour
  maxRequests: 50,
  keyGenerator: userKeyGenerator,
  message: 'Too many admin requests, please try again later',
});

// File upload rate limiting (20 uploads per hour)
export const uploadRateLimit = createRateLimitMiddleware({
  windowMs: 60 * 60 * 1000, // 1 hour
  maxRequests: 20,
  keyGenerator: userKeyGenerator,
  message: 'Too many file uploads, please try again later',
});

/**
 * Dynamic rate limiting based on user subscription tier
 */
export async function dynamicRateLimit(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  if (!request.user) {
    // Apply default rate limiting for unauthenticated users
    return generalRateLimit(request, reply);
  }

  try {
    // Get user's subscription tier from database or cache
    const cacheKey = `user:${request.user.id}:subscription`;
    let subscriptionTier = await CacheService.get<string>(cacheKey);

    if (!subscriptionTier) {
      // Fetch from database if not in cache
      const { db } = await import('@/config/database');
      const { users } = await import('@/db/schema');
      const { eq } = await import('drizzle-orm');

      const user = await db.query.users.findFirst({
        where: eq(users.id, request.user.id),
        columns: { subscriptionTier: true },
      });

      subscriptionTier = user?.subscriptionTier || 'free';
      await CacheService.set(cacheKey, subscriptionTier, 300); // Cache for 5 minutes
    }

    // Define rate limits based on subscription tier
    const rateLimits = {
      free: { windowMs: 60 * 60 * 1000, maxRequests: 100 }, // 100/hour
      pro: { windowMs: 60 * 60 * 1000, maxRequests: 500 }, // 500/hour
      enterprise: { windowMs: 60 * 60 * 1000, maxRequests: 2000 }, // 2000/hour
    };

    const limits = rateLimits[subscriptionTier as keyof typeof rateLimits] || rateLimits.free;

    const dynamicMiddleware = createRateLimitMiddleware({
      ...limits,
      keyGenerator: userKeyGenerator,
      message: `Rate limit exceeded for ${subscriptionTier} tier`,
    });

    return dynamicMiddleware(request, reply);
  } catch (error) {
    logger.error('Dynamic rate limiting error:', error);
    // Fall back to general rate limiting
    return generalRateLimit(request, reply);
  }
}

/**
 * Rate limit bypass for specific conditions
 */
export function createBypassableRateLimit(
  baseMiddleware: (req: FastifyRequest, reply: FastifyReply) => Promise<void>,
  bypassCondition: (req: FastifyRequest) => boolean
) {
  return async function bypassableRateLimitMiddleware(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    if (bypassCondition(request)) {
      logger.debug('Rate limit bypassed', {
        ip: request.ip,
        userId: request.user?.id,
        url: request.url,
      });
      return;
    }

    return baseMiddleware(request, reply);
  };
}

/**
 * Rate limit information endpoint helper
 */
export async function getRateLimitInfo(
  request: FastifyRequest,
  keyGenerator: (req: FastifyRequest) => string = userKeyGenerator
): Promise<{
  limit: number;
  remaining: number;
  resetTime: number;
  windowMs: number;
}> {
  const key = keyGenerator(request);
  
  // This would need to be customized based on your specific rate limiting setup
  const defaultLimits = {
    limit: 100,
    remaining: 100,
    resetTime: Date.now() + (60 * 60 * 1000),
    windowMs: 60 * 60 * 1000,
  };

  try {
    const rateLimitInfo = await CacheService.checkRateLimit(key, 100, 3600);
    return {
      limit: 100,
      remaining: rateLimitInfo.remaining,
      resetTime: rateLimitInfo.resetTime,
      windowMs: 60 * 60 * 1000,
    };
  } catch (error) {
    logger.error('Failed to get rate limit info:', error);
    return defaultLimits;
  }
}
