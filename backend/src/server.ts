import Fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';
import multipart from '@fastify/multipart';
import { checkDatabaseConnection, closeDatabaseConnection } from '@/config/database';
import { checkRedisConnection, closeRedisConnection } from '@/config/redis';
import { TaskQueueService } from '@/services/task-queue';
import { AIProviderService } from '@/services/ai-provider';
import { logger } from '@/utils/logger';

// Import routes
import authRoutes from '@/routes/auth';
import userRoutes from '@/routes/users';
import repositoryRoutes from '@/routes/repositories';
import taskRoutes from '@/routes/tasks';
import webhookRoutes from '@/routes/webhooks';
import adminRoutes from '@/routes/admin';

// Server configuration
const PORT = parseInt(process.env.PORT || '3001');
const HOST = process.env.HOST || 'localhost';
const NODE_ENV = process.env.NODE_ENV || 'development';

// Create Fastify instance
const fastify = Fastify({
  logger: false, // We use our custom logger
  trustProxy: true,
  bodyLimit: 10 * 1024 * 1024, // 10MB
});

// Global error handler
fastify.setErrorHandler(async (error, request, reply) => {
  logger.error('Unhandled error:', {
    error: error.message,
    stack: error.stack,
    url: request.url,
    method: request.method,
    ip: request.ip,
    userAgent: request.headers['user-agent'],
    userId: request.user?.id,
  });

  // Don't expose internal errors in production
  const message = NODE_ENV === 'production' ? 'Internal Server Error' : error.message;

  return reply.status(error.statusCode || 500).send({
    success: false,
    error: {
      code: 'INTERNAL_ERROR',
      message,
    },
  });
});

// Not found handler
fastify.setNotFoundHandler(async (request, reply) => {
  logger.warn('Route not found:', {
    url: request.url,
    method: request.method,
    ip: request.ip,
  });

  return reply.status(404).send({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: 'Route not found',
    },
  });
});

// Register plugins
async function registerPlugins() {
  // Security
  await fastify.register(helmet, {
    contentSecurityPolicy: false, // Disable CSP for API
  });

  // CORS
  await fastify.register(cors, {
    origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-API-Key'],
  });

  // Rate limiting
  await fastify.register(rateLimit, {
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
    timeWindow: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
    redis: {
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379'),
      password: process.env.REDIS_PASSWORD,
    },
  });

  // File upload support
  await fastify.register(multipart, {
    limits: {
      fileSize: 10 * 1024 * 1024, // 10MB
      files: 5,
    },
  });

  logger.info('Plugins registered successfully');
}

// Register routes
async function registerRoutes() {
  // Health check
  fastify.get('/health', async (request, reply) => {
    const dbHealthy = await checkDatabaseConnection();
    const redisHealthy = await checkRedisConnection();

    const health = {
      status: dbHealthy && redisHealthy ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      services: {
        database: dbHealthy ? 'healthy' : 'unhealthy',
        redis: redisHealthy ? 'healthy' : 'unhealthy',
        queue: 'healthy', // Simplified check
      },
      version: process.env.npm_package_version || '1.0.0',
      environment: NODE_ENV,
    };

    const statusCode = health.status === 'healthy' ? 200 : 503;
    return reply.status(statusCode).send(health);
  });

  // API routes
  await fastify.register(authRoutes, { prefix: '/api/auth' });
  await fastify.register(userRoutes, { prefix: '/api/users' });
  await fastify.register(repositoryRoutes, { prefix: '/api/repositories' });
  await fastify.register(taskRoutes, { prefix: '/api/tasks' });
  await fastify.register(webhookRoutes, { prefix: '/api/webhooks' });
  await fastify.register(adminRoutes, { prefix: '/api/admin' });

  logger.info('Routes registered successfully');
}

// Initialize services
async function initializeServices() {
  try {
    // Check database connection
    const dbHealthy = await checkDatabaseConnection();
    if (!dbHealthy) {
      throw new Error('Database connection failed');
    }

    // Check Redis connection
    const redisHealthy = await checkRedisConnection();
    if (!redisHealthy) {
      throw new Error('Redis connection failed');
    }

    // Initialize task queue
    TaskQueueService.initialize();

    // Initialize AI providers
    await AIProviderService.initialize();

    logger.info('All services initialized successfully');
  } catch (error) {
    logger.error('Service initialization failed:', error);
    throw error;
  }
}

// Graceful shutdown
async function gracefulShutdown(signal: string) {
  logger.info(`Received ${signal}, starting graceful shutdown...`);

  try {
    // Stop accepting new requests
    await fastify.close();

    // Shutdown task queue
    await TaskQueueService.shutdown();

    // Close database connection
    await closeDatabaseConnection();

    // Close Redis connection
    await closeRedisConnection();

    logger.info('Graceful shutdown completed');
    process.exit(0);
  } catch (error) {
    logger.error('Error during graceful shutdown:', error);
    process.exit(1);
  }
}

// Setup signal handlers
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error('Uncaught exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled rejection:', { reason, promise });
  process.exit(1);
});

// Start server
async function start() {
  try {
    logger.info('Starting Async Coder API server...', {
      port: PORT,
      host: HOST,
      environment: NODE_ENV,
    });

    // Initialize services
    await initializeServices();

    // Register plugins
    await registerPlugins();

    // Register routes
    await registerRoutes();

    // Start listening
    await fastify.listen({
      port: PORT,
      host: HOST,
    });

    logger.info('Server started successfully', {
      port: PORT,
      host: HOST,
      environment: NODE_ENV,
    });

    // Log available routes in development
    if (NODE_ENV === 'development') {
      logger.info('Available routes:', {
        routes: fastify.printRoutes(),
      });
    }
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Start the server
start();

// Export for testing
export { fastify };
