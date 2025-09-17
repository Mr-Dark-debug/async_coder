# Technology Stack & Dependencies

<cite>
**Referenced Files in This Document**   
- [package.json](file://package.json) - *Updated with Radix UI components and dependencies*
- [next.config.ts](file://next.config.ts) - *Configured for image optimization and remote patterns*
- [postcss.config.mjs](file://postcss.config.mjs) - *PostCSS integration with Tailwind CSS*
- [src/app/layout.tsx](file://src\app\layout.tsx) - *Root layout with ClerkProvider*
- [src/components/ui](file://src\components\ui) - *UI components using Radix UI and Tailwind*
- [comp.md](file://comp.md) - *Tailwind configuration and CSS variables*
- [src/lib/utils.ts](file://src\lib\utils.ts) - *Utility functions for class merging*
</cite>

## Update Summary
**Changes Made**   
- Updated supporting libraries section to include Radix UI components
- Added documentation for new UI primitives: AlertDialog, Dialog, Select, Switch, Tabs, Tooltip
- Removed outdated reference to NextAuth.js and confirmed Clerk authentication
- Added details on class-variance-authority and tailwind-merge for component styling
- Updated development dependencies to reflect actual TypeScript and ESLint versions
- Enhanced theme management section with CSS variable implementation details
- Removed non-existent tailwind.config.ts reference and updated with actual comp.md source
- Added utility function documentation for cn() helper

## Table of Contents
1. [Technology Stack & Dependencies](#technology-stack--dependencies)
2. [Core Frameworks](#core-frameworks)
3. [Supporting Libraries](#supporting-libraries)
4. [Development Dependencies](#development-dependencies)
5. [Configuration Files](#configuration-files)
6. [Build System Integration](#build-system-integration)
7. [Architecture Overview](#architecture-overview)
8. [Theme Management Implementation](#theme-management-implementation)
9. [Authentication Flow](#authentication-flow)
10. [Responsive Design & UI Components](#responsive-design--ui-components)

## Core Frameworks

The async_coder application is built on a modern, high-performance technology stack with a Next.js frontend. This foundation enables server-side rendering, API services, and seamless full-stack integration.

### Next.js v15.5.0
Next.js serves as the core frontend framework for routing, server-side rendering (SSR), and static site generation. The version 15.5.0 provides enhanced React Server Components support, optimized build performance, and improved developer experience.

**Key Features:**
- File-based routing system via the `app` directory
- Built-in API routes for backend functionality
- Automatic code splitting and optimization
- Image optimization with configured remote patterns
- Environment variable management

The framework is configured through `next.config.ts`, which contains image optimization settings for remote patterns from various domains including Unsplash, ImageKit, and Clerk.

**Section sources**
- [package.json](file://package.json#L10-L11)
- [next.config.ts](file://next.config.ts#L1-L46)

### React v19.1.0
React 19.1.0 provides the component model and rendering engine for the frontend application. This version introduces several performance improvements and new features that enhance the developer experience.

**Key Features:**
- React Server Components (RSC) for efficient server-side rendering
- Improved server components with better data fetching patterns
- Enhanced error boundaries and component lifecycle management
- Concurrent rendering for smoother user experiences

The application leverages React's component-based architecture to create reusable UI elements that are composed together in the main page structure.

**Section sources**
- [package.json](file://package.json#L10-L11)

## Supporting Libraries

### @clerk/nextjs for Authentication
The application uses Clerk for authentication instead of NextAuth.js. Clerk provides a complete authentication solution with support for social logins and user management.

**Implementation:**
- Pre-built SignIn and SignUp components from @clerk/nextjs
- Social login integration (GitHub)
- JWT-based session management
- Environment variable configuration for Clerk keys

The authentication pages are implemented in `src/app/sign-in/page.tsx` and `src/app/sign-up/page.tsx`, using Clerk's pre-built components.

**Section sources**
- [package.json](file://package.json#L7)
- [src/app/sign-in/page.tsx](file://src\app\sign-in/page.tsx#L1-L33)
- [src/app/sign-up/page.tsx](file://src\app\sign-up/page.tsx)

### lucide-react for Icons
lucide-react provides a collection of beautifully designed SVG icons that are used throughout the application interface. The library offers:

- Lightweight SVG-based icons
- Easy React component integration
- Consistent visual style
- Tree-shaking support to minimize bundle size

### Radix UI Components
The application now incorporates Radix UI components for accessible, unstyled UI primitives. These components provide the foundation for interactive elements with full accessibility support.

**Key Components:**
- **@radix-ui/react-alert-dialog**: Accessible alert dialogs with confirmation actions
- **@radix-ui/react-dialog**: Flexible dialog components for modals and popovers
- **@radix-ui/react-select**: Accessible select menus with customizable styling
- **@radix-ui/react-switch**: Toggle switches with keyboard navigation support
- **@radix-ui/react-tabs**: Tabbed interfaces with proper ARIA labeling
- **@radix-ui/react-tooltip**: Accessible tooltips with positioning controls

These components are used throughout the UI in files like `alert-dialog.tsx`, `dialog.tsx`, `select.tsx`, `switch.tsx`, `tabs.tsx`, and `tooltip.tsx`.

**Section sources**
- [package.json](file://package.json#L8-L17)
- [src/components/ui/alert-dialog.tsx](file://src\components\ui\alert-dialog.tsx)
- [src/components/ui/dialog.tsx](file://src\components\ui\dialog.tsx)
- [src/components/ui/select.tsx](file://src\components\ui\select.tsx)
- [src/components/ui/switch.tsx](file://src\components\ui\switch.tsx)
- [src/components/ui/tabs.tsx](file://src\components\ui\tabs.tsx)
- [src/components/ui/tooltip.tsx](file://src\components\ui\tooltip.tsx)

### Utility Libraries
The application uses several utility libraries to enhance component development and styling.

**class-variance-authority**: Provides a type-safe way to define component variants and styles. Used for creating consistent UI component variations.

**tailwind-merge**: Safely merges Tailwind CSS classes without duplication or conflicts. Essential for component composition.

**clsx**: Utility for conditionally joining class names together.

These utilities are imported and re-exported in the `cn()` helper function in `src/lib/utils.ts`.

**Section sources**
- [package.json](file://package.json#L20-L22)
- [src/lib/utils.ts](file://src\lib\utils.ts#L1-L5)

## Development Dependencies

### TypeScript for Type Safety
TypeScript v5+ provides static type checking and enhanced developer tooling for both frontend and backend. The configuration includes:

- Strict type checking mode
- ES2017 target with ESNext libraries
- Module resolution for bundler environments
- Path aliases (`@/*` maps to `./src/*`)
- JSX preservation for React

The frontend uses TypeScript, with tsconfig.json file for configuration.

**Section sources**
- [package.json](file://package.json#L20-L21)

### PostCSS for CSS Processing
PostCSS processes CSS with plugins, primarily integrating with Tailwind CSS. The configuration in `postcss.config.mjs` specifies:

```javascript
const config = {
  plugins: ["@tailwindcss/postcss"],
};
```

This enables Tailwind's utility classes to be processed and included in the final CSS bundle.

**Section sources**
- [package.json](file://package.json#L20-L21)
- [postcss.config.mjs](file://postcss.config.mjs#L1-L6)

## Configuration Files

### next.config.ts
The Next.js configuration includes image optimization settings for remote patterns:

```typescript
const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'ik.imagekit.io',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'tailark.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'html.tailus.io',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'img.clerk.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.clerk.dev',
        pathname: '/**',
      },
    ],
  },
};
```

This configuration allows the application to optimize images from external sources.

**Section sources**
- [next.config.ts](file://next.config.ts#L1-L46)

### postcss.config.mjs
The PostCSS configuration is minimal, focusing on Tailwind CSS integration:

```javascript
const config = {
  plugins: ["@tailwindcss/postcss"],
};

export default config;
```

**Section sources**
- [postcss.config.mjs](file://postcss.config.mjs#L1-L6)

## Build System Integration

The build system integrates multiple tools through package.json scripts:

**Frontend Scripts:**
```json
"scripts": {
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "eslint"
}
```

**Build Process Flow:**
1. TypeScript compilation with type checking
2. PostCSS processes Tailwind directives into final CSS
3. Next.js bundles React components with SSR/RSC optimization
4. Static assets are optimized and versioned
5. Final output is ready for deployment

The integration between these tools is seamless, with Next.js orchestrating the frontend build process.

**Section sources**
- [package.json](file://package.json#L5-L9)

## Architecture Overview

The application follows a frontend architecture with Next.js and React:

```
graph TB
subgraph "Frontend"
A[Next.js v15.5.0]
B[React v19.1.0]
C[Tailwind CSS]
D[Clerk Authentication]
E[UI Components]
F[Radix UI Primitives]
G[Utility Libraries]
end
```

**Diagram sources**
- [package.json](file://package.json)
- [src/components/ui](file://src\components\ui)

## Theme Management Implementation

The theme management system provides dynamic switching between light and dark modes with accessibility compliance.

### Implementation Details
Based on the CSS variables defined in comp.md:

- **Theme System**: Uses CSS variables with theme-aware classes
- **Accessibility**: WCAG AA compliance with proper contrast ratios
- **Component Standardization**: All components use theme variables
- **Light Mode**: Clean white background (#ffffff) with high-contrast dark text (#0a0a0a)
- **Dark Mode**: Deep dark background (#0a0a0a) with light text (#ededed)

The implementation uses CSS custom properties defined in the `:root` and `:root[class~="dark"]` selectors, with color values referenced via hsl(var(--color-name)) in Tailwind configuration.

**Section sources**
- [comp.md](file://comp.md#L89-L172)
- [comp.md](file://comp.md#L0-L89)

## Authentication Flow

The authentication system is implemented using Clerk with social login integration.

### Component Integration
The authentication flow uses Clerk's pre-built components:

```tsx
import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <SignIn 
        path="/sign-in" 
        routing="path"
        signUpUrl="/sign-up"
      />
    </div>
  );
}
```

**Section sources**
- [src/app/sign-in/page.tsx](file://src\app\sign-in/page.tsx#L1-L33)
- [src/app/layout.tsx](file://src\app\layout.tsx)

## Responsive Design & UI Components

The application implements responsive design principles through Tailwind CSS utility classes and component composition.

### Component Structure
The UI components are organized in the `src/components` directory with a focus on reusable, theme-aware components:

- **Bento Grid Layout**: For feature showcase with interactive hover effects
- **Timeline Component**: With gradient styling for both light and dark modes
- **Feature Steps**: Animated feature walkthrough with auto-play functionality
- **Glowing Effect**: Interactive glow effects with proximity detection
- **Hero Section**: Animated background with Raycast-style design
- **Radix UI Components**: Accessible primitives for dialogs, tooltips, tabs, and more

### Responsive Features
- **Container Centering**: Max width with horizontal centering
- **Mobile Optimization**: Responsive grid layouts and typography
- **Interactive Elements**: Hover effects and smooth transitions
- **Accessibility**: Proper contrast ratios and focus indicators in both themes

The combination of Next.js, React Server Components, Tailwind CSS, and Radix UI enables a highly responsive and performant user interface.

**Section sources**
- [src/components/ui](file://src\components\ui)
- [comp.md](file://comp.md#L0-L89)