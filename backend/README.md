# Async Coder Backend

A production-ready backend API for the Async Coder AI coding assistant platform, built with Fastify, TypeScript, and Drizzle ORM.

## Features

- 🚀 **High Performance**: Built with Fastify for maximum throughput
- 🔐 **Secure Authentication**: JWT tokens, API keys, and Clerk integration
- 🗄️ **Robust Database**: PostgreSQL with Drizzle ORM and migrations
- 🔄 **Background Jobs**: Redis-based task queue with Bull
- 🤖 **AI Integration**: Support for multiple AI providers (OpenAI, Anthropic, Google)
- 📊 **Real-time Updates**: WebSocket support for live task updates
- 🛡️ **Security**: Rate limiting, input validation, and encryption
- 📈 **Monitoring**: Comprehensive logging and health checks
- 🔧 **Admin Panel**: Full admin API for system management

## Tech Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Fastify
- **Database**: PostgreSQL with Supabase
- **ORM**: Drizzle ORM
- **Cache/Queue**: Redis with Bull
- **Authentication**: Clerk + JWT
- **AI Providers**: OpenAI, Anthropic, Google AI
- **Payments**: Stripe
- **Logging**: Winston
- **Validation**: Zod

## Project Structure

```
backend/
├── src/
│   ├── config/          # Configuration files
│   │   ├── auth.ts      # Authentication setup
│   │   ├── database.ts  # Database connection
│   │   └── redis.ts     # Redis configuration
│   ├── db/
│   │   ├── schema/      # Database schemas
│   │   ├── migrations/  # Database migrations
│   │   └── seed.ts      # Database seeding
│   ├── middleware/      # Fastify middleware
│   │   ├── auth.ts      # Authentication middleware
│   │   ├── rate-limit.ts # Rate limiting
│   │   └── validation.ts # Input validation
│   ├── routes/          # API route handlers
│   │   ├── auth.ts      # Authentication routes
│   │   ├── users.ts     # User management
│   │   ├── tasks.ts     # Task management
│   │   ├── repositories.ts # Repository management
│   │   ├── webhooks.ts  # Webhook handlers
│   │   └── admin.ts     # Admin routes
│   ├── services/        # Business logic services
│   │   ├── user.ts      # User service
│   │   ├── task-queue.ts # Job queue management
│   │   ├── task-executor.ts # Task execution
│   │   └── ai-provider.ts # AI provider abstraction
│   ├── utils/           # Utility functions
│   │   ├── logger.ts    # Logging utilities
│   │   ├── encryption.ts # Encryption helpers
│   │   └── github.ts    # GitHub API integration
│   ├── types/           # TypeScript type definitions
│   └── server.ts        # Main server file
├── drizzle.config.ts    # Drizzle configuration
├── package.json
└── tsconfig.json
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL database (Supabase recommended)
- Redis server
- GitHub OAuth app
- AI provider API keys (OpenAI, Anthropic, Google)

### Installation

1. **Clone and install dependencies:**
```bash
cd backend
npm install
```

2. **Set up environment variables:**
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. **Set up the database:**
```bash
# Generate migrations
npm run db:generate

# Run migrations
npm run db:migrate

# Seed initial data
npm run db:seed
```

4. **Start the development server:**
```bash
npm run dev
```

The API will be available at `http://localhost:3001`

### Environment Variables

Key environment variables (see `.env.example` for complete list):

```env
# Database
DATABASE_URL=postgresql://user:pass@host:port/db
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Authentication
CLERK_SECRET_KEY=sk_test_your-clerk-secret
JWT_SECRET=your-super-secret-jwt-key

# Redis
REDIS_URL=redis://localhost:6379

# GitHub
GITHUB_CLIENT_ID=your-github-oauth-client-id
GITHUB_CLIENT_SECRET=your-github-oauth-secret

# AI Providers
OPENAI_API_KEY=sk-your-openai-key
ANTHROPIC_API_KEY=sk-ant-your-anthropic-key
GOOGLE_AI_API_KEY=your-google-ai-key

# Stripe
STRIPE_SECRET_KEY=sk_test_your-stripe-key
```

## API Documentation

Comprehensive API documentation is available in [API-documentation.md](./API-documentation.md).

### Quick Examples

**Authentication:**
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"clerkToken": "your-clerk-token"}'
```

**Create a task:**
```bash
curl -X POST http://localhost:3001/api/tasks \
  -H "Authorization: Bearer your-jwt-token" \
  -H "Content-Type: application/json" \
  -d '{
    "repositoryId": "repo-uuid",
    "aiModelId": "model-uuid",
    "title": "Fix authentication bug",
    "prompt": "Find and fix the bug in the login component",
    "branch": "main",
    "type": "debug"
  }'
```

**Health check:**
```bash
curl http://localhost:3001/health
```

## Database Schema

The database uses a comprehensive schema with the following main entities:

- **Users**: User accounts with authentication and subscription info
- **Repositories**: GitHub repositories with access control
- **Tasks**: AI coding tasks with execution tracking
- **AI Models**: Available AI models and configurations
- **Pull Requests**: Generated PRs with status tracking
- **Credits**: Credit system for usage billing
- **Subscriptions**: User subscription management

## Background Jobs

The system uses Redis and Bull for background job processing:

- **Task Execution**: AI-powered code analysis and generation
- **Repository Syncing**: GitHub repository synchronization
- **Cleanup Jobs**: Temporary file and workspace cleanup
- **Webhook Processing**: Asynchronous webhook handling

## Security Features

- **Authentication**: Multiple auth methods (JWT, API keys, sessions)
- **Rate Limiting**: Configurable rate limits per endpoint and user tier
- **Input Validation**: Comprehensive request validation with Zod
- **Encryption**: Sensitive data encryption at rest
- **CORS**: Configurable cross-origin resource sharing
- **Helmet**: Security headers and protection

## Monitoring & Logging

- **Structured Logging**: JSON-formatted logs with Winston
- **Health Checks**: Comprehensive system health monitoring
- **Metrics**: Performance and usage metrics collection
- **Error Tracking**: Detailed error logging and tracking
- **Audit Logs**: Security and admin action auditing

## Development

### Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run test         # Run tests
npm run lint         # Lint code
npm run db:generate  # Generate database migrations
npm run db:migrate   # Run database migrations
npm run db:seed      # Seed database with initial data
npm run db:studio    # Open Drizzle Studio
```

### Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run specific test file
npm test -- auth.test.ts
```

### Database Operations

```bash
# Generate new migration
npm run db:generate

# Run migrations
npm run db:migrate

# Seed database
npm run db:seed

# Open database studio
npm run db:studio
```

## Deployment

### Docker

```bash
# Build image
docker build -t async-coder-api .

# Run container
docker run -p 3001:3001 \
  -e DATABASE_URL=your-db-url \
  -e REDIS_URL=your-redis-url \
  async-coder-api
```

### Production Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Configure production database
- [ ] Set up Redis cluster
- [ ] Configure SSL/TLS
- [ ] Set up monitoring and alerting
- [ ] Configure log aggregation
- [ ] Set up backup strategies
- [ ] Configure rate limiting
- [ ] Set up health checks
- [ ] Configure auto-scaling

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions:
- Check the [API documentation](./API-documentation.md)
- Review the [troubleshooting guide](#troubleshooting)
- Open an issue on GitHub
- Contact the development team

## Troubleshooting

### Common Issues

**Database connection failed:**
- Verify DATABASE_URL is correct
- Check database server is running
- Ensure network connectivity

**Redis connection failed:**
- Verify REDIS_URL is correct
- Check Redis server is running
- Ensure Redis authentication is configured

**Authentication errors:**
- Verify Clerk configuration
- Check JWT_SECRET is set
- Ensure API keys are valid

**Task execution failures:**
- Check AI provider API keys
- Verify credit balance
- Check repository access permissions
