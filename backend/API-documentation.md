# Async Coder Backend API Documentation

## Overview

The Async Coder Backend API provides a comprehensive set of endpoints for managing users, repositories, tasks, and AI-powered code assistance. The API is built with Fastify and TypeScript, featuring robust authentication, rate limiting, and real-time capabilities.

## Base URL

```
Development: http://localhost:3001
Production: https://api.async-coder.com
```

## Authentication

The API supports multiple authentication methods:

### 1. JWT Bearer Token
```http
Authorization: Bearer <jwt_token>
```

### 2. API Key
```http
X-API-Key: <api_key>
```

### 3. Session Cookie
```http
Cookie: async_coder_session=<session_id>
```

## Response Format

All API responses follow a consistent JSON format:

```json
{
  "success": boolean,
  "data": any,
  "error": {
    "code": "string",
    "message": "string",
    "details": any
  },
  "meta": {
    "page": number,
    "limit": number,
    "total": number,
    "totalPages": number
  }
}
```

## Rate Limiting

Rate limits are applied per endpoint and user:

- **General API**: 100 requests per 15 minutes
- **Authentication**: 5 requests per 15 minutes
- **Task Creation**: 10 requests per hour
- **Webhooks**: 1000 requests per hour

Rate limit headers are included in responses:
```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 2024-01-01T12:00:00Z
```

## Error Codes

| Code | Description |
|------|-------------|
| `UNAUTHORIZED` | Authentication required |
| `FORBIDDEN` | Insufficient permissions |
| `VALIDATION_ERROR` | Request validation failed |
| `RATE_LIMIT_EXCEEDED` | Rate limit exceeded |
| `INSUFFICIENT_CREDITS` | Not enough credits |
| `RESOURCE_NOT_FOUND` | Resource not found |
| `INTERNAL_ERROR` | Internal server error |

## Endpoints

### Authentication

#### POST /api/auth/login
Authenticate user with Clerk token.

**Request:**
```json
{
  "clerkToken": "string"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "username": "username",
      "displayName": "User Name",
      "avatarUrl": "https://...",
      "credits": 100,
      "subscriptionTier": "free",
      "isGithubConnected": false
    },
    "token": "jwt_token",
    "refreshToken": "refresh_token",
    "sessionId": "session_id"
  }
}
```

#### POST /api/auth/refresh
Refresh authentication token.

**Request:**
```json
{
  "refreshToken": "string"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "token": "new_jwt_token",
    "refreshToken": "new_refresh_token"
  }
}
```

#### POST /api/auth/github/connect
Connect GitHub account.

**Request:**
```json
{
  "code": "github_oauth_code",
  "state": "optional_state"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "GitHub account connected successfully",
    "githubUser": {
      "id": 12345,
      "login": "username",
      "name": "User Name",
      "avatar_url": "https://..."
    }
  }
}
```

#### POST /api/auth/logout
Logout user and invalidate session.

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Logged out successfully"
  }
}
```

### Users

#### GET /api/users/me
Get current user profile.

**Headers:**
```http
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "username": "username",
    "displayName": "User Name",
    "avatarUrl": "https://...",
    "credits": 100,
    "totalCreditsUsed": 50,
    "subscriptionTier": "free",
    "isGithubConnected": true,
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  }
}
```

#### PUT /api/users/me
Update current user profile.

**Request:**
```json
{
  "displayName": "New Display Name",
  "avatarUrl": "https://new-avatar-url.com"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "username": "username",
    "displayName": "New Display Name",
    "avatarUrl": "https://new-avatar-url.com",
    "credits": 100,
    "subscriptionTier": "free",
    "isGithubConnected": true
  }
}
```

#### GET /api/users/me/credits/transactions
Get user's credit transaction history.

**Query Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 20, max: 100)
- `type` (string): Transaction type filter
- `startDate` (string): Start date filter (ISO 8601)
- `endDate` (string): End date filter (ISO 8601)

**Response:**
```json
{
  "success": true,
  "data": {
    "transactions": [
      {
        "id": "uuid",
        "type": "debit",
        "amount": -10,
        "description": "Task execution",
        "balanceAfter": 90,
        "createdAt": "2024-01-01T00:00:00Z"
      }
    ],
    "total": 25,
    "page": 1,
    "limit": 20
  },
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 25,
    "totalPages": 2
  }
}
```

### Repositories

#### GET /api/repositories
Get user's repositories.

**Query Parameters:**
- `page` (number): Page number
- `limit` (number): Items per page
- `search` (string): Search query
- `connected` (boolean): Filter by GitHub connection status

**Response:**
```json
{
  "success": true,
  "data": {
    "repositories": [
      {
        "id": "uuid",
        "githubId": 12345,
        "name": "my-repo",
        "fullName": "username/my-repo",
        "description": "Repository description",
        "isPrivate": false,
        "defaultBranch": "main",
        "language": "TypeScript",
        "url": "https://github.com/username/my-repo",
        "isActive": true,
        "createdAt": "2024-01-01T00:00:00Z"
      }
    ]
  }
}
```

#### POST /api/repositories/sync
Sync repositories from GitHub.

**Request:**
```json
{
  "force": false
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "synced": 15,
    "added": 3,
    "updated": 2,
    "message": "Repositories synced successfully"
  }
}
```

#### GET /api/repositories/:repositoryId/branches
Get repository branches.

**Response:**
```json
{
  "success": true,
  "data": {
    "branches": [
      {
        "name": "main",
        "commit": {
          "sha": "abc123",
          "url": "https://..."
        },
        "protected": false
      }
    ]
  }
}
```

### Tasks

#### POST /api/tasks
Create a new task.

**Request:**
```json
{
  "repositoryId": "uuid",
  "aiModelId": "uuid",
  "title": "Fix bug in authentication",
  "description": "Optional description",
  "prompt": "Find and fix the authentication bug in the login component",
  "branch": "main",
  "targetBranch": "main",
  "type": "debug",
  "priority": "medium"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "Fix bug in authentication",
    "description": "Optional description",
    "status": "pending",
    "type": "debug",
    "priority": "medium",
    "estimatedCredits": 25,
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

#### GET /api/tasks
Get user's tasks.

**Query Parameters:**
- `page` (number): Page number
- `limit` (number): Items per page
- `status` (string): Filter by status
- `type` (string): Filter by type
- `repositoryId` (string): Filter by repository

**Response:**
```json
{
  "success": true,
  "data": {
    "tasks": [
      {
        "id": "uuid",
        "title": "Fix bug in authentication",
        "status": "completed",
        "type": "debug",
        "priority": "medium",
        "creditsUsed": 23,
        "createdAt": "2024-01-01T00:00:00Z",
        "completedAt": "2024-01-01T00:05:00Z",
        "repository": {
          "name": "my-repo",
          "fullName": "username/my-repo"
        },
        "aiModel": {
          "name": "gpt-4",
          "displayName": "GPT-4"
        }
      }
    ]
  }
}
```

#### GET /api/tasks/:taskId
Get task details.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "Fix bug in authentication",
    "description": "Optional description",
    "prompt": "Find and fix the authentication bug",
    "status": "completed",
    "type": "debug",
    "priority": "medium",
    "branch": "main",
    "targetBranch": "main",
    "creditsUsed": 23,
    "startedAt": "2024-01-01T00:00:00Z",
    "completedAt": "2024-01-01T00:05:00Z",
    "createdAt": "2024-01-01T00:00:00Z",
    "repository": {
      "id": "uuid",
      "name": "my-repo",
      "fullName": "username/my-repo"
    },
    "aiModel": {
      "id": "uuid",
      "name": "gpt-4",
      "displayName": "GPT-4"
    },
    "results": [
      {
        "id": "uuid",
        "resultType": "code_changes",
        "content": "Fixed authentication bug...",
        "summary": "Applied fix to login component",
        "createdAt": "2024-01-01T00:05:00Z"
      }
    ]
  }
}
```

#### PUT /api/tasks/:taskId/cancel
Cancel a running task.

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Task cancelled successfully"
  }
}
```

### AI Models

#### GET /api/ai-models
Get available AI models.

**Response:**
```json
{
  "success": true,
  "data": {
    "models": [
      {
        "id": "uuid",
        "name": "gpt-4",
        "displayName": "GPT-4",
        "provider": "openai",
        "description": "Most capable GPT model",
        "costPerToken": 0.00003,
        "maxTokens": 8192,
        "capabilities": ["debug", "ask", "documentation"],
        "isActive": true
      }
    ]
  }
}
```

### Webhooks

#### POST /api/webhooks/github
GitHub webhook endpoint.

**Headers:**
```http
X-GitHub-Event: pull_request
X-Hub-Signature-256: sha256=...
```

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Webhook processed successfully"
  }
}
```

### Health Check

#### GET /health
Check API health status.

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00Z",
  "services": {
    "database": "healthy",
    "redis": "healthy",
    "queue": "healthy"
  },
  "version": "1.0.0",
  "environment": "production"
}
```

## WebSocket Events

The API supports real-time updates via WebSocket connections:

### Connection
```javascript
const ws = new WebSocket('ws://localhost:3001/ws');
```

### Events

#### task:status_updated
```json
{
  "event": "task:status_updated",
  "data": {
    "taskId": "uuid",
    "status": "running",
    "progress": 45
  }
}
```

#### task:completed
```json
{
  "event": "task:completed",
  "data": {
    "taskId": "uuid",
    "status": "completed",
    "creditsUsed": 23,
    "result": {
      "type": "code_changes",
      "pullRequestUrl": "https://github.com/..."
    }
  }
}
```

#### credits:updated
```json
{
  "event": "credits:updated",
  "data": {
    "userId": "uuid",
    "credits": 77,
    "change": -23
  }
}
```

## SDK Examples

### JavaScript/TypeScript
```typescript
import { AsyncCoderAPI } from '@async-coder/sdk';

const api = new AsyncCoderAPI({
  baseUrl: 'http://localhost:3001',
  token: 'your-jwt-token'
});

// Create a task
const task = await api.tasks.create({
  repositoryId: 'repo-uuid',
  aiModelId: 'model-uuid',
  title: 'Fix authentication bug',
  prompt: 'Find and fix the bug in the login component',
  type: 'debug'
});

// Listen for task updates
api.on('task:completed', (data) => {
  console.log('Task completed:', data);
});
```

### Python
```python
from async_coder import AsyncCoderAPI

api = AsyncCoderAPI(
    base_url='http://localhost:3001',
    token='your-jwt-token'
)

# Create a task
task = api.tasks.create(
    repository_id='repo-uuid',
    ai_model_id='model-uuid',
    title='Fix authentication bug',
    prompt='Find and fix the bug in the login component',
    type='debug'
)
```

## Deployment

### Environment Variables
See `.env.example` for required environment variables.

### Docker
```bash
docker build -t async-coder-api .
docker run -p 3001:3001 async-coder-api
```

### Health Monitoring
Monitor the `/health` endpoint for service status.
