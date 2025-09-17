# Repository and Branch Selection

<cite>
**Referenced Files in This Document**   
- [sidebar-data.json](file://src/json/sidebar-data.json)
- [v0-ai-chat.tsx](file://src/components/ui/v0-ai-chat.tsx)
- [repositories.ts](file://backend/src/db/schema/repositories.ts)
- [repositories.ts](file://backend/src/routes/repositories.ts)
- [github.ts](file://backend/src/utils/github.ts)
- [task-executor.ts](file://backend/src/services/task-executor.ts)
</cite>

## Table of Contents
1. [Introduction](#introduction)
2. [Data Source and Configuration](#data-source-and-configuration)
3. [User Interface Components](#user-interface-components)
4. [Backend Repository Management](#backend-repository-management)
5. [Branch Selection and Integration](#branch-selection-and-integration)
6. [AI Chat Context Integration](#ai-chat-context-integration)
7. [Configuration Options](#configuration-options)
8. [Best Practices](#best-practices)

## Introduction
The Repository and Branch Selection system enables users to choose specific codebases and branches for AI-assisted development tasks within the Async Coder platform. This system integrates frontend selection components with backend repository management to provide context-aware AI interactions. The selection mechanism allows users to work with multiple repositories from different owners, including both public and private repositories, and to specify branches for targeted code analysis and modification.

The system serves as a critical bridge between user intent and AI processing, ensuring that AI operations occur within the correct code context. By selecting repositories and branches, users define the scope of AI operations such as debugging, documentation generation, architecture planning, and pull request reviews.

## Data Source and Configuration
The repository selection interface is powered by data from the sidebar-data.json file, which contains a list of available codebases that users can select from. This static configuration file provides the initial set of repositories displayed in the selection dropdown.

```json
{
  "codebases": [
    {
      "id": "async_coder",
      "name": "async_coder",
      "owner": "pschoudhary-dot",
      "fullName": "pschoudhary-dot/async_coder",
      "description": "The last AI assistant you'll ever need for coding",
      "language": "TypeScript",
      "isPrivate": false,
      "hasNotifications": true,
      "notificationCount": 1
    },
    {
      "id": "image_router",
      "name": "image-router",
      "owner": "pschoudhary-dot",
      "fullName": "pschoudhary-dot/image-router", 
      "description": "Smart image routing and optimization service",
      "language": "Python",
      "isPrivate": false,
      "hasNotifications": true,
      "notificationCount": 1
    }
  ]
}
```

The data structure includes essential repository metadata such as ID, name, owner, full GitHub identifier, description, programming language, and privacy status. This information is used to populate the selection interface with relevant details about each repository.

**Section sources**
- [sidebar-data.json](file://src/json/sidebar-data.json)

## User Interface Components
The repository and branch selection interface is implemented in the v0-ai-chat.tsx component, which renders dropdown selectors for both repositories and branches. The interface follows a progressive disclosure pattern, where the branch selector only appears after a repository has been selected.

``mermaid
flowchart TD
A[Repository Selector Button] --> B{Repository Selected?}
B --> |No| C[Show only Repository Dropdown]
B --> |Yes| D[Show Branch Selector]
D --> E[Fetch Branches from GitHub API]
E --> F[Display Branch Dropdown]
F --> G[User Selects Branch]
G --> H[Update AI Context]
```

The component maintains state for the selected repository and branch using React useState hooks:

```typescript
const [selectedRepo, setSelectedRepo] = useState<string | null>(null);
const [selectedBranch, setSelectedBranch] = useState<string | null>(null);
```

When a user clicks the repository selector, a dropdown appears showing all repositories from the sidebar-data.json file. Selecting a repository updates the state and triggers the appearance of the branch selector. The branch selector initially shows mock data, but in the full implementation, it would be populated with actual branch data from the GitHub API.

**Section sources**
- [v0-ai-chat.tsx](file://src/components/ui/v0-ai-chat.tsx#L200-L296)

## Backend Repository Management
The backend system manages repository data through a comprehensive database schema and API endpoints. The repositories table in the database stores detailed information about each repository, including GitHub identifiers, metadata, and access controls.

``mermaid
erDiagram
REPOSITORIES {
uuid id PK
integer githubId UK
string name
string fullName UK
text description
boolean isPrivate
string defaultBranch
string language
string url
string cloneUrl
uuid ownerId FK
boolean isActive
timestamp createdAt
timestamp updatedAt
}
USERS {
uuid id PK
string githubId UK
string email UK
string name
}
USER_REPOSITORY_ACCESS {
uuid id PK
uuid userId FK
uuid repositoryId FK
string accessLevel
boolean isCollaborator
timestamp addedAt
}
REPOSITORIES ||--o{ USER_REPOSITORY_ACCESS : "has access"
REPOSITORIES ||--|| USERS : "owned by"
USERS ||--o{ USER_REPOSITORY_ACCESS : "has access to"
```

The database schema includes relationships between repositories and users, allowing for fine-grained access control. The userRepositoryAccess table manages permissions for users who are not owners of a repository.

**Diagram sources**
- [repositories.ts](file://backend/src/db/schema/repositories.ts#L0-L34)

**Section sources**
- [repositories.ts](file://backend/src/db/schema/repositories.ts#L0-L86)

## Branch Selection and Integration
Branch selection is tightly integrated with GitHub's API to ensure that users can work with the most up-to-date branch information. When a repository is selected, the system fetches the current list of branches from GitHub.

The backend provides an endpoint to retrieve repository branches:

``mermaid
sequenceDiagram
participant Frontend
participant Backend
participant GitHub
Frontend->>Backend : GET /repositories/{id}/branches
Backend->>Backend : Verify user access
Backend->>GitHub : Fetch branches via GitHub API
GitHub-->>Backend : Return branch list
Backend-->>Frontend : Return branches
Frontend->>Frontend : Update branch selector UI
```

The implementation in repositories.ts handles branch retrieval:

```typescript
fastify.get('/:repositoryId/branches', async (request, reply) => {
  // Get repository and verify access
  const repository = await db.query.repositories.findFirst({
    where: eq(repositories.id, repositoryId),
  });

  // Check access
  const hasAccess = isOwner || repository.userAccess.length > 0;
  
  if (!hasAccess) {
    return reply.status(403).send({ error: 'Access denied' });
  }

  // Fetch branches from GitHub
  const github = new GitHubService(accessToken);
  const [owner, repo] = repository.fullName.split('/');
  const branches = await github.getRepositoryBranches(owner, repo);

  return reply.send({ branches });
});
```

When a task is executed, the selected branch is used to clone the repository:

```typescript
private static async cloneRepository(task: Task & { repository: any }, workspaceId: string): Promise<void> {
  const cloneUrl = task.repository.cloneUrl.replace(
    'https://github.com/',
    `https://${accessToken}@github.com/`
  );

  const git = spawn('git', ['clone', '-b', task.branch, cloneUrl, repoPath]);
}
```

**Diagram sources**
- [repositories.ts](file://backend/src/routes/repositories.ts#L400-L460)
- [github.ts](file://backend/src/utils/github.ts#L14-L403)
- [task-executor.ts](file://backend/src/services/task-executor.ts#L140-L200)

**Section sources**
- [repositories.ts](file://backend/src/routes/repositories.ts#L400-L460)
- [github.ts](file://backend/src/utils/github.ts#L14-L403)
- [task-executor.ts](file://backend/src/services/task-executor.ts#L140-L200)

## AI Chat Context Integration
The repository and branch selection system integrates with the AI chat context to ensure that all AI operations are performed on the correct codebase and branch. When a user selects a repository and branch, this context is passed to AI tasks.

The integration occurs in the task execution pipeline:

``mermaid
flowchart TD
A[User Selects Repository] --> B[User Selects Branch]
B --> C[Context Stored in State]
C --> D[AI Task Initiated]
D --> E[Task Includes Repository/Branch Context]
E --> F[Workspace Created]
F --> G[Repository Cloned on Selected Branch]
G --> H[AI Processes Code in Context]
H --> I[Results Returned to User]
```

The AI task executor uses the selected repository and branch information to clone the correct codebase:

```typescript
private static async cloneRepository(task: Task & { repository: any }, workspaceId: string): Promise<void> {
  // Clone repository using git command
  const git = spawn('git', ['clone', '-b', task.branch, cloneUrl, repoPath]);
}
```

The context is also passed to the AI provider to ensure that prompts and responses are aware of the selected repository:

```typescript
const aiResult = await AIProviderService.executeTask(task.aiModel.name, {
  type: task.type,
  prompt: task.prompt,
  context,
  repository: task.repository,
  branch: task.branch,
});
```

**Section sources**
- [task-executor.ts](file://backend/src/services/task-executor.ts#L140-L339)

## Configuration Options
The repository and branch selection system offers several configuration options to customize its behavior:

### Frontend Configuration
The sidebar-data.json file allows configuration of the initial repository list:

```json
{
  "codebases": [
    {
      "id": "async_coder",
      "name": "async_coder",
      "owner": "pschoudhary-dot",
      "fullName": "pschoudhary-dot/async_coder",
      "description": "The last AI assistant you'll ever need for coding",
      "language": "TypeScript",
      "isPrivate": false,
      "hasNotifications": true,
      "notificationCount": 1
    }
  ],
  "dailyTaskLimit": {
    "current": 0,
    "maximum": 15
  }
}
```

### Backend Configuration
The system can be configured through environment variables and database settings:

- **GitHub Integration**: The system requires GitHub OAuth credentials to access repositories
- **Rate Limiting**: API endpoints are protected by rate limiting to prevent abuse
- **Access Control**: Repository access is controlled through the userRepositoryAccess table
- **Sync Settings**: Users can sync their GitHub repositories to update the local repository list

The repository sync endpoint allows users to refresh their repository list from GitHub:

```typescript
fastify.post('/sync', async (request, reply) => {
  // Fetch repositories from GitHub
  const githubRepos = await github.getUserRepositories({
    type: 'all',
    sort: 'updated',
    per_page: 100,
  });
});
```

**Section sources**
- [sidebar-data.json](file://src/json/sidebar-data.json)
- [repositories.ts](file://backend/src/routes/repositories.ts#L200-L400)

## Best Practices
To effectively manage codebase references and ensure optimal performance, follow these best practices:

### Repository Selection Best Practices
1. **Keep Repository List Curated**: Regularly sync repositories to remove inactive projects
2. **Organize by Project Type**: Group repositories by functionality or client for easier navigation
3. **Use Descriptive Names**: Ensure repository names clearly indicate their purpose
4. **Limit Active Repositories**: Only keep frequently used repositories in the active list

### Branch Management Guidelines
1. **Select Specific Branches**: Always select the specific branch you're working on rather than relying on defaults
2. **Update Branch List Regularly**: Refresh branch information when switching between development phases
3. **Use Feature Branches**: Work on feature branches rather than main branches for AI-assisted development
4. **Verify Branch Status**: Ensure the selected branch is up-to-date before initiating AI tasks

### Performance Optimization
1. **Minimize Repository Size**: For large repositories, consider using shallow clones
2. **Cache Frequently Used Repositories**: Implement caching for repositories that are accessed regularly
3. **Limit Concurrent Operations**: Avoid running multiple AI tasks on the same repository simultaneously
4. **Monitor API Usage**: Track GitHub API usage to stay within rate limits

### Security Considerations
1. **Protect Access Tokens**: Ensure GitHub access tokens are securely stored and transmitted
2. **Validate Repository Access**: Always verify user permissions before allowing repository access
3. **Sanitize Input**: Validate repository and branch names to prevent injection attacks
4. **Implement Proper Error Handling**: Gracefully handle cases where repositories cannot be accessed

Following these best practices will ensure a smooth and secure experience when using the Repository and Branch Selection system for AI-assisted development tasks.