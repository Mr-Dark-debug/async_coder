// Export all database schemas and relations
export * from './users';
export * from './repositories';
export * from './ai-models';
export * from './tasks';
export * from './pull-requests';
export * from './credits';
export * from './subscriptions';

// Re-export commonly used types from drizzle-orm
export type { InferSelectModel, InferInsertModel } from 'drizzle-orm';

// Type helpers for our schemas
import type { InferSelectModel, InferInsertModel } from 'drizzle-orm';
import { 
  users, 
  repositories, 
  userRepositoryAccess,
  repositoryWebhooks,
  aiModels, 
  modelUsageStats,
  aiProviderConfigs,
  tasks, 
  taskResults, 
  taskAnalytics,
  taskLogs,
  pullRequests, 
  pullRequestReviews,
  pullRequestComments,
  creditTransactions, 
  creditPackages,
  creditPurchases,
  subscriptionPlans,
  subscriptions, 
  subscriptionInvoices,
  subscriptionUsage
} from './index';

// User types
export type User = InferSelectModel<typeof users>;
export type NewUser = InferInsertModel<typeof users>;

// Repository types
export type Repository = InferSelectModel<typeof repositories>;
export type NewRepository = InferInsertModel<typeof repositories>;
export type UserRepositoryAccess = InferSelectModel<typeof userRepositoryAccess>;
export type NewUserRepositoryAccess = InferInsertModel<typeof userRepositoryAccess>;
export type RepositoryWebhook = InferSelectModel<typeof repositoryWebhooks>;
export type NewRepositoryWebhook = InferInsertModel<typeof repositoryWebhooks>;

// AI Model types
export type AIModel = InferSelectModel<typeof aiModels>;
export type NewAIModel = InferInsertModel<typeof aiModels>;
export type ModelUsageStats = InferSelectModel<typeof modelUsageStats>;
export type NewModelUsageStats = InferInsertModel<typeof modelUsageStats>;
export type AIProviderConfig = InferSelectModel<typeof aiProviderConfigs>;
export type NewAIProviderConfig = InferInsertModel<typeof aiProviderConfigs>;

// Task types
export type Task = InferSelectModel<typeof tasks>;
export type NewTask = InferInsertModel<typeof tasks>;
export type TaskResult = InferSelectModel<typeof taskResults>;
export type NewTaskResult = InferInsertModel<typeof taskResults>;
export type TaskAnalytics = InferSelectModel<typeof taskAnalytics>;
export type NewTaskAnalytics = InferInsertModel<typeof taskAnalytics>;
export type TaskLog = InferSelectModel<typeof taskLogs>;
export type NewTaskLog = InferInsertModel<typeof taskLogs>;

// Pull Request types
export type PullRequest = InferSelectModel<typeof pullRequests>;
export type NewPullRequest = InferInsertModel<typeof pullRequests>;
export type PullRequestReview = InferSelectModel<typeof pullRequestReviews>;
export type NewPullRequestReview = InferInsertModel<typeof pullRequestReviews>;
export type PullRequestComment = InferSelectModel<typeof pullRequestComments>;
export type NewPullRequestComment = InferInsertModel<typeof pullRequestComments>;

// Credit types
export type CreditTransaction = InferSelectModel<typeof creditTransactions>;
export type NewCreditTransaction = InferInsertModel<typeof creditTransactions>;
export type CreditPackage = InferSelectModel<typeof creditPackages>;
export type NewCreditPackage = InferInsertModel<typeof creditPackages>;
export type CreditPurchase = InferSelectModel<typeof creditPurchases>;
export type NewCreditPurchase = InferInsertModel<typeof creditPurchases>;

// Subscription types
export type SubscriptionPlan = InferSelectModel<typeof subscriptionPlans>;
export type NewSubscriptionPlan = InferInsertModel<typeof subscriptionPlans>;
export type Subscription = InferSelectModel<typeof subscriptions>;
export type NewSubscription = InferInsertModel<typeof subscriptions>;
export type SubscriptionInvoice = InferSelectModel<typeof subscriptionInvoices>;
export type NewSubscriptionInvoice = InferInsertModel<typeof subscriptionInvoices>;
export type SubscriptionUsage = InferSelectModel<typeof subscriptionUsage>;
export type NewSubscriptionUsage = InferInsertModel<typeof subscriptionUsage>;

// Database schema object for Drizzle
export const schema = {
  // Users
  users,
  
  // Repositories
  repositories,
  userRepositoryAccess,
  repositoryWebhooks,
  
  // AI Models
  aiModels,
  modelUsageStats,
  aiProviderConfigs,
  
  // Tasks
  tasks,
  taskResults,
  taskAnalytics,
  taskLogs,
  
  // Pull Requests
  pullRequests,
  pullRequestReviews,
  pullRequestComments,
  
  // Credits
  creditTransactions,
  creditPackages,
  creditPurchases,
  
  // Subscriptions
  subscriptionPlans,
  subscriptions,
  subscriptionInvoices,
  subscriptionUsage,
} as const;
