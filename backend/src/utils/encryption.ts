import crypto from 'crypto';
import { logger } from './logger';

// Encryption configuration
const ALGORITHM = 'aes-256-cbc';
const KEY_LENGTH = 32; // 256 bits
const IV_LENGTH = 16; // 128 bits

// Get encryption key from environment
const ENCRYPTION_KEY = process.env['ENCRYPTION_KEY'];

if (!ENCRYPTION_KEY) {
  throw new Error('ENCRYPTION_KEY environment variable is required');
}

// Derive key from the provided key
const derivedKey = crypto.scryptSync(ENCRYPTION_KEY, 'salt', KEY_LENGTH);

export class EncryptionService {
  /**
   * Encrypt a string value
   */
  static encrypt(text: string): string {
    try {
      if (!ENCRYPTION_KEY) {
        throw new Error('ENCRYPTION_KEY environment variable is required');
      }

      const iv = crypto.randomBytes(IV_LENGTH);
      const cipher = crypto.createCipheriv(ALGORITHM, derivedKey, iv);
      
      let encrypted = cipher.update(text, 'utf8', 'hex');
      encrypted += cipher.final('hex');
      
      // Combine iv and encrypted data
      const result = iv.toString('hex') + ':' + encrypted;
      
      return result;
    } catch (error) {
      logger.error('Encryption failed:', error);
      throw new Error('Failed to encrypt data');
    }
  }

  /**
   * Decrypt a string value
   */
  static decrypt(encryptedData: string): string {
    try {
      const parts = encryptedData.split(':');
      if (parts.length !== 2 || !parts[0] || !parts[1]) {
        throw new Error('Invalid encrypted data format');
      }

      const ivHex = parts[0];
      const encrypted = parts[1];
      const iv = Buffer.from(ivHex, 'hex');

      if (!ENCRYPTION_KEY) {
        throw new Error('ENCRYPTION_KEY environment variable is required');
      }

      const decipher = crypto.createDecipheriv(ALGORITHM, derivedKey, iv);

      let decrypted = decipher.update(encrypted, 'hex', 'utf8');
      decrypted += decipher.final('utf8');

      return decrypted;
    } catch (error) {
      logger.error('Decryption failed:', error);
      throw new Error('Failed to decrypt data');
    }
  }

  /**
   * Hash a password using bcrypt
   */
  static async hashPassword(password: string): Promise<string> {
    try {
      const bcrypt = await import('bcryptjs');
      return await bcrypt.hash(password, 12);
    } catch (error) {
      logger.error('Password hashing failed:', error);
      throw new Error('Failed to hash password');
    }
  }

  /**
   * Verify a password against a hash
   */
  static async verifyPassword(password: string, hash: string): Promise<boolean> {
    try {
      const bcrypt = await import('bcryptjs');
      return await bcrypt.compare(password, hash);
    } catch (error) {
      logger.error('Password verification failed:', error);
      return false;
    }
  }

  /**
   * Generate a secure random string
   */
  static generateSecureRandom(length: number = 32): string {
    return crypto.randomBytes(length).toString('hex');
  }

  /**
   * Generate a secure random token
   */
  static generateToken(length: number = 32): string {
    return crypto.randomBytes(length).toString('base64url');
  }

  /**
   * Hash data using SHA-256
   */
  static hash(data: string): string {
    return crypto.createHash('sha256').update(data).digest('hex');
  }

  /**
   * Create HMAC signature
   */
  static createHMAC(data: string, secret: string): string {
    return crypto.createHmac('sha256', secret).update(data).digest('hex');
  }

  /**
   * Verify HMAC signature
   */
  static verifyHMAC(data: string, signature: string, secret: string): boolean {
    const expectedSignature = this.createHMAC(data, secret);
    return crypto.timingSafeEqual(
      Buffer.from(signature, 'hex'),
      Buffer.from(expectedSignature, 'hex')
    );
  }

  /**
   * Encrypt GitHub access token
   */
  static encryptGitHubToken(token: string): string {
    return this.encrypt(token);
  }

  /**
   * Decrypt GitHub access token
   */
  static decryptGitHubToken(encryptedToken: string): string {
    return this.decrypt(encryptedToken);
  }

  /**
   * Encrypt API key
   */
  static encryptApiKey(apiKey: string): string {
    return this.encrypt(apiKey);
  }

  /**
   * Decrypt API key
   */
  static decryptApiKey(encryptedApiKey: string): string {
    return this.decrypt(encryptedApiKey);
  }

  /**
   * Generate API key with metadata
   */
  static generateApiKey(userId: string, scope: string = 'general'): {
    key: string;
    hash: string;
    metadata: {
      userId: string;
      scope: string;
      createdAt: string;
    };
  } {
    const timestamp = Date.now().toString();
    const random = this.generateSecureRandom(16);
    const metadata = {
      userId,
      scope,
      createdAt: new Date().toISOString(),
    };
    
    const keyData = `${userId}:${scope}:${timestamp}:${random}`;
    const key = `ak_${Buffer.from(keyData).toString('base64url')}`;
    const hash = this.hash(key);
    
    return { key, hash, metadata };
  }

  /**
   * Verify API key format and extract metadata
   */
  static verifyApiKey(apiKey: string): {
    valid: boolean;
    userId?: string;
    scope?: string;
    createdAt?: Date;
  } {
    try {
      if (!apiKey.startsWith('ak_')) {
        return { valid: false };
      }
      
      const decoded = Buffer.from(apiKey.slice(3), 'base64url').toString();
      const [userId, scope, timestamp] = decoded.split(':');
      
      if (!userId || !scope || !timestamp) {
        return { valid: false };
      }
      
      return {
        valid: true,
        userId,
        scope,
        createdAt: new Date(parseInt(timestamp)),
      };
    } catch (error) {
      return { valid: false };
    }
  }

  /**
   * Encrypt sensitive configuration data
   */
  static encryptConfig(config: Record<string, any>): string {
    return this.encrypt(JSON.stringify(config));
  }

  /**
   * Decrypt sensitive configuration data
   */
  static decryptConfig(encryptedConfig: string): Record<string, any> {
    const decrypted = this.decrypt(encryptedConfig);
    return JSON.parse(decrypted);
  }

  /**
   * Generate webhook secret
   */
  static generateWebhookSecret(): string {
    return this.generateSecureRandom(32);
  }

  /**
   * Verify webhook signature (GitHub style)
   */
  static verifyWebhookSignature(
    payload: string,
    signature: string,
    secret: string
  ): boolean {
    try {
      const expectedSignature = `sha256=${this.createHMAC(payload, secret)}`;
      return crypto.timingSafeEqual(
        Buffer.from(signature),
        Buffer.from(expectedSignature)
      );
    } catch (error) {
      logger.error('Webhook signature verification failed:', error);
      return false;
    }
  }
}

// Export utility functions
export const {
  encrypt,
  decrypt,
  hashPassword,
  verifyPassword,
  generateSecureRandom,
  generateToken,
  hash,
  createHMAC,
  verifyHMAC,
  encryptGitHubToken,
  decryptGitHubToken,
  encryptApiKey,
  decryptApiKey,
  generateApiKey,
  verifyApiKey,
  encryptConfig,
  decryptConfig,
  generateWebhookSecret,
  verifyWebhookSignature,
} = EncryptionService;
