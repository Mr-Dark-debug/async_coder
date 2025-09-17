# Build and Deployment

<cite>
**Referenced Files in This Document**   
- [package.json](file://package.json) - *Updated with frontend scripts*
- [backend/package.json](file://backend\package.json) - *Added backend structure and scripts*
- [next.config.ts](file://next.config.ts) - *Updated with image optimization settings*
- [backend/src/server.ts](file://backend\src\server.ts) - *Backend server entry point*
- [backend/src/config/database.ts](file://backend\src\config\database.ts) - *Database configuration*
- [backend/src/config/redis.ts](file://backend\src\config/redis.ts) - *Redis and caching setup*
- [backend/src/services/task-queue.ts](file://backend\src\services\task-queue.ts) - *Background job processing*
- [backend/src/services/ai-provider.ts](file://backend\src\services\ai-provider.ts) - *AI model integration*
- [backend/drizzle.config.ts](file://backend\drizzle.config.ts) - *Database migration configuration*
- [src/app/page.tsx](file://src\app\page.tsx)
- [src/app/providers.tsx](file://src\app\providers.tsx)
</cite>

## Update Summary
**Changes Made**   
- Updated documentation to reflect new backend structure and coordinated deployment requirements
- Added backend development and build scripts to documentation
- Enhanced Next.js configuration details with actual image optimization settings
- Added comprehensive backend deployment requirements including database, Redis, and AI services
- Updated authentication section to reflect Clerk-based authentication flow
- Added new sections for task queue processing and AI provider integration
- Updated environment variable requirements for full-stack deployment

## Table of Contents
1. [Development Setup with pnpm](#development-setup-with-pnpm)
2. [Build and Development Scripts](#build-and-development-scripts)
3. [Next.js Configuration Analysis](#nextjs-configuration-analysis)
4. [Backend Architecture and Services](#backend-architecture-and-services)
5. [Authentication and Environment Variables](#authentication-and-environment-variables)
6. [Deployment Instructions](#deployment-instructions)
7. [Performance Optimization Techniques](#performance-optimization-techniques)
8. [Common Build Errors and Troubleshooting](#common-build-errors-and-troubleshooting)
9. [CI/CD Integration Options](#cicd-integration-options)

## Development Setup with pnpm

The async_coder application uses **pnpm** as its package manager, configured through the project structure. This setup enables efficient dependency management for the full-stack application.

To set up the development environment:

1. Install pnpm globally:
   ```bash
   npm install -g pnpm
   ```

2. Install project dependencies:
   ```bash
   pnpm install
   ```

3. Start the development servers:
   - Frontend: `pnpm dev` (runs Next.js development server)
   - Backend: `pnpm run dev --filter=backend` (runs backend API server)

4. The application uses a monorepo structure with:
   - Frontend in the root directory (Next.js application)
   - Backend in the `backend/` directory (Fastify API server)

This configuration ensures consistent dependency resolution across environments and leverages pnpm's disk-efficient linking strategy for both frontend and backend dependencies.

**Section sources**
- [package.json](file://package.json) - *Frontend scripts*
- [backend/package.json](file://backend\package.json) - *Backend scripts and dependencies*

## Build and Development Scripts

The `package.json` files define the primary scripts for development, building, and running both frontend and backend applications.

### Frontend Scripts (Root package.json)

```json
"scripts": {
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "eslint"
}
```

### Backend Scripts (backend/package.json)

```json
"scripts": {
  "dev": "tsx watch src/server.ts",
  "build": "tsc",
  "start": "node dist/server.js",
  "db:generate": "drizzle-kit generate",
  "db:migrate": "drizzle-kit migrate",
  "db:studio": "drizzle-kit studio",
  "db:seed": "tsx --require dotenv/config src/db/seed.ts",
  "test": "jest",
  "test:watch": "jest --watch",
  "lint": "eslint src/**/*.ts",
  "lint:fix": "eslint src/**/*.ts --fix"
}
```

### Script Descriptions

#### Frontend
- **`dev`**: Starts the Next.js development server with hot reloading at `http://localhost:3000`
- **`build`**: Compiles the Next.js application for production
- **`start`**: Runs the production server using the built output
- **`lint`**: Runs ESLint to identify code quality issues

#### Backend
- **`dev`**: Starts the backend API server in watch mode using tsx
- **`build`**: Compiles TypeScript code to JavaScript in the `dist/` directory
- **`start`**: Runs the compiled backend server
- **`db:generate`**: Generates database migration files
- **`db:migrate`**: Applies database migrations
- **`db:studio`**: Launches Drizzle ORM Studio for database management
- **`db:seed`**: Seeds the database with initial data
- **`test`**: Runs Jest tests
- **`lint`**: Runs ESLint on backend code

These scripts enable coordinated development and deployment of the full-stack application.

**Section sources**
- [package.json](file://package.json) - *Frontend scripts*
- [backend/package.json](file://backend\package.json#L5-L25) - *Backend scripts*

## Next.js Configuration Analysis

The `next.config.ts` file contains the core configuration for the Next.js frontend application:

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'ik.imagekit.io',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'tailark.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'html.tailus.io',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'img.clerk.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.clerk.dev',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
```

### Configuration Details

The configuration includes image optimization settings that allow the application to securely load images from specified external domains. This is essential for:

- User avatars from Clerk authentication service
- Background images from Unsplash
- UI assets from various CDNs

The `remotePatterns` configuration enables Next.js to optimize images from these domains, providing automatic format conversion, responsive sizing, and improved performance.

For production deployment, consider adding additional configuration options:

```ts
const nextConfig: NextConfig = {
  output: 'export', // Enable static site generation
  trailingSlash: true,
  reactStrictMode: true,
  swcMinify: true,
  images: {
    // existing remotePatterns
  },
};
```

This would enable full static export capability, making the frontend application suitable for any static hosting provider.

**Section sources**
- [next.config.ts](file://next.config.ts#L1-L46) - *Image optimization configuration*

## Backend Architecture and Services

The backend application is built with Fastify and provides essential services for the async_coder platform.

### Server Architecture

The backend server is implemented in `backend/src/server.ts` and uses the following architecture:

- **Fastify**: High-performance Node.js web framework
- **Drizzle ORM**: Database ORM and query builder
- **PostgreSQL**: Primary database
- **Redis**: Caching and session storage
- **Bull**: Background job queue processing
- **Clerk**: Authentication and user management

### Key Services

#### Database Service
The database configuration in `backend/src/config/database.ts` establishes a connection to PostgreSQL using connection pooling:

```ts
const client = postgres(connectionString, {
  max: 20,
  idle_timeout: 20,
  connect_timeout: 10,
});
```

Drizzle ORM is used for type-safe database operations with the schema defined in `backend/src/db/schema/`.

#### Redis and Caching
Redis is configured in `backend/src/config/redis.ts` for:
- Session management
- Rate limiting
- Caching frequently accessed data
- Task queue processing

#### Task Queue Processing
The task queue service in `backend/src/services/task-queue.ts` uses Bull with Redis to manage background jobs:

- Task execution jobs with priority levels (low, medium, high)
- Cleanup jobs for temporary files and workspaces
- Job progress tracking and status monitoring
- Failed job retry mechanisms

#### AI Provider Integration
The AI provider service in `backend/src/services/ai-provider.ts` supports multiple AI models:
- OpenAI (GPT-4, GPT-3.5-turbo)
- Anthropic (Claude-3)
- Google AI (Gemini)

The service handles API key management, request routing, and response processing for AI-powered coding assistance.

**Section sources**
- [backend/src/server.ts](file://backend\src\server.ts#L1-L261) - *Server entry point and initialization*
- [backend/src/config/database.ts](file://backend\src\config\database.ts#L1-L75) - *Database configuration*
- [backend/src/config/redis.ts](file://backend\src\config/redis.ts#L1-L195) - *Redis configuration and caching*
- [backend/src/services/task-queue.ts](file://backend\src\services\task-queue.ts#L1-L434) - *Task queue processing*
- [backend/src/services/ai-provider.ts](file://backend\src\services\ai-provider.ts#L1-L417) - *AI provider integration*

## Authentication and Environment Variables

The application implements authentication using **Clerk** for user management and session handling.

### Required Environment Variables

#### Frontend
- **`NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`**: Clerk publishable key for frontend integration
- **`NEXT_PUBLIC_CLERK_SIGN_IN_URL`**: Sign-in URL for Clerk authentication
- **`NEXT_PUBLIC_CLERK_SIGN_UP_URL`**: Sign-up URL for Clerk authentication

#### Backend
- **`CLERK_SECRET_KEY`**: Clerk secret key for server-side authentication
- **`DATABASE_URL`**: PostgreSQL database connection string
- **`REDIS_HOST`**: Redis server host
- **`REDIS_PORT`**: Redis server port
- **`REDIS_PASSWORD`**: Redis server password
- **`REDIS_DB`**: Redis database number
- **`OPENAI_API_KEY`**: OpenAI API key for AI features
- **`ANTHROPIC_API_KEY`**: Anthropic API key for AI features
- **`GOOGLE_AI_API_KEY`**: Google AI API key for AI features
- **`STRIPE_SECRET_KEY`**: Stripe secret key for subscription management
- **`SUPABASE_URL`**: Supabase URL for storage
- **`SUPABASE_ANON_KEY`**: Supabase anonymous key

### Environment Setup

Create `.env.local` files in both the root and backend directories:

**Root directory (.env.local):**
```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
```

**Backend directory (backend/.env.local):**
```env
CLERK_SECRET_KEY=your_clerk_secret_key
DATABASE_URL=your_postgresql_connection_string
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_DB=0
OPENAI_API_KEY=your_openai_api_key
ANTHROPIC_API_KEY=your_anthropic_api_key
GOOGLE_AI_API_KEY=your_google_ai_api_key
STRIPE_SECRET_KEY=your_stripe_secret_key
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
PORT=3001
HOST=localhost
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
RATE_LIMIT_MAX_REQUESTS=100
RATE_LIMIT_WINDOW_MS=900000
```

This authentication setup enables secure user management with Clerk, with sessions managed through Redis caching.

**Section sources**
- [backend/src/config/auth.ts](file://backend\src\config\auth.ts) - *Authentication service*
- [backend/src/routes/auth.ts](file://backend\src\routes\auth.ts#L1-L387) - *Authentication routes*
- [backend/src/middleware/auth.ts](file://backend\src\middleware\auth.ts) - *Authentication middleware*

## Deployment Instructions

### Vercel Deployment

As a Next.js application, async_coder is optimized for deployment on Vercel:

1. Push code to a Git repository (GitHub, GitLab, or Bitbucket)
2. Sign in to Vercel and import the frontend project
3. Configure environment variables in the Vercel dashboard:
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - `NEXT_PUBLIC_CLERK_SIGN_IN_URL`
   - `NEXT_PUBLIC_CLERK_SIGN_UP_URL`
4. Set build command to `pnpm build`
5. Set output directory to `.next`
6. Deploy the frontend

For the backend, deploy to a Node.js hosting provider (Render, Railway, AWS, etc.) with:
- Build command: `cd backend && pnpm build`
- Start command: `cd backend && pnpm start`
- Environment variables as specified above
- PostgreSQL and Redis add-ons or external services

### Netlify Deployment

For Netlify deployment:

1. Connect your Git repository
2. Configure build settings:
   - **Build command**: `pnpm build`
   - **Publish directory**: `.next`
3. Add environment variables in the Netlify UI
4. Deploy the frontend

Deploy the backend separately to a Node.js hosting provider as described above.

### Database and Redis Setup

For production deployment:

1. **Database**: Use a managed PostgreSQL service (Supabase, AWS RDS, Render, etc.)
   - Run migrations with: `pnpm run db:migrate --filter=backend`
   - Seed data with: `pnpm run db:seed --filter=backend`

2. **Redis**: Use a managed Redis service (Upstash, AWS ElastiCache, Render, etc.)
   - Configure connection details in environment variables

3. **Drizzle ORM**: Use Drizzle Studio for database management:
   ```bash
   pnpm run db:studio --filter=backend
   ```

### Custom Domain and SSL Configuration

1. Purchase a domain through a registrar
2. Configure DNS to point to your hosting provider
3. In Vercel/Netlify, add the custom domain
4. The platform automatically provisions SSL via Let's Encrypt
5. Enforce HTTPS in settings

For the backend API, configure CORS to allow requests from your frontend domain:

```env
CORS_ORIGIN=https://yourdomain.com,https://www.yourdomain.com
```

**Section sources**
- [backend/drizzle.config.ts](file://backend\drizzle.config.ts#L1-L21) - *Database migration configuration*
- [next.config.ts](file://next.config.ts#L1-L46) - *Frontend configuration*
- [backend/src/server.ts](file://backend\src\server.ts#L1-L261) - *Backend server configuration*

## Performance Optimization Techniques

### Code Splitting

Next.js automatically implements code splitting by:
- Separating page-level code
- Lazy-loading components
- Dynamic imports for heavy libraries

To further optimize, use dynamic imports for non-critical components:

```ts
import dynamic from 'next/dynamic';

const HeavyComponent = dynamic(() => import('../components/HeavyComponent'));
```

### Image Optimization

The `next.config.ts` configuration enables automatic image optimization for specified domains:

```ts
images: {
  remotePatterns: [
    {
      protocol: 'https',
      hostname: 'img.clerk.com',
      pathname: '/**',
    },
    // other domains
  ],
}
```

This enables:
- Automatic format conversion (AVIF, WebP)
- Responsive image generation
- Improved loading performance
- Reduced bandwidth usage

### Asset Optimization with Tailwind CSS

The project includes Tailwind CSS for utility-first styling. Ensure PurgeCSS is enabled in production to remove unused styles, significantly reducing CSS bundle size.

### Backend Performance Optimization

#### Database Optimization
- Use connection pooling with appropriate limits
- Implement proper indexing in the database schema
- Use Drizzle ORM's query optimization features

#### Redis Caching
- Cache frequently accessed data and API responses
- Implement proper TTL (time-to-live) values
- Use Redis for session storage and rate limiting

#### Task Queue Optimization
- Process background jobs with appropriate priority levels
- Monitor queue statistics and adjust worker counts
- Implement proper error handling and retry mechanisms

### Lighthouse Optimization Recommendations

To achieve high Lighthouse scores:

1. **Performance**: Implement static site generation where possible
2. **Accessibility**: Add proper ARIA labels and semantic HTML
3. **Best Practices**: Use HTTPS, secure headers, and modern JavaScript
4. **SEO**: Add meta tags and structured data
5. **PWA**: Consider adding a web app manifest and service worker

Target performance metrics:
- First Contentful Paint: < 1.8s
- Time to Interactive: < 3.4s
- Speed Index: < 3.8s
- Total Blocking Time: < 200ms
- Cumulative Layout Shift: < 0.1

**Section sources**
- [next.config.ts](file://next.config.ts#L1-L46) - *Image optimization*
- [backend/src/config/database.ts](file://backend\src\config\database.ts#L1-L75) - *Database connection pooling*
- [backend/src/config/redis.ts](file://backend\src\config/redis.ts#L1-L195) - *Redis caching*
- [backend/src/services/task-queue.ts](file://backend\src\services\task-queue.ts#L1-L434) - *Task queue processing*

## Common Build Errors and Troubleshooting

### Missing Environment Variables

**Error**: `DATABASE_URL environment variable is required`

**Solution**: Ensure all required environment variables are defined in `.env.local` files for both frontend and backend.

### pnpm Installation Issues

**Error**: `command not found: pnpm`

**Solution**: Install pnpm globally:
```bash
npm install -g pnpm
```

### Database Connection Issues

**Error**: `Database connection failed`

**Solution**: 
1. Verify DATABASE_URL is correctly formatted
2. Ensure PostgreSQL server is running and accessible
3. Check network connectivity and firewall settings
4. Verify database credentials and permissions

### Redis Connection Issues

**Error**: `Redis connection failed`

**Solution**:
1. Verify Redis server is running
2. Check Redis host, port, and password configuration
3. Ensure network connectivity to Redis server
4. Verify Redis server has sufficient memory and resources

### Build Output Issues

**Error**: `Error: Image Optimization using Next.js' default loader is not compatible with 'output: 'export''`

**Solution**: Either:
1. Configure an image loader service, or
2. Add image domains to `next.config.ts` and avoid remote images not in the domains list

### AI Provider Configuration

Ensure AI provider API keys are properly configured:
- **OpenAI**: Set `OPENAI_API_KEY`
- **Anthropic**: Set `ANTHROPIC_API_KEY`
- **Google AI**: Set `GOOGLE_AI_API_KEY`

Verify API keys have the necessary permissions and are not rate-limited.

### Migration Issues

**Error**: Database migration failures

**Solution**:
1. Run `pnpm run db:generate --filter=backend` to generate migration files
2. Review generated SQL for correctness
3. Run `pnpm run db:migrate --filter=backend` to apply migrations
4. Check database schema and constraints

**Section sources**
- [backend/src/config/database.ts](file://backend\src\config\database.ts#L1-L75) - *Database connection*
- [backend/src/config/redis.ts](file://backend\src\config/redis.ts#L1-L195) - *Redis connection*
- [backend/drizzle.config.ts](file://backend\drizzle.config.ts#L1-L21) - *Migration configuration*

## CI/CD Integration Options

### GitHub Actions

Create `.github/workflows/deploy.yml` for automated deployment:

```yaml
name: Deploy
on:
  push:
    branches: [ main ]

jobs:
  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v3
        with:
          node-version: 20
          cache: pnpm

      - run: pnpm install
      - run: pnpm build

      - uses: vercel/action@v1
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          org-id: ${{ secrets.VERCEL_ORG_ID }}
          scope: ${{ secrets.VERCEL_SCOPE }}
          # Prevent auto-deploy to avoid multiple deployments
          skip-auto-deploy: true

  deploy-backend:
    runs-on: ubuntu-latest
    needs: deploy-frontend
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v3
        with:
          node-version: 20
          cache: pnpm

      - run: cd backend && pnpm install
      - run: cd backend && pnpm build

      - uses: render-deploy@v1
        with:
          service-id: ${{ secrets.RENDER_SERVICE_ID }}
          api-key: ${{ secrets.RENDER_API_KEY }}
```

### Database Migration in CI/CD

Add database migration steps to your CI/CD pipeline:

```yaml
- name: Run database migrations
  run: |
    cd backend
    pnpm run db:migrate
  env:
    DATABASE_URL: ${{ secrets.DATABASE_URL }}
```

### Environment-Specific Configuration

Use different environment variables for development, staging, and production:

```yaml
- name: Deploy to staging
  if: github.ref == 'refs/heads/staging'
  # Use staging environment variables

- name: Deploy to production
  if: github.ref == 'refs/heads/main'
  # Use production environment variables
```

### Health Checks and Monitoring

Implement health checks for both frontend and backend:

```bash
# Frontend health check
curl -f http://localhost:3000/health

# Backend health check
curl -f http://localhost:3001/health
```

Monitor application performance and error rates using services like Sentry, LogRocket, or Datadog.

**Section sources**
- [backend/src/server.ts](file://backend\src\server.ts#L1-L261) - *Health check endpoint*
- [backend/package.json](file://backend\package.json#L5-L25) - *Deployment scripts*
- [next.config.ts](file://next.config.ts#L1-L46) - *Frontend configuration*