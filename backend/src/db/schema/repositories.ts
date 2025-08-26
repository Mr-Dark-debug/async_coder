import { pgTable, uuid, text, integer, boolean, timestamp, unique, index } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { users } from './users';

export const repositories = pgTable('repositories', {
  id: uuid('id').defaultRandom().primaryKey(),
  githubId: integer('github_id').notNull().unique(),
  name: text('name').notNull(),
  fullName: text('full_name').notNull(),
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
}, (table) => ({
  githubIdIdx: unique('repositories_github_id_idx').on(table.githubId),
  ownerActiveIdx: index('repositories_owner_active_idx').on(table.ownerId, table.isActive),
  fullNameIdx: index('repositories_full_name_idx').on(table.fullName),
}));

export const repositoriesRelations = relations(repositories, ({ one, many }) => ({
  owner: one(users, { 
    fields: [repositories.ownerId], 
    references: [users.id] 
  }),
  tasks: many(tasks),
  pullRequests: many(pullRequests),
  userAccess: many(userRepositoryAccess),
  webhooks: many(repositoryWebhooks),
}));

export const userRepositoryAccess = pgTable('user_repository_access', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  repositoryId: uuid('repository_id').references(() => repositories.id).notNull(),
  accessLevel: text('access_level', { 
    enum: ['read', 'write', 'admin'] 
  }).notNull(),
  isCollaborator: boolean('is_collaborator').default(false),
  addedAt: timestamp('added_at').defaultNow(),
}, (table) => ({
  userRepoUnique: unique('user_repo_access_unique').on(table.userId, table.repositoryId),
  userRepoIdx: index('user_repo_access_idx').on(table.userId, table.repositoryId),
}));

export const userRepositoryAccessRelations = relations(userRepositoryAccess, ({ one }) => ({
  user: one(users, { 
    fields: [userRepositoryAccess.userId], 
    references: [users.id] 
  }),
  repository: one(repositories, { 
    fields: [userRepositoryAccess.repositoryId], 
    references: [repositories.id] 
  }),
}));

export const repositoryWebhooks = pgTable('repository_webhooks', {
  id: uuid('id').defaultRandom().primaryKey(),
  repositoryId: uuid('repository_id').references(() => repositories.id).notNull(),
  githubWebhookId: integer('github_webhook_id').unique(),
  url: text('url').notNull(),
  secret: text('secret').notNull(),
  events: text('events').array().notNull(), // Array of webhook events
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (table) => ({
  repoWebhookIdx: index('repo_webhook_idx').on(table.repositoryId),
  githubWebhookIdx: unique('github_webhook_idx').on(table.githubWebhookId),
}));

export const repositoryWebhooksRelations = relations(repositoryWebhooks, ({ one }) => ({
  repository: one(repositories, { 
    fields: [repositoryWebhooks.repositoryId], 
    references: [repositories.id] 
  }),
}));

// Import other tables for relations
import { tasks } from './tasks';
import { pullRequests } from './pull-requests';
