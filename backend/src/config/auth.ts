import { createClerkClient } from '@clerk/backend';
import jwt from 'jsonwebtoken';
import { logger } from '@/utils/logger';
import type { JWTPayload, AuthenticatedUser } from '@/types';

// Clerk configuration
const clerkSecretKey = process.env.CLERK_SECRET_KEY;
const clerkPublishableKey = process.env.CLERK_PUBLISHABLE_KEY;

if (!clerkSecretKey || !clerkPublishableKey) {
  throw new Error('CLERK_SECRET_KEY and CLERK_PUBLISHABLE_KEY environment variables are required');
}

export const clerkClient = createClerkClient({
  secretKey: clerkSecretKey,
  publishableKey: clerkPublishableKey,
});

// JWT configuration
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '30d';

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required');
}

export class AuthService {
  /**
   * Generate JWT token for authenticated user
   */
  static generateToken(user: AuthenticatedUser): string {
    try {
      const payload: Omit<JWTPayload, 'iat' | 'exp'> = {
        userId: user.id,
        clerkId: user.clerkId,
        email: user.email,
      };

      return jwt.sign(payload, JWT_SECRET, {
        expiresIn: JWT_EXPIRES_IN,
        issuer: 'async-coder-api',
        audience: 'async-coder-app',
      });
    } catch (error) {
      logger.error('Error generating JWT token:', error);
      throw new Error('Failed to generate authentication token');
    }
  }

  /**
   * Generate refresh token
   */
  static generateRefreshToken(user: AuthenticatedUser): string {
    try {
      const payload = {
        userId: user.id,
        clerkId: user.clerkId,
        type: 'refresh',
      };

      return jwt.sign(payload, JWT_SECRET, {
        expiresIn: JWT_REFRESH_EXPIRES_IN,
        issuer: 'async-coder-api',
        audience: 'async-coder-app',
      });
    } catch (error) {
      logger.error('Error generating refresh token:', error);
      throw new Error('Failed to generate refresh token');
    }
  }

  /**
   * Verify JWT token
   */
  static verifyToken(token: string): JWTPayload {
    try {
      const decoded = jwt.verify(token, JWT_SECRET, {
        issuer: 'async-coder-api',
        audience: 'async-coder-app',
      }) as JWTPayload;

      return decoded;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new Error('Token has expired');
      } else if (error instanceof jwt.JsonWebTokenError) {
        throw new Error('Invalid token');
      } else {
        logger.error('Error verifying JWT token:', error);
        throw new Error('Token verification failed');
      }
    }
  }

  /**
   * Verify Clerk session token
   */
  static async verifyClerkToken(token: string): Promise<any> {
    try {
      const sessionToken = await clerkClient.verifyToken(token);
      return sessionToken;
    } catch (error) {
      logger.error('Error verifying Clerk token:', error);
      throw new Error('Invalid Clerk session token');
    }
  }

  /**
   * Get user from Clerk
   */
  static async getClerkUser(clerkId: string) {
    try {
      const user = await clerkClient.users.getUser(clerkId);
      return user;
    } catch (error) {
      logger.error('Error fetching Clerk user:', { clerkId, error });
      throw new Error('Failed to fetch user from Clerk');
    }
  }

  /**
   * Update user metadata in Clerk
   */
  static async updateClerkUserMetadata(
    clerkId: string, 
    metadata: Record<string, any>
  ): Promise<void> {
    try {
      await clerkClient.users.updateUserMetadata(clerkId, {
        publicMetadata: metadata,
      });
    } catch (error) {
      logger.error('Error updating Clerk user metadata:', { clerkId, error });
      throw new Error('Failed to update user metadata');
    }
  }

  /**
   * Extract token from Authorization header
   */
  static extractTokenFromHeader(authHeader?: string): string | null {
    if (!authHeader) return null;
    
    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return null;
    }
    
    return parts[1];
  }

  /**
   * Validate session token format
   */
  static isValidTokenFormat(token: string): boolean {
    // Basic JWT format validation (3 parts separated by dots)
    const parts = token.split('.');
    return parts.length === 3;
  }

  /**
   * Generate session ID
   */
  static generateSessionId(): string {
    return `sess_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Hash password (for future use if needed)
   */
  static async hashPassword(password: string): Promise<string> {
    const bcrypt = await import('bcryptjs');
    return bcrypt.hash(password, 12);
  }

  /**
   * Compare password (for future use if needed)
   */
  static async comparePassword(password: string, hash: string): Promise<boolean> {
    const bcrypt = await import('bcryptjs');
    return bcrypt.compare(password, hash);
  }

  /**
   * Generate secure random string
   */
  static generateSecureRandom(length: number = 32): string {
    const crypto = require('crypto');
    return crypto.randomBytes(length).toString('hex');
  }

  /**
   * Create API key for external integrations
   */
  static generateApiKey(userId: string): string {
    const timestamp = Date.now().toString();
    const random = this.generateSecureRandom(16);
    return `ak_${Buffer.from(`${userId}:${timestamp}:${random}`).toString('base64')}`;
  }

  /**
   * Verify API key
   */
  static verifyApiKey(apiKey: string): { userId: string; timestamp: number } | null {
    try {
      if (!apiKey.startsWith('ak_')) return null;
      
      const decoded = Buffer.from(apiKey.slice(3), 'base64').toString();
      const [userId, timestamp] = decoded.split(':');
      
      if (!userId || !timestamp) return null;
      
      return {
        userId,
        timestamp: parseInt(timestamp),
      };
    } catch (error) {
      return null;
    }
  }
}

// Auth configuration constants
export const AUTH_CONFIG = {
  JWT_SECRET,
  JWT_EXPIRES_IN,
  JWT_REFRESH_EXPIRES_IN,
  CLERK_SECRET_KEY: clerkSecretKey,
  CLERK_PUBLISHABLE_KEY: clerkPublishableKey,
  SESSION_COOKIE_NAME: 'async_coder_session',
  REFRESH_COOKIE_NAME: 'async_coder_refresh',
  COOKIE_OPTIONS: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict' as const,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  },
} as const;
