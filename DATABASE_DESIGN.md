# Async Coder - Database Design & Backend Architecture

## Project Overview

Based on the analysis of the current Async Coder project, this document outlines a comprehensive database design and backend architecture for the AI coding assistant platform. The system will support user authentication, GitHub integration, task management, AI model selection, credit system, and PR tracking.

## Current State Analysis

### Existing Implementation
- **Frontend**: Next.js 15 with React 19, TypeScript, Tailwind CSS
- **Authentication**: Clerk integration (already implemented)
- **UI Components**: Radix UI, Framer Motion, custom components
- **Current Pages**: Landing page, sign-in/sign-up, task dashboard with sidebar

### Key Requirements Identified
1. User authentication with GitHub OAuth integration
2. Repository selection and branch management
3. AI model selection and task execution
4. Credit system for usage tracking
5. Task history and PR management
6. Real-time task status updates

## Database Schema Design

### Technology Stack
- **Database**: Supabase (PostgreSQL)
- **ORM**: Drizzle ORM with TypeScript
- **Backend**: Separate Node.js/Express server or Next.js API routes
- **Real-time**: Supabase real-time subscriptions

### Core Tables

#### 1. Users Table
```typescript
export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  clerkId: text('clerk_id').notNull().unique(), // Clerk user ID
  githubId: integer('github_id').unique(), // GitHub user ID
  email: text('email').notNull().unique(),
  username: text('username').notNull().unique(),
  displayName: text('display_name'),
  avatarUrl: text('avatar_url'),
  githubAccessToken: text('github_access_token'), // Encrypted
  isGithubConnected: boolean('is_github_connected').default(false),
  credits: integer('credits').default(100), // Free credits
  totalCreditsUsed: integer('total_credits_used').default(0),
  subscriptionTier: text('subscription_tier').default('free'), // free, pro, enterprise
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});
```

#### 2. Repositories Table
```typescript
export const repositories = pgTable('repositories', {
  id: uuid('id').defaultRandom().primaryKey(),
  githubId: integer('github_id').notNull().unique(), // GitHub repo ID
  name: text('name').notNull(),
  fullName: text('full_name').notNull(), // owner/repo
  description: text('description'),
  isPrivate: boolean('is_private').default(false),
  defaultBranch: text('default_branch').default('main'),
  language: text('language'),
  url: text('url').notNull(),
  cloneUrl: text('clone_url').notNull(),
  ownerId: uuid('owner_id').references(() => users.id),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});
```

#### 3. AI Models Table
```typescript
export const aiModels = pgTable('ai_models', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull().unique(), // claude-3.5-sonnet, gpt-4, etc.
  displayName: text('display_name').notNull(),
  provider: text('provider').notNull(), // anthropic, openai, google, etc.
  description: text('description'),
  costPerToken: decimal('cost_per_token', { precision: 10, scale: 8 }),
  maxTokens: integer('max_tokens'),
  capabilities: jsonb('capabilities'), // Array of capabilities
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
});
```

#### 4. Tasks Table
```typescript
export const tasks = pgTable('tasks', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  repositoryId: uuid('repository_id').references(() => repositories.id).notNull(),
  aiModelId: uuid('ai_model_id').references(() => aiModels.id).notNull(),
  title: text('title').notNull(),
  description: text('description'),
  prompt: text('prompt').notNull(), // User's task prompt
  branch: text('branch').notNull(),
  targetBranch: text('target_branch').default('main'),
  status: text('status').notNull().default('pending'), // pending, running, completed, failed, cancelled
  type: text('type').notNull(), // debug, ask, documentation, architect, pr_review, async
  priority: text('priority').default('medium'), // low, medium, high
  creditsUsed: integer('credits_used').default(0),
  estimatedCredits: integer('estimated_credits'),
  startedAt: timestamp('started_at'),
  completedAt: timestamp('completed_at'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});
```

#### 5. Task Results Table
```typescript
export const taskResults = pgTable('task_results', {
  id: uuid('id').defaultRandom().primaryKey(),
  taskId: uuid('task_id').references(() => tasks.id).notNull(),
  resultType: text('result_type').notNull(), // code_changes, documentation, analysis, pr_created
  content: text('content'), // Generated content/code
  filePath: text('file_path'), // For code changes
  summary: text('summary'),
  metadata: jsonb('metadata'), // Additional result data
  createdAt: timestamp('created_at').defaultNow(),
});
```

#### 6. Pull Requests Table
```typescript
export const pullRequests = pgTable('pull_requests', {
  id: uuid('id').defaultRandom().primaryKey(),
  taskId: uuid('task_id').references(() => tasks.id),
  repositoryId: uuid('repository_id').references(() => repositories.id).notNull(),
  githubPrId: integer('github_pr_id').unique(), // GitHub PR ID
  prNumber: integer('pr_number').notNull(),
  title: text('title').notNull(),
  description: text('description'),
  sourceBranch: text('source_branch').notNull(),
  targetBranch: text('target_branch').notNull(),
  status: text('status').notNull(), // open, closed, merged, draft
  url: text('url').notNull(),
  mergedAt: timestamp('merged_at'),
  closedAt: timestamp('closed_at'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});
```

#### 7. User Repository Access Table
```typescript
export const userRepositoryAccess = pgTable('user_repository_access', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  repositoryId: uuid('repository_id').references(() => repositories.id).notNull(),
  accessLevel: text('access_level').notNull(), // read, write, admin
  isCollaborator: boolean('is_collaborator').default(false),
  addedAt: timestamp('added_at').defaultNow(),
}, (table) => ({
  userRepoUnique: unique().on(table.userId, table.repositoryId),
}));
```

#### 8. Credit Transactions Table
```typescript
export const creditTransactions = pgTable('credit_transactions', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  taskId: uuid('task_id').references(() => tasks.id),
  type: text('type').notNull(), // debit, credit, bonus, refund
  amount: integer('amount').notNull(),
  description: text('description'),
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at').defaultNow(),
});
```

### Relations Definition

```typescript
// User Relations
export const usersRelations = relations(users, ({ many }) => ({
  repositories: many(repositories),
  tasks: many(tasks),
  repositoryAccess: many(userRepositoryAccess),
  creditTransactions: many(creditTransactions),
}));

// Repository Relations
export const repositoriesRelations = relations(repositories, ({ one, many }) => ({
  owner: one(users, { fields: [repositories.ownerId], references: [users.id] }),
  tasks: many(tasks),
  pullRequests: many(pullRequests),
  userAccess: many(userRepositoryAccess),
}));

// Task Relations
export const tasksRelations = relations(tasks, ({ one, many }) => ({
  user: one(users, { fields: [tasks.userId], references: [users.id] }),
  repository: one(repositories, { fields: [tasks.repositoryId], references: [repositories.id] }),
  aiModel: one(aiModels, { fields: [tasks.aiModelId], references: [aiModels.id] }),
  results: many(taskResults),
  pullRequest: one(pullRequests),
}));

// AI Model Relations
export const aiModelsRelations = relations(aiModels, ({ many }) => ({
  tasks: many(tasks),
}));

// Task Results Relations
export const taskResultsRelations = relations(taskResults, ({ one }) => ({
  task: one(tasks, { fields: [taskResults.taskId], references: [tasks.id] }),
}));

// Pull Request Relations
export const pullRequestsRelations = relations(pullRequests, ({ one }) => ({
  task: one(tasks, { fields: [pullRequests.taskId], references: [tasks.id] }),
  repository: one(repositories, { fields: [pullRequests.repositoryId], references: [repositories.id] }),
}));
```

## Backend Architecture

### Folder Structure
```
backend/
├── src/
│   ├── config/
│   │   ├── database.ts          # Drizzle configuration
│   │   ├── github.ts            # GitHub API configuration
│   │   └── ai-providers.ts      # AI provider configurations
│   ├── db/
│   │   ├── schema/
│   │   │   ├── users.ts
│   │   │   ├── repositories.ts
│   │   │   ├── tasks.ts
│   │   │   ├── ai-models.ts
│   │   │   └── index.ts
│   │   ├── migrations/          # Drizzle migrations
│   │   └── seed.ts             # Database seeding
│   ├── services/
│   │   ├── auth.ts             # Authentication service
│   │   ├── github.ts           # GitHub API integration
│   │   ├── ai-providers/       # AI provider integrations
│   │   │   ├── claude.ts
│   │   │   ├── openai.ts
│   │   │   └── gemini.ts
│   │   ├── task-executor.ts    # Task execution logic
│   │   └── credit-manager.ts   # Credit management
│   ├── routes/
│   │   ├── auth.ts
│   │   ├── repositories.ts
│   │   ├── tasks.ts
│   │   └── webhooks.ts         # GitHub webhooks
│   ├── middleware/
│   │   ├── auth.ts
│   │   ├── rate-limit.ts
│   │   └── validation.ts
│   ├── utils/
│   │   ├── encryption.ts       # Token encryption
│   │   ├── github-api.ts       # GitHub API helpers
│   │   └── validators.ts       # Input validation
│   └── types/
│       ├── api.ts
│       ├── github.ts
│       └── tasks.ts
├── drizzle.config.ts
├── package.json
└── tsconfig.json
```

### Key Implementation Details

#### 1. Database Connection (Drizzle + Supabase)
```typescript
// src/config/database.ts
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '../db/schema';

const connectionString = process.env.DATABASE_URL!;
const client = postgres(connectionString);

export const db = drizzle(client, { schema });
```

#### 2. GitHub Integration Service
```typescript
// src/services/github.ts
export class GitHubService {
  async getUserRepositories(accessToken: string) {
    // Fetch user repositories from GitHub API
  }
  
  async createPullRequest(repoData: any, prData: any) {
    // Create PR via GitHub API
  }
  
  async setupWebhooks(repoId: string) {
    // Setup webhooks for PR status updates
  }
}
```

#### 3. Task Execution Service
```typescript
// src/services/task-executor.ts
export class TaskExecutor {
  async executeTask(taskId: string) {
    // 1. Validate task and user credits
    // 2. Clone repository to temporary workspace
    // 3. Execute AI model with task prompt
    // 4. Apply changes to codebase
    // 5. Create PR if needed
    // 6. Update task status and deduct credits
  }
}
```

### API Endpoints

#### Authentication & User Management
- `POST /api/auth/github/connect` - Connect GitHub account
- `GET /api/auth/user` - Get current user info
- `PUT /api/auth/user` - Update user profile

#### Repository Management
- `GET /api/repositories` - List user repositories
- `POST /api/repositories/sync` - Sync repositories from GitHub
- `GET /api/repositories/:id/branches` - Get repository branches

#### Task Management
- `POST /api/tasks` - Create new task
- `GET /api/tasks` - List user tasks with pagination
- `GET /api/tasks/:id` - Get task details
- `PUT /api/tasks/:id/cancel` - Cancel running task
- `GET /api/tasks/:id/results` - Get task results

#### Pull Request Management
- `GET /api/pull-requests` - List PRs created by tasks
- `POST /api/webhooks/github` - GitHub webhook endpoint

### Real-time Features

#### WebSocket Events
- `task:status_updated` - Task status changes
- `task:completed` - Task completion with results
- `pr:status_updated` - PR status changes
- `credits:updated` - Credit balance updates

### Security Considerations

1. **Token Encryption**: GitHub access tokens encrypted at rest
2. **Rate Limiting**: API rate limiting per user/IP
3. **Input Validation**: Strict validation for all inputs
4. **Webhook Verification**: GitHub webhook signature verification
5. **Credit Limits**: Prevent credit abuse with daily limits

### Deployment Strategy

#### Development Environment
- Local PostgreSQL or Supabase local development
- Environment variables for API keys
- Hot reloading for development

#### Production Environment
- Supabase hosted PostgreSQL
- Encrypted environment variables
- Horizontal scaling with load balancers
- Background job processing for long-running tasks

## Advanced Features & Considerations

### 1. Credit System Implementation

#### Credit Calculation Logic
```typescript
// src/services/credit-manager.ts
export class CreditManager {
  async calculateTaskCredits(prompt: string, modelId: string): Promise<number> {
    const model = await db.query.aiModels.findFirst({
      where: eq(aiModels.id, modelId)
    });

    const estimatedTokens = this.estimateTokens(prompt);
    return Math.ceil(estimatedTokens * model.costPerToken * 100); // Convert to credits
  }

  async deductCredits(userId: string, amount: number, taskId: string) {
    return await db.transaction(async (tx) => {
      // Deduct from user balance
      await tx.update(users)
        .set({
          credits: sql`${users.credits} - ${amount}`,
          totalCreditsUsed: sql`${users.totalCreditsUsed} + ${amount}`
        })
        .where(eq(users.id, userId));

      // Record transaction
      await tx.insert(creditTransactions).values({
        userId,
        taskId,
        type: 'debit',
        amount: -amount,
        description: 'Task execution'
      });
    });
  }
}
```

### 2. Task Queue System

#### Background Job Processing
```typescript
// src/services/task-queue.ts
import Bull from 'bull';

export const taskQueue = new Bull('task processing', {
  redis: process.env.REDIS_URL
});

taskQueue.process('execute-task', async (job) => {
  const { taskId } = job.data;
  const executor = new TaskExecutor();
  await executor.executeTask(taskId);
});

// Add task to queue
export async function queueTask(taskId: string, priority: 'low' | 'medium' | 'high' = 'medium') {
  const priorityMap = { low: 1, medium: 5, high: 10 };

  await taskQueue.add('execute-task', { taskId }, {
    priority: priorityMap[priority],
    attempts: 3,
    backoff: 'exponential'
  });
}
```

### 3. GitHub Webhook Handling

#### PR Status Tracking
```typescript
// src/routes/webhooks.ts
export async function handleGitHubWebhook(payload: any) {
  switch (payload.action) {
    case 'opened':
      await updatePRStatus(payload.pull_request.id, 'open');
      break;
    case 'closed':
      if (payload.pull_request.merged) {
        await updatePRStatus(payload.pull_request.id, 'merged');
        await completePRTask(payload.pull_request.id);
      } else {
        await updatePRStatus(payload.pull_request.id, 'closed');
      }
      break;
  }
}
```

### 4. AI Provider Abstraction

#### Unified AI Interface
```typescript
// src/services/ai-providers/base.ts
export abstract class AIProvider {
  abstract async generateCode(prompt: string, context: any): Promise<string>;
  abstract async reviewCode(code: string, context: any): Promise<string>;
  abstract estimateTokens(text: string): number;
}

// src/services/ai-providers/claude.ts
export class ClaudeProvider extends AIProvider {
  async generateCode(prompt: string, context: any): Promise<string> {
    // Claude-specific implementation
  }
}
```

### 5. Database Indexing Strategy

#### Performance Optimization
```sql
-- Critical indexes for performance
CREATE INDEX idx_tasks_user_status ON tasks(user_id, status);
CREATE INDEX idx_tasks_created_at ON tasks(created_at DESC);
CREATE INDEX idx_repositories_owner_active ON repositories(owner_id, is_active);
CREATE INDEX idx_pull_requests_repo_status ON pull_requests(repository_id, status);
CREATE INDEX idx_credit_transactions_user_created ON credit_transactions(user_id, created_at DESC);

-- Composite indexes for common queries
CREATE INDEX idx_tasks_user_repo_status ON tasks(user_id, repository_id, status);
CREATE INDEX idx_user_repo_access_lookup ON user_repository_access(user_id, repository_id);
```

### 6. Data Migration Strategy

#### Drizzle Migration Example
```typescript
// drizzle/migrations/0001_initial_schema.sql
CREATE TABLE IF NOT EXISTS "users" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "clerk_id" text NOT NULL UNIQUE,
  "github_id" integer UNIQUE,
  "email" text NOT NULL UNIQUE,
  "username" text NOT NULL UNIQUE,
  "credits" integer DEFAULT 100,
  "created_at" timestamp DEFAULT now()
);

-- Add indexes
CREATE INDEX "idx_users_clerk_id" ON "users" ("clerk_id");
CREATE INDEX "idx_users_github_id" ON "users" ("github_id");
```

### 7. Monitoring & Analytics

#### Task Analytics Table
```typescript
export const taskAnalytics = pgTable('task_analytics', {
  id: uuid('id').defaultRandom().primaryKey(),
  taskId: uuid('task_id').references(() => tasks.id).notNull(),
  executionTimeMs: integer('execution_time_ms'),
  tokensUsed: integer('tokens_used'),
  linesOfCodeGenerated: integer('lines_of_code_generated'),
  filesModified: integer('files_modified'),
  errorCount: integer('error_count').default(0),
  successRate: decimal('success_rate', { precision: 5, scale: 2 }),
  createdAt: timestamp('created_at').defaultNow(),
});
```

### 8. Caching Strategy

#### Redis Caching Layer
```typescript
// src/services/cache.ts
export class CacheService {
  async cacheUserRepositories(userId: string, repos: any[]) {
    await redis.setex(`user:${userId}:repos`, 300, JSON.stringify(repos));
  }

  async getCachedRepositories(userId: string) {
    const cached = await redis.get(`user:${userId}:repos`);
    return cached ? JSON.parse(cached) : null;
  }
}
```

### 9. Error Handling & Logging

#### Structured Logging
```typescript
// src/utils/logger.ts
export const logger = {
  info: (message: string, meta?: any) => {
    console.log(JSON.stringify({
      level: 'info',
      message,
      timestamp: new Date().toISOString(),
      ...meta
    }));
  },

  error: (message: string, error?: Error, meta?: any) => {
    console.error(JSON.stringify({
      level: 'error',
      message,
      error: error?.message,
      stack: error?.stack,
      timestamp: new Date().toISOString(),
      ...meta
    }));
  }
};
```

### 10. Testing Strategy

#### Database Testing Setup
```typescript
// tests/setup.ts
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

export async function setupTestDB() {
  const testClient = postgres(process.env.TEST_DATABASE_URL!);
  const testDb = drizzle(testClient, { schema });

  // Run migrations
  await migrate(testDb, { migrationsFolder: './drizzle/migrations' });

  return { testDb, testClient };
}

export async function cleanupTestDB(client: any) {
  await client.end();
}
```

## Implementation Roadmap

### Phase 1: Core Infrastructure (Week 1-2)
1. Set up Supabase database and Drizzle ORM
2. Implement basic user authentication with Clerk
3. Create core database tables and relations
4. Set up GitHub OAuth integration

### Phase 2: Repository Management (Week 3)
1. Implement repository syncing from GitHub
2. Create repository selection UI
3. Add branch management functionality
4. Set up webhook endpoints

### Phase 3: Task System (Week 4-5)
1. Implement task creation and queuing
2. Add AI provider integrations
3. Create task execution engine
4. Implement credit system

### Phase 4: PR Management (Week 6)
1. Add PR creation functionality
2. Implement PR status tracking
3. Create task result display
4. Add real-time updates

### Phase 5: Advanced Features (Week 7-8)
1. Add task analytics and monitoring
2. Implement advanced AI features
3. Add collaboration features
4. Performance optimization

This comprehensive database design and backend architecture provides a robust foundation for building the Async Coder platform with all the required features while ensuring scalability, security, and maintainability.
