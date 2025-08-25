# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

This is a Next.js 15.5.0 application with TypeScript, React 19, and Tailwind CSS v4. The project uses the modern Next.js App Router architecture and is configured for development with ESLint and PostCSS.

## Essential Commands

### Development
```bash
# Start development server (hot reload enabled)
npm run dev

# Access application at http://localhost:3000
```

### Building & Production
```bash
# Build for production
npm run build

# Start production server (requires build first)
npm run start
```

### Code Quality
```bash
# Run ESLint
npm run lint

# ESLint with auto-fix
npx eslint . --fix
```

### Package Management
```bash
# Install dependencies
npm install

# Add a new dependency
npm install <package-name>

# Add a development dependency
npm install -D <package-name>
```

## Architecture & Structure

### App Router Architecture
- **`src/app/`** - Next.js App Router directory containing all routes and layouts
- **`src/app/layout.tsx`** - Root layout component that wraps all pages
- **`src/app/page.tsx`** - Home page component (route: `/`)
- **`src/app/globals.css`** - Global CSS imports and root styling variables

### Key Configuration Files
- **`next.config.ts`** - Next.js configuration (currently minimal)
- **`tsconfig.json`** - TypeScript configuration with path mapping (`@/*` → `./src/*`)
- **`eslint.config.mjs`** - ESLint configuration using flat config format with Next.js rules
- **`postcss.config.mjs`** - PostCSS configuration for Tailwind CSS v4
- **`package.json`** - Project dependencies and npm scripts

### Styling System
The project uses **Tailwind CSS v4** with a modern configuration:
- CSS imports via `@import "tailwindcss"` in `globals.css`
- CSS custom properties for theming (`--background`, `--foreground`)
- Built-in dark mode support using `prefers-color-scheme`
- Custom theme configuration using `@theme inline` directive
- Geist Sans and Geist Mono fonts loaded via `next/font/google`

### TypeScript Configuration
- Strict mode enabled with comprehensive type checking
- Path alias `@/*` maps to `src/*` for clean imports
- Next.js TypeScript plugin integrated
- ES2017 target with ESNext modules using bundler resolution

### Route Structure
Currently using App Router with:
- **Root route (`/`)**: Served by `src/app/page.tsx`
- **Layout**: Applied via `src/app/layout.tsx` to all routes
- Font optimization and metadata configured at the layout level

## Development Patterns

### Adding New Pages
Create new `page.tsx` files in subdirectories of `src/app/`:
```bash
# Create new route: /about
mkdir src/app/about
# Create page component
touch src/app/about/page.tsx
```

### Adding Components
Create components in a logical directory structure:
```bash
# Create components directory
mkdir -p src/components
# Add component files
touch src/components/ComponentName.tsx
```

### Working with Styles
- Use Tailwind classes directly in JSX
- Global styles go in `src/app/globals.css`
- CSS custom properties are defined for theming
- Dark mode is handled automatically via CSS media queries

### Import Patterns
- Use `@/` alias for imports from `src/` directory
- Import Next.js components and utilities from their respective packages
- Font loading handled in layout with variable CSS custom properties

## Technology Stack
- **Next.js 15.5.0** - React framework with App Router
- **React 19.1.0** - UI library (latest version)
- **TypeScript 5.x** - Static type checking
- **Tailwind CSS 4.x** - Utility-first CSS framework
- **ESLint 9.x** - Code linting with Next.js configuration
- **Geist Fonts** - Typography via Google Fonts integration
