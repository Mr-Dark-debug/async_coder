import { pgTable, uuid, text, integer, boolean, timestamp, unique } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  clerkId: text('clerk_id').notNull().unique(),
  githubId: integer('github_id').unique(),
  email: text('email').notNull().unique(),
  username: text('username').notNull().unique(),
  displayName: text('display_name'),
  avatarUrl: text('avatar_url'),
  githubAccessToken: text('github_access_token'), // Encrypted
  isGithubConnected: boolean('is_github_connected').default(false),
  credits: integer('credits').default(100),
  totalCreditsUsed: integer('total_credits_used').default(0),
  subscriptionTier: text('subscription_tier', { 
    enum: ['free', 'pro', 'enterprise'] 
  }).default('free'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (table) => ({
  clerkIdIdx: unique('users_clerk_id_idx').on(table.clerkId),
  githubIdIdx: unique('users_github_id_idx').on(table.githubId),
  emailIdx: unique('users_email_idx').on(table.email),
  usernameIdx: unique('users_username_idx').on(table.username),
}));

export const usersRelations = relations(users, ({ many }) => ({
  repositories: many(repositories),
  tasks: many(tasks),
  repositoryAccess: many(userRepositoryAccess),
  creditTransactions: many(creditTransactions),
  subscriptions: many(subscriptions),
}));

// Import other tables for relations (will be defined in other files)
import { repositories } from './repositories';
import { tasks } from './tasks';
import { userRepositoryAccess } from './repositories';
import { creditTransactions } from './credits';
import { subscriptions } from './subscriptions';
