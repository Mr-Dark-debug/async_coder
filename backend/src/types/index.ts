import { z } from 'zod';

// User Types
export interface User {
  id: string;
  clerkId: string;
  githubId?: number;
  email: string;
  username: string;
  displayName?: string;
  avatarUrl?: string;
  githubAccessToken?: string;
  isGithubConnected: boolean;
  credits: number;
  totalCreditsUsed: number;
  subscriptionTier: 'free' | 'pro' | 'enterprise';
  createdAt: Date;
  updatedAt: Date;
}

// Repository Types
export interface Repository {
  id: string;
  githubId: number;
  name: string;
  fullName: string;
  description?: string;
  isPrivate: boolean;
  defaultBranch: string;
  language?: string;
  url: string;
  cloneUrl: string;
  ownerId: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Task Types
export type TaskStatus = 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';
export type TaskType = 'debug' | 'ask' | 'documentation' | 'architect' | 'pr_review' | 'async';
export type TaskPriority = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  userId: string;
  repositoryId: string;
  aiModelId: string;
  title: string;
  description?: string;
  prompt: string;
  branch: string;
  targetBranch: string;
  status: TaskStatus;
  type: TaskType;
  priority: TaskPriority;
  creditsUsed: number;
  estimatedCredits?: number;
  startedAt?: Date;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// AI Model Types
export interface AIModel {
  id: string;
  name: string;
  displayName: string;
  provider: string;
  description?: string;
  costPerToken: number;
  maxTokens?: number;
  capabilities: string[];
  isActive: boolean;
  createdAt: Date;
}

// Pull Request Types
export type PRStatus = 'open' | 'closed' | 'merged' | 'draft';

export interface PullRequest {
  id: string;
  taskId?: string;
  repositoryId: string;
  githubPrId: number;
  prNumber: number;
  title: string;
  description?: string;
  sourceBranch: string;
  targetBranch: string;
  status: PRStatus;
  url: string;
  mergedAt?: Date;
  closedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Credit Transaction Types
export type TransactionType = 'debit' | 'credit' | 'bonus' | 'refund';

export interface CreditTransaction {
  id: string;
  userId: string;
  taskId?: string;
  type: TransactionType;
  amount: number;
  description?: string;
  metadata?: Record<string, any>;
  createdAt: Date;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// Validation Schemas
export const CreateTaskSchema = z.object({
  repositoryId: z.string().uuid(),
  aiModelId: z.string().uuid(),
  title: z.string().min(1).max(255),
  description: z.string().optional(),
  prompt: z.string().min(1),
  branch: z.string().min(1),
  targetBranch: z.string().default('main'),
  type: z.enum(['debug', 'ask', 'documentation', 'architect', 'pr_review', 'async']),
  priority: z.enum(['low', 'medium', 'high']).default('medium'),
});

export const UpdateUserSchema = z.object({
  displayName: z.string().optional(),
  avatarUrl: z.string().url().optional(),
});

export const ConnectGitHubSchema = z.object({
  code: z.string(),
  state: z.string().optional(),
});

// GitHub Types
export interface GitHubUser {
  id: number;
  login: string;
  name: string;
  email: string;
  avatar_url: string;
}

export interface GitHubRepository {
  id: number;
  name: string;
  full_name: string;
  description: string;
  private: boolean;
  default_branch: string;
  language: string;
  html_url: string;
  clone_url: string;
  owner: {
    id: number;
    login: string;
  };
}

// Job Queue Types
export interface JobData {
  taskId: string;
  userId: string;
  priority: TaskPriority;
  metadata?: Record<string, any>;
}

export interface JobResult {
  success: boolean;
  data?: any;
  error?: string;
  creditsUsed?: number;
}

// Webhook Types
export interface GitHubWebhookPayload {
  action: string;
  repository: GitHubRepository;
  pull_request?: {
    id: number;
    number: number;
    title: string;
    body: string;
    state: string;
    merged: boolean;
    html_url: string;
    head: {
      ref: string;
    };
    base: {
      ref: string;
    };
  };
  sender: GitHubUser;
}

// Error Types
export class AppError extends Error {
  public statusCode: number;
  public code: string;
  public isOperational: boolean;

  constructor(message: string, statusCode: number = 500, code: string = 'INTERNAL_ERROR') {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

// Authentication Types
export interface AuthenticatedUser {
  id: string;
  clerkId: string;
  email: string;
  username: string;
  role?: string;
}

export interface JWTPayload {
  userId: string;
  clerkId: string;
  email: string;
  iat: number;
  exp: number;
}

// Fastify Request Extensions
declare module 'fastify' {
  interface FastifyRequest {
    user?: AuthenticatedUser;
    sessionId?: string;
  }
}
