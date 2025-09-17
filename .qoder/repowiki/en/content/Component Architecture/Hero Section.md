# Hero Section

<cite>
**Referenced Files in This Document**   
- [Hero.tsx](file://src\components\Hero.tsx) - *Updated in recent commit*
- [hero-section-1.tsx](file://src\components\ui\hero-section-1.tsx) - *Updated in recent commit*
- [raycast-animated-background.tsx](file://src\components\ui\raycast-animated-background.tsx) - *New background implementation*
- [page.tsx](file://src\app\page.tsx) - *Updated in recent commit*
- [glowing-effect.tsx](file://src\components\ui\glowing-effect.tsx) - *Mouse movement tracking implementation*
- [animated-group.tsx](file://src\components\ui\animated-group.tsx) - *Animation variants with 3D transforms*
</cite>

## Update Summary
**Changes Made**   
- Updated documentation to reflect the new background implementation using Raycast Animated Background
- Corrected component naming: HeroSection is now implemented in hero-section-1.tsx and integrated via page.tsx
- Removed references to non-existent NeuralBackground component
- Added documentation for actual mouse movement tracking implementation in glowing-effect.tsx
- Updated architecture overview to reflect real component relationships
- Removed outdated code examples and diagrams that did not match current implementation
- Added documentation for 3D transform usage in animated components

## Table of Contents
1. [Introduction](#introduction)
2. [Project Structure](#project-structure)
3. [Core Components](#core-components)
4. [Architecture Overview](#architecture-overview)
5. [Detailed Component Analysis](#detailed-component-analysis)
6. [Dependency Analysis](#dependency-analysis)
7. [Performance Considerations](#performance-considerations)
8. [Troubleshooting Guide](#troubleshooting-guide)
9. [Conclusion](#conclusion)

## Introduction

The HeroSection component serves as the primary landing view for the Async Coder application, delivering an immersive visual experience through dynamic animations and interactive effects. This documentation provides a comprehensive analysis of its current implementation, focusing on the integration between the Raycast Animated Background and animated content cards. The component leverages React's state management, event listeners, and CSS transforms to create engaging effects that enhance user engagement. The actual implementation differs significantly from the previously documented version, with the background now powered by Unicorn Studio's Raycast technology and mouse interaction handled through the glowing-effect component.

## Project Structure

The HeroSection component resides within the Next.js application structure under `src/app/components/ui/`, following a feature-based organization pattern. It is integrated into the main page layout and works in conjunction with other UI components to form a cohesive landing experience.

``mermaid
graph TB
subgraph "App Components"
HeroSection[hero-section-1.tsx]
RaycastBackground[raycast-animated-background.tsx]
AnimatedGroup[animated-group.tsx]
Logos3[logos3.tsx]
GlowingEffect[glowing-effect.tsx]
end
subgraph "Main Application"
Page[page.tsx]
Layout[layout.tsx]
end
Page --> HeroSection
Page --> RaycastBackground
HeroSection --> AnimatedGroup
HeroSection --> Logos3
GlowingEffect --> HeroSection
```

**Diagram sources**
- [hero-section-1.tsx](file://src\components\ui\hero-section-1.tsx)
- [raycast-animated-background.tsx](file://src\components\ui\raycast-animated-background.tsx)
- [page.tsx](file://src\app\page.tsx)

**Section sources**
- [hero-section-1.tsx](file://src\components\ui\hero-section-1.tsx)
- [page.tsx](file://src\app\page.tsx)

## Core Components

The HeroSection component combines visual aesthetics with interactive functionality through several key elements: the Raycast Animated Background powered by Unicorn Studio, animated content cards using Framer Motion, and interactive glowing effects that respond to user mouse movements. The component uses React's `useState` and `useEffect` hooks to manage component state and lifecycle events. The actual implementation does not include a NeuralBackground canvas visualization as previously documented, but instead uses an external animation library for the background effect. The glowing-effect component tracks mouse coordinates and applies CSS variable-based animations to create interactive visual feedback.

**Section sources**
- [hero-section-1.tsx](file://src\components\ui\hero-section-1.tsx)
- [raycast-animated-background.tsx](file://src\components\ui\raycast-animated-background.tsx)
- [glowing-effect.tsx](file://src\components\ui\glowing-effect.tsx)

## Architecture Overview

The HeroSection architecture follows a client-side rendering pattern with React components managing state and DOM interactions. The main HeroSection component orchestrates the visual effects by coordinating with the Raycast Animated Background for the backdrop and using AnimatedGroup for staggered animations of content elements. Data flows from user events (mouse movement, scrolling) to event handlers that update CSS variables and trigger animations.

``mermaid
graph TD
A[User Interaction] --> B[Pointer Move Event]
A --> C[Scroll Event]
B --> D[GlowingEffect handleMove]
C --> D
D --> E[requestAnimationFrame]
E --> F[Update CSS Variables]
F --> G[Visual Feedback Animation]
A --> H[HeroSection Navigation]
H --> I[Smooth Scrolling]
I --> J[Content Visibility]
```

**Diagram sources**
- [hero-section-1.tsx](file://src\components\ui\hero-section-1.tsx)
- [glowing-effect.tsx](file://src\components\ui\glowing-effect.tsx)

## Detailed Component Analysis

### HeroSection Component Analysis

The HeroSection component implements a modern landing page experience with animated entrances and interactive elements. It uses React's `useState` and `useRouter` hooks to manage component state and navigation. The component includes a responsive navigation header with mobile menu functionality and authentication state awareness through Clerk integration.

#### Mouse Tracking Implementation

The component itself does not directly track mouse coordinates. Instead, this functionality is delegated to the GlowingEffect component which is applied to various elements:

```typescript
const handleMove = useCallback(
  (e?: MouseEvent | { x: number; y: number }) => {
    if (!containerRef.current) return;

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    animationFrameRef.current = requestAnimationFrame(() => {
      const element = containerRef.current;
      if (!element) return;

      const { left, top, width, height } = element.getBoundingClientRect();
      const mouseX = e?.x ?? lastPosition.current.x;
      const mouseY = e?.y ?? lastPosition.current.y;

      // Update last position for scroll events
      if (e) {
        lastPosition.current = { x: mouseX, y: mouseY };
      }

      // Calculate distance from center and update CSS variable
      const center = [left + width * 0.5, top + height * 0.5];
      const distanceFromCenter = Math.hypot(mouseX - center[0], mouseY - center[1]);
      
      // Update CSS variable for active state
      element.style.setProperty("--active", isActive ? "1" : "0");
    });
  },
  [inactiveZone, proximity, movementDuration]
);
```

This implementation uses `requestAnimationFrame` to throttle mouse movement updates and prevent performance issues. The coordinates are used to calculate the distance from the element's center and update CSS variables that control the visual effects.

#### 3D Transform Usage

While the HeroSection itself does not implement 3D transforms, the animated-group component used within it supports 3D animations through Framer Motion:

```typescript
flip: {
  container: defaultContainerVariants,
  item: {
    hidden: { opacity: 0, rotateX: -90 },
    visible: {
      opacity: 1,
      rotateX: 0,
      transition: { type: 'spring', stiffness: 300, damping: 20 },
    },
  },
}
```

These transforms are applied to individual items within an AnimatedGroup, creating a flipping effect as elements enter the viewport. The actual 3D rendering is handled by Framer Motion's animation engine.

#### Navigation and Authentication Integration

The component includes a responsive navigation header with authentication state awareness:

```typescript
<SignedOut>
  <SignInButton mode="modal">
    <LoadingButton variant="outline" size="sm">
      <span>Login</span>
    </LoadingButton>
  </SignInButton>
  <SignInButton mode="modal">
    <LoadingButton size="sm">
      <span>Sign Up</span>
    </LoadingButton>
  </SignInButton>
</SignedOut>
<SignedIn>
  <UserButton appearance={{ elements: { avatarBox: "w-8 h-8" } }} />
  <LoadingButton size="sm" loading={isGetStartedLoading} onClick={handleGetStartedClick}>
    <span>Go to Dashboard</span>
  </LoadingButton>
</SignedIn>
```

This integration with Clerk provides seamless authentication flows without requiring page reloads.

``mermaid
classDiagram
class HeroSection {
+isSignUpLoading : boolean
+isGitHubLoading : boolean
+isGetStartedLoading : boolean
+menuState : boolean
+isScrolled : boolean
+router : NextRouter
+handleGetStartedClick() : void
+handleGitHubClick() : void
}
class HeroHeader {
+menuState : boolean
+isScrolled : boolean
+isGetStartedLoading : boolean
+router : NextRouter
+handleGetStartedClick() : void
}
class GlowingEffect {
+containerRef : RefObject~HTMLDivElement~
+lastPosition : RefObject~{x : number, y : number}~
+animationFrameRef : RefObject~number~
+handleMove(e : MouseEvent) : void
}
HeroSection --> HeroHeader : "contains"
HeroSection --> AnimatedGroup : "uses for animations"
HeroSection --> GlowingEffect : "applies to interactive elements"
HeroHeader --> "window" : "listens to scroll events"
GlowingEffect --> "document.body" : "listens to pointermove events"
```

**Diagram sources**
- [hero-section-1.tsx](file://src\components\ui\hero-section-1.tsx)
- [glowing-effect.tsx](file://src\components\ui\glowing-effect.tsx)

**Section sources**
- [hero-section-1.tsx](file://src\components\ui\hero-section-1.tsx)

### Raycast Animated Background Analysis

The Raycast Animated Background component creates a dynamic visual effect using the Unicorn Studio React library. It serves as the immersive backdrop for the entire application, replacing the previously documented NeuralBackground canvas implementation.

#### Background Initialization

The component initializes with window size tracking to ensure proper dimensions:

```typescript
export const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize;
};
```

This custom hook ensures the background animation is always sized to match the viewport.

#### External Animation Integration

The component integrates with Unicorn Studio's animation service:

```typescript
return (
  <div className={cn("absolute inset-0 w-full h-full blur-sm")}>
    <UnicornScene
      production={true}
      projectId="cbmTT38A0CcuYxeiyj5H"
      width={width}
      height={height}
    />
  </div>
);
```

This external integration provides a sophisticated animated background without requiring custom canvas rendering code. The blur-sm CSS class applies a subtle blur effect to enhance the depth perception.

#### Client-Side Rendering Considerations

The component uses a client-side check to prevent server-side rendering issues:

```typescript
const [isClient, setIsClient] = useState(false);

useEffect(() => {
  setIsClient(true);
}, []);

if (!isClient || !width || !height) {
  return (
    <div className={cn("absolute inset-0 w-full h-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 animate-pulse")} />
  );
}
```

This ensures the animation only renders on the client side and provides a fallback gradient with pulse animation during hydration.

``mermaid
sequenceDiagram
participant Browser
participant RaycastBackground
participant UnicornStudio
participant Window
Browser->>RaycastBackground : Component mounts
RaycastBackground->>Window : Add resize listener
RaycastBackground->>RaycastBackground : Initialize window size
RaycastBackground->>RaycastBackground : Set isClient to true
RaycastBackground->>UnicornStudio : Render UnicornScene with dimensions
loop Every resize
Window->>RaycastBackground : resize event
RaycastBackground->>RaycastBackground : Update window size state
RaycastBackground->>UnicornStudio : Update scene dimensions
end
```

**Diagram sources**
- [raycast-animated-background.tsx](file://src\components\ui\raycast-animated-background.tsx)

**Section sources**
- [raycast-animated-background.tsx](file://src\components\ui\raycast-animated-background.tsx)

## Dependency Analysis

The HeroSection component has several key dependencies that enable its functionality. The component tree shows how these elements work together to create the final user experience.

``mermaid
graph TD
HeroSection --> AnimatedGroup
HeroSection --> Logos3
HeroSection --> LoadingButton
HeroSection --> GlowingEffect
HeroSection --> Clerk[Authentication]
RaycastBackground --> UnicornStudio[External Animation Service]
AnimatedGroup --> FramerMotion[Animation Library]
GlowingEffect --> MotionReact[Animation Library]
style HeroSection fill:#f9f,stroke:#333
style RaycastBackground fill:#bbf,stroke:#333
style AnimatedGroup fill:#f96,stroke:#333
style GlowingEffect fill:#69f,stroke:#333
```

**Diagram sources**
- [hero-section-1.tsx](file://src\components\ui\hero-section-1.tsx)
- [raycast-animated-background.tsx](file://src\components\ui\raycast-animated-background.tsx)
- [animated-group.tsx](file://src\components\ui\animated-group.tsx)
- [glowing-effect.tsx](file://src\components\ui\glowing-effect.tsx)

**Section sources**
- [hero-section-1.tsx](file://src\components\ui\hero-section-1.tsx)
- [raycast-animated-background.tsx](file://src\components\ui\raycast-animated-background.tsx)

## Performance Considerations

The HeroSection implementation includes several performance optimizations to ensure smooth rendering and responsive interactions:

### Animation Optimization

The implementation leverages several strategies to maintain performance:

1. **requestAnimationFrame throttling**: The glowing-effect component uses `requestAnimationFrame` to limit mouse movement updates to the display refresh rate.

2. **Passive event listeners**: Event listeners are marked as passive to improve scroll performance:
```typescript
window.addEventListener("scroll", handleScroll, { passive: true });
document.body.addEventListener("pointermove", handlePointerMove, { passive: true });
```

3. **Animation cleanup**: The component properly cleans up event listeners and animation frames:
```typescript
return () => {
  if (animationFrameRef.current) {
    cancelAnimationFrame(animationFrameRef.current);
  }
  window.removeEventListener("scroll", handleScroll);
  document.body.removeEventListener("pointermove", handlePointerMove);
};
```

### Rendering Efficiency

The component implements efficient rendering patterns:

```typescript
const GlowingEffect = memo(({ 
  blur = 0,
  inactiveZone = 0.7,
  proximity = 0,
  spread = 20,
  variant = "default",
  glow = false,
  className,
  movementDuration = 2,
  borderWidth = 1,
  disabled = true,
}: GlowingEffectProps) => {
  // Component implementation
});
```

The use of `React.memo` prevents unnecessary re-renders when props haven't changed.

### External Service Integration

The Raycast Animated Background delegates complex animations to an external service, reducing the client-side processing burden. This approach allows for sophisticated visual effects without impacting the main thread performance.

### Memory Management

The component uses `useRef` hooks to maintain references to DOM elements and data structures without triggering re-renders:

```typescript
const containerRef = useRef<HTMLDivElement>(null);
const lastPosition = useRef({ x: 0, y: 0 });
const animationFrameRef = useRef<number>(0);
```

This prevents unnecessary re-renders while maintaining access to mutable values across renders.

## Troubleshooting Guide

### Common Issues and Solutions

**Issue**: Background animation not loading
- **Cause**: Client-side rendering check preventing initialization
- **Solution**: Ensure component is rendered on the client side and wait for `isClient` to be true

**Issue**: Mouse interaction effects not working
- **Cause**: Event listeners not properly attached
- **Solution**: Verify that pointermove and scroll event listeners are correctly set up in the useEffect cleanup

**Issue**: Performance degradation on lower-end devices
- **Cause**: External animation service consuming resources
- **Solution**: Consider implementing a fallback static background for low-performance devices

**Issue**: Authentication buttons not responding
- **Cause**: Clerk integration issues
- **Solution**: Verify Clerk configuration and ensure proper initialization

### Debugging Tips

1. **Console logging**: Add temporary console logs to verify mouse position and animation frame callbacks are working.

2. **Performance monitoring**: Use browser dev tools to monitor FPS and identify performance bottlenecks.

3. **Event verification**: Check that event listeners are properly attached using the Elements panel in dev tools.

4. **Network inspection**: Monitor requests to the Unicorn Studio service to ensure proper loading.

**Section sources**
- [hero-section-1.tsx](file://src\components\ui\hero-section-1.tsx)
- [raycast-animated-background.tsx](file://src\components\ui\raycast-animated-background.tsx)
- [glowing-effect.tsx](file://src\components\ui\glowing-effect.tsx)

## Conclusion

The HeroSection component demonstrates a modern approach to interactive web design, combining external animation services with client-side React components to create an engaging user experience. The implementation differs significantly from the previously documented version, with the background now powered by Unicorn Studio's Raycast technology rather than a custom canvas neural network. The component leverages established libraries like Framer Motion for animations and Clerk for authentication, focusing on integration rather than custom implementation. By using `requestAnimationFrame` for mouse movement tracking and proper cleanup of event listeners, the implementation achieves smooth interactions while maintaining performance. This approach represents a shift from custom canvas implementations to integrated third-party animation services, reducing development complexity while delivering sophisticated visual effects.