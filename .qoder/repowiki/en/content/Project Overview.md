# Project Overview

<cite>
**Referenced Files in This Document**   
- [README.md](file://README.md) - *Updated with environments management UI*
- [backend/README.md](file://backend\README.md) - *Updated with environments management details*
- [page.tsx](file://src\app\page.tsx) - *Updated with new component structure*
- [layout.tsx](file://src\app\layout.tsx)
- [hero-section-1.tsx](file://src\components\ui\hero-section-1.tsx) - *Enhanced with authentication options*
- [EnhancedRoadmap.tsx](file://src\components\EnhancedRoadmap.tsx) - *Improved roadmap section*
- [roadmap-timeline.tsx](file://src\components\ui\roadmap-timeline.tsx) - *Implementation of enhanced roadmap*
- [EnvironmentsTab.tsx](file://src\components\settings\tabs\EnvironmentsTab.tsx) - *New environments management UI*
- [CreateEnvironmentTab.tsx](file://src\components\settings\tabs\CreateEnvironmentTab.tsx) - *New environment creation form*
- [settings-content.tsx](file://src\components\settings\settings-content.tsx) - *Updated with environments tab*
</cite>

## Update Summary
**Changes Made**   
- Updated Introduction to reflect new environments management feature
- Added new Core Components section for EnvironmentsTab and CreateEnvironmentTab
- Updated Project Structure to include new environments management components
- Enhanced Core Components section with details about the new environments management UI
- Updated User Journey and Authentication section with environments management workflow
- Added new Component Analysis section for EnvironmentsTab and CreateEnvironmentTab
- Updated all diagrams to reflect current component structure including environments management
- Added backend environments management implementation details

## Table of Contents
1. [Introduction](#introduction)
2. [Project Structure](#project-structure)
3. [Core Components](#core-components)
4. [Architecture Overview](#architecture-overview)
5. [User Journey and Authentication](#user-journey-and-authentication)
6. [Component Analysis](#component-analysis)
7. [Conclusion](#conclusion)

## Introduction

Async Coder is an open-source, end-to-end AI coding assistant designed to empower developers with autonomous development capabilities. The project's frontend marketing website serves as a comprehensive informational platform that showcases the tool's advanced features, value proposition, and flexible deployment options. Built using modern web technologies, the site targets developers and technical users seeking an AI-powered coding co-pilot that offers full control, multi-engine support, and end-to-end automation from idea to pull request.

The website effectively communicates Async Coder's core value proposition: providing developers with a self-hostable, open-source AI assistant that supports multiple AI backends (including Claude, Gemini, and Aider) while maintaining data sovereignty. The site highlights key use cases such as debugging, code generation, documentation, architectural planning, and automated pull request reviews, positioning Async Coder as a comprehensive solution that transcends traditional coding assistants.

**Section sources**
- [README.md](file://README.md)

## Project Structure

The project follows a Next.js App Router architecture with a well-organized component structure. The application is built with React Server Components for server-side rendering and client components for interactive elements. The structure separates components into logical directories, with the main application components located in `src/app/components` and shared components in `src/components`.

The entry point of the application is `src/app/page.tsx`, which composes the main landing page by importing and rendering various UI components in a specific sequence. The layout is defined in `src/app/layout.tsx`, which provides the overall structure and theming for the application. The component structure has been updated to use `HeroSection` from `hero-section-1.tsx` and includes the new `EnhancedRoadmap` component.

```
mermaid
graph TB
A[src/app] --> B[page.tsx]
A --> C[layout.tsx]
A --> D[components/]
D --> E[hero-section-1.tsx]
D --> F[EnhancedRoadmap.tsx]
D --> G[Features.tsx]
D --> H[AIBackends.tsx]
D --> I[QuickStart.tsx]
D --> J[Footer.tsx]
src/components --> K[ui/]
src/components --> L[settings/]
L --> M[EnvironmentsTab.tsx]
L --> N[CreateEnvironmentTab.tsx]
```

**Diagram sources**
- [page.tsx](file://src\app\page.tsx)
- [layout.tsx](file://src\app\layout.tsx)

**Section sources**
- [page.tsx](file://src\app\page.tsx)
- [layout.tsx](file://src\app\layout.tsx)

## Core Components

The website is composed of several key components that work together to present Async Coder's value proposition. The `HeroSection` component provides navigation and theme toggling functionality, while the `HeroSection` displays the main value proposition with engaging animations. The `Features` component showcases the product's capabilities with interactive cards, and the `AIBackends` component highlights the supported AI models.

The `QuickStart` component provides guidance for new users, while the `EnhancedRoadmap` component offers a detailed view of the project's development trajectory with community engagement features. The `Footer` component contains additional navigation, social links, and a newsletter subscription form.

The new `EnvironmentsTab` component provides a comprehensive interface for managing development environments with search functionality and creation capabilities. The `CreateEnvironmentTab` component enables users to configure new environments with repository selection, environment variables, and container settings.

```
mermaid
flowchart TD
A[HomePage] --> B[HeroSection]
A --> C[Features]
A --> D[AIBackends]
A --> E[QuickStart]
A --> F[EnhancedRoadmap]
A --> G[Footer]
H[SettingsPage] --> I[EnvironmentsTab]
I --> J[CreateEnvironmentTab]
```

**Diagram sources**
- [page.tsx](file://src\app\page.tsx)
- [EnvironmentsTab.tsx](file://src\components\settings\tabs\EnvironmentsTab.tsx)
- [CreateEnvironmentTab.tsx](file://src\components\settings\tabs\CreateEnvironmentTab.tsx)

**Section sources**
- [page.tsx](file://src\app\page.tsx)
- [hero-section-1.tsx](file://src\components\ui\hero-section-1.tsx)
- [Features.tsx](file://src\components\Features.tsx)
- [AIBackends.tsx](file://src\components\AIBackends.tsx)
- [QuickStart.tsx](file://src\components\QuickStart.tsx)
- [EnhancedRoadmap.tsx](file://src\components\EnhancedRoadmap.tsx)
- [Footer.tsx](file://src\components\Footer.tsx)
- [EnvironmentsTab.tsx](file://src\components\settings\tabs\EnvironmentsTab.tsx)
- [CreateEnvironmentTab.tsx](file://src\components\settings\tabs\CreateEnvironmentTab.tsx)

## Architecture Overview

The application follows a modern Next.js architecture with React Server Components and client-side interactivity. The site uses server-side rendering for improved performance and SEO, while leveraging client components for interactive features like the pricing toggle, demo animation, and 3D mouse-tracking effects.

The theming system is implemented through a `ThemeProvider` that allows users to switch between light and dark modes. The UI is styled with Tailwind CSS, utilizing a custom color palette and glass-morphism effects for a modern, visually appealing design. The application integrates Clerk for authentication, supporting both GitHub and Google as authentication providers.

The new environments management feature is implemented as a client-side component within the settings interface, allowing users to search, create, and manage development environments. The `EnvironmentsTab` component provides a searchable table interface, while the `CreateEnvironmentTab` component offers a multi-step form for environment configuration.

```
mermaid
graph TB
subgraph "Frontend"
A[Next.js App Router]
B[React Server Components]
C[Client Components]
D[Tailwind CSS]
E[ThemeProvider]
F[Environments Management]
end
subgraph "Authentication"
G[Clerk]
H[GitHub Provider]
I[Google Provider]
end
subgraph "Content"
J[Marketing Pages]
K[Interactive Demos]
L[Pricing Information]
M[Development Roadmap]
N[Environments Management]
end
A --> B
A --> C
A --> D
A --> E
A --> F
C --> G
G --> H
G --> I
J --> A
K --> A
L --> A
M --> A
N --> A
F --> O[EnvironmentsTab]
F --> P[CreateEnvironmentTab]
```

**Diagram sources**
- [layout.tsx](file://src\app\layout.tsx)
- [hero-section-1.tsx](file://src\components\ui\hero-section-1.tsx)
- [EnvironmentsTab.tsx](file://src\components\settings\tabs\EnvironmentsTab.tsx)
- [CreateEnvironmentTab.tsx](file://src\components\settings\tabs\CreateEnvironmentTab.tsx)

**Section sources**
- [layout.tsx](file://src\app\layout.tsx)
- [hero-section-1.tsx](file://src\components\ui\hero-section-1.tsx)
- [EnvironmentsTab.tsx](file://src\components\settings\tabs\EnvironmentsTab.tsx)
- [CreateEnvironmentTab.tsx](file://src\components\settings\tabs\CreateEnvironmentTab.tsx)

## User Journey and Authentication

The user journey begins with the landing page, which immediately presents Async Coder's value proposition through the `HeroSection`. Users can explore the product's features, see a live demo of code improvements, and review pricing options. The navigation is intuitive, with clear calls-to-action throughout the site, including "Get Started Now" and "View on GitHub" buttons.

Authentication is implemented using Clerk with GitHub and Google as primary providers. The frontend components use Clerk's `SignInButton` and `UserButton` for authentication flows, while the backend validates Clerk tokens and manages user sessions. When a user signs in, the frontend sends the Clerk token to the backend `/login` endpoint, which verifies the token and creates a session.

After authentication, users can access the dashboard and settings interface where they can manage their development environments. The environments management workflow allows users to search existing environments, create new ones, and configure environment-specific settings such as repository connections, environment variables, and container configurations.

```
mermaid
sequenceDiagram
participant User as "Visitor"
participant Browser as "Browser"
participant Clerk as "Clerk Auth"
participant Backend as "Backend API"
participant GitHub as "GitHub OAuth"
User->>Browser : Visits async-coder.com
Browser->>Browser : Renders landing page
User->>Browser : Clicks "Login"
Browser->>Clerk : Clerk SignInButton
Clerk->>GitHub : OAuth Authorization Request
GitHub->>User : GitHub Login Page
User->>GitHub : Authenticates
GitHub->>Clerk : Authorization Code
Clerk->>Clerk : Exchange code for token
Clerk->>Browser : Set Clerk session
Browser->>Backend : POST /login with clerkToken
Backend->>Backend : Verify Clerk token
Backend->>Backend : Find or create user
Backend->>Backend : Generate JWT and session
Backend->>Browser : Return auth tokens
Browser->>Browser : Set session cookies
Browser->>User : Authenticated experience
User->>Browser : Navigates to Settings
Browser->>Browser : Renders EnvironmentsTab
User->>Browser : Clicks "Create environment"
Browser->>Browser : Renders CreateEnvironmentTab
User->>Browser : Configures environment settings
Browser->>Backend : POST /environments with environment data
Backend->>Backend : Create environment record
Backend->>Browser : Return success response
Browser->>Browser : Update environments list
```

**Diagram sources**
- [hero-section-1.tsx](file://src\components\ui\hero-section-1.tsx)
- [EnvironmentsTab.tsx](file://src\components\settings\tabs\EnvironmentsTab.tsx)
- [CreateEnvironmentTab.tsx](file://src\components\settings\tabs\CreateEnvironmentTab.tsx)

**Section sources**
- [hero-section-1.tsx](file://src\components\ui\hero-section-1.tsx)
- [EnvironmentsTab.tsx](file://src\components\settings\tabs\EnvironmentsTab.tsx)
- [CreateEnvironmentTab.tsx](file://src\components\settings\tabs\CreateEnvironmentTab.tsx)

## Component Analysis

### HeroSection Analysis
The `HeroSection` component serves as the primary landing point, immediately communicating Async Coder's value proposition. It features a dynamic gradient text effect and 3D mouse-tracking animations that create an engaging first impression. The section includes key messaging about the product being open-source and self-hostable, along with social proof indicators showing developer count, rating, and security certifications.

The component has been updated to use Clerk for authentication, with `SignedIn` and `SignedOut` components controlling the display of authentication buttons. When signed out, users see "Get Started Now" and "View on GitHub" buttons; when signed in, they see a "Go to Dashboard" button.

```
mermaid
flowchart TD
A[HeroSection] --> B[RaycastBackground]
A --> C[Banner: Autonomous AI Development]
A --> D[Headline: The last AI assistant you'll ever need for coding]
A --> E[Subheadline: An open-source, end-to-end AI coding assistant]
A --> F[Authentication Buttons]
F --> G[SignedOut]
G --> H[Get Started Now]
G --> I[View on GitHub]
F --> J[SignedIn]
J --> K[Go to Dashboard]
A --> L[Logos3: Technology partners]
```

**Diagram sources**
- [hero-section-1.tsx](file://src\components\ui\hero-section-1.tsx)

**Section sources**
- [hero-section-1.tsx](file://src\components\ui\hero-section-1.tsx)

### EnvironmentsTab Analysis
The `EnvironmentsTab` component provides a comprehensive interface for managing development environments with search functionality and creation capabilities. The component displays a table of existing environments with columns for name, repository, task count, creator, and creation date. Users can search environments by name or repository and create new environments through a dedicated form.

The component implements client-side filtering for the search functionality and provides a clean, intuitive interface for environment management. The table uses a responsive grid layout with hover effects and proper spacing for readability.

```
classDiagram
class EnvironmentsTab {
+searchQuery : string
+showCreateForm : boolean
+isNavigating : boolean
+environments : Environment[]
+filteredEnvironments : Environment[]
+setSearchQuery() : void
+setShowCreateForm() : void
+setIsNavigating() : void
+handleCreateEnvironment() : Promise<void>
}
class Environment {
+name : string
+repo : string
+tasksCount : number
+creator : string
+createdAt : string
}
class CreateEnvironmentTab {
+onBack : () => void
}
EnvironmentsTab --> CreateEnvironmentTab : "renders when showCreateForm is true"
EnvironmentsTab --> Environment : "contains multiple"
```

**Diagram sources**
- [EnvironmentsTab.tsx](file://src\components\settings\tabs\EnvironmentsTab.tsx)

**Section sources**
- [EnvironmentsTab.tsx](file://src\components\settings\tabs\EnvironmentsTab.tsx)

### CreateEnvironmentTab Analysis
The `CreateEnvironmentTab` component provides a multi-step form for creating new development environments. The form is organized into logical sections including basic information (organization, repository, name, description) and code execution settings (container image, environment variables, secrets, container caching, setup script, and agent internet access).

The component includes a terminal preview on the right side and uses various UI components such as dialogs for managing preinstalled packages, environment variables, and secrets. The form validates required fields before enabling the create button and provides a breadcrumb navigation pattern.

```
classDiagram
class CreateEnvironmentTab {
+selectedOrg : string
+searchRepo : string
+selectedRepo : string
+envName : string
+description : string
+containerImage : string
+preinstalledPackages : boolean
+containerCaching : boolean
+setupScript : string
+agentAccess : boolean
+isCreating : boolean
+showPackagesDialog : boolean
+showEnvDialog : boolean
+showSecretsDialog : boolean
+environmentVariables : Array<{key: string, value: string}>
+secrets : Array<{key: string, value: string}>
+repositories : Repository[]
+organizations : Organization[]
+setSelectedOrg() : void
+setSearchRepo() : void
+setSelectedRepo() : void
+setEnvName() : void
+setDescription() : void
+setContainerImage() : void
+setPreinstalledPackages() : void
+setContainerCaching() : void
+setSetupScript() : void
+setAgentAccess() : void
+setIsCreating() : void
+setShowPackagesDialog() : void
+setShowEnvDialog() : void
+setShowSecretsDialog() : void
+setEnvironmentVariables() : void
+setSecrets() : void
+handleCreateEnvironment() : Promise<void>
}
class Repository {
+name : string
+visibility : 'Private' | 'Public'
+icon? : React.ReactNode
}
class Organization {
+id : string
+name : string
}
class PreinstalledPackagesDialog {
+open : boolean
+onOpenChange : (open: boolean) => void
}
class EnvironmentVariableDialog {
+open : boolean
+onOpenChange : (open: boolean) => void
+title : string
+type : 'environment' | 'secret'
}
CreateEnvironmentTab --> PreinstalledPackagesDialog : "uses"
CreateEnvironmentTab --> EnvironmentVariableDialog : "uses twice with different types"
CreateEnvironmentTab --> Repository : "contains multiple"
CreateEnvironmentTab --> Organization : "contains multiple"
```

**Diagram sources**
- [CreateEnvironmentTab.tsx](file://src\components\settings\tabs\CreateEnvironmentTab.tsx)

**Section sources**
- [CreateEnvironmentTab.tsx](file://src\components\settings\tabs\CreateEnvironmentTab.tsx)

### Backend Authentication Analysis
The backend authentication system is built around Clerk for identity management and JWT for session management. The `/login` endpoint accepts a Clerk token, verifies it, and creates a session with a JWT token. The system also supports GitHub account connection through an OAuth flow that exchanges a code for an access token.

The authentication middleware validates JWT tokens and caches user data for performance. The system uses Redis for session storage and includes rate limiting to prevent abuse. Clerk webhooks are used to synchronize user data between Clerk and the application's database.

```
mermaid
flowchart TD
A[Frontend] --> |clerkToken| B[/login]
B --> C[Verify Clerk Token]
C --> D[Find or Create User]
D --> E[Generate JWT]
E --> F[Create Session]
F --> G[Return tokens]
A --> |code| H[/github/connect]
H --> I[Exchange Code for Token]
I --> J[Get GitHub User]
J --> K[Connect GitHub Account]
K --> L[Return success]
```

**Diagram sources**
- [auth.ts](file://backend\src\routes\auth.ts)
- [auth.ts](file://backend\src\config\auth.ts)

**Section sources**
- [auth.ts](file://backend\src\routes\auth.ts)
- [auth.ts](file://backend\src\config\auth.ts)

## Conclusion

The Async Coder marketing website effectively showcases the AI coding assistant as a comprehensive solution for modern development workflows. Built with Next.js and React, the site leverages server-side rendering for performance while incorporating client-side interactivity for an engaging user experience. The architecture demonstrates a clear separation of concerns, with well-defined components that work together to communicate the product's value proposition.

The site targets developers and technical teams by highlighting key features such as multi-model AI support, GitHub integration, self-hosting capabilities, and autonomous development workflows. The user journey is carefully designed to guide visitors from initial awareness through to conversion points like the dashboard access and GitHub repository. Authentication via GitHub and Google is implemented using Clerk, providing a seamless login experience for developers already familiar with these platforms.

The recent enhancements to the environments management UI provide developers with powerful tools to organize and configure their development environments. The `EnvironmentsTab` and `CreateEnvironmentTab` components offer an intuitive interface for managing environments with search functionality and comprehensive configuration options. The integration of Clerk for authentication simplifies the login process while maintaining security. Overall, the website serves as both a marketing tool and a demonstration of the technical sophistication behind Async Coder, effectively positioning it as a powerful, flexible, and developer-centric AI coding assistant that addresses the limitations of existing solutions in the market.