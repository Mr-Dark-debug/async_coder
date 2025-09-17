# Authentication Integration

<cite>
**Referenced Files in This Document**   
- [auth.ts](file://backend\src\config\auth.ts) - *Updated to use Clerk and JWT-based authentication*
- [auth.ts](file://backend\src\routes\auth.ts) - *Modified to support GitHub and Google OAuth via Clerk*
- [index.ts](file://backend\src\types\index.ts) - *Contains AuthenticatedUser and JWTPayload type definitions*
</cite>

## Update Summary
**Changes Made**   
- Updated authentication system from NextAuth.js to Clerk-based OAuth with JWT
- Added support for both GitHub and Google OAuth providers through Clerk
- Replaced outdated NextAuth endpoints with new RESTful API routes
- Updated session management from cookies to JWT tokens stored in memory and Redis
- Removed obsolete environment variables and added new ones for Clerk integration
- Revised request/response flow to reflect new authentication architecture
- Updated client-side integration to use Clerk's authentication flow

## Table of Contents
1. [Authentication Integration](#authentication-integration)
2. [Supported Authentication Endpoints](#supported-authentication-endpoints)
3. [GitHub and Google OAuth Configuration](#github-and-google-oauth-configuration)
4. [Request/Response Flow](#requestresponse-flow)
5. [Session and JWT Management](#session-and-jwt-management)
6. [Environment Variables](#environment-variables)
7. [Security Considerations](#security-considerations)
8. [Client-Side Authentication State](#client-side-authentication-state)
9. [Sample curl Requests](#sample-curl-requests)
10. [Common Issues and Troubleshooting](#common-issues-and-troubleshooting)

## Supported Authentication Endpoints

The authentication system now uses Clerk for OAuth management with custom backend endpoints for token handling and session management. These RESTful endpoints are implemented in Fastify and handle authentication flows for both GitHub and Google OAuth.

**Available Endpoints:**
- `POST /api/auth/login` – Authenticates user with Clerk token and returns JWT
- `POST /api/auth/refresh` – Refreshes expired JWT token using refresh token
- `POST /api/auth/logout` – Logs out user and clears session
- `POST /api/auth/github/connect` – Connects GitHub account to existing user
- `POST /api/auth/webhooks/clerk` – Handles Clerk webhook events for user lifecycle

These endpoints are explicitly defined in the Fastify route configuration and require proper authentication headers for access.

**Section sources**
- [auth.ts](file://backend\src\routes\auth.ts#L43-L386) - *Implementation of authentication routes*

## GitHub and Google OAuth Configuration

The application uses Clerk as the authentication provider to support both GitHub and Google OAuth. The configuration is centralized in the `AuthService` class within the auth configuration file.

```ts
import { createClerkClient } from '@clerk/backend';

const clerkSecretKey = process.env.CLERK_SECRET_KEY;
const clerkPublishableKey = process.env.CLERK_PUBLISHABLE_KEY;

export const clerkClient = createClerkClient({
  secretKey: clerkSecretKey,
  publishableKey: clerkPublishableKey,
});
```

Clerk handles the OAuth flow for both providers, including:
- **Google OAuth**: Configured through Clerk dashboard with Google Cloud credentials
- **GitHub OAuth**: Configured through Clerk dashboard with GitHub App credentials
- **Unified authentication**: Both providers return a Clerk session token that is exchanged for a JWT

The authentication flow begins on the frontend with Clerk's authentication components, which redirect to the appropriate OAuth provider and return a session token upon successful authentication.

**Section sources**
- [auth.ts](file://backend\src\config\auth.ts#L1-L40) - *Clerk client initialization*
- [auth.ts](file://backend\src\routes\auth.ts#L43-L80) - *Login endpoint implementation*

## Request/Response Flow

The authentication flow follows the OAuth 2.0 authorization code grant pattern with Clerk as the identity provider. Below is the sequence of events during a successful login:

``mermaid
sequenceDiagram
participant User as "User Browser"
participant App as "Next.js Application"
participant Clerk as "Clerk Auth"
participant GitHub as "GitHub OAuth"
User->>App : Navigate to sign-in page
App->>Clerk : Initiate sign-in with provider
Clerk->>User : Redirect to GitHub/Google login
User->>GitHub : Enter credentials & consent
GitHub->>Clerk : Redirect with authorization code
Clerk->>Clerk : Exchange code for tokens
Clerk->>App : Return Clerk session token
App->>App : Send token to /api/auth/login
App->>Backend : POST /api/auth/login with clerkToken
Backend->>Clerk : Verify Clerk token
Clerk-->>Backend : Return user data
Backend->>Backend : Generate JWT and refresh tokens
Backend->>App : Return JWT, refresh token, and user data
App->>User : Store tokens and redirect to dashboard
```

**Section sources**
- [auth.ts](file://backend\src\routes\auth.ts#L43-L80) - *Login endpoint implementation*
- [auth.ts](file://backend\src\config\auth.ts#L50-L85) - *Token generation methods*

## Session and JWT Management

The system uses JSON Web Tokens (JWT) for stateless session management. After successful authentication, the backend generates both access and refresh tokens.

**Session Flow:**
1. After successful authentication, the backend generates a JWT containing user information
2. The JWT is signed using the `JWT_SECRET`
3. The token is returned in the response body (not stored in cookies)
4. On subsequent requests, the client sends the JWT in the Authorization header as a Bearer token
5. The backend verifies the JWT signature and expiration
6. Valid tokens expose user data through the request object in protected routes

**Example Successful Authentication Response (JSON):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_123",
      "email": "john.doe@example.com",
      "username": "johndoe",
      "displayName": "John Doe",
      "avatarUrl": "https://github.com/johndoe.png",
      "credits": 100,
      "subscriptionTier": "pro",
      "isGithubConnected": true
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.x.x",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.y.y",
    "sessionId": "sess_12345"
  }
}
```

**Example Failed Authentication Response (JSON):**
```json
{
  "success": false,
  "error": {
    "code": "INVALID_CLERK_TOKEN",
    "message": "Invalid Clerk session token"
  }
}
```

Access tokens typically expire after 7 days, while refresh tokens expire after 30 days.

**Section sources**
- [auth.ts](file://backend\src\config\auth.ts#L50-L85) - *JWT generation and verification*
- [auth.ts](file://backend\src\routes\auth.ts#L43-L80) - *Login response structure*

## Environment Variables

The following environment variables must be configured for authentication to work:

**Required Environment Variables:**
- `CLERK_SECRET_KEY`: Clerk's secret key for server-side operations
- `CLERK_PUBLISHABLE_KEY`: Clerk's publishable key for client-side operations
- `JWT_SECRET`: Secret key for signing JWT tokens (should be a long, random string)

These variables should be added to a `.env.local` file in the project root:

```env
CLERK_SECRET_KEY=your_clerk_secret_key
CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
JWT_SECRET=your_strong_random_jwt_secret_here
JWT_EXPIRES_IN=7d
JWT_REFRESH_EXPIRES_IN=30d
```

**Section sources**
- [auth.ts](file://backend\src\config\auth.ts#L1-L30) - *Environment variable declarations and validation*

## Security Considerations

**Critical Security Practices:**
- **Never commit secrets**: Ensure `.env.local` is in `.gitignore`
- **Use strong secrets**: Generate `JWT_SECRET` using cryptographically secure methods
- **HTTPS in production**: Always use HTTPS to prevent token interception
- **Token validation**: All requests validate JWT tokens using `authMiddleware`
- **Rate limiting**: Implemented on authentication endpoints to prevent brute force attacks
- **Token expiration**: Access tokens expire after 7 days, refresh tokens after 30 days
- **Secure token storage**: Client applications should store tokens securely (e.g., in memory or secure storage)

The use of Bearer tokens in the Authorization header follows industry standards for API authentication.

## Client-Side Authentication State

The application uses Clerk's frontend components to manage authentication state. After obtaining a Clerk session token, the client exchanges it with the backend for a JWT.

```tsx
// Example of client-side authentication flow
const handleLogin = async () => {
  const { sessionId } = await Clerk.loadSession();
  if (sessionId) {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ clerkToken: sessionId }),
    });
    const data = await response.json();
    // Store JWT and update application state
    setAuthState(data);
  }
};
```

Protected routes use the JWT in the Authorization header:

```tsx
const fetchUserData = async () => {
  const response = await fetch('/api/users/me', {
    headers: { 
      'Authorization': `Bearer ${jwtToken}`,
      'Content-Type': 'application/json'
    },
  });
  return response.json();
};
```

**Section sources**
- [auth.ts](file://backend\src\routes\auth.ts#L43-L80) - *Login endpoint*
- [auth.ts](file://backend\src\middleware\auth.ts#L1-L160) - *Authentication middleware*

## Sample curl Requests

**Login with Clerk Token:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"clerkToken": "clerk_session_token_here"}'
```

**Refresh Token:**
```bash
curl -X POST http://localhost:3000/api/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{"refreshToken": "refresh_token_here"}'
```

**Connect GitHub Account:**
```bash
curl -X POST http://localhost:3000/api/auth/github/connect \
  -H "Authorization: Bearer jwt_token_here" \
  -H "Content-Type: application/json" \
  -d '{"code": "github_oauth_code_here"}'
```

**Logout:**
```bash
curl -X POST http://localhost:3000/api/auth/logout \
  -H "Authorization: Bearer jwt_token_here" \
  -H "Content-Type: application/json"
```

## Common Issues and Troubleshooting

**1. Invalid Clerk Token**
- **Symptom**: "Invalid Clerk session token" error
- **Solution**: Verify `CLERK_SECRET_KEY` value and ensure the token is valid and not expired

**2. JWT Secret Mismatch**
- **Symptom**: "Invalid token" error during verification
- **Solution**: Ensure `JWT_SECRET` is consistent across all instances and deployments

**3. Token Expiration**
- **Symptom**: "Token has expired" error after period of inactivity
- **Solution**: Implement token refresh logic using the refresh endpoint

**4. GitHub Connection Failure**
- **Symptom**: "Failed to connect GitHub account" error
- **Solution**: Verify GitHub OAuth app configuration in Clerk dashboard and check rate limits

**5. Production Deployment Issues**
- **Symptom**: Authentication works locally but fails in production
- **Solution**: Ensure environment variables are properly set in production environment and use HTTPS

**Section sources**
- [auth.ts](file://backend\src\routes\auth.ts#L43-L386) - *All authentication route implementations*
- [auth.ts](file://backend\src\config\auth.ts#L1-L240) - *Authentication service and configuration*
- [index.ts](file://backend\src\types\index.ts#L240-L262) - *AuthenticatedUser and JWTPayload type definitions*