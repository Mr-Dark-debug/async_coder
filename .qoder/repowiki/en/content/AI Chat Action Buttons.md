# AI Chat Action Buttons

<cite>
**Referenced Files in This Document**   
- [v0-ai-chat.tsx](file://src/components/ui/v0-ai-chat.tsx)
- [action-config.json](file://src/json/action-config.json)
</cite>

## Table of Contents
1. [Introduction](#introduction)
2. [Configuration Structure](#configuration-structure)
3. [Icon Mapping System](#icon-mapping-system)
4. [Interaction Patterns](#interaction-patterns)
5. [Adding New Action Types](#adding-new-action-types)
6. [Prompt Engineering Best Practices](#prompt-engineering-best-practices)

## Introduction
AI Chat Action Buttons are interactive UI elements designed to streamline developer workflows by providing one-click access to common AI-powered coding tasks. These buttons are integrated into the AI chat interface and allow users to quickly initiate specific modes such as debugging, documentation generation, or architectural planning. The system is built with extensibility in mind, allowing for easy customization and addition of new action types through configuration files.

The action buttons are implemented as React components that dynamically render based on a JSON configuration file. Each button triggers a predefined prompt that sets the context for the AI assistant, enabling focused and effective interactions. This documentation provides comprehensive details about the configuration structure, icon mapping system, interaction logic, and best practices for extending and optimizing the action button system.

**Section sources**
- [v0-ai-chat.tsx](file://src/components/ui/v0-ai-chat.tsx#L1-L372)
- [action-config.json](file://src/json/action-config.json#L1-L89)

## Configuration Structure
The AI Chat Action Buttons are configured through the `action-config.json` file, which defines all available actions and their properties. The configuration structure is organized under the `actionButtons` array, where each entry represents a distinct action type.

Each action object contains the following properties:
- **id**: Unique identifier for the action (e.g., "debug_mode")
- **label**: Display text shown on the button
- **icon**: Icon name that maps to a visual representation
- **defaultPrompt**: Predefined prompt text inserted when the button is clicked
- **description**: Tooltip text providing additional context about the action

```json
{
  "id": "debug_mode",
  "label": "Debug Code",
  "icon": "Bug",
  "defaultPrompt": "I need help debugging my code. Can you analyze the following code and help me identify and fix any issues?",
  "description": "Automatically detects bugs, generates fixes, and adds intelligent logging"
}
```

The configuration file also includes additional sections such as `quickStartPrompts` for common use cases and `aiBackends` for AI provider information, but the `actionButtons` array is the primary source for action button definitions.

**Section sources**
- [action-config.json](file://src/json/action-config.json#L2-L22)

## Icon Mapping System
The icon mapping system dynamically renders appropriate icons based on the icon name specified in the configuration file. This system is implemented in the `getIcon` function within the `v0-ai-chat.tsx` component, which maintains a mapping between icon names and their corresponding React components.

The supported icons are:
- **Bug**: Renders a bug icon for debugging-related actions
- **HelpCircle**: Renders a help icon for general inquiry actions
- **FileText**: Renders a document icon for documentation-related actions
- **Layers**: Renders a layers icon for architectural planning actions
- **GitPullRequest**: Renders a pull request icon for code review actions

``mermaid
flowchart TD
A["Icon Name String"] --> B{Icon Name Check}
B --> |Bug| C[Bug Icon Component]
B --> |HelpCircle| D[HelpCircle Icon Component]
B --> |FileText| E[FileText Icon Component]
B --> |Layers| F[Layers Icon Component]
B --> |GitPullRequest| G[GitPullRequest Icon Component]
B --> |Other| H[Default HelpCircle Icon]
C --> I[Rendered Button]
D --> I
E --> I
F --> I
G --> I
H --> I
```

**Diagram sources**
- [v0-ai-chat.tsx](file://src/components/ui/v0-ai-chat.tsx#L123-L163)

**Section sources**
- [v0-ai-chat.tsx](file://src/components/ui/v0-ai-chat.tsx#L123-L163)

## Interaction Patterns
The interaction pattern for AI Chat Action Buttons follows a consistent flow when a user clicks on a button. The process begins with the `handleActionClick` function, which receives the action ID as a parameter and searches for the corresponding action configuration.

When an action button is clicked:
1. The `handleActionClick` function is triggered with the action ID
2. The function searches the `actionConfig.actionButtons` array for a matching ID
3. If a match is found, the `defaultPrompt` from the configuration is set as the input value
4. The textarea height is automatically adjusted to accommodate the new content
5. The user can then modify the prompt or send it directly to the AI assistant

``mermaid
sequenceDiagram
participant User as "User"
participant Button as "ActionButton"
participant Handler as "handleActionClick"
participant Config as "action-config.json"
participant Input as "Textarea Input"
User->>Button : Click Action Button
Button->>Handler : Pass actionId
Handler->>Config : Find action by ID
Config-->>Handler : Return action configuration
Handler->>Input : Set value to defaultPrompt
Handler->>Handler : Adjust textarea height
Input-->>User : Display populated prompt
```

**Diagram sources**
- [v0-ai-chat.tsx](file://src/components/ui/v0-ai-chat.tsx#L142-L149)
- [v0-ai-chat.tsx](file://src/components/ui/v0-ai-chat.tsx#L337-L353)

**Section sources**
- [v0-ai-chat.tsx](file://src/components/ui/v0-ai-chat.tsx#L142-L149)

## Adding New Action Types
Adding new action types to the AI Chat interface requires modifying the `action-config.json` file and optionally adding new icons to the icon mapping system. The process involves creating a new entry in the `actionButtons` array with the required properties.

To add a new action type:
1. Open the `action-config.json` file
2. Add a new object to the `actionButtons` array
3. Specify a unique ID, descriptive label, appropriate icon name, default prompt, and tooltip description
4. If using a new icon, import the corresponding Lucide icon component in `v0-ai-chat.tsx`
5. Add the icon to the `getIcon` function's mapping object

Example of adding a "Code Optimization" action:
```json
{
  "id": "optimize_mode",
  "label": "Optimize Code",
  "icon": "Sparkles",
  "defaultPrompt": "Please analyze my code for performance improvements and suggest optimizations for better efficiency and readability.",
  "description": "Analyzes code for performance bottlenecks and suggests optimizations"
}
```

After adding the configuration, the new action button will automatically appear in the UI with the specified properties and behavior.

**Section sources**
- [action-config.json](file://src/json/action-config.json#L2-L22)
- [v0-ai-chat.tsx](file://src/components/ui/v0-ai-chat.tsx#L123-L163)

## Prompt Engineering Best Practices
Effective prompt engineering is crucial for maximizing the utility of AI Chat Action Buttons. Well-crafted prompts provide clear context and specific instructions that guide the AI assistant toward more accurate and helpful responses.

Best practices for crafting default prompts:
- **Be specific**: Clearly define the task and expected output format
- **Provide context**: Include information about the codebase or project requirements
- **Set expectations**: Specify the level of detail required in the response
- **Use action-oriented language**: Start with verbs like "analyze," "generate," or "review"
- **Include constraints**: Mention any limitations or requirements (e.g., performance, security)

Examples of effective prompt patterns:
- For debugging: "Analyze the following code and identify potential bugs, edge cases, and security vulnerabilities. Provide specific fixes with code examples."
- For documentation: "Generate comprehensive documentation including inline comments, API references, usage examples, and potential edge cases."
- For architecture: "Design a scalable architecture that addresses current limitations and supports future growth. Include technology recommendations and implementation roadmap."

Regularly review and refine prompts based on user feedback and actual usage patterns to ensure they continue to meet evolving needs.

**Section sources**
- [action-config.json](file://src/json/action-config.json#L2-L22)