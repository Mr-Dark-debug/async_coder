import { pgTable, uuid, text, decimal, integer, boolean, timestamp, jsonb, unique, index } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const aiModels = pgTable('ai_models', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull().unique(),
  displayName: text('display_name').notNull(),
  provider: text('provider', { 
    enum: ['openai', 'anthropic', 'google', 'cohere', 'huggingface', 'custom'] 
  }).notNull(),
  description: text('description'),
  costPerToken: decimal('cost_per_token', { precision: 10, scale: 8 }).notNull(),
  maxTokens: integer('max_tokens'),
  capabilities: jsonb('capabilities').$type<string[]>().notNull().default([]),
  configuration: jsonb('configuration').$type<Record<string, any>>().default({}),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (table) => ({
  nameIdx: unique('ai_models_name_idx').on(table.name),
  providerActiveIdx: index('ai_models_provider_active_idx').on(table.provider, table.isActive),
  activeIdx: index('ai_models_active_idx').on(table.isActive),
}));

export const aiModelsRelations = relations(aiModels, ({ many }) => ({
  tasks: many(tasks),
  modelUsage: many(modelUsageStats),
}));

export const modelUsageStats = pgTable('model_usage_stats', {
  id: uuid('id').defaultRandom().primaryKey(),
  modelId: uuid('model_id').references(() => aiModels.id).notNull(),
  userId: uuid('user_id').references(() => users.id),
  date: timestamp('date').notNull(),
  totalRequests: integer('total_requests').default(0),
  totalTokensUsed: integer('total_tokens_used').default(0),
  totalCreditsUsed: integer('total_credits_used').default(0),
  averageResponseTime: decimal('average_response_time', { precision: 8, scale: 2 }),
  successRate: decimal('success_rate', { precision: 5, scale: 2 }),
  createdAt: timestamp('created_at').defaultNow(),
}, (table) => ({
  modelDateIdx: index('model_usage_model_date_idx').on(table.modelId, table.date),
  userDateIdx: index('model_usage_user_date_idx').on(table.userId, table.date),
  dateIdx: index('model_usage_date_idx').on(table.date),
}));

export const modelUsageStatsRelations = relations(modelUsageStats, ({ one }) => ({
  model: one(aiModels, { 
    fields: [modelUsageStats.modelId], 
    references: [aiModels.id] 
  }),
  user: one(users, { 
    fields: [modelUsageStats.userId], 
    references: [users.id] 
  }),
}));

// Provider-specific configurations
export const aiProviderConfigs = pgTable('ai_provider_configs', {
  id: uuid('id').defaultRandom().primaryKey(),
  provider: text('provider').notNull().unique(),
  apiKey: text('api_key'), // Encrypted
  baseUrl: text('base_url'),
  configuration: jsonb('configuration').$type<Record<string, any>>().default({}),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (table) => ({
  providerIdx: unique('ai_provider_configs_provider_idx').on(table.provider),
}));

// Import other tables for relations
import { tasks } from './tasks';
import { users } from './users';
