# AI Chat Interface

<cite>
**Referenced Files in This Document**   
- [task/page.tsx](file://src/app/task/page.tsx)
- [ui/v0-ai-chat.tsx](file://src/components/ui/v0-ai-chat.tsx)
- [ui/demo.tsx](file://src/components/ui/demo.tsx)
- [ui/ai-voice-input.tsx](file://src/components/ui/ai-voice-input.tsx)
- [settings/settings-navigation.tsx](file://src/components/settings/settings-navigation.tsx)
- [app/task/settings/page.tsx](file://src/app/task/settings/page.tsx)
- [backend/src/services/ai-provider.ts](file://backend/src/services/ai-provider.ts)
- [backend/src/db/schema/ai-models.ts](file://backend/src/db/schema/ai-models.ts)
- [DATABASE_DESIGN.md](file://DATABASE_DESIGN.md)
</cite>

## Table of Contents
1. [Introduction](#introduction)
2. [Project Structure](#project-structure)
3. [Core Components](#core-components)
4. [Architecture Overview](#architecture-overview)
5. [Detailed Component Analysis](#detailed-component-analysis)
6. [User Interaction Patterns](#user-interaction-patterns)
7. [Backend Integration](#backend-integration)
8. [Configuration Options](#configuration-options)
9. [Accessibility Features](#accessibility-features)
10. [Customization and Best Practices](#customization-and-best-practices)

## Introduction
The AI Chat Interface is a web-based application that enables users to interact with multiple AI models through a unified dashboard. The interface provides a conversational experience for software development tasks, supporting various AI backends including Claude, Gemini, and OpenAI. Users can configure their preferred AI models, manage API keys, and interact through both text and voice input methods. The system is designed to support advanced AI modes such as debugging, documentation generation, and architectural planning.

## Project Structure
The project follows a Next.js application structure with separate frontend and backend directories. The AI chat interface is primarily implemented in the frontend components, with integration to backend services for AI model execution.

``mermaid
graph TB
subgraph "Frontend"
A[src/app/task/page.tsx] --> B[src/components/ui/v0-ai-chat.tsx]
A --> C[src/components/ui/demo.tsx]
B --> D[src/components/ui/ai-voice-input.tsx]
C --> E[src/components/settings/settings-navigation.tsx]
end
subgraph "Backend"
F[backend/src/services/ai-provider.ts] --> G[backend/src/db/schema/ai-models.ts]
end
A --> F
B --> F
```

**Diagram sources**
- [src/app/task/page.tsx](file://src/app/task/page.tsx)
- [src/components/ui/v0-ai-chat.tsx](file://src/components/ui/v0-ai-chat.tsx)
- [src/components/ui/demo.tsx](file://src/components/ui/demo.tsx)
- [src/components/ui/ai-voice-input.tsx](file://src/components/ui/ai-voice-input.tsx)
- [backend/src/services/ai-provider.ts](file://backend/src/services/ai-provider.ts)

**Section sources**
- [src/app/task/page.tsx](file://src/app/task/page.tsx)
- [src/components/ui/v0-ai-chat.tsx](file://src/components/ui/v0-ai-chat.tsx)

## Core Components
The AI Chat Interface consists of several core components that work together to provide a seamless user experience. The main entry point is the TaskPage component, which renders the SidebarDemo component containing the VercelV0Chat interface. The VercelV0Chat component provides the primary chat interface with text input and voice capabilities. The AI voice input functionality is implemented as a separate reusable component that can be integrated into the chat interface.

**Section sources**
- [src/app/task/page.tsx](file://src/app/task/page.tsx#L0-L16)
- [src/components/ui/v0-ai-chat.tsx](file://src/components/ui/v0-ai-chat.tsx#L48-L88)
- [src/components/ui/ai-voice-input.tsx](file://src/components/ui/ai-voice-input.tsx#L0-L146)

## Architecture Overview
The AI Chat Interface follows a client-server architecture with a React-based frontend and a Node.js backend. The frontend handles user interactions and displays the chat interface, while the backend manages AI model execution and data persistence.

``mermaid
graph LR
A[User] --> B[Frontend Interface]
B --> C[AI Voice Input]
B --> D[Text Input]
B --> E[Settings Management]
B --> F[Backend API]
F --> G[AI Provider Service]
G --> H[OpenAI]
G --> I[Anthropic]
G --> J[Google AI]
F --> K[Database]
```

**Diagram sources**
- [src/app/task/page.tsx](file://src/app/task/page.tsx)
- [src/components/ui/v0-ai-chat.tsx](file://src/components/ui/v0-ai-chat.tsx)
- [backend/src/services/ai-provider.ts](file://backend/src/services/ai-provider.ts)

## Detailed Component Analysis

### VercelV0Chat Component Analysis
The VercelV0Chat component is the core implementation of the AI chat interface, providing a text-based conversational experience with AI models.

``mermaid
classDiagram
class VercelV0Chat {
+string value
+string selectedRepo
+string selectedBranch
+boolean showRepoDropdown
+boolean showBranchDropdown
+boolean isRecording
+useState() value
+useState() selectedRepo
+useState() selectedBranch
+useState() showRepoDropdown
+useState() showBranchDropdown
+useState() isRecording
+handleKeyPress()
+handleSubmit()
+toggleRecording()
}
class AIVoiceInput {
+boolean submitted
+number time
+boolean isClient
+boolean isDemo
+useEffect() handleAnimation
+useEffect() handleTiming
+formatTime()
+handleClick()
}
VercelV0Chat --> AIVoiceInput : "uses"
```

**Diagram sources**
- [src/components/ui/v0-ai-chat.tsx](file://src/components/ui/v0-ai-chat.tsx#L48-L88)
- [src/components/ui/ai-voice-input.tsx](file://src/components/ui/ai-voice-input.tsx#L0-L146)

**Section sources**
- [src/components/ui/v0-ai-chat.tsx](file://src/components/ui/v0-ai-chat.tsx#L48-L88)
- [src/components/ui/ai-voice-input.tsx](file://src/components/ui/ai-voice-input.tsx#L0-L146)

### Task Page Component Analysis
The TaskPage component serves as the main entry point for the AI chat interface, handling user authentication and rendering the sidebar with the chat interface.

``mermaid
sequenceDiagram
participant User
participant TaskPage
participant Auth
participant SidebarDemo
participant VercelV0Chat
User->>TaskPage : Navigate to /task
TaskPage->>Auth : Check authentication status
Auth-->>TaskPage : Return user ID or null
alt User is authenticated
TaskPage->>SidebarDemo : Render component
SidebarDemo->>VercelV0Chat : Display chat interface
VercelV0Chat-->>User : Show chat interface
else User is not authenticated
TaskPage->>TaskPage : Redirect to /sign-in
TaskPage-->>User : Show sign-in page
end
```

**Diagram sources**
- [src/app/task/page.tsx](file://src/app/task/page.tsx#L0-L16)
- [src/components/ui/demo.tsx](file://src/components/ui/demo.tsx#L0-L42)

**Section sources**
- [src/app/task/page.tsx](file://src/app/task/page.tsx#L0-L16)
- [src/components/ui/demo.tsx](file://src/components/ui/demo.tsx#L0-L42)

## User Interaction Patterns
The AI Chat Interface supports multiple user interaction patterns, including text-based input and voice input. Users can interact with the system through the main dashboard, which provides access to the chat interface and settings. The interface includes a sidebar with navigation to recent tasks and codebases, as well as a settings link for configuration.

The text input component automatically adjusts its height based on the content, providing a seamless typing experience. The voice input feature allows users to speak their queries, with a visualizer that animates during recording. Users can also select repositories and branches from dropdown menus to contextualize their requests.

**Section sources**
- [src/components/ui/v0-ai-chat.tsx](file://src/components/ui/v0-ai-chat.tsx#L48-L88)
- [src/components/ui/ai-voice-input.tsx](file://src/components/ui/ai-voice-input.tsx#L0-L146)
- [src/components/ui/demo.tsx](file://src/components/ui/demo.tsx#L95-L123)

## Backend Integration
The AI Chat Interface integrates with backend services to execute AI tasks and manage user data. The frontend communicates with the backend through API endpoints, which are handled by the AIProviderService.

``mermaid
sequenceDiagram
participant Frontend
participant Backend
participant AIProvider
participant OpenAI
participant Anthropic
participant GoogleAI
Frontend->>Backend : POST /api/ai-task
Backend->>AIProvider : executeTask(modelName, request)
alt Model is OpenAI
AIProvider->>OpenAI : API request
OpenAI-->>AIProvider : Response
else Model is Anthropic
AIProvider->>Anthropic : API request
Anthropic-->>AIProvider : Response
else Model is Google AI
AIProvider->>GoogleAI : API request
GoogleAI-->>AIProvider : Response
end
AIProvider-->>Backend : AITaskResponse
Backend-->>Frontend : Return response
```

**Diagram sources**
- [backend/src/services/ai-provider.ts](file://backend/src/services/ai-provider.ts#L351-L415)
- [src/components/ui/v0-ai-chat.tsx](file://src/components/ui/v0-ai-chat.tsx)

**Section sources**
- [backend/src/services/ai-provider.ts](file://backend/src/services/ai-provider.ts#L351-L415)
- [src/components/ui/v0-ai-chat.tsx](file://src/components/ui/v0-ai-chat.tsx)

## Configuration Options
The AI Chat Interface provides several configuration options through the settings page, allowing users to customize their experience.

### AI Backend Configuration
Users can select their preferred AI backend from the available options:
- Claude Code
- Gemini CLI
- Aider
- Async In-House AI

The backend configuration is managed through the AIProviderService, which initializes providers based on environment variables. The service supports multiple models from different providers, including:

``mermaid
erDiagram
AI_MODELS {
uuid id PK
string name UK
string displayName
string provider
text description
decimal costPerToken
integer maxTokens
jsonb capabilities
boolean isActive
timestamp createdAt
}
```

**Diagram sources**
- [backend/src/db/schema/ai-models.ts](file://backend/src/db/schema/ai-models.ts)
- [DATABASE_DESIGN.md](file://DATABASE_DESIGN.md)
- [src/app/task/settings/page.tsx](file://src/app/task/settings/page.tsx#L38-L66)

### API Key Management
Users can configure API keys for different AI services:
- Claude API Key
- Gemini API Key
- OpenAI API Key

The system validates API keys and handles authentication with the respective services. API keys are stored securely in the database and used to authenticate requests to the AI providers.

**Section sources**
- [src/app/task/settings/page.tsx](file://src/app/task/settings/page.tsx#L63-L92)
- [backend/src/services/ai-provider.ts](file://backend/src/services/ai-provider.ts#L303-L349)

## Accessibility Features
The AI Chat Interface includes several accessibility features to ensure usability for all users:

1. **Keyboard Navigation**: The interface supports full keyboard navigation, allowing users to navigate between components using tab and arrow keys.

2. **Screen Reader Support**: All interactive elements include appropriate ARIA labels and roles for screen reader compatibility.

3. **Voice Input**: The AI voice input component provides an alternative to text-based input, making the interface accessible to users with mobility impairments.

4. **Responsive Design**: The interface is designed to work across different screen sizes and devices.

5. **Color Contrast**: The interface maintains sufficient color contrast for users with visual impairments.

6. **Focus Indicators**: Clear visual focus indicators help users track their position in the interface.

**Section sources**
- [src/components/ui/ai-voice-input.tsx](file://src/components/ui/ai-voice-input.tsx#L0-L146)
- [src/components/ui/demo.tsx](file://src/components/ui/demo.tsx#L176-L205)
- [src/components/settings/settings-navigation.tsx](file://src/components/settings/settings-navigation.tsx#L19-L46)

## Customization and Best Practices

### Theme Customization
The interface supports multiple theme options:
- Auto (System): Follows the user's system preferences
- Light: Light color scheme
- Dark: Dark color scheme

Users can select their preferred theme in the settings page, which applies the chosen theme across the entire interface.

### Best Practices for Customization
1. **API Key Security**: Store API keys securely and avoid committing them to version control.
2. **Model Selection**: Choose AI models based on the specific requirements of your tasks.
3. **Rate Limiting**: Implement appropriate rate limiting to prevent excessive API usage.
4. **Error Handling**: Implement robust error handling for API failures and network issues.
5. **Performance Optimization**: Optimize the interface for fast response times and smooth interactions.

### Extensibility
The system is designed to be extensible, with support for:
- Adding new AI models through the plugin system
- Customizing prompt templates
- Integrating with additional backend services
- Extending the user interface with new components

The roadmap includes plans for a plugin system to easily integrate new AI models and backends, making the interface highly customizable for different use cases.

**Section sources**
- [src/app/task/settings/page.tsx](file://src/app/task/settings/page.tsx#L38-L66)
- [src/components/settings/settings-navigation.tsx](file://src/components/settings/settings-navigation.tsx#L77-L100)
- [src/components/ui/roadmap-timeline.tsx](file://src/components/ui/roadmap-timeline.tsx#L139-L168)
- [src/components/Roadmap.tsx](file://src/components/Roadmap.tsx#L35-L80)