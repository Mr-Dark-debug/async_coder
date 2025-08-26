import { pgTable, uuid, text, integer, timestamp, jsonb, index } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { users } from './users';
import { repositories } from './repositories';
import { aiModels } from './ai-models';

export const tasks = pgTable('tasks', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  repositoryId: uuid('repository_id').references(() => repositories.id).notNull(),
  aiModelId: uuid('ai_model_id').references(() => aiModels.id).notNull(),
  title: text('title').notNull(),
  description: text('description'),
  prompt: text('prompt').notNull(),
  branch: text('branch').notNull(),
  targetBranch: text('target_branch').default('main'),
  status: text('status', { 
    enum: ['pending', 'running', 'completed', 'failed', 'cancelled'] 
  }).notNull().default('pending'),
  type: text('type', { 
    enum: ['debug', 'ask', 'documentation', 'architect', 'pr_review', 'async'] 
  }).notNull(),
  priority: text('priority', { 
    enum: ['low', 'medium', 'high'] 
  }).default('medium'),
  creditsUsed: integer('credits_used').default(0),
  estimatedCredits: integer('estimated_credits'),
  metadata: jsonb('metadata').$type<Record<string, any>>().default({}),
  startedAt: timestamp('started_at'),
  completedAt: timestamp('completed_at'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (table) => ({
  userStatusIdx: index('tasks_user_status_idx').on(table.userId, table.status),
  userCreatedIdx: index('tasks_user_created_idx').on(table.userId, table.createdAt),
  repoStatusIdx: index('tasks_repo_status_idx').on(table.repositoryId, table.status),
  statusIdx: index('tasks_status_idx').on(table.status),
  typeIdx: index('tasks_type_idx').on(table.type),
  priorityIdx: index('tasks_priority_idx').on(table.priority),
}));

export const tasksRelations = relations(tasks, ({ one, many }) => ({
  user: one(users, { 
    fields: [tasks.userId], 
    references: [users.id] 
  }),
  repository: one(repositories, { 
    fields: [tasks.repositoryId], 
    references: [repositories.id] 
  }),
  aiModel: one(aiModels, { 
    fields: [tasks.aiModelId], 
    references: [aiModels.id] 
  }),
  results: many(taskResults),
  pullRequest: one(pullRequests),
  analytics: one(taskAnalytics),
  logs: many(taskLogs),
}));

export const taskResults = pgTable('task_results', {
  id: uuid('id').defaultRandom().primaryKey(),
  taskId: uuid('task_id').references(() => tasks.id).notNull(),
  resultType: text('result_type', { 
    enum: ['code_changes', 'documentation', 'analysis', 'pr_created', 'error'] 
  }).notNull(),
  content: text('content'),
  filePath: text('file_path'),
  summary: text('summary'),
  metadata: jsonb('metadata').$type<Record<string, any>>().default({}),
  createdAt: timestamp('created_at').defaultNow(),
}, (table) => ({
  taskResultIdx: index('task_results_task_idx').on(table.taskId),
  typeIdx: index('task_results_type_idx').on(table.resultType),
}));

export const taskResultsRelations = relations(taskResults, ({ one }) => ({
  task: one(tasks, { 
    fields: [taskResults.taskId], 
    references: [tasks.id] 
  }),
}));

export const taskAnalytics = pgTable('task_analytics', {
  id: uuid('id').defaultRandom().primaryKey(),
  taskId: uuid('task_id').references(() => tasks.id).notNull(),
  executionTimeMs: integer('execution_time_ms'),
  tokensUsed: integer('tokens_used'),
  linesOfCodeGenerated: integer('lines_of_code_generated'),
  filesModified: integer('files_modified'),
  errorCount: integer('error_count').default(0),
  successRate: integer('success_rate'), // Percentage
  performanceScore: integer('performance_score'), // 1-100
  createdAt: timestamp('created_at').defaultNow(),
}, (table) => ({
  taskAnalyticsIdx: index('task_analytics_task_idx').on(table.taskId),
}));

export const taskAnalyticsRelations = relations(taskAnalytics, ({ one }) => ({
  task: one(tasks, { 
    fields: [taskAnalytics.taskId], 
    references: [tasks.id] 
  }),
}));

export const taskLogs = pgTable('task_logs', {
  id: uuid('id').defaultRandom().primaryKey(),
  taskId: uuid('task_id').references(() => tasks.id).notNull(),
  level: text('level', { 
    enum: ['debug', 'info', 'warn', 'error'] 
  }).notNull(),
  message: text('message').notNull(),
  metadata: jsonb('metadata').$type<Record<string, any>>().default({}),
  timestamp: timestamp('timestamp').defaultNow(),
}, (table) => ({
  taskLogIdx: index('task_logs_task_idx').on(table.taskId),
  levelIdx: index('task_logs_level_idx').on(table.level),
  timestampIdx: index('task_logs_timestamp_idx').on(table.timestamp),
}));

export const taskLogsRelations = relations(taskLogs, ({ one }) => ({
  task: one(tasks, { 
    fields: [taskLogs.taskId], 
    references: [tasks.id] 
  }),
}));

// Import other tables for relations
import { pullRequests } from './pull-requests';
