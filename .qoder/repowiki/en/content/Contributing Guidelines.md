# Contributing Guidelines

<cite>
**Referenced Files in This Document**   
- [README.md](file://README.md#L1-L174)
- [package.json](file://package.json#L1-L28)
- [tailwind.config.ts](file://tailwind.config.ts#L1-L85)
- [src/app/components/Header.tsx](file://src/app/components/Header.tsx#L1-L211)
- [src/app/components/ThemeProvider.tsx](file://src/app/components/ThemeProvider.tsx#L1-L49)
- [src/app/page.tsx](file://src/app/page.tsx#L1-L27)
- [src/components/FeaturesSection.tsx](file://src/components/FeaturesSection.tsx#L1-L213)
- [pnpm-lock.yaml](file://pnpm-lock.yaml)
- [tsconfig.json](file://tsconfig.json)
</cite>

## Table of Contents
1. [Introduction](#introduction)
2. [Codebase Conventions](#codebase-conventions)
3. [Development Workflow](#development-workflow)
4. [Linting, Formatting, and Type Checking](#linting-formatting-and-type-checking)
5. [Component Development Guidelines](#component-development-guidelines)
6. [Theme System Extension](#theme-system-extension)
7. [Testing Recommendations](#testing-recommendations)
8. [Development Environment Setup](#development-environment-setup)
9. [Pull Request and Code Review Process](#pull-request-and-code-review-process)

## Introduction

This document provides comprehensive guidelines for contributing to the **Async Coder** project, an open-source AI-powered coding assistant designed to streamline development workflows. The frontend is built using **Next.js 15**, **React 19**, **TypeScript**, and **Tailwind CSS**, with a component-driven architecture and dark-mode-first design philosophy.

The codebase emphasizes clean, accessible React patterns, dynamic theming via CSS variables, and responsive UI interactions powered by modern web APIs. This guide details the technical standards, development practices, and contribution workflows necessary to maintain consistency and quality across the project.

**Section sources**
- [README.md](file://README.md#L1-L174)

## Codebase Conventions

### TypeScript Typing

The project enforces strict type safety using TypeScript. All components and utilities are written in `.tsx` files with explicit interfaces and type annotations. Key typing patterns include:

- **Component Props**: Functional components use explicit interfaces for props.
- **State Management**: `useState` is typed with union types for finite states (e.g., `Theme = 'dark' | 'light'`).
- **Context API**: Custom hooks like `useTheme` are wrapped with proper typing and runtime validation.

Example from `ThemeProvider.tsx`:
```typescript
type Theme = 'dark' | 'light'
interface ThemeContextType {
  theme: Theme
  toggleTheme: () => void
}
```

### React Component Patterns

The application follows a modular, reusable component architecture:

- **Client Components**: All interactive components use `"use client"` directive.
- **Composition**: The main page (`page.tsx`) composes high-level sections like `HeroSection`, `FeaturesSection`, and `PricingSection`.
- **Event Handling**: Inline event handlers are used for simplicity, with closures capturing state.
- **Refs and Effects**: `useRef` and `useEffect` manage DOM interactions and lifecycle events (e.g., scroll detection in `Header`).

Example from `Header.tsx`:
```tsx
const [isScrolled, setIsScrolled] = useState(false)
useEffect(() => {
  const handleScroll = () => setIsScrolled(window.scrollY > 10)
  window.addEventListener('scroll', handleScroll)
  return () => window.removeEventListener('scroll', handleScroll)
}, [])
```

### Tailwind CSS Class Naming

The styling system leverages **Tailwind CSS** with a focus on utility-first classes and dynamic theming:

- **Responsive Design**: Uses `md:flex`, `lg:grid-cols-3` for breakpoints.
- **Dark Mode**: Implements `dark:` variants via `darkMode: "class"` in `tailwind.config.ts`.
- **Customization**: Extends theme with CSS variables for colors, radii, and animations.
- **Glass Morphism**: Achieved via `backdrop-blur-xl`, `bg-white/90`, and `border` classes.

Example from `Header.tsx`:
```tsx
className="backdrop-blur-xl bg-white/90 dark:bg-[#0a0a0c]/90 shadow-lg border border-blue-100/20"
```

**Section sources**
- [src/app/components/Header.tsx](file://src/app/components/Header.tsx#L1-L211)
- [src/app/components/ThemeProvider.tsx](file://src/app/components/ThemeProvider.tsx#L1-L49)
- [tailwind.config.ts](file://tailwind.config.ts#L1-L85)

## Development Workflow

### Dependency Management with pnpm

The project uses **pnpm** as the package manager, evidenced by the presence of `pnpm-lock.yaml` and `pnpm-workspace.yaml`. This ensures fast, disk-efficient installations and deterministic dependency resolution.

To set up the project:
```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Run linting
pnpm lint
```

The `package.json` defines these scripts, aligning with standard Next.js conventions.

**Section sources**
- [package.json](file://package.json#L1-L28)
- [pnpm-lock.yaml](file://pnpm-lock.yaml)

## Linting, Formatting, and Type Checking

The project leverages Next.js built-in tooling for code quality:

- **Linting**: Uses `next lint` which integrates ESLint with recommended rules for React and Next.js.
- **Formatting**: No explicit formatter (like Prettier) is configured, suggesting reliance on editor defaults or IDE formatting.
- **Type Checking**: Enabled via `typescript` in `devDependencies` and enforced during development and build.

Developers should run `pnpm lint` before committing to catch potential bugs and enforce code style.

**Section sources**
- [package.json](file://package.json#L1-L28)
- [tsconfig.json](file://tsconfig.json)

## Component Development Guidelines

### Adding New Components

1. **Location**: Place new components in `src/app/components/` for page-specific UI or `src/components/` for shared elements.
2. **Naming**: Use PascalCase (e.g., `NewFeatureCard.tsx`).
3. **Structure**: Follow the pattern of `Header.tsx` or `FeaturesSection.tsx`:
   - Import React and necessary hooks.
   - Define props interface if applicable.
   - Use `useState`, `useEffect`, `useRef` as needed.
   - Return JSX with semantic HTML and Tailwind classes.
4. **Interactivity**: Use client components (`"use client"`) for any dynamic behavior.

### Modifying Existing Features

When updating components:
- Preserve accessibility attributes (e.g., `aria-label`, `role`).
- Maintain responsive behavior across breakpoints.
- Ensure theme compatibility via `dark:` classes or context usage.
- Avoid inline styles unless necessary for animations (e.g., scroll-based transforms).

Example: The `Header` component dynamically adjusts its appearance based on scroll position and theme.

**Section sources**
- [src/app/components/Header.tsx](file://src/app/components/Header.tsx#L1-L211)
- [src/components/FeaturesSection.tsx](file://src/components/FeaturesSection.tsx#L1-L213)
- [src/app/page.tsx](file://src/app/page.tsx#L1-L27)

## Theme System Extension

The theme system is implemented using **React Context** and **CSS variables**:

- **Provider**: `ThemeProvider.tsx` manages the `theme` state and toggles between `'dark'` and `'light'`.
- **Persistence**: Theme preference is saved to `localStorage`.
- **DOM Integration**: Adds/removes `dark` class on `documentElement` to trigger Tailwind’s dark mode.
- **CSS Variables**: Tailwind config references `hsl(var(--primary))`, etc., allowing dynamic theming.

To extend the theme:
1. Add new CSS variables in your global stylesheet (e.g., `--bg-glass`, `--border-primary`).
2. Extend the `theme.extend.colors` in `tailwind.config.ts`.
3. Use new variables in components via `style={{ background: 'var(--bg-glass)' }}` or Tailwind’s `bg-[var(--bg-glass)]`.

Example from `tailwind.config.ts`:
```ts
colors: {
  primary: { DEFAULT: "hsl(var(--primary))", foreground: "hsl(var(--primary-foreground))" }
}
```

**Section sources**
- [src/app/components/ThemeProvider.tsx](file://src/app/components/ThemeProvider.tsx#L1-L49)
- [tailwind.config.ts](file://tailwind.config.ts#L1-L85)

## Testing Recommendations

While no formal test files (e.g., `*.test.tsx`) are present in the current structure, the following testing strategy is recommended:

- **Unit Testing**: Use **Jest** and **React Testing Library** to test component rendering and interaction logic.
- **Integration Testing**: Verify component composition (e.g., `HomePage` renders all sections correctly).
- **Accessibility Testing**: Employ **axe-core** to ensure compliance with WCAG standards.
- **Visual Regression**: Use tools like **Playwright** or **Cypress** for screenshot comparisons.

Example test for `Header`:
```tsx
test('toggles mobile menu on button click', () => {
  render(<Header />)
  const menuButton = screen.getByLabelText('Toggle menu')
  fireEvent.click(menuButton)
  expect(screen.getByRole('navigation')).toBeVisible()
})
```

**Section sources**
- [src/app/components/Header.tsx](file://src/app/components/Header.tsx#L1-L211)

## Development Environment Setup

To contribute to the project:

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/async-coder/async-coder.git
   cd async-coder
   ```

2. **Install Dependencies**:
   ```bash
   pnpm install
   ```

3. **Run the Development Server**:
   ```bash
   pnpm dev
   ```
   The app will be available at `http://localhost:3000`.

4. **Verify Changes**:
   - Test responsiveness across device sizes.
   - Check both dark and light themes.
   - Ensure smooth animations and scroll behavior.

5. **Build and Test Production**:
   ```bash
   pnpm build && pnpm start
   ```

**Section sources**
- [README.md](file://README.md#L85-L104)
- [package.json](file://package.json#L1-L28)

## Pull Request and Code Review Process

### Pull Request Expectations

- **Atomic Commits**: Each PR should address a single feature or fix.
- **Descriptive Titles**: Use clear, concise titles (e.g., "Add mobile menu animation").
- **Detailed Descriptions**: Explain the change, motivation, and testing steps.
- **Code Quality**: Ensure no linting errors, proper typing, and adherence to component patterns.
- **Visual Updates**: Include screenshots for UI changes.

### Commit Message Standards

Follow conventional commit format:
```
feat: add new pricing tier component
fix: resolve header scroll jitter
docs: update contribution guidelines
style: format FeaturesSection with Prettier
refactor: extract theme toggle button
test: add Header unit tests
chore: update dependencies
```

### Code Review Process

- **Peer Review**: At least one maintainer must approve the PR.
- **Accessibility Check**: Ensure all interactive elements are keyboard-navigable and labeled.
- **Performance**: Avoid unnecessary re-renders; optimize large lists with virtualization if needed.
- **Theme Consistency**: Verify appearance in both light and dark modes.
- **Merge Strategy**: Use "Squash and Merge" to keep history clean.

Refer to the [GitHub Discussions](https://github.com/your-org/async-coder/discussions) for community input and roadmap alignment.

**Section sources**
- [README.md](file://README.md#L145-L174)