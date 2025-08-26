import { logger } from '@/utils/logger';
import { EncryptionService } from '@/utils/encryption';

// AI Provider interfaces
interface AIProviderConfig {
  apiKey: string;
  baseUrl?: string;
  model: string;
  maxTokens?: number;
}

interface AITaskRequest {
  type: string;
  prompt: string;
  context: {
    files: Array<{ path: string; content: string }>;
    structure: string;
  };
  repository: any;
  branch: string;
}

interface AITaskResponse {
  content: string;
  summary?: string;
  tokensUsed?: number;
  metadata?: Record<string, any>;
}

// Abstract AI Provider class
abstract class AIProvider {
  protected config: AIProviderConfig;

  constructor(config: AIProviderConfig) {
    this.config = config;
  }

  abstract executeTask(request: AITaskRequest): Promise<AITaskResponse>;
  abstract estimateTokens(text: string): number;
  abstract getMaxTokens(): number;
}

// OpenAI Provider
class OpenAIProvider extends AIProvider {
  async executeTask(request: AITaskRequest): Promise<AITaskResponse> {
    try {
      const systemPrompt = this.buildSystemPrompt(request.type);
      const userPrompt = this.buildUserPrompt(request);

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: this.config.model,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
          ],
          max_tokens: this.config.maxTokens || 4000,
          temperature: 0.1,
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.statusText}`);
      }

      const data = await response.json();
      const content = data.choices[0]?.message?.content || '';
      const tokensUsed = data.usage?.total_tokens || 0;

      return {
        content,
        tokensUsed,
        metadata: {
          model: this.config.model,
          finishReason: data.choices[0]?.finish_reason,
        },
      };
    } catch (error) {
      logger.error('OpenAI task execution failed:', error);
      throw new Error('OpenAI task execution failed');
    }
  }

  estimateTokens(text: string): number {
    // Rough estimation: 1 token ≈ 4 characters
    return Math.ceil(text.length / 4);
  }

  getMaxTokens(): number {
    return this.config.maxTokens || 4000;
  }

  private buildSystemPrompt(taskType: string): string {
    const prompts = {
      debug: 'You are an expert software engineer. Analyze the provided code and identify bugs, then provide fixes with clear explanations.',
      ask: 'You are a helpful coding assistant. Answer the user\'s question about the codebase with detailed explanations and examples.',
      documentation: 'You are a technical writer. Generate comprehensive documentation for the provided code, including usage examples.',
      architect: 'You are a software architect. Analyze the codebase structure and provide architectural recommendations and improvements.',
      pr_review: 'You are a senior developer conducting a code review. Provide constructive feedback on code quality, best practices, and potential issues.',
      async: 'You are an expert in asynchronous programming. Convert the provided synchronous code to asynchronous patterns with proper error handling.',
    };

    return prompts[taskType] || prompts.ask;
  }

  private buildUserPrompt(request: AITaskRequest): string {
    let prompt = `Task: ${request.prompt}\n\n`;
    
    prompt += `Repository: ${request.repository.fullName}\n`;
    prompt += `Branch: ${request.branch}\n\n`;
    
    if (request.context.structure) {
      prompt += `Directory Structure:\n${request.context.structure}\n\n`;
    }
    
    if (request.context.files.length > 0) {
      prompt += 'Relevant Files:\n';
      request.context.files.forEach(file => {
        prompt += `\n--- ${file.path} ---\n${file.content}\n`;
      });
    }
    
    return prompt;
  }
}

// Anthropic Claude Provider
class AnthropicProvider extends AIProvider {
  async executeTask(request: AITaskRequest): Promise<AITaskResponse> {
    try {
      const prompt = this.buildPrompt(request);

      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json',
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: this.config.model,
          max_tokens: this.config.maxTokens || 4000,
          messages: [
            { role: 'user', content: prompt },
          ],
        }),
      });

      if (!response.ok) {
        throw new Error(`Anthropic API error: ${response.statusText}`);
      }

      const data = await response.json();
      const content = data.content[0]?.text || '';
      const tokensUsed = data.usage?.input_tokens + data.usage?.output_tokens || 0;

      return {
        content,
        tokensUsed,
        metadata: {
          model: this.config.model,
          stopReason: data.stop_reason,
        },
      };
    } catch (error) {
      logger.error('Anthropic task execution failed:', error);
      throw new Error('Anthropic task execution failed');
    }
  }

  estimateTokens(text: string): number {
    // Claude's tokenization is roughly 1 token per 3.5 characters
    return Math.ceil(text.length / 3.5);
  }

  getMaxTokens(): number {
    return this.config.maxTokens || 4000;
  }

  private buildPrompt(request: AITaskRequest): string {
    const taskInstructions = this.getTaskInstructions(request.type);
    
    let prompt = `${taskInstructions}\n\n`;
    prompt += `Task: ${request.prompt}\n\n`;
    prompt += `Repository: ${request.repository.fullName}\n`;
    prompt += `Branch: ${request.branch}\n\n`;
    
    if (request.context.structure) {
      prompt += `Directory Structure:\n${request.context.structure}\n\n`;
    }
    
    if (request.context.files.length > 0) {
      prompt += 'Code Files:\n';
      request.context.files.forEach(file => {
        prompt += `\n--- ${file.path} ---\n${file.content}\n`;
      });
    }
    
    return prompt;
  }

  private getTaskInstructions(taskType: string): string {
    const instructions = {
      debug: 'Analyze the code for bugs and provide fixes with explanations.',
      ask: 'Answer the question about the codebase with detailed explanations.',
      documentation: 'Generate comprehensive documentation for the code.',
      architect: 'Provide architectural analysis and recommendations.',
      pr_review: 'Conduct a thorough code review with constructive feedback.',
      async: 'Convert synchronous code to asynchronous patterns.',
    };

    return instructions[taskType] || instructions.ask;
  }
}

// Google AI Provider (Gemini)
class GoogleAIProvider extends AIProvider {
  async executeTask(request: AITaskRequest): Promise<AITaskResponse> {
    try {
      const prompt = this.buildPrompt(request);

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${this.config.model}:generateContent?key=${this.config.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: prompt }],
          }],
          generationConfig: {
            maxOutputTokens: this.config.maxTokens || 4000,
            temperature: 0.1,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`Google AI API error: ${response.statusText}`);
      }

      const data = await response.json();
      const content = data.candidates[0]?.content?.parts[0]?.text || '';
      const tokensUsed = data.usageMetadata?.totalTokenCount || 0;

      return {
        content,
        tokensUsed,
        metadata: {
          model: this.config.model,
          finishReason: data.candidates[0]?.finishReason,
        },
      };
    } catch (error) {
      logger.error('Google AI task execution failed:', error);
      throw new Error('Google AI task execution failed');
    }
  }

  estimateTokens(text: string): number {
    // Gemini tokenization is roughly 1 token per 4 characters
    return Math.ceil(text.length / 4);
  }

  getMaxTokens(): number {
    return this.config.maxTokens || 4000;
  }

  private buildPrompt(request: AITaskRequest): string {
    let prompt = `You are an AI coding assistant. ${this.getTaskDescription(request.type)}\n\n`;
    prompt += `Task: ${request.prompt}\n\n`;
    prompt += `Repository: ${request.repository.fullName}\n`;
    prompt += `Branch: ${request.branch}\n\n`;
    
    if (request.context.files.length > 0) {
      prompt += 'Code Context:\n';
      request.context.files.forEach(file => {
        prompt += `\nFile: ${file.path}\n\`\`\`\n${file.content}\n\`\`\`\n`;
      });
    }
    
    return prompt;
  }

  private getTaskDescription(taskType: string): string {
    const descriptions = {
      debug: 'Find and fix bugs in the provided code.',
      ask: 'Answer questions about the codebase.',
      documentation: 'Create documentation for the code.',
      architect: 'Analyze and improve the code architecture.',
      pr_review: 'Review the code and provide feedback.',
      async: 'Convert code to use asynchronous patterns.',
    };

    return descriptions[taskType] || descriptions.ask;
  }
}

// AI Provider Service
export class AIProviderService {
  private static providers: Map<string, AIProvider> = new Map();

  /**
   * Initialize AI providers
   */
  static async initialize(): Promise<void> {
    try {
      // Initialize OpenAI
      if (process.env.OPENAI_API_KEY) {
        this.providers.set('gpt-4', new OpenAIProvider({
          apiKey: process.env.OPENAI_API_KEY,
          model: 'gpt-4',
          maxTokens: 4000,
        }));

        this.providers.set('gpt-3.5-turbo', new OpenAIProvider({
          apiKey: process.env.OPENAI_API_KEY,
          model: 'gpt-3.5-turbo',
          maxTokens: 4000,
        }));
      }

      // Initialize Anthropic
      if (process.env.ANTHROPIC_API_KEY) {
        this.providers.set('claude-3-sonnet', new AnthropicProvider({
          apiKey: process.env.ANTHROPIC_API_KEY,
          model: 'claude-3-sonnet-20240229',
          maxTokens: 4000,
        }));

        this.providers.set('claude-3-haiku', new AnthropicProvider({
          apiKey: process.env.ANTHROPIC_API_KEY,
          model: 'claude-3-haiku-20240307',
          maxTokens: 4000,
        }));
      }

      // Initialize Google AI
      if (process.env.GOOGLE_AI_API_KEY) {
        this.providers.set('gemini-pro', new GoogleAIProvider({
          apiKey: process.env.GOOGLE_AI_API_KEY,
          model: 'gemini-pro',
          maxTokens: 4000,
        }));
      }

      logger.info('AI providers initialized', {
        providers: Array.from(this.providers.keys()),
      });
    } catch (error) {
      logger.error('Failed to initialize AI providers:', error);
    }
  }

  /**
   * Execute task with specified AI model
   */
  static async executeTask(modelName: string, request: AITaskRequest): Promise<AITaskResponse> {
    const provider = this.providers.get(modelName);
    
    if (!provider) {
      throw new Error(`AI provider not found: ${modelName}`);
    }

    logger.ai('Executing AI task', {
      model: modelName,
      type: request.type,
      promptLength: request.prompt.length,
    });

    const startTime = Date.now();
    const result = await provider.executeTask(request);
    const executionTime = Date.now() - startTime;

    logger.ai('AI task completed', {
      model: modelName,
      tokensUsed: result.tokensUsed,
      executionTime,
    });

    return result;
  }

  /**
   * Estimate tokens for a given text and model
   */
  static estimateTokens(modelName: string, text: string): number {
    const provider = this.providers.get(modelName);
    
    if (!provider) {
      // Default estimation
      return Math.ceil(text.length / 4);
    }

    return provider.estimateTokens(text);
  }

  /**
   * Get available AI models
   */
  static getAvailableModels(): string[] {
    return Array.from(this.providers.keys());
  }

  /**
   * Check if model is available
   */
  static isModelAvailable(modelName: string): boolean {
    return this.providers.has(modelName);
  }
}
