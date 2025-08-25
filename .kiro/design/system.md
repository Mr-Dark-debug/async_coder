# Async Coder Design System

## Brand Identity

### Logo & Branding
- **Primary Logo**: "AC" in gradient box + "Async Coder" text
- **Colors**: Blue to Purple gradient (#3b82f6 → #8b5cf6)
- **Typography**: Geist Sans (primary), Geist Mono (code)
- **Tone**: Professional, innovative, developer-focused

### Color Palette

#### Light Mode
```css
--background: #ffffff
--foreground: #0f172a
--card: #ffffff
--card-foreground: #0f172a
--primary: #0f172a
--primary-foreground: #f8fafc
--secondary: #f1f5f9
--secondary-foreground: #0f172a
--muted: #f1f5f9
--muted-foreground: #64748b
--accent: #f1f5f9
--accent-foreground: #0f172a
--border: #e2e8f0
--ring: #3b82f6
```

#### Dark Mode
```css
--background: #020617
--foreground: #f8fafc
--card: #0f172a
--card-foreground: #f8fafc
--primary: #f8fafc
--primary-foreground: #020617
--secondary: #1e293b
--secondary-foreground: #f8fafc
--muted: #1e293b
--muted-foreground: #94a3b8
--accent: #1e293b
--accent-foreground: #f8fafc
--border: #334155
--ring: #3b82f6
```

#### Semantic Colors
- **Success**: Green (#10b981)
- **Warning**: Amber (#f59e0b)
- **Error**: Red (#dc2626)
- **Info**: Blue (#3b82f6)

### Typography Scale

#### Headings
- **H1**: 4xl-5xl (36-48px) - Hero titles
- **H2**: 3xl-4xl (30-36px) - Section headers
- **H3**: 2xl (24px) - Subsection headers
- **H4**: xl (20px) - Card titles
- **H5**: lg (18px) - Component titles
- **H6**: base (16px) - Small headers

#### Body Text
- **Large**: lg (18px) - Hero descriptions
- **Base**: base (16px) - Standard body text
- **Small**: sm (14px) - Captions, metadata
- **Extra Small**: xs (12px) - Labels, badges

#### Code Text
- **Inline**: Geist Mono, bg-muted, rounded
- **Block**: Geist Mono, bg-card, border, syntax highlighting

### Spacing System
- **xs**: 0.25rem (4px)
- **sm**: 0.5rem (8px)
- **md**: 1rem (16px)
- **lg**: 1.5rem (24px)
- **xl**: 2rem (32px)
- **2xl**: 3rem (48px)
- **3xl**: 4rem (64px)
- **4xl**: 6rem (96px)

### Border Radius
- **sm**: 0.25rem (4px) - Small elements
- **md**: 0.5rem (8px) - Standard radius
- **lg**: 0.75rem (12px) - Cards, buttons
- **xl**: 1rem (16px) - Large containers
- **2xl**: 1.5rem (24px) - Hero sections
- **full**: 9999px - Pills, avatars

### Shadows
- **sm**: 0 1px 2px rgba(0,0,0,0.05)
- **md**: 0 4px 6px rgba(0,0,0,0.07)
- **lg**: 0 10px 15px rgba(0,0,0,0.1)
- **xl**: 0 20px 25px rgba(0,0,0,0.1)
- **2xl**: 0 25px 50px rgba(0,0,0,0.25)

## Component Guidelines

### Buttons
- **Primary**: Gradient background, white text
- **Secondary**: Border, muted background
- **Ghost**: Transparent, hover accent
- **Destructive**: Red background, white text

### Cards
- **Background**: bg-card
- **Border**: border-border
- **Shadow**: shadow-sm to shadow-lg
- **Padding**: p-6 standard

### Forms
- **Inputs**: border-input, focus:ring-ring
- **Labels**: text-sm, font-medium
- **Validation**: Error states with red border

### Navigation
- **Header**: Sticky, backdrop-blur
- **Links**: text-muted-foreground, hover:text-foreground
- **Active**: text-foreground, font-medium

### Animations
- **Duration**: 150ms-300ms standard
- **Easing**: ease-in-out
- **Hover**: Scale, opacity, color transitions
- **Page**: Fade in/out, slide transitions

## Accessibility Standards

### Contrast Ratios
- **Normal text**: 4.5:1 minimum
- **Large text**: 3:1 minimum
- **Interactive elements**: 3:1 minimum

### Focus Management
- **Visible focus**: ring-2 ring-ring
- **Keyboard navigation**: Tab order logical
- **Skip links**: For screen readers

### Semantic HTML
- **Headings**: Proper hierarchy (h1→h6)
- **Landmarks**: nav, main, aside, footer
- **ARIA**: Labels, descriptions, states

## Responsive Breakpoints
- **sm**: 640px - Mobile landscape
- **md**: 768px - Tablet
- **lg**: 1024px - Desktop
- **xl**: 1280px - Large desktop
- **2xl**: 1536px - Extra large

## Animation Principles
- **Purposeful**: Enhance UX, not distract
- **Fast**: 150-300ms for micro-interactions
- **Smooth**: Use easing functions
- **Reduced motion**: Respect user preferences