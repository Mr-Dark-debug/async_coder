# Async Coder - Project Requirements & Analysis

## Project Overview
Async Coder is an open-source, end-to-end AI coding assistant built with Next.js 15, React 19, and TypeScript. The application aims to provide developers with autonomous AI development capabilities through multiple specialized modes.

## Current Architecture

### Tech Stack
- **Frontend**: Next.js 15.5.0, React 19.1.0, TypeScript 5
- **Styling**: Tailwind CSS 4, next-themes for theme management
- **Authentication**: Clerk
- **UI Components**: Radix UI, Lucide React icons
- **Animations**: Framer Motion, custom animated components

### Project Structure
```
src/
├── app/
│   ├── layout.tsx          # Root layout with theme provider
│   ├── page.tsx            # Main landing page
│   └── globals.css         # Global styles and CSS variables
├── components/
│   ├── ui/                 # Reusable UI components
│   │   ├── button.tsx
│   │   ├── theme-toggle.tsx
│   │   ├── hero-section-1.tsx
│   │   └── ...
│   ├── Features.tsx        # Features section
│   ├── AIBackends.tsx      # AI backends showcase
│   ├── QuickStart.tsx      # Quick start guide
│   ├── Roadmap.tsx         # Product roadmap
│   └── Footer.tsx          # Site footer
├── lib/
│   └── utils.ts            # Utility functions
└── middleware.ts           # Next.js middleware
```

## Current Issues Identified

### 1. Theme & Light Mode Visibility Issues
**Problem**: Components may not be properly visible in light mode
**Current State**: 
- Theme provider is implemented with next-themes
- CSS variables are defined for both light and dark modes
- Some components may have insufficient contrast in light mode

**Required Fixes**:
- Audit all components for light mode visibility
- Ensure proper contrast ratios (WCAG AA compliance)
- Fix text readability over background elements
- Improve button and interactive element visibility

### 2. Component Styling Inconsistencies
**Problem**: Inconsistent styling across components
**Current State**:
- Using Tailwind CSS with custom CSS variables
- Some components use hardcoded colors instead of theme variables
- Mixed usage of dark: prefixes and CSS variables

**Required Fixes**:
- Standardize color usage across all components
- Ensure all components use theme-aware classes
- Implement consistent spacing and typography

### 3. Missing Core Functionality
**Problem**: Landing page exists but core AI features are not implemented
**Current State**: 
- Only landing page components exist
- No actual AI integration or backend functionality
- Missing user dashboard, coding interface, etc.

**Required Implementation**:
- User authentication flow
- AI coding interface
- Multiple AI backend integrations
- File management system
- Code execution environment

## Detailed Requirements

### 1. Theme System Requirements

#### Light Mode Specifications
- **Background**: Clean white (#ffffff) with subtle gray accents
- **Text**: High contrast dark text (#0a0a0a) for readability
- **Buttons**: Clear borders and backgrounds with proper hover states
- **Cards**: Light gray backgrounds (#f8f9fa) with defined borders
- **Interactive Elements**: Visible focus states and hover effects

#### Dark Mode Specifications  
- **Background**: Deep dark (#0a0a0a) with gray accents
- **Text**: Light text (#ededed) for readability
- **Buttons**: Proper contrast with dark backgrounds
- **Cards**: Dark gray backgrounds (#262626) with subtle borders

#### Accessibility Requirements
- Minimum contrast ratio of 4.5:1 for normal text
- Minimum contrast ratio of 3:1 for large text
- Focus indicators visible in both themes
- Color should not be the only means of conveying information

### 2. Component Requirements

#### Navigation Header
- Responsive design for mobile and desktop
- Theme toggle functionality
- Smooth scroll navigation to sections
- Authentication buttons (Login/Sign Up)
- Sticky header with backdrop blur effect

#### Hero Section
- Animated background (Raycast-style)
- Clear value proposition
- Call-to-action buttons
- Responsive typography
- Partner/integration logos

#### Features Section
- Bento grid layout for feature showcase
- Interactive hover effects
- Clear feature descriptions
- Visual icons or illustrations
- Responsive grid layout

#### AI Backends Section
- Showcase supported AI providers
- Integration capabilities
- Visual representations of each backend
- Comparison or selection interface

#### Footer
- Company information
- Legal links (Privacy, Terms)
- Social media links
- Newsletter signup
- Responsive layout

### 3. Performance Requirements
- **Core Web Vitals**:
  - LCP (Largest Contentful Paint) < 2.5s
  - FID (First Input Delay) < 100ms
  - CLS (Cumulative Layout Shift) < 0.1
- **Bundle Size**: Optimized JavaScript bundles
- **Image Optimization**: Next.js Image component usage
- **Font Loading**: Optimized Google Fonts loading

### 4. SEO Requirements
- Proper meta tags and Open Graph data
- Structured data markup
- Semantic HTML structure
- Optimized page titles and descriptions
- XML sitemap generation

## Implementation Priority

### Phase 1: Theme & Styling Fixes (Current Focus)
1. ✅ Update .gitignore with .kiro and docs folders
2. 🔄 Audit and fix light mode visibility issues
3. 🔄 Standardize component styling
4. 🔄 Improve accessibility compliance
5. 🔄 Test responsive design across devices

### Phase 2: Core Functionality
1. Implement user authentication flow
2. Create AI coding interface
3. Add file management system
4. Integrate AI backends (Claude, Gemini, etc.)
5. Build code execution environment

### Phase 3: Advanced Features
1. Autonomous development pipeline
2. Code review system
3. Documentation generation
4. PR management integration
5. Learning and improvement system

## Testing Strategy

### Manual Testing Checklist
- [ ] Light mode visibility across all components
- [ ] Dark mode functionality
- [ ] Theme toggle smooth transitions
- [ ] Responsive design on mobile/tablet/desktop
- [ ] Keyboard navigation accessibility
- [ ] Screen reader compatibility

### Automated Testing
- Unit tests for components
- Integration tests for user flows
- Visual regression testing
- Performance monitoring
- Accessibility testing with axe-core

## Success Metrics
- **User Experience**: Smooth theme transitions, readable content in both modes
- **Accessibility**: WCAG AA compliance score > 95%
- **Performance**: Core Web Vitals in green zone
- **Conversion**: Clear call-to-action effectiveness
- **Engagement**: Time spent on page, scroll depth

## Next Steps
1. Complete theme and styling audit
2. Fix identified light mode issues
3. Implement missing UI components
4. Add comprehensive testing
5. Plan Phase 2 development roadmap