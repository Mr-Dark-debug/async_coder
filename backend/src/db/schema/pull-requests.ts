import { pgTable, uuid, text, integer, timestamp, index, unique } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { tasks } from './tasks';
import { repositories } from './repositories';

export const pullRequests = pgTable('pull_requests', {
  id: uuid('id').defaultRandom().primaryKey(),
  taskId: uuid('task_id').references(() => tasks.id),
  repositoryId: uuid('repository_id').references(() => repositories.id).notNull(),
  githubPrId: integer('github_pr_id').unique(),
  prNumber: integer('pr_number').notNull(),
  title: text('title').notNull(),
  description: text('description'),
  sourceBranch: text('source_branch').notNull(),
  targetBranch: text('target_branch').notNull(),
  status: text('status', { 
    enum: ['open', 'closed', 'merged', 'draft'] 
  }).notNull(),
  url: text('url').notNull(),
  mergedAt: timestamp('merged_at'),
  closedAt: timestamp('closed_at'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (table) => ({
  githubPrIdx: unique('pull_requests_github_pr_idx').on(table.githubPrId),
  repoStatusIdx: index('pull_requests_repo_status_idx').on(table.repositoryId, table.status),
  taskIdx: index('pull_requests_task_idx').on(table.taskId),
  statusIdx: index('pull_requests_status_idx').on(table.status),
}));

export const pullRequestsRelations = relations(pullRequests, ({ one, many }) => ({
  task: one(tasks, { 
    fields: [pullRequests.taskId], 
    references: [tasks.id] 
  }),
  repository: one(repositories, { 
    fields: [pullRequests.repositoryId], 
    references: [repositories.id] 
  }),
  reviews: many(pullRequestReviews),
  comments: many(pullRequestComments),
}));

export const pullRequestReviews = pgTable('pull_request_reviews', {
  id: uuid('id').defaultRandom().primaryKey(),
  pullRequestId: uuid('pull_request_id').references(() => pullRequests.id).notNull(),
  githubReviewId: integer('github_review_id').unique(),
  reviewerId: uuid('reviewer_id').references(() => users.id),
  state: text('state', { 
    enum: ['pending', 'approved', 'changes_requested', 'commented'] 
  }).notNull(),
  body: text('body'),
  submittedAt: timestamp('submitted_at'),
  createdAt: timestamp('created_at').defaultNow(),
}, (table) => ({
  prReviewIdx: index('pr_reviews_pr_idx').on(table.pullRequestId),
  githubReviewIdx: unique('pr_reviews_github_idx').on(table.githubReviewId),
  reviewerIdx: index('pr_reviews_reviewer_idx').on(table.reviewerId),
}));

export const pullRequestReviewsRelations = relations(pullRequestReviews, ({ one }) => ({
  pullRequest: one(pullRequests, { 
    fields: [pullRequestReviews.pullRequestId], 
    references: [pullRequests.id] 
  }),
  reviewer: one(users, { 
    fields: [pullRequestReviews.reviewerId], 
    references: [users.id] 
  }),
}));

export const pullRequestComments = pgTable('pull_request_comments', {
  id: uuid('id').defaultRandom().primaryKey(),
  pullRequestId: uuid('pull_request_id').references(() => pullRequests.id).notNull(),
  githubCommentId: integer('github_comment_id').unique(),
  authorId: uuid('author_id').references(() => users.id),
  body: text('body').notNull(),
  filePath: text('file_path'),
  line: integer('line'),
  isResolved: boolean('is_resolved').default(false),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (table) => ({
  prCommentIdx: index('pr_comments_pr_idx').on(table.pullRequestId),
  githubCommentIdx: unique('pr_comments_github_idx').on(table.githubCommentId),
  authorIdx: index('pr_comments_author_idx').on(table.authorId),
}));

export const pullRequestCommentsRelations = relations(pullRequestComments, ({ one }) => ({
  pullRequest: one(pullRequests, { 
    fields: [pullRequestComments.pullRequestId], 
    references: [pullRequests.id] 
  }),
  author: one(users, { 
    fields: [pullRequestComments.authorId], 
    references: [users.id] 
  }),
}));

// Import other tables for relations
import { users } from './users';
import { boolean } from 'drizzle-orm/pg-core';
