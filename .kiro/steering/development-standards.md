# Development Standards & Guidelines

## 🎯 Code Quality Standards

### TypeScript Guidelines

#### Type Safety
```typescript
// ✅ Good: Explicit types for function parameters and returns
function processUserData(user: User): Promise<ProcessedUser> {
  return processUser(user);
}

// ❌ Bad: Using 'any' type
function processUserData(user: any): any {
  return processUser(user);
}

// ✅ Good: Proper interface definitions
interface User {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
}

// ❌ Bad: Loose object typing
type User = {
  [key: string]: any;
}
```

#### Naming Conventions
```typescript
// Components: PascalCase
export function UserProfile() {}

// Functions/variables: camelCase
const getUserData = () => {};
const isAuthenticated = true;

// Constants: SCREAMING_SNAKE_CASE
const API_BASE_URL = 'https://api.asynccoder.dev';
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

// Types/Interfaces: PascalCase
interface ApiResponse<T> {}
type UserRole = 'admin' | 'user' | 'guest';
```

### React Component Standards

#### Component Structure
```typescript
// ✅ Good: Proper component structure
interface ComponentProps {
  title: string;
  onAction?: () => void;
  className?: string;
  children?: React.ReactNode;
}

export function Component({ 
  title, 
  onAction, 
  className,
  children 
}: ComponentProps) {
  // Hooks at the top
  const [state, setState] = useState(false);
  const { data, loading } = useQuery();
  
  // Event handlers
  const handleClick = useCallback(() => {
    onAction?.();
  }, [onAction]);
  
  // Early returns for loading/error states
  if (loading) return <LoadingSpinner />;
  
  // Main render
  return (
    <div className={cn("base-classes", className)}>
      <h2>{title}</h2>
      {children}
      <button onClick={handleClick}>Action</button>
    </div>
  );
}
```

#### Hooks Guidelines
```typescript
// ✅ Good: Custom hooks for reusable logic
function useUserData(userId: string) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    fetchUser(userId)
      .then(setUser)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [userId]);
  
  return { user, loading, error };
}

// ✅ Good: Proper dependency arrays
useEffect(() => {
  fetchData(id, filter);
}, [id, filter]); // Include all dependencies

// ❌ Bad: Missing dependencies
useEffect(() => {
  fetchData(id, filter);
}, []); // Missing id and filter
```

### CSS/Styling Standards

#### Tailwind CSS Guidelines
```typescript
// ✅ Good: Semantic class grouping
<div className={cn(
  // Layout
  "flex items-center justify-between",
  // Spacing
  "p-4 gap-2",
  // Appearance
  "bg-card border border-border rounded-lg",
  // Typography
  "text-card-foreground font-medium",
  // States
  "hover:bg-accent transition-colors",
  // Responsive
  "md:p-6 lg:gap-4",
  // Conditional
  className
)}>

// ❌ Bad: Unorganized classes
<div className="flex bg-card p-4 text-card-foreground border hover:bg-accent items-center border-border rounded-lg font-medium justify-between transition-colors gap-2 md:p-6 lg:gap-4">
```

#### Component Variants
```typescript
// ✅ Good: Using class-variance-authority
const buttonVariants = cva(
  // Base styles
  "inline-flex items-center justify-center rounded-md font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        outline: "border border-input bg-background hover:bg-accent",
        ghost: "hover:bg-accent hover:text-accent-foreground",
      },
      size: {
        sm: "h-9 px-3 text-sm",
        md: "h-10 px-4",
        lg: "h-11 px-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);
```

## 🧪 Testing Standards

### Unit Testing
```typescript
// ✅ Good: Comprehensive component testing
describe('UserProfile', () => {
  const mockUser = {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
  };

  it('renders user information correctly', () => {
    render(<UserProfile user={mockUser} />);
    
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
  });

  it('calls onEdit when edit button is clicked', async () => {
    const onEdit = jest.fn();
    render(<UserProfile user={mockUser} onEdit={onEdit} />);
    
    await user.click(screen.getByRole('button', { name: /edit/i }));
    
    expect(onEdit).toHaveBeenCalledWith(mockUser.id);
  });

  it('handles loading state', () => {
    render(<UserProfile user={null} loading />);
    
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });
});
```

### Integration Testing
```typescript
// ✅ Good: Testing user workflows
describe('Authentication Flow', () => {
  it('allows user to sign in and access dashboard', async () => {
    // Arrange
    const { user } = renderWithProviders(<App />);
    
    // Act
    await user.click(screen.getByRole('link', { name: /sign in/i }));
    await user.type(screen.getByLabelText(/email/i), 'test@example.com');
    await user.type(screen.getByLabelText(/password/i), 'password123');
    await user.click(screen.getByRole('button', { name: /sign in/i }));
    
    // Assert
    await waitFor(() => {
      expect(screen.getByText(/dashboard/i)).toBeInTheDocument();
    });
  });
});
```

### E2E Testing
```typescript
// ✅ Good: Critical user journey testing
test('user can create and edit a project', async ({ page }) => {
  // Sign in
  await page.goto('/sign-in');
  await page.fill('[data-testid="email"]', 'test@example.com');
  await page.fill('[data-testid="password"]', 'password123');
  await page.click('[data-testid="sign-in-button"]');
  
  // Create project
  await page.click('[data-testid="new-project-button"]');
  await page.fill('[data-testid="project-name"]', 'Test Project');
  await page.click('[data-testid="create-project-button"]');
  
  // Verify project created
  await expect(page.locator('[data-testid="project-title"]')).toContainText('Test Project');
});
```

## 📁 File Organization

### Project Structure
```
src/
├── app/                    # Next.js app directory
│   ├── (auth)/            # Route groups
│   │   ├── sign-in/
│   │   └── sign-up/
│   ├── dashboard/         # Protected routes
│   │   ├── projects/
│   │   └── settings/
│   └── api/               # API routes
├── components/            # React components
│   ├── ui/               # Base UI components
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   └── index.ts      # Barrel exports
│   ├── forms/            # Form components
│   ├── dashboard/        # Feature components
│   └── providers/        # Context providers
├── lib/                  # Utilities and configurations
│   ├── utils.ts          # General utilities
│   ├── validations.ts    # Zod schemas
│   ├── api.ts            # API client
│   └── constants.ts      # App constants
├── hooks/                # Custom React hooks
├── types/                # TypeScript type definitions
└── styles/               # Global styles
```

### Import Organization
```typescript
// ✅ Good: Organized imports
// React and Next.js
import React from 'react';
import { useState, useEffect } from 'react';
import Link from 'next/link';

// Third-party libraries
import { clsx } from 'clsx';
import { motion } from 'framer-motion';

// Internal utilities
import { cn } from '@/lib/utils';
import { api } from '@/lib/api';

// Components
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

// Types
import type { User, Project } from '@/types';

// ❌ Bad: Mixed import order
import { Button } from '@/components/ui/button';
import React from 'react';
import type { User } from '@/types';
import { clsx } from 'clsx';
```

## 🔧 Development Workflow

### Git Workflow
```bash
# Feature branch naming
feature/AUTH-001-user-authentication
bugfix/DASH-002-sidebar-navigation
hotfix/critical-security-patch

# Commit message format
type(scope): description

# Examples
feat(auth): add user authentication with Clerk
fix(dashboard): resolve sidebar navigation issue
docs(readme): update installation instructions
test(components): add unit tests for Button component
```

### Code Review Process
1. **Self Review**: Review your own code before creating PR
2. **Automated Checks**: Ensure all CI checks pass
3. **Peer Review**: At least one team member approval required
4. **Testing**: Manual testing of new features
5. **Documentation**: Update relevant documentation

### Branch Protection Rules
- Require pull request reviews
- Require status checks to pass
- Require branches to be up to date
- Restrict pushes to main branch
- Require signed commits

## 🚀 Performance Standards

### Core Web Vitals Targets
- **LCP (Largest Contentful Paint)**: < 2.5s
- **FID (First Input Delay)**: < 100ms
- **CLS (Cumulative Layout Shift)**: < 0.1

### Bundle Size Limits
- **Initial bundle**: < 200KB gzipped
- **Route chunks**: < 100KB gzipped
- **Component chunks**: < 50KB gzipped

### Performance Best Practices
```typescript
// ✅ Good: Lazy loading components
const LazyComponent = lazy(() => import('./HeavyComponent'));

// ✅ Good: Memoizing expensive calculations
const expensiveValue = useMemo(() => {
  return heavyCalculation(data);
}, [data]);

// ✅ Good: Optimizing re-renders
const MemoizedComponent = memo(({ data }) => {
  return <div>{data.title}</div>;
});

// ✅ Good: Using Next.js Image optimization
<Image
  src="/hero-image.jpg"
  alt="Hero"
  width={800}
  height={600}
  priority
/>
```

## 🔒 Security Standards

### Input Validation
```typescript
// ✅ Good: Using Zod for validation
const userSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(2).max(50),
});

// Validate on both client and server
const validateUser = (data: unknown) => {
  return userSchema.parse(data);
};
```

### API Security
```typescript
// ✅ Good: Proper error handling
export async function POST(request: Request) {
  try {
    const user = await auth();
    if (!user) {
      return new Response('Unauthorized', { status: 401 });
    }
    
    const body = await request.json();
    const validatedData = userSchema.parse(body);
    
    // Process request...
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response('Invalid input', { status: 400 });
    }
    
    // Log error but don't expose details
    console.error('API Error:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
```

### Environment Variables
```typescript
// ✅ Good: Validate environment variables
const env = z.object({
  DATABASE_URL: z.string().url(),
  NEXTAUTH_SECRET: z.string().min(32),
  OPENAI_API_KEY: z.string().startsWith('sk-'),
}).parse(process.env);

// ❌ Bad: Direct access without validation
const apiKey = process.env.OPENAI_API_KEY; // Could be undefined
```

## 📚 Documentation Standards

### Code Documentation
```typescript
/**
 * Processes user authentication and returns session data
 * 
 * @param credentials - User login credentials
 * @param options - Authentication options
 * @returns Promise resolving to user session or null
 * 
 * @example
 * ```typescript
 * const session = await authenticateUser({
 *   email: 'user@example.com',
 *   password: 'securePassword'
 * });
 * ```
 */
async function authenticateUser(
  credentials: LoginCredentials,
  options?: AuthOptions
): Promise<UserSession | null> {
  // Implementation...
}
```

### Component Documentation
```typescript
/**
 * A reusable button component with multiple variants and sizes
 * 
 * @component
 * @example
 * ```tsx
 * <Button variant="primary" size="lg" onClick={handleClick}>
 *   Click me
 * </Button>
 * ```
 */
interface ButtonProps {
  /** Button content */
  children: React.ReactNode;
  /** Visual style variant */
  variant?: 'primary' | 'secondary' | 'outline';
  /** Button size */
  size?: 'sm' | 'md' | 'lg';
  /** Click handler */
  onClick?: () => void;
  /** Additional CSS classes */
  className?: string;
}
```

### README Standards
Each feature/component should include:
- Purpose and overview
- Installation/setup instructions
- Usage examples
- API documentation
- Contributing guidelines
- Troubleshooting guide