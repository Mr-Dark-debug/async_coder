import Redis from 'ioredis';
import { logger } from '@/utils/logger';

// Redis configuration
const redisConfig = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD,
  db: parseInt(process.env.REDIS_DB || '0'),
  retryDelayOnFailover: 100,
  maxRetriesPerRequest: 3,
  lazyConnect: true,
  keepAlive: 30000,
  connectTimeout: 10000,
  commandTimeout: 5000,
};

// Create Redis client
export const redis = new Redis(redisConfig);

// Redis event handlers
redis.on('connect', () => {
  logger.info('Redis connected successfully');
});

redis.on('ready', () => {
  logger.info('Redis is ready to receive commands');
});

redis.on('error', (error) => {
  logger.error('Redis connection error:', error);
});

redis.on('close', () => {
  logger.warn('Redis connection closed');
});

redis.on('reconnecting', () => {
  logger.info('Redis reconnecting...');
});

// Redis health check
export async function checkRedisConnection(): Promise<boolean> {
  try {
    await redis.ping();
    logger.info('Redis connection successful');
    return true;
  } catch (error) {
    logger.error('Redis connection failed:', error);
    return false;
  }
}

// Cache helper functions
export class CacheService {
  private static readonly DEFAULT_TTL = 300; // 5 minutes

  static async get<T>(key: string): Promise<T | null> {
    try {
      const value = await redis.get(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      logger.error('Cache get error:', { key, error });
      return null;
    }
  }

  static async set(key: string, value: any, ttl: number = this.DEFAULT_TTL): Promise<boolean> {
    try {
      await redis.setex(key, ttl, JSON.stringify(value));
      return true;
    } catch (error) {
      logger.error('Cache set error:', { key, error });
      return false;
    }
  }

  static async del(key: string): Promise<boolean> {
    try {
      await redis.del(key);
      return true;
    } catch (error) {
      logger.error('Cache delete error:', { key, error });
      return false;
    }
  }

  static async exists(key: string): Promise<boolean> {
    try {
      const result = await redis.exists(key);
      return result === 1;
    } catch (error) {
      logger.error('Cache exists error:', { key, error });
      return false;
    }
  }

  static async increment(key: string, ttl?: number): Promise<number> {
    try {
      const result = await redis.incr(key);
      if (ttl && result === 1) {
        await redis.expire(key, ttl);
      }
      return result;
    } catch (error) {
      logger.error('Cache increment error:', { key, error });
      return 0;
    }
  }

  static async setHash(key: string, field: string, value: any, ttl?: number): Promise<boolean> {
    try {
      await redis.hset(key, field, JSON.stringify(value));
      if (ttl) {
        await redis.expire(key, ttl);
      }
      return true;
    } catch (error) {
      logger.error('Cache hash set error:', { key, field, error });
      return false;
    }
  }

  static async getHash<T>(key: string, field: string): Promise<T | null> {
    try {
      const value = await redis.hget(key, field);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      logger.error('Cache hash get error:', { key, field, error });
      return null;
    }
  }

  static async getAllHash<T>(key: string): Promise<Record<string, T> | null> {
    try {
      const hash = await redis.hgetall(key);
      const result: Record<string, T> = {};
      
      for (const [field, value] of Object.entries(hash)) {
        result[field] = JSON.parse(value);
      }
      
      return Object.keys(result).length > 0 ? result : null;
    } catch (error) {
      logger.error('Cache get all hash error:', { key, error });
      return null;
    }
  }

  // Session management
  static async setSession(sessionId: string, data: any, ttl: number = 86400): Promise<boolean> {
    return this.set(`session:${sessionId}`, data, ttl);
  }

  static async getSession<T>(sessionId: string): Promise<T | null> {
    return this.get<T>(`session:${sessionId}`);
  }

  static async deleteSession(sessionId: string): Promise<boolean> {
    return this.del(`session:${sessionId}`);
  }

  // Rate limiting
  static async checkRateLimit(
    key: string, 
    limit: number, 
    window: number
  ): Promise<{ allowed: boolean; remaining: number; resetTime: number }> {
    try {
      const current = await this.increment(`rate_limit:${key}`, window);
      const remaining = Math.max(0, limit - current);
      const resetTime = Date.now() + (window * 1000);
      
      return {
        allowed: current <= limit,
        remaining,
        resetTime
      };
    } catch (error) {
      logger.error('Rate limit check error:', { key, error });
      return { allowed: true, remaining: limit, resetTime: Date.now() };
    }
  }
}

// Graceful shutdown
export async function closeRedisConnection(): Promise<void> {
  try {
    await redis.quit();
    logger.info('Redis connection closed');
  } catch (error) {
    logger.error('Error closing Redis connection:', error);
  }
}
