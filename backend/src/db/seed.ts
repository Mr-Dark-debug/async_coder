import 'dotenv/config';
import { db } from '@/config/database';
import { 
  aiModels, 
  subscriptionPlans, 
  creditPackages,
  aiProviderConfigs 
} from '@/db/schema';
import { logger } from '@/utils/logger';
import { EncryptionService } from '@/utils/encryption';

/**
 * Seed the database with initial data
 */
async function seedDatabase() {
  try {
    logger.info('Starting database seeding...');

    // Seed AI models
    await seedAIModels();

    // Seed subscription plans
    await seedSubscriptionPlans();

    // Seed credit packages
    await seedCreditPackages();

    // Seed AI provider configurations
    await seedAIProviderConfigs();

    logger.info('Database seeding completed successfully');
  } catch (error) {
    logger.error('Database seeding failed:', error);
    throw error;
  }
}

/**
 * Seed AI models
 */
async function seedAIModels() {
  logger.info('Seeding AI models...');

  const models = [
    {
      name: 'gpt-4',
      displayName: 'GPT-4',
      provider: 'openai',
      description: 'Most capable GPT model, great for complex coding tasks',
      costPerToken: '0.00003',
      maxTokens: 8192,
      capabilities: ['debug', 'ask', 'documentation', 'architect', 'pr_review', 'async'],
      configuration: {
        temperature: 0.1,
        topP: 1,
        frequencyPenalty: 0,
        presencePenalty: 0,
      },
      isActive: true,
    },
    {
      name: 'gpt-3.5-turbo',
      displayName: 'GPT-3.5 Turbo',
      provider: 'openai',
      description: 'Fast and efficient model for most coding tasks',
      costPerToken: '0.000002',
      maxTokens: 4096,
      capabilities: ['debug', 'ask', 'documentation', 'async'],
      configuration: {
        temperature: 0.1,
        topP: 1,
        frequencyPenalty: 0,
        presencePenalty: 0,
      },
      isActive: true,
    },
    {
      name: 'claude-3-sonnet',
      displayName: 'Claude 3 Sonnet',
      provider: 'anthropic',
      description: 'Balanced model with strong reasoning capabilities',
      costPerToken: '0.000015',
      maxTokens: 4096,
      capabilities: ['debug', 'ask', 'documentation', 'architect', 'pr_review'],
      configuration: {
        temperature: 0.1,
        maxTokensToSample: 4096,
      },
      isActive: true,
    },
    {
      name: 'claude-3-haiku',
      displayName: 'Claude 3 Haiku',
      provider: 'anthropic',
      description: 'Fast and cost-effective model for simple tasks',
      costPerToken: '0.00000025',
      maxTokens: 4096,
      capabilities: ['ask', 'documentation'],
      configuration: {
        temperature: 0.1,
        maxTokensToSample: 4096,
      },
      isActive: true,
    },
    {
      name: 'gemini-pro',
      displayName: 'Gemini Pro',
      provider: 'google',
      description: 'Google\'s advanced AI model for coding tasks',
      costPerToken: '0.000001',
      maxTokens: 4096,
      capabilities: ['debug', 'ask', 'documentation', 'architect'],
      configuration: {
        temperature: 0.1,
        topP: 1,
        topK: 40,
      },
      isActive: true,
    },
  ];

  for (const model of models) {
    try {
      await db.insert(aiModels).values(model as any).onConflictDoNothing();
      logger.info(`Seeded AI model: ${model.name}`);
    } catch (error) {
      logger.error(`Failed to seed AI model ${model.name}:`, error);
    }
  }
}

/**
 * Seed subscription plans
 */
async function seedSubscriptionPlans() {
  logger.info('Seeding subscription plans...');

  const plans = [
    {
      name: 'free',
      displayName: 'Free Plan',
      description: 'Perfect for getting started with AI coding assistance',
      tier: 'free',
      price: 0,
      currency: 'USD',
      billingInterval: 'month',
      creditsIncluded: 100,
      maxRepositories: 3,
      maxTasksPerDay: 5,
      features: [
        'Basic AI assistance',
        'Up to 3 repositories',
        '5 tasks per day',
        'Community support',
      ],
      isActive: true,
    },
    {
      name: 'pro',
      displayName: 'Pro Plan',
      description: 'For professional developers who need more power',
      tier: 'pro',
      price: 2000, // $20.00
      currency: 'USD',
      billingInterval: 'month',
      creditsIncluded: 1000,
      maxRepositories: 25,
      maxTasksPerDay: 50,
      features: [
        'Advanced AI models',
        'Up to 25 repositories',
        '50 tasks per day',
        'Priority support',
        'Advanced analytics',
        'Custom AI prompts',
      ],
      isActive: true,
    },
    {
      name: 'enterprise',
      displayName: 'Enterprise Plan',
      description: 'For teams and organizations with advanced needs',
      tier: 'enterprise',
      price: 10000, // $100.00
      currency: 'USD',
      billingInterval: 'month',
      creditsIncluded: 10000,
      maxRepositories: null, // Unlimited
      maxTasksPerDay: null, // Unlimited
      features: [
        'All AI models',
        'Unlimited repositories',
        'Unlimited tasks',
        'Dedicated support',
        'Custom integrations',
        'Team management',
        'Advanced security',
        'SLA guarantee',
      ],
      isActive: true,
    },
  ];

  for (const plan of plans) {
    try {
      await db.insert(subscriptionPlans).values(plan as any).onConflictDoNothing();
      logger.info(`Seeded subscription plan: ${plan.name}`);
    } catch (error) {
      logger.error(`Failed to seed subscription plan ${plan.name}:`, error);
    }
  }
}

/**
 * Seed credit packages
 */
async function seedCreditPackages() {
  logger.info('Seeding credit packages...');

  const packages = [
    {
      name: 'starter',
      description: 'Perfect for small projects',
      credits: 100,
      price: 500, // $5.00
      currency: 'USD',
      isActive: true,
    },
    {
      name: 'developer',
      description: 'Great for active developers',
      credits: 500,
      price: 2000, // $20.00
      currency: 'USD',
      isActive: true,
    },
    {
      name: 'professional',
      description: 'For professional development work',
      credits: 1000,
      price: 3500, // $35.00
      currency: 'USD',
      isActive: true,
    },
    {
      name: 'enterprise',
      description: 'For large-scale projects',
      credits: 5000,
      price: 15000, // $150.00
      currency: 'USD',
      isActive: true,
    },
  ];

  for (const pkg of packages) {
    try {
      await db.insert(creditPackages).values(pkg).onConflictDoNothing();
      logger.info(`Seeded credit package: ${pkg.name}`);
    } catch (error) {
      logger.error(`Failed to seed credit package ${pkg.name}:`, error);
    }
  }
}

/**
 * Seed AI provider configurations
 */
async function seedAIProviderConfigs() {
  logger.info('Seeding AI provider configurations...');

  // Helper function to check if API key is a placeholder
  const isPlaceholder = (key: string) => {
    return !key || 
           key.includes('your-') || 
           key.includes('sk-your') || 
           key.includes('sk-ant-your') ||
           key === 'your-openai-api-key' ||
           key === 'your-anthropic-api-key' ||
           key === 'your-google-ai-api-key';
  };

  const configs = [
    {
      provider: 'openai',
      apiKey: (process.env['OPENAI_API_KEY'] && !isPlaceholder(process.env['OPENAI_API_KEY'])) ? 
        EncryptionService.encryptApiKey(process.env['OPENAI_API_KEY']) : null,
      baseUrl: 'https://api.openai.com/v1',
      configuration: {
        organization: process.env['OPENAI_ORG_ID'],
        defaultModel: 'gpt-4',
        maxRetries: 3,
        timeout: 60000,
      },
      isActive: !!(process.env['OPENAI_API_KEY'] && !isPlaceholder(process.env['OPENAI_API_KEY'])),
    },
    {
      provider: 'anthropic',
      apiKey: (process.env['ANTHROPIC_API_KEY'] && !isPlaceholder(process.env['ANTHROPIC_API_KEY'])) ? 
        EncryptionService.encryptApiKey(process.env['ANTHROPIC_API_KEY']) : null,
      baseUrl: 'https://api.anthropic.com',
      configuration: {
        version: '2023-06-01',
        defaultModel: 'claude-3-sonnet-20240229',
        maxRetries: 3,
        timeout: 60000,
      },
      isActive: !!(process.env['ANTHROPIC_API_KEY'] && !isPlaceholder(process.env['ANTHROPIC_API_KEY'])),
    },
    {
      provider: 'google',
      apiKey: (process.env['GOOGLE_AI_API_KEY'] && !isPlaceholder(process.env['GOOGLE_AI_API_KEY'])) ? 
        EncryptionService.encryptApiKey(process.env['GOOGLE_AI_API_KEY']) : null,
      baseUrl: 'https://generativelanguage.googleapis.com',
      configuration: {
        version: 'v1beta',
        defaultModel: 'gemini-pro',
        maxRetries: 3,
        timeout: 60000,
      },
      isActive: !!(process.env['GOOGLE_AI_API_KEY'] && !isPlaceholder(process.env['GOOGLE_AI_API_KEY'])),
    },
  ];

  for (const config of configs) {
    try {
      // Insert the config regardless of API key status for structure
      await db.insert(aiProviderConfigs).values(config as any).onConflictDoNothing();
      if (config.apiKey) {
        logger.info(`Seeded AI provider config: ${config.provider} (with encrypted API key)`);
      } else {
        logger.info(`Seeded AI provider config: ${config.provider} (placeholder - no API key)`);
      }
    } catch (error) {
      logger.error(`Failed to seed AI provider config ${config.provider}:`, error);
    }
  }
}

/**
 * Clear all seeded data (for testing)
 */
async function clearSeedData() {
  logger.info('Clearing seed data...');

  try {
    await db.delete(aiProviderConfigs);
    await db.delete(creditPackages);
    await db.delete(subscriptionPlans);
    await db.delete(aiModels);

    logger.info('Seed data cleared successfully');
  } catch (error) {
    logger.error('Failed to clear seed data:', error);
    throw error;
  }
}

// Run seeding if this file is executed directly
if (require.main === module) {
  seedDatabase()
    .then(() => {
      logger.info('Seeding completed');
      process.exit(0);
    })
    .catch((error) => {
      logger.error('Seeding failed:', error);
      process.exit(1);
    });
}

export { seedDatabase, clearSeedData };
