# Async Coder - System Architecture

## 🏗️ High-Level Architecture

### System Overview
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend API   │    │   AI Services   │
│   (Next.js)     │◄──►│   (Node.js)     │◄──►│   (Multiple)    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   CDN/Edge      │    │   Database      │    │   File Storage  │
│   (Vercel)      │    │   (PostgreSQL)  │    │   (S3/Supabase) │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🎯 Frontend Architecture

### Technology Stack
- **Framework**: Next.js 15 (App Router)
- **Runtime**: React 19
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **State Management**: React Context + useReducer
- **Authentication**: Clerk
- **Animations**: Framer Motion
- **Code Editor**: Monaco Editor
- **Icons**: Lucide React + Radix UI

### Folder Structure
```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Authentication routes
│   ├── dashboard/         # Main application
│   ├── api/               # API routes
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Landing page
├── components/            # React components
│   ├── ui/               # Base UI components
│   ├── forms/            # Form components
│   ├── dashboard/        # Dashboard-specific
│   ├── ai/               # AI-related components
│   └── layout/           # Layout components
├── lib/                  # Utility libraries
│   ├── utils.ts          # General utilities
│   ├── ai/               # AI integration
│   ├── auth/             # Authentication
│   └── api/              # API clients
├── hooks/                # Custom React hooks
├── types/                # TypeScript definitions
├── constants/            # Application constants
└── middleware.ts         # Next.js middleware
```

### State Management Strategy

#### Global State (React Context)
```typescript
// User authentication state
interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

// Application settings
interface AppState {
  theme: 'light' | 'dark' | 'system';
  aiProvider: 'openai' | 'claude' | 'gemini';
  preferences: UserPreferences;
}

// Project workspace state
interface WorkspaceState {
  currentProject: Project | null;
  files: FileTree;
  openTabs: EditorTab[];
  activeTab: string | null;
}
```

#### Local State (useState/useReducer)
- Component-specific UI state
- Form state and validation
- Temporary data and interactions

### Component Architecture

#### Design System Components
```typescript
// Base components with variants
Button, Input, Card, Modal, Toast, etc.

// Compound components
<Select>
  <SelectTrigger />
  <SelectContent />
  <SelectItem />
</Select>
```

#### Feature Components
```typescript
// Dashboard layout
<DashboardLayout>
  <Sidebar />
  <MainContent>
    <Header />
    <WorkspaceArea />
  </MainContent>
</DashboardLayout>

// AI Chat interface
<AIChat>
  <ChatHistory />
  <MessageInput />
  <ModelSelector />
</AIChat>
```

## 🔧 Backend Architecture

### API Design
- **Type**: RESTful API with GraphQL consideration
- **Framework**: Next.js API Routes (initially)
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: Clerk webhooks + JWT
- **File Storage**: Supabase Storage or AWS S3

### API Endpoints Structure
```
/api/
├── auth/                 # Authentication
│   ├── webhook          # Clerk webhooks
│   └── session          # Session management
├── projects/            # Project management
│   ├── [id]/           # Project CRUD
│   └── files/          # File operations
├── ai/                  # AI integrations
│   ├── chat            # Chat completions
│   ├── models          # Available models
│   └── usage           # Usage tracking
├── users/              # User management
│   ├── profile         # User profile
│   └── settings        # User preferences
└── webhooks/           # External webhooks
    ├── github          # GitHub integration
    └── deployment      # Deployment hooks
```

### Database Schema

#### Core Tables
```sql
-- Users (synced from Clerk)
CREATE TABLE users (
  id UUID PRIMARY KEY,
  clerk_id VARCHAR UNIQUE NOT NULL,
  email VARCHAR NOT NULL,
  name VARCHAR,
  avatar_url VARCHAR,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Projects
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  name VARCHAR NOT NULL,
  description TEXT,
  repository_url VARCHAR,
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Files
CREATE TABLE files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id),
  path VARCHAR NOT NULL,
  content TEXT,
  language VARCHAR,
  size INTEGER,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(project_id, path)
);

-- AI Conversations
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  project_id UUID REFERENCES projects(id),
  title VARCHAR,
  model VARCHAR NOT NULL,
  mode VARCHAR NOT NULL, -- 'chat', 'debug', 'ask', etc.
  created_at TIMESTAMP DEFAULT NOW()
);

-- Messages
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES conversations(id),
  role VARCHAR NOT NULL, -- 'user', 'assistant', 'system'
  content TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW()
);

-- API Usage Tracking
CREATE TABLE api_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  provider VARCHAR NOT NULL,
  model VARCHAR NOT NULL,
  tokens_used INTEGER NOT NULL,
  cost_cents INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## 🤖 AI Integration Architecture

### Multi-Provider Support
```typescript
interface AIProvider {
  name: string;
  models: AIModel[];
  authenticate(apiKey: string): Promise<boolean>;
  chat(messages: Message[], options: ChatOptions): Promise<ChatResponse>;
  stream(messages: Message[], options: ChatOptions): AsyncIterable<ChatChunk>;
}

// Supported providers
const providers: AIProvider[] = [
  new OpenAIProvider(),
  new ClaudeProvider(),
  new GeminiProvider(),
  new LocalProvider(), // For local models
];
```

### AI Mode System
```typescript
interface AIMode {
  name: string;
  description: string;
  systemPrompt: string;
  suggestedModels: string[];
  execute(context: ModeContext): Promise<ModeResult>;
}

// Available modes
const modes = {
  chat: new ChatMode(),
  debug: new DebugMode(),
  ask: new AskMode(),
  documentation: new DocumentationMode(),
  architect: new ArchitectMode(),
  review: new ReviewMode(),
  async: new AsyncMode(), // Autonomous mode
};
```

### Context Management
```typescript
interface CodeContext {
  files: FileContent[];
  dependencies: PackageInfo[];
  gitHistory: GitCommit[];
  errors: ErrorInfo[];
  tests: TestResult[];
}

class ContextBuilder {
  static async buildContext(
    project: Project,
    mode: AIMode,
    userQuery: string
  ): Promise<CodeContext> {
    // Intelligent context selection based on:
    // - Current file being edited
    // - Related files (imports, references)
    // - Recent changes
    // - Error logs
    // - Test results
  }
}
```

## 🔐 Security Architecture

### Authentication Flow
```
1. User signs up/in via Clerk
2. Clerk issues JWT token
3. Frontend includes token in API requests
4. Backend verifies token with Clerk
5. User session established
```

### Authorization Levels
- **Public**: Landing page, documentation
- **Authenticated**: Dashboard, basic features
- **Premium**: Advanced AI modes, higher limits
- **Enterprise**: Team features, SSO, compliance

### Data Security
- **Encryption**: All data encrypted at rest and in transit
- **API Keys**: Encrypted storage, never logged
- **Code Privacy**: User code never shared or trained on
- **Audit Logs**: All actions logged for compliance

## 📊 Performance Architecture

### Frontend Optimization
- **Code Splitting**: Route-based and component-based
- **Lazy Loading**: Images, components, and routes
- **Caching**: React Query for API responses
- **CDN**: Static assets served from edge locations
- **Bundle Analysis**: Regular bundle size monitoring

### Backend Optimization
- **Database**: Connection pooling, query optimization
- **Caching**: Redis for session and API response caching
- **Rate Limiting**: Per-user and per-endpoint limits
- **Monitoring**: Real-time performance metrics

### AI Performance
- **Streaming**: Real-time response streaming
- **Batching**: Multiple requests batched when possible
- **Caching**: Common responses cached
- **Fallbacks**: Graceful degradation when AI unavailable

## 🚀 Deployment Architecture

### Development Environment
```
Local Development:
├── Frontend: localhost:3000 (Next.js dev server)
├── Database: Local PostgreSQL
├── Storage: Local file system
└── AI: Development API keys
```

### Staging Environment
```
Vercel Staging:
├── Frontend: staging.asynccoder.dev
├── Database: Supabase staging
├── Storage: Supabase storage
└── AI: Staging API keys with limits
```

### Production Environment
```
Vercel Production:
├── Frontend: asynccoder.dev (CDN + Edge functions)
├── Database: Supabase production (with replicas)
├── Storage: Supabase storage (with CDN)
├── Monitoring: Vercel Analytics + Sentry
└── AI: Production API keys with monitoring
```

### CI/CD Pipeline
```
GitHub Actions:
1. Code push to main branch
2. Run tests (unit, integration, e2e)
3. Build and optimize
4. Deploy to staging
5. Run smoke tests
6. Deploy to production (if staging passes)
7. Monitor deployment health
```

## 📈 Scalability Considerations

### Horizontal Scaling
- **Frontend**: Edge deployment with Vercel
- **Backend**: Serverless functions (auto-scaling)
- **Database**: Read replicas for scaling reads
- **Storage**: CDN for file delivery

### Vertical Scaling
- **Database**: Upgrade instance size as needed
- **AI Processing**: Queue system for heavy operations
- **File Processing**: Background jobs for large files

### Cost Optimization
- **AI Usage**: Smart caching and batching
- **Database**: Query optimization and indexing
- **Storage**: Lifecycle policies for old files
- **Monitoring**: Usage-based alerts and limits

## 🔍 Monitoring & Observability

### Application Monitoring
- **Performance**: Core Web Vitals, API response times
- **Errors**: Error tracking with Sentry
- **Usage**: User analytics with Vercel Analytics
- **AI**: Token usage, model performance, costs

### Infrastructure Monitoring
- **Uptime**: Service availability monitoring
- **Database**: Query performance, connection health
- **Storage**: File access patterns, storage usage
- **Security**: Failed auth attempts, suspicious activity

### Alerting Strategy
- **Critical**: Service down, database errors
- **Warning**: High response times, approaching limits
- **Info**: Deployment success, usage milestones