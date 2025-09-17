# Configurable Action Buttons

<cite>
**Referenced Files in This Document**   
- [action-config.json](file://src/json/action-config.json)
- [v0-ai-chat.tsx](file://src/components/ui/v0-ai-chat.tsx)
- [ai-provider.ts](file://backend/src/services/ai-provider.ts)
- [README.md](file://README.md)
</cite>

## Table of Contents
1. [Introduction](#introduction)
2. [Configuration Structure](#configuration-structure)
3. [Frontend Implementation](#frontend-implementation)
4. [Backend Integration](#backend-integration)
5. [Action Types and AI Task Mapping](#action-types-and-ai-task-mapping)
6. [Customization Options](#customization-options)
7. [Adding New Action Types](#adding-new-action-types)
8. [Prompt Engineering Best Practices](#prompt-engineering-best-practices)
9. [System Architecture](#system-architecture)

## Introduction
The Configurable Action Buttons system is a core feature of Async Coder that provides users with quick access to specialized AI coding assistance modes. These buttons streamline the development workflow by offering pre-configured prompts for common development tasks such as debugging, documentation generation, and code review.

The system is designed to be highly configurable, allowing both end-users and developers to customize the available actions. Each action button corresponds to a specific AI task type and provides a default prompt that sets the context for the AI assistant. When a user clicks an action button, the corresponding default prompt is loaded into the input field, ready for customization and submission.

This documentation provides a comprehensive overview of the Configurable Action Buttons system, covering its configuration structure, implementation details, integration with AI tasks, and customization options. It also includes guidance on adding new action types and best practices for prompt engineering to maximize the effectiveness of the AI assistant.

## Configuration Structure
The Configurable Action Buttons system is primarily configured through the action-config.json file, which defines all available action buttons, quick start prompts, and AI backends. This centralized configuration enables easy customization and extension of the system without requiring code changes.

```json
{
  "actionButtons": [
    {
      "id": "debug_mode",
      "label": "Debug Code",
      "icon": "Bug",
      "defaultPrompt": "I need help debugging my code. Can you analyze the following code and help me identify and fix any issues?",
      "description": "Automatically detects bugs, generates fixes, and adds intelligent logging"
    },
    {
      "id": "ask_mode",
      "label": "Ask Question",
      "icon": "HelpCircle",
      "defaultPrompt": "I have a question about my codebase. Can you help me understand how to implement or optimize the following?",
      "description": "Ask anything about your codebase with context-aware analysis"
    }
  ],
  "quickStartPrompts": [
    {
      "category": "Project Setup",
      "prompts": [
        "Generate a FastAPI boilerplate with authentication",
        "Create a Next.js project with TypeScript and Tailwind CSS"
      ]
    }
  ],
  "aiBackends": [
    {
      "name": "Claude Code",
      "provider": "Anthropic",
      "description": "Advanced reasoning and code generation"
    }
  ],
  "version": "1.0.0",
  "lastUpdated": "2025-01-25"
}
```

The configuration structure consists of three main sections:

**actionButtons**: Defines the available action buttons with the following properties:
- **id**: Unique identifier for the action
- **label**: Display text for the button
- **icon**: Icon name from Lucide React library
- **defaultPrompt**: Pre-configured prompt that loads when the button is clicked
- **description**: Tooltip text that appears on hover

**quickStartPrompts**: Provides categorized prompts for common development scenarios, organized by category with multiple prompt suggestions per category.

**aiBackends**: Lists the available AI backend providers with their names, providers, and descriptions.

**Section sources**
- [action-config.json](file://src/json/action-config.json)

## Frontend Implementation
The frontend implementation of the Configurable Action Buttons system is located in the v0-ai-chat.tsx component, which renders the action buttons and handles user interactions. The system uses a data-driven approach, dynamically rendering buttons based on the configuration in action-config.json.

``mermaid
flowchart TD
A[Import Configuration] --> B[Map Action Buttons]
B --> C[Render ActionButton Components]
C --> D[Handle Click Events]
D --> E[Set Default Prompt]
E --> F[Adjust Textarea Height]
style A fill:#f9f,stroke:#333
style B fill:#f9f,stroke:#333
style C fill:#f9f,stroke:#333
style D fill:#f9f,stroke:#333
style E fill:#f9f,stroke:#333
style F fill:#f9f,stroke:#333
```

**Diagram sources**
- [v0-ai-chat.tsx](file://src/components/ui/v0-ai-chat.tsx)

The implementation follows these key steps:

1. **Configuration Import**: The component imports the action configuration from action-config.json at the module level.

2. **Button Rendering**: The component maps over the actionButtons array to dynamically render ActionButton components:
```typescript
{actionConfig.actionButtons.map((action) => (
    <ActionButton
        key={action.id}
        icon={getIcon(action.icon)}
        label={action.label}
        onClick={() => handleActionClick(action.id)}
        description={action.description}
    />
))}
```

3. **Icon Management**: The getIcon function maps icon names to Lucide React components:
```typescript
const getIcon = (iconName: string) => {
    const iconMap: Record<string, React.ReactNode> = {
        Bug: <Bug className="w-4 h-4" />,
        HelpCircle: <HelpCircle className="w-4 h-4" />,
        FileText: <FileText className="w-4 h-4" />,
        Layers: <Layers className="w-4 h-4" />,
        GitPullRequest: <GitPullRequest className="w-4 h-4" />,
    };
    return iconMap[iconName] || <HelpCircle className="w-4 h-4" />;
};
```

4. **Event Handling**: The handleActionClick function processes button clicks by finding the corresponding action and setting its default prompt in the textarea:
```typescript
const handleActionClick = (actionId: string) => {
    const action = actionConfig.actionButtons.find(btn => btn.id === actionId);
    if (action) {
        setValue(action.defaultPrompt);
        setTimeout(() => adjustHeight(), 0);
    }
};
```

The ActionButton component itself is a reusable UI element that displays the button with its icon, label, and tooltip description. It uses Tailwind CSS for styling with hover effects and responsive design.

**Section sources**
- [v0-ai-chat.tsx](file://src/components/ui/v0-ai-chat.tsx)

## Backend Integration
The Configurable Action Buttons system integrates with the backend AI provider service through a well-defined interface that maps frontend actions to backend AI tasks. This integration enables the system to execute complex AI operations based on user interactions with the action buttons.

``mermaid
sequenceDiagram
participant Frontend
participant Backend
participant AIProvider
Frontend->>Backend : Execute AI Task (type, prompt, context)
Backend->>AIProvider : Route to appropriate provider
AIProvider->>AIProvider : Build system prompt based on task type
AIProvider->>AIProvider : Execute task with AI model
AIProvider-->>Backend : Return AI response
Backend-->>Frontend : Return processed result
Note over Frontend,Backend : Action button click triggers AI task execution
```

**Diagram sources**
- [ai-provider.ts](file://backend/src/services/ai-provider.ts)
- [v0-ai-chat.tsx](file://src/components/ui/v0-ai-chat.tsx)

The integration process involves several key components:

1. **Task Request Interface**: The backend defines a standardized interface for AI task requests:
```typescript
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
```

2. **AI Provider Service**: The AIProviderService class manages multiple AI providers and routes requests to the appropriate backend:
```typescript
static async executeTask(modelName: string, request: AITaskRequest): Promise<AITaskResponse>
```

3. **System Prompt Generation**: Each AI provider builds a system prompt based on the task type, providing context-specific instructions to the AI model:
```typescript
private buildSystemPrompt(taskType: string): string {
    const prompts = {
        debug: 'You are an expert software engineer. Analyze the provided code and identify bugs, then provide fixes with clear explanations.',
        ask: 'You are a helpful coding assistant. Answer the user\'s question about the codebase with detailed explanations and examples.',
        // ... other task types
    };
    return prompts[taskType] || prompts.ask;
}
```

4. **Task Type Mapping**: The system maps action button IDs to AI task types, with the following correspondences:
- debug_mode → debug
- ask_mode → ask
- documentation_mode → documentation
- architect_mode → architect
- pr_review_mode → pr_review

When a user clicks an action button, the frontend sends a task request to the backend with the appropriate task type and prompt. The backend then processes this request through the AI provider service, which selects the appropriate AI model, constructs the system prompt, and executes the task.

**Section sources**
- [ai-provider.ts](file://backend/src/services/ai-provider.ts)

## Action Types and AI Task Mapping
The Configurable Action Buttons system supports multiple action types, each mapped to a specific AI task with specialized system prompts and capabilities. This mapping ensures that the AI assistant provides contextually appropriate responses based on the selected action.

``mermaid
classDiagram
class ActionButton {
+id : string
+label : string
+icon : string
+defaultPrompt : string
+description : string
}
class TaskType {
+name : string
+systemPrompt : string
+capabilities : string[]
}
class AIProvider {
+executeTask(request : AITaskRequest)
+buildSystemPrompt(taskType : string)
}
ActionButton --> TaskType : "maps to"
TaskType --> AIProvider : "uses"
class DebugTask {
+systemPrompt : "You are an expert software engineer..."
+capabilities : ["bug detection", "code fixes", "logging"]
}
class AskTask {
+systemPrompt : "You are a helpful coding assistant..."
+capabilities : ["code explanation", "examples", "best practices"]
}
class DocumentationTask {
+systemPrompt : "You are a technical writer..."
+capabilities : ["inline comments", "API references", "usage examples"]
}
class ArchitectTask {
+systemPrompt : "You are a software architect..."
+capabilities : ["scalability", "best practices", "roadmaps"]
}
class PRReviewTask {
+systemPrompt : "You are a senior developer conducting a code review..."
+capabilities : ["code quality", "best practices", "test suggestions"]
}
TaskType <|-- DebugTask
TaskType <|-- AskTask
TaskType <|-- DocumentationTask
TaskType <|-- ArchitectTask
TaskType <|-- PRReviewTask
```

**Diagram sources**
- [action-config.json](file://src/json/action-config.json)
- [ai-provider.ts](file://backend/src/services/ai-provider.ts)

The system currently supports the following action types:

**Debug Mode (debug_mode)**
- **Purpose**: Code debugging and issue resolution
- **System Prompt**: "You are an expert software engineer. Analyze the provided code and identify bugs, then provide fixes with clear explanations."
- **Capabilities**: Bug detection, code fixes, intelligent logging, error analysis
- **Use Cases**: Identifying syntax errors, fixing logical bugs, optimizing performance issues

**Ask Mode (ask_mode)**
- **Purpose**: Codebase questions and explanations
- **System Prompt**: "You are a helpful coding assistant. Answer the user's question about the codebase with detailed explanations and examples."
- **Capabilities**: Code explanation, concept clarification, best practice recommendations
- **Use Cases**: Understanding complex code, learning new frameworks, optimizing implementations

**Documentation Mode (documentation_mode)**
- **Purpose**: Code documentation generation
- **System Prompt**: "You are a technical writer. Generate comprehensive documentation for the provided code, including usage examples."
- **Capabilities**: Inline comments, API references, usage examples, README generation
- **Use Cases**: Documenting functions and classes, creating API documentation, generating project READMEs

**Architecture Planning Mode (architect_mode)**
- **Purpose**: System design and technical planning
- **System Prompt**: "You are a software architect. Analyze the codebase structure and provide architectural recommendations and improvements."
- **Capabilities**: Scalability analysis, best practice recommendations, technical roadmaps
- **Use Cases**: Designing microservices architectures, planning database schemas, creating technical roadmaps

**PR Review Mode (pr_review_mode)**
- **Purpose**: Code review and feedback
- **System Prompt**: "You are a senior developer conducting a code review. Provide constructive feedback on code quality, best practices, and potential issues."
- **Capabilities**: Code quality assessment, best practice recommendations, test suggestions
- **Use Cases**: Reviewing pull requests, identifying code smells, suggesting improvements

Each action type is configured with a specific system prompt that guides the AI model's behavior and response style. The system prompts are designed to establish the appropriate role and context for the AI assistant, ensuring consistent and high-quality responses.

**Section sources**
- [action-config.json](file://src/json/action-config.json)
- [ai-provider.ts](file://backend/src/services/ai-provider.ts)

## Customization Options
The Configurable Action Buttons system offers extensive customization options that allow users and developers to tailor the interface and functionality to their specific needs. These options range from simple configuration changes to advanced system extensions.

### Configuration-Level Customization
Users can customize the action buttons by modifying the action-config.json file. This approach allows for easy changes without requiring code modifications:

**Adding or Modifying Action Buttons**
```json
{
  "actionButtons": [
    {
      "id": "new_custom_action",
      "label": "Custom Task",
      "icon": "CustomIcon",
      "defaultPrompt": "Perform a custom task with specific requirements...",
      "description": "Description of the custom task"
    }
  ]
}
```

**Updating Quick Start Prompts**
```json
{
  "quickStartPrompts": [
    {
      "category": "New Category",
      "prompts": [
        "New prompt suggestion 1",
        "New prompt suggestion 2"
      ]
    }
  ]
}
```

### Frontend Customization
Developers can extend the system by modifying the v0-ai-chat.tsx component or creating new components that leverage the same configuration system.

**Styling Customization**
The action buttons use Tailwind CSS classes that can be easily modified:
```typescript
className="flex items-center gap-2 px-4 py-2 bg-neutral-900 hover:bg-neutral-800 rounded-full border border-neutral-800 text-neutral-400 hover:text-white transition-colors group relative"
```

**Icon Support**
The system supports all Lucide React icons. To add a new icon, import it in the component:
```typescript
import { NewIcon } from "lucide-react";
```

Then add it to the icon map in the getIcon function:
```typescript
const iconMap: Record<string, React.ReactNode> = {
    // existing icons
    NewIcon: <NewIcon className="w-4 h-4" />,
};
```

### Backend Integration Customization
The AI provider system can be extended to support new AI models and backends:

**Adding New AI Providers**
```typescript
// In ai-provider.ts
class CustomAIProvider extends AIProvider {
    async executeTask(request: AITaskRequest): Promise<AITaskResponse> {
        // Implementation for custom AI provider
    }
    
    // Other required methods
}

// Register the provider in initialize()
this.providers.set('custom-model', new CustomAIProvider({
    apiKey: process.env.CUSTOM_API_KEY,
    model: 'custom-model',
    maxTokens: 4000,
}));
```

**Custom Task Types**
New task types can be added by extending the system prompt mappings:
```typescript
private buildSystemPrompt(taskType: string): string {
    const prompts = {
        // existing task types
        custom_task: 'You are a specialist in custom tasks. Perform the requested custom operation with detailed explanations.',
    };
    return prompts[taskType] || prompts.ask;
}
```

These customization options make the Configurable Action Buttons system highly adaptable to different development workflows and team requirements.

**Section sources**
- [action-config.json](file://src/json/action-config.json)
- [v0-ai-chat.tsx](file://src/components/ui/v0-ai-chat.tsx)
- [ai-provider.ts](file://backend/src/services/ai-provider.ts)

## Adding New Action Types
Adding new action types to the Configurable Action Buttons system involves coordinated changes to both frontend and backend components. This process ensures that new actions are properly integrated with the AI task system and provide a seamless user experience.

### Step 1: Define the Action Configuration
Add the new action to the action-config.json file with appropriate properties:

```json
{
  "actionButtons": [
    {
      "id": "new_action_type",
      "label": "New Action",
      "icon": "AppropriateIcon",
      "defaultPrompt": "Default prompt for the new action type...",
      "description": "Description of what the new action does"
    }
  ]
}
```

Key considerations for configuration:
- Choose a unique and descriptive ID
- Select an appropriate icon from the Lucide React library
- Craft a clear and concise label
- Write a comprehensive default prompt that guides the AI
- Provide a helpful description for the tooltip

### Step 2: Add Icon Support
If using a new icon, import it in the v0-ai-chat.tsx component:

```typescript
import { NewIcon } from "lucide-react";
```

Add the icon to the icon mapping function:

```typescript
const getIcon = (iconName: string) => {
    const iconMap: Record<string, React.ReactNode> = {
        // existing icons
        NewIcon: <NewIcon className="w-4 h-4" />,
    };
    return iconMap[iconName] || <HelpCircle className="w-4 h-4" />;
};
```

### Step 3: Implement Backend Support
Add the new task type to the AI provider system in ai-provider.ts:

```typescript
private buildSystemPrompt(taskType: string): string {
    const prompts = {
        // existing task types
        new_action_type: 'You are a specialist in [domain]. Perform the requested task with detailed explanations and examples.',
    };
    return prompts[taskType] || prompts.ask;
}
```

For more complex actions, you might need to create a custom AI provider class that extends the base AIProvider class and implements the executeTask method with specialized logic.

### Step 4: Test the New Action
After implementing the changes, test the new action type thoroughly:

1. Verify that the button appears correctly in the UI
2. Check that clicking the button loads the default prompt
3. Test the AI response to ensure it's appropriate for the task
4. Validate that the system handles edge cases gracefully

### Example: Adding a "Code Optimization" Action
```json
{
  "id": "optimization_mode",
  "label": "Optimize Code",
  "icon": "Zap",
  "defaultPrompt": "Analyze the following code and suggest performance optimizations, memory improvements, and best practice enhancements.",
  "description": "Optimizes code for performance, memory usage, and best practices"
}
```

Corresponding backend implementation:
```typescript
private buildSystemPrompt(taskType: string): string {
    const prompts = {
        // existing task types
        optimization_mode: 'You are a performance optimization expert. Analyze the provided code for performance bottlenecks, memory usage issues, and best practice violations. Provide specific optimization suggestions with code examples.',
    };
    return prompts[taskType] || prompts.ask;
}
```

This systematic approach ensures that new action types are properly integrated and provide value to users.

**Section sources**
- [action-config.json](file://src/json/action-config.json)
- [v0-ai-chat.tsx](file://src/components/ui/v0-ai-chat.tsx)
- [ai-provider.ts](file://backend/src/services/ai-provider.ts)

## Prompt Engineering Best Practices
Effective prompt engineering is crucial for maximizing the value of the Configurable Action Buttons system. Well-crafted prompts guide the AI assistant to provide more accurate, relevant, and useful responses. This section outlines best practices for creating and using prompts within the system.

### Principles of Effective Prompts
1. **Be Specific**: Clearly define the task and expected output format
2. **Provide Context**: Include relevant information about the codebase or problem
3. **Set Constraints**: Specify limitations such as code length, performance requirements, or compatibility needs
4. **Define the Role**: Establish the AI's role (e.g., senior developer, architect, reviewer)
5. **Include Examples**: When possible, provide examples of desired output

### Default Prompt Guidelines
When creating default prompts for action buttons, follow these guidelines:

**Clarity and Focus**
- Start with a clear action verb (e.g., "Analyze", "Generate", "Review")
- Specify the exact task to be performed
- Avoid ambiguous language

**Example of a Well-Structured Prompt**
```
"Review the following code and identify potential security vulnerabilities. For each vulnerability, provide:
1. A description of the issue
2. The potential impact
3. A code example showing how to fix it
4. References to relevant security best practices"
```

**Context Provision**
Include placeholders or instructions for providing context:
```
"Analyze the following code from a [framework] application. Consider the specific requirements of this framework when providing recommendations."
```

### Advanced Prompt Engineering Techniques
**Chain-of-Thought Prompting**
Guide the AI through a logical reasoning process:
```
"First, analyze the code structure. Then, identify potential performance bottlenecks. Next, suggest specific optimizations with code examples. Finally, explain the expected performance improvement."
```

**Few-Shot Learning**
Provide examples of desired output format:
```
"Format your response as follows:
Issue: [description]
Impact: [severity level]
Solution: [code example]
Best Practice: [reference]"
```

**Constraint-Based Prompting**
Set specific requirements:
```
"Suggest optimizations that reduce memory usage by at least 30% without compromising code readability. Provide before and after code examples."
```

### Common Prompt Anti-Patterns to Avoid
- **Vagueness**: "Make this better" or "Improve this code"
- **Over-constraining**: Excessively limiting creativity or solution space
- **Assumption of Knowledge**: Assuming the AI knows project-specific details
- **Contradictory Requirements**: Conflicting constraints or goals

### Customization Tips
When users modify default prompts, encourage them to:
1. Maintain the core structure and intent
2. Add specific context about their codebase
3. Include any project-specific requirements
4. Keep prompts concise but comprehensive

By following these best practices, users can create prompts that elicit high-quality responses from the AI assistant, maximizing the effectiveness of the Configurable Action Buttons system.

**Section sources**
- [action-config.json](file://src/json/action-config.json)
- [README.md](file://README.md)

## System Architecture
The Configurable Action Buttons system is part of a larger architecture that integrates frontend components with backend AI services. This architecture enables seamless interaction between user interface elements and AI processing capabilities.

``mermaid
graph TB
subgraph "Frontend"
A[User Interface]
B[Action Buttons]
C[v0-ai-chat Component]
D[Configuration]
end
subgraph "Backend"
E[API Server]
F[AI Provider Service]
G[AI Models]
H[Database]
end
A --> B
B --> C
C --> D
C --> E
E --> F
F --> G
F --> H
G --> F
F --> E
E --> C
style Frontend fill:#f0f0f0,stroke:#333
style Backend fill:#e0e0e0,stroke:#333
```

**Diagram sources**
- [v0-ai-chat.tsx](file://src/components/ui/v0-ai-chat.tsx)
- [ai-provider.ts](file://backend/src/services/ai-provider.ts)

The architecture consists of several key components:

**Frontend Layer**
- **User Interface**: The main interface where users interact with the system
- **Action Buttons**: Configurable buttons that trigger specific AI tasks
- **v0-ai-chat Component**: The React component that renders the action buttons and handles user interactions
- **Configuration**: The action-config.json file that defines available actions

**Backend Layer**
- **API Server**: Handles requests from the frontend and routes them to appropriate services
- **AI Provider Service**: Manages AI providers and executes AI tasks
- **AI Models**: External AI services (Claude, Gemini, etc.) that process requests
- **Database**: Stores user data, API keys, and other persistent information

The data flow follows this pattern:
1. User clicks an action button in the frontend
2. The v0-ai-chat component loads the default prompt from configuration
3. User submits the prompt (possibly modified)
4. Frontend sends request to API server
5. API server routes request to AI Provider Service
6. AI Provider Service selects appropriate AI model and constructs system prompt
7. AI model processes the request and returns response
8. Response is sent back through the API server to the frontend
9. Frontend displays the AI response to the user

This architecture provides a clean separation of concerns, with the frontend handling user interaction and the backend managing AI processing. The configuration-driven approach allows for easy customization and extension of the system without requiring changes to the core architecture.

**Section sources**
- [v0-ai-chat.tsx](file://src/components/ui/v0-ai-chat.tsx)
- [ai-provider.ts](file://backend/src/services/ai-provider.ts)