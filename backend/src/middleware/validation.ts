import { FastifyRequest, FastifyReply } from 'fastify';
import { z, ZodSchema, ZodError } from 'zod';
import { logger } from '@/utils/logger';

/**
 * Validation middleware factory
 */
export function createValidationMiddleware<T>(schema: ZodSchema<T>, target: 'body' | 'query' | 'params' = 'body') {
  return async function validationMiddleware(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    try {
      const dataToValidate = request[target];
      const validatedData = schema.parse(dataToValidate);
      
      // Replace the original data with validated data
      (request as any)[target] = validatedData;
      
      logger.debug('Validation successful', {
        target,
        url: request.url,
        method: request.method,
      });
    } catch (error) {
      if (error instanceof ZodError) {
        const validationErrors = error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message,
          code: err.code,
        }));

        logger.warn('Validation failed', {
          target,
          url: request.url,
          method: request.method,
          errors: validationErrors,
        });

        return reply.status(400).send({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Request validation failed',
            details: validationErrors,
          },
        });
      }

      logger.error('Validation middleware error:', error);
      return reply.status(500).send({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Internal validation error',
        },
      });
    }
  };
}

/**
 * Common validation schemas
 */

// UUID validation
export const uuidSchema = z.string().uuid('Invalid UUID format');

// Pagination validation
export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

// Task creation validation
export const createTaskSchema = z.object({
  repositoryId: uuidSchema,
  aiModelId: uuidSchema,
  title: z.string().min(1).max(255),
  description: z.string().max(1000).optional(),
  prompt: z.string().min(1).max(10000),
  branch: z.string().min(1).max(255),
  targetBranch: z.string().min(1).max(255).default('main'),
  type: z.enum(['debug', 'ask', 'documentation', 'architect', 'pr_review', 'async']),
  priority: z.enum(['low', 'medium', 'high']).default('medium'),
});

// Task update validation
export const updateTaskSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  description: z.string().max(1000).optional(),
  priority: z.enum(['low', 'medium', 'high']).optional(),
  status: z.enum(['pending', 'running', 'completed', 'failed', 'cancelled']).optional(),
});

// User update validation
export const updateUserSchema = z.object({
  displayName: z.string().min(1).max(255).optional(),
  avatarUrl: z.string().url().optional(),
});

// GitHub connection validation
export const connectGitHubSchema = z.object({
  code: z.string().min(1),
  state: z.string().optional(),
});

// Repository sync validation
export const syncRepositoriesSchema = z.object({
  force: z.boolean().default(false),
});

// Webhook validation
export const webhookPayloadSchema = z.object({
  action: z.string(),
  repository: z.object({
    id: z.number(),
    name: z.string(),
    full_name: z.string(),
  }),
  sender: z.object({
    id: z.number(),
    login: z.string(),
  }),
});

// Credit purchase validation
export const creditPurchaseSchema = z.object({
  packageId: uuidSchema,
  paymentMethodId: z.string().min(1),
});

// Subscription validation
export const subscriptionSchema = z.object({
  planId: uuidSchema,
  paymentMethodId: z.string().min(1),
});

// API key creation validation
export const createApiKeySchema = z.object({
  name: z.string().min(1).max(255),
  scope: z.string().min(1).max(100).default('general'),
  expiresAt: z.string().datetime().optional(),
});

// Search validation
export const searchSchema = z.object({
  q: z.string().min(1).max(255),
  type: z.enum(['tasks', 'repositories', 'users']).optional(),
  ...paginationSchema.shape,
});

// File upload validation
export const fileUploadSchema = z.object({
  filename: z.string().min(1).max(255),
  contentType: z.string().min(1),
  size: z.number().int().min(1).max(10 * 1024 * 1024), // 10MB max
});

/**
 * Pre-configured validation middlewares
 */

// Body validation middlewares
export const validateCreateTask = createValidationMiddleware(createTaskSchema, 'body');
export const validateUpdateTask = createValidationMiddleware(updateTaskSchema, 'body');
export const validateUpdateUser = createValidationMiddleware(updateUserSchema, 'body');
export const validateConnectGitHub = createValidationMiddleware(connectGitHubSchema, 'body');
export const validateSyncRepositories = createValidationMiddleware(syncRepositoriesSchema, 'body');
export const validateWebhookPayload = createValidationMiddleware(webhookPayloadSchema, 'body');
export const validateCreditPurchase = createValidationMiddleware(creditPurchaseSchema, 'body');
export const validateSubscription = createValidationMiddleware(subscriptionSchema, 'body');
export const validateCreateApiKey = createValidationMiddleware(createApiKeySchema, 'body');
export const validateFileUpload = createValidationMiddleware(fileUploadSchema, 'body');

// Query validation middlewares
export const validatePagination = createValidationMiddleware(paginationSchema, 'query');
export const validateSearch = createValidationMiddleware(searchSchema, 'query');

// Params validation middlewares
export const validateUuidParam = createValidationMiddleware(
  z.object({ id: uuidSchema }), 
  'params'
);

export const validateTaskParams = createValidationMiddleware(
  z.object({ taskId: uuidSchema }), 
  'params'
);

export const validateRepositoryParams = createValidationMiddleware(
  z.object({ repositoryId: uuidSchema }), 
  'params'
);

export const validateUserParams = createValidationMiddleware(
  z.object({ userId: uuidSchema }), 
  'params'
);

/**
 * Custom validation helpers
 */

// Validate email format
export const emailSchema = z.string().email('Invalid email format');

// Validate URL format
export const urlSchema = z.string().url('Invalid URL format');

// Validate GitHub repository format (owner/repo)
export const githubRepoSchema = z.string().regex(
  /^[a-zA-Z0-9_.-]+\/[a-zA-Z0-9_.-]+$/,
  'Invalid GitHub repository format (should be owner/repo)'
);

// Validate branch name format
export const branchNameSchema = z.string().regex(
  /^[a-zA-Z0-9_.-\/]+$/,
  'Invalid branch name format'
);

// Validate credit amount
export const creditAmountSchema = z.number().int().min(1).max(10000);

// Validate password strength
export const passwordSchema = z.string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character');

/**
 * Conditional validation middleware
 */
export function createConditionalValidation<T>(
  schema: ZodSchema<T>,
  condition: (request: FastifyRequest) => boolean,
  target: 'body' | 'query' | 'params' = 'body'
) {
  return async function conditionalValidationMiddleware(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    if (condition(request)) {
      return createValidationMiddleware(schema, target)(request, reply);
    }
  };
}

/**
 * Multiple schema validation (for different content types)
 */
export function createMultiSchemaValidation(
  schemas: Record<string, ZodSchema>,
  getSchemaKey: (request: FastifyRequest) => string,
  target: 'body' | 'query' | 'params' = 'body'
) {
  return async function multiSchemaValidationMiddleware(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    const schemaKey = getSchemaKey(request);
    const schema = schemas[schemaKey];

    if (!schema) {
      return reply.status(400).send({
        success: false,
        error: {
          code: 'UNSUPPORTED_SCHEMA',
          message: `Unsupported schema type: ${schemaKey}`,
        },
      });
    }

    return createValidationMiddleware(schema, target)(request, reply);
  };
}

/**
 * Sanitization helpers
 */
export function sanitizeString(str: string): string {
  return str.trim().replace(/[<>]/g, '');
}

export function sanitizeHtml(html: string): string {
  // Basic HTML sanitization - in production, use a proper library like DOMPurify
  return html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
}

export function sanitizeFilename(filename: string): string {
  return filename.replace(/[^a-zA-Z0-9._-]/g, '_');
}
