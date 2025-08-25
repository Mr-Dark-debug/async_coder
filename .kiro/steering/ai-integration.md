---
inclusion: manual
---

# AI Integration Guidelines

## Multi-Provider Architecture

### Supported AI Providers
- **OpenAI**: GPT-4, GPT-3.5-turbo, Code models
- **Anthropic**: Claude 3.5 Sonnet, Claude 3 Haiku
- **Google**: Gemini Pro, Gemini Flash
- **Local Models**: Ollama, LM Studio integration
- **Custom APIs**: OpenAI-compatible endpoints

### Provider Configuration
```typescript
interface AIProvider {
  id: string;
  name: string;
  baseUrl: string;
  apiKey: string;
  models: AIModel[];
  rateLimit: RateLimit;
  costPerToken: number;
}

const providers: Record<string, AIProvider> = {
  openai: {
    id: 'openai',
    name: 'OpenAI',
    baseUrl: 'https://api.openai.com/v1',
    models: ['gpt-4', 'gpt-3.5-turbo'],
    rateLimit: { requests: 3500, window: 60000 },
    costPerToken: 0.00003,
  },
  claude: {
    id: 'claude',
    name: 'Anthropic Claude',
    baseUrl: 'https://api.anthropic.com/v1',
    models: ['claude-3-5-sonnet-20241022'],
    rateLimit: { requests: 1000, window: 60000 },
    costPerToken: 0.000015,
  },
};
```

## AI Mode System

### Core Modes Implementation
```typescript
abstract class AIMode {
  abstract name: string;
  abstract description: string;
  abstract systemPrompt: string;
  abstract suggestedModels: string[];
  
  abstract execute(context: ModeContext): Promise<ModeResult>;
  
  protected buildContext(project: Project, query: string): CodeContext {
    // Smart context building based on mode requirements
  }
}

class DebugMode extends AIMode {
  name = 'Debug Mode';
  systemPrompt = `You are an expert debugging assistant. Analyze code for bugs, 
    performance issues, and potential improvements. Provide specific fixes with explanations.`;
  
  async execute(context: ModeContext): Promise<ModeResult> {
    // 1. Analyze error logs and stack traces
    // 2. Examine relevant code files
    // 3. Identify root causes
    // 4. Generate fix suggestions
    // 5. Provide test cases
  }
}
```

### Context-Aware Processing
```typescript
interface CodeContext {
  // Current file being edited
  activeFile?: {
    path: string;
    content: string;
    language: string;
    cursorPosition?: number;
  };
  
  // Related files (imports, dependencies)
  relatedFiles: FileContent[];
  
  // Project metadata
  project: {
    name: string;
    framework: string;
    dependencies: PackageInfo[];
    gitBranch: string;
  };
  
  // Error context
  errors?: {
    runtime: ErrorLog[];
    compile: CompileError[];
    lint: LintError[];
  };
  
  // Test context
  tests?: {
    results: TestResult[];
    coverage: CoverageReport;
  };
}
```

## Streaming and Real-time Features

### Message Streaming
```typescript
async function* streamAIResponse(
  messages: Message[],
  provider: AIProvider,
  model: string
): AsyncGenerator<ChatChunk> {
  const response = await fetch(`${provider.baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${provider.apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      messages,
      stream: true,
    }),
  });

  const reader = response.body?.getReader();
  if (!reader) throw new Error('No response body');

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunk = new TextDecoder().decode(value);
    const lines = chunk.split('\n').filter(line => line.trim());

    for (const line of lines) {
      if (line.startsWith('data: ')) {
        const data = line.slice(6);
        if (data === '[DONE]') return;
        
        try {
          const parsed = JSON.parse(data);
          yield {
            content: parsed.choices[0]?.delta?.content || '',
            finished: parsed.choices[0]?.finish_reason !== null,
          };
        } catch (error) {
          console.warn('Failed to parse chunk:', error);
        }
      }
    }
  }
}
```

### Code Suggestions
```typescript
interface CodeSuggestion {
  id: string;
  type: 'completion' | 'refactor' | 'fix' | 'optimization';
  range: {
    start: { line: number; character: number };
    end: { line: number; character: number };
  };
  originalCode: string;
  suggestedCode: string;
  explanation: string;
  confidence: number;
}

class CodeSuggestionEngine {
  async getSuggestions(
    file: FileContent,
    cursorPosition: number,
    context: CodeContext
  ): Promise<CodeSuggestion[]> {
    // 1. Analyze current code context
    // 2. Identify potential improvements
    // 3. Generate suggestions with AI
    // 4. Rank by confidence and relevance
  }
}
```

## Error Handling and Fallbacks

### Graceful Degradation
```typescript
class AIService {
  private providers: AIProvider[];
  private fallbackChain: string[];

  async chat(
    messages: Message[],
    options: ChatOptions
  ): Promise<ChatResponse> {
    for (const providerId of this.fallbackChain) {
      try {
        const provider = this.providers.find(p => p.id === providerId);
        if (!provider) continue;

        // Check rate limits
        if (await this.isRateLimited(provider)) continue;

        // Attempt request
        return await this.makeRequest(provider, messages, options);
      } catch (error) {
        console.warn(`Provider ${providerId} failed:`, error);
        // Continue to next provider
      }
    }

    throw new Error('All AI providers unavailable');
  }

  private async isRateLimited(provider: AIProvider): Promise<boolean> {
    // Check rate limit status
    const usage = await this.getRateLimit(provider.id);
    return usage.remaining <= 0;
  }
}
```

### Cost Optimization
```typescript
interface CostOptimizer {
  selectOptimalModel(
    task: AITask,
    availableModels: AIModel[]
  ): AIModel;
  
  estimateCost(
    messages: Message[],
    model: AIModel
  ): number;
  
  shouldUseCache(
    query: string,
    context: CodeContext
  ): boolean;
}

class SmartModelSelector implements CostOptimizer {
  selectOptimalModel(task: AITask, models: AIModel[]): AIModel {
    // Simple tasks -> cheaper models
    if (task.complexity === 'low') {
      return models.find(m => m.tier === 'fast') || models[0];
    }
    
    // Complex tasks -> premium models
    if (task.complexity === 'high') {
      return models.find(m => m.tier === 'premium') || models[0];
    }
    
    // Default to balanced model
    return models.find(m => m.tier === 'balanced') || models[0];
  }
}
```

## Security and Privacy

### Data Protection
```typescript
interface PrivacySettings {
  shareCodeWithAI: boolean;
  retainConversations: boolean;
  allowTelemetry: boolean;
  localProcessingOnly: boolean;
}

class PrivacyManager {
  async sanitizeCode(code: string, settings: PrivacySettings): Promise<string> {
    if (!settings.shareCodeWithAI) {
      // Replace sensitive patterns
      return code
        .replace(/api[_-]?key[s]?\s*[:=]\s*['"][^'"]+['"]/gi, 'API_KEY="[REDACTED]"')
        .replace(/password[s]?\s*[:=]\s*['"][^'"]+['"]/gi, 'password="[REDACTED]"')
        .replace(/secret[s]?\s*[:=]\s*['"][^'"]+['"]/gi, 'secret="[REDACTED]"');
    }
    return code;
  }

  async shouldProcessLocally(
    task: AITask,
    settings: PrivacySettings
  ): Promise<boolean> {
    return settings.localProcessingOnly || 
           task.containsSensitiveData ||
           task.requiresPrivacy;
  }
}
```

### API Key Management
```typescript
interface APIKeyManager {
  encrypt(key: string): Promise<string>;
  decrypt(encryptedKey: string): Promise<string>;
  validate(key: string, provider: string): Promise<boolean>;
  rotate(oldKey: string, newKey: string): Promise<void>;
}

class SecureKeyManager implements APIKeyManager {
  private encryptionKey: string;

  async encrypt(key: string): Promise<string> {
    // Use Web Crypto API for encryption
    const encoder = new TextEncoder();
    const data = encoder.encode(key);
    
    const cryptoKey = await crypto.subtle.importKey(
      'raw',
      encoder.encode(this.encryptionKey),
      { name: 'AES-GCM' },
      false,
      ['encrypt']
    );

    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encrypted = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      cryptoKey,
      data
    );

    return btoa(String.fromCharCode(...new Uint8Array(encrypted)));
  }
}
```

## Performance Optimization

### Caching Strategy
```typescript
interface AICache {
  get(key: string): Promise<CachedResponse | null>;
  set(key: string, response: AIResponse, ttl: number): Promise<void>;
  invalidate(pattern: string): Promise<void>;
}

class IntelligentCache implements AICache {
  private generateKey(
    messages: Message[],
    model: string,
    context: CodeContext
  ): string {
    // Create deterministic cache key
    const contextHash = this.hashContext(context);
    const messagesHash = this.hashMessages(messages);
    return `${model}:${contextHash}:${messagesHash}`;
  }

  async shouldCache(response: AIResponse): Promise<boolean> {
    // Cache successful responses for common queries
    return response.success && 
           response.type !== 'creative' && 
           response.confidence > 0.8;
  }
}
```

### Request Batching
```typescript
class RequestBatcher {
  private queue: PendingRequest[] = [];
  private batchTimeout: NodeJS.Timeout | null = null;

  async addRequest(request: AIRequest): Promise<AIResponse> {
    return new Promise((resolve, reject) => {
      this.queue.push({ request, resolve, reject });
      
      if (!this.batchTimeout) {
        this.batchTimeout = setTimeout(() => {
          this.processBatch();
        }, 100); // 100ms batch window
      }
    });
  }

  private async processBatch(): Promise<void> {
    const batch = this.queue.splice(0);
    this.batchTimeout = null;

    // Group by provider and model
    const groups = this.groupRequests(batch);
    
    // Process each group
    for (const group of groups) {
      await this.processBatchGroup(group);
    }
  }
}
```