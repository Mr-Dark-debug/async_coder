import { db, withTransaction } from '@/config/database';
import { users, creditTransactions } from '@/db/schema';
import { eq, desc, and, gte, lte } from 'drizzle-orm';
import { AuthService } from '@/config/auth';
import { CacheService } from '@/config/redis';
import { logger } from '@/utils/logger';
import { EncryptionService } from '@/utils/encryption';
import type { User, NewUser, CreditTransaction } from '@/types';

export class UserService {
  /**
   * Create a new user
   */
  static async createUser(userData: {
    clerkId: string;
    email: string;
    username: string;
    displayName?: string;
    avatarUrl?: string;
  }): Promise<User> {
    try {
      const newUser: NewUser = {
        clerkId: userData.clerkId,
        email: userData.email,
        username: userData.username,
        displayName: userData.displayName,
        avatarUrl: userData.avatarUrl,
        credits: 100, // Free credits for new users
        totalCreditsUsed: 0,
        subscriptionTier: 'free',
        isGithubConnected: false,
      };

      const [user] = await db.insert(users).values(newUser).returning();

      // Create initial credit transaction
      await db.insert(creditTransactions).values({
        userId: user.id,
        type: 'bonus',
        amount: 100,
        description: 'Welcome bonus credits',
        balanceAfter: 100,
      });

      logger.info('User created successfully', {
        userId: user.id,
        email: user.email,
        username: user.username,
      });

      // Clear any cached user data
      await this.clearUserCache(user.id);

      return user;
    } catch (error) {
      logger.error('Failed to create user:', error);
      throw new Error('Failed to create user');
    }
  }

  /**
   * Get user by ID
   */
  static async getUserById(userId: string): Promise<User | null> {
    try {
      // Check cache first
      const cacheKey = `user:${userId}`;
      let user = await CacheService.get<User>(cacheKey);

      if (!user) {
        user = await db.query.users.findFirst({
          where: eq(users.id, userId),
        });

        if (user) {
          // Cache for 5 minutes
          await CacheService.set(cacheKey, user, 300);
        }
      }

      return user || null;
    } catch (error) {
      logger.error('Failed to get user by ID:', { userId, error });
      throw new Error('Failed to fetch user');
    }
  }

  /**
   * Get user by Clerk ID
   */
  static async getUserByClerkId(clerkId: string): Promise<User | null> {
    try {
      const cacheKey = `user:clerk:${clerkId}`;
      let user = await CacheService.get<User>(cacheKey);

      if (!user) {
        user = await db.query.users.findFirst({
          where: eq(users.clerkId, clerkId),
        });

        if (user) {
          await CacheService.set(cacheKey, user, 300);
        }
      }

      return user || null;
    } catch (error) {
      logger.error('Failed to get user by Clerk ID:', { clerkId, error });
      throw new Error('Failed to fetch user');
    }
  }

  /**
   * Get user by email
   */
  static async getUserByEmail(email: string): Promise<User | null> {
    try {
      return await db.query.users.findFirst({
        where: eq(users.email, email),
      });
    } catch (error) {
      logger.error('Failed to get user by email:', { email, error });
      throw new Error('Failed to fetch user');
    }
  }

  /**
   * Update user
   */
  static async updateUser(
    userId: string,
    updates: Partial<Pick<User, 'displayName' | 'avatarUrl' | 'githubAccessToken' | 'isGithubConnected'>>
  ): Promise<User> {
    try {
      // Encrypt GitHub access token if provided
      if (updates.githubAccessToken) {
        updates.githubAccessToken = EncryptionService.encryptGitHubToken(updates.githubAccessToken);
      }

      const [updatedUser] = await db
        .update(users)
        .set({
          ...updates,
          updatedAt: new Date(),
        })
        .where(eq(users.id, userId))
        .returning();

      if (!updatedUser) {
        throw new Error('User not found');
      }

      logger.info('User updated successfully', {
        userId,
        updatedFields: Object.keys(updates),
      });

      // Clear cache
      await this.clearUserCache(userId);

      return updatedUser;
    } catch (error) {
      logger.error('Failed to update user:', { userId, error });
      throw new Error('Failed to update user');
    }
  }

  /**
   * Connect GitHub account
   */
  static async connectGitHub(
    userId: string,
    githubData: {
      githubId: number;
      accessToken: string;
    }
  ): Promise<User> {
    try {
      const encryptedToken = EncryptionService.encryptGitHubToken(githubData.accessToken);

      const [updatedUser] = await db
        .update(users)
        .set({
          githubId: githubData.githubId,
          githubAccessToken: encryptedToken,
          isGithubConnected: true,
          updatedAt: new Date(),
        })
        .where(eq(users.id, userId))
        .returning();

      if (!updatedUser) {
        throw new Error('User not found');
      }

      logger.info('GitHub account connected successfully', {
        userId,
        githubId: githubData.githubId,
      });

      // Clear cache
      await this.clearUserCache(userId);

      return updatedUser;
    } catch (error) {
      logger.error('Failed to connect GitHub account:', { userId, error });
      throw new Error('Failed to connect GitHub account');
    }
  }

  /**
   * Disconnect GitHub account
   */
  static async disconnectGitHub(userId: string): Promise<User> {
    try {
      const [updatedUser] = await db
        .update(users)
        .set({
          githubId: null,
          githubAccessToken: null,
          isGithubConnected: false,
          updatedAt: new Date(),
        })
        .where(eq(users.id, userId))
        .returning();

      if (!updatedUser) {
        throw new Error('User not found');
      }

      logger.info('GitHub account disconnected successfully', { userId });

      // Clear cache
      await this.clearUserCache(userId);

      return updatedUser;
    } catch (error) {
      logger.error('Failed to disconnect GitHub account:', { userId, error });
      throw new Error('Failed to disconnect GitHub account');
    }
  }

  /**
   * Get user's GitHub access token (decrypted)
   */
  static async getGitHubAccessToken(userId: string): Promise<string | null> {
    try {
      const user = await this.getUserById(userId);
      
      if (!user?.githubAccessToken) {
        return null;
      }

      return EncryptionService.decryptGitHubToken(user.githubAccessToken);
    } catch (error) {
      logger.error('Failed to get GitHub access token:', { userId, error });
      return null;
    }
  }

  /**
   * Update user credits
   */
  static async updateCredits(
    userId: string,
    amount: number,
    type: 'debit' | 'credit' | 'bonus' | 'refund',
    description?: string,
    taskId?: string
  ): Promise<{ user: User; transaction: CreditTransaction }> {
    try {
      return await withTransaction(async (tx) => {
        // Get current user
        const currentUser = await tx.query.users.findFirst({
          where: eq(users.id, userId),
          columns: { id: true, credits: true },
        });

        if (!currentUser) {
          throw new Error('User not found');
        }

        // Calculate new balance
        const newBalance = currentUser.credits + amount;

        if (newBalance < 0) {
          throw new Error('Insufficient credits');
        }

        // Update user credits
        const [updatedUser] = await tx
          .update(users)
          .set({
            credits: newBalance,
            totalCreditsUsed: type === 'debit' ? 
              users.totalCreditsUsed + Math.abs(amount) : 
              users.totalCreditsUsed,
            updatedAt: new Date(),
          })
          .where(eq(users.id, userId))
          .returning();

        // Create credit transaction
        const [transaction] = await tx
          .insert(creditTransactions)
          .values({
            userId,
            taskId,
            type,
            amount,
            description,
            balanceAfter: newBalance,
          })
          .returning();

        logger.info('User credits updated', {
          userId,
          amount,
          type,
          newBalance,
          transactionId: transaction.id,
        });

        return { user: updatedUser, transaction };
      });
    } catch (error) {
      logger.error('Failed to update user credits:', { userId, amount, type, error });
      throw error;
    }
  }

  /**
   * Get user's credit transactions
   */
  static async getCreditTransactions(
    userId: string,
    options: {
      page?: number;
      limit?: number;
      type?: string;
      startDate?: Date;
      endDate?: Date;
    } = {}
  ): Promise<{
    transactions: CreditTransaction[];
    total: number;
    page: number;
    limit: number;
  }> {
    try {
      const { page = 1, limit = 20, type, startDate, endDate } = options;
      const offset = (page - 1) * limit;

      // Build where conditions
      const conditions = [eq(creditTransactions.userId, userId)];
      
      if (type) {
        conditions.push(eq(creditTransactions.type, type as any));
      }
      
      if (startDate) {
        conditions.push(gte(creditTransactions.createdAt, startDate));
      }
      
      if (endDate) {
        conditions.push(lte(creditTransactions.createdAt, endDate));
      }

      const whereClause = conditions.length > 1 ? and(...conditions) : conditions[0];

      // Get transactions
      const transactions = await db.query.creditTransactions.findMany({
        where: whereClause,
        orderBy: [desc(creditTransactions.createdAt)],
        limit,
        offset,
      });

      // Get total count
      const [{ count }] = await db
        .select({ count: sql`count(*)` })
        .from(creditTransactions)
        .where(whereClause);

      return {
        transactions,
        total: Number(count),
        page,
        limit,
      };
    } catch (error) {
      logger.error('Failed to get credit transactions:', { userId, error });
      throw new Error('Failed to fetch credit transactions');
    }
  }

  /**
   * Update user subscription tier
   */
  static async updateSubscriptionTier(
    userId: string,
    tier: 'free' | 'pro' | 'enterprise'
  ): Promise<User> {
    try {
      const [updatedUser] = await db
        .update(users)
        .set({
          subscriptionTier: tier,
          updatedAt: new Date(),
        })
        .where(eq(users.id, userId))
        .returning();

      if (!updatedUser) {
        throw new Error('User not found');
      }

      logger.info('User subscription tier updated', { userId, tier });

      // Clear cache
      await this.clearUserCache(userId);

      return updatedUser;
    } catch (error) {
      logger.error('Failed to update subscription tier:', { userId, tier, error });
      throw new Error('Failed to update subscription tier');
    }
  }

  /**
   * Delete user
   */
  static async deleteUser(userId: string): Promise<void> {
    try {
      await withTransaction(async (tx) => {
        // Delete user (cascade will handle related records)
        await tx.delete(users).where(eq(users.id, userId));

        logger.info('User deleted successfully', { userId });
      });

      // Clear cache
      await this.clearUserCache(userId);
    } catch (error) {
      logger.error('Failed to delete user:', { userId, error });
      throw new Error('Failed to delete user');
    }
  }

  /**
   * Clear user cache
   */
  private static async clearUserCache(userId: string): Promise<void> {
    try {
      const user = await db.query.users.findFirst({
        where: eq(users.id, userId),
        columns: { clerkId: true },
      });

      if (user) {
        await Promise.all([
          CacheService.del(`user:${userId}`),
          CacheService.del(`user:clerk:${user.clerkId}`),
          CacheService.del(`user:${userId}:subscription`),
        ]);
      }
    } catch (error) {
      logger.error('Failed to clear user cache:', { userId, error });
    }
  }
}

// Import sql for count query
import { sql } from 'drizzle-orm';
