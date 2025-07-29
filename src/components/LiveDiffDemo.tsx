import React, { useEffect, useState, useRef } from 'react'
import { Play, Pause, RotateCw } from 'lucide-react'
export function LiveDiffDemo() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentStep, setCurrentStep] = useState(0)
  const [mousePosition, setMousePosition] = useState({
    x: 0,
    y: 0,
  })
  const demoContainerRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<number | null>(null)
  const lastTimeRef = useRef<number | null>(null)
  const oldCode = `function calculateTotal(items) {
  let total = 0;
  for (let i = 0; i < items.length; i++) {
    total = total + items[i].price;
  }
  return total;
}`
  const newCode = `/**
 * Calculates the total price of all items with optional discount
 * @param {Array} items - Array of items with price property
 * @param {number} discount - Optional discount percentage
 * @return {number} The total price
 */
function calculateTotal(items, discount = 0) {
  if (!Array.isArray(items)) {
    throw new TypeError('Items must be an array');
  }
  // Calculate sum using reduce for better readability
  const total = items.reduce((sum, item) => sum + item.price, 0);
  // Apply discount if provided
  return discount > 0
    ? total * (1 - discount / 100)
    : total;
}`
  const steps = [
    {
      type: 'thinking',
      text: 'Analyzing function...',
    },
    {
      type: 'thinking',
      text: 'Identifying potential improvements...',
    },
    {
      type: 'thinking',
      text: 'Considering error handling...',
    },
    {
      type: 'thinking',
      text: 'Planning documentation...',
    },
    {
      type: 'typing',
      code: `/**
 * Calculates the total price of all items with optional discount
 * @param {Array} items - Array of items with price property
 * @param {number} discount - Optional discount percentage
 * @return {number} The total price
 */
function calculateTotal(items) {
  let total = 0;
  for (let i = 0; i < items.length; i++) {
    total = total + items[i].price;
  }
  return total;
}`,
    },
    {
      type: 'typing',
      code: `/**
 * Calculates the total price of all items with optional discount
 * @param {Array} items - Array of items with price property
 * @param {number} discount - Optional discount percentage
 * @return {number} The total price
 */
function calculateTotal(items, discount = 0) {
  let total = 0;
  for (let i = 0; i < items.length; i++) {
    total = total + items[i].price;
  }
  return total;
}`,
    },
    {
      type: 'typing',
      code: `/**
 * Calculates the total price of all items with optional discount
 * @param {Array} items - Array of items with price property
 * @param {number} discount - Optional discount percentage
 * @return {number} The total price
 */
function calculateTotal(items, discount = 0) {
  if (!Array.isArray(items)) {
    throw new TypeError('Items must be an array');
  }
  let total = 0;
  for (let i = 0; i < items.length; i++) {
    total = total + items[i].price;
  }
  return total;
}`,
    },
    {
      type: 'typing',
      code: `/**
 * Calculates the total price of all items with optional discount
 * @param {Array} items - Array of items with price property
 * @param {number} discount - Optional discount percentage
 * @return {number} The total price
 */
function calculateTotal(items, discount = 0) {
  if (!Array.isArray(items)) {
    throw new TypeError('Items must be an array');
  }
  // Calculate sum using reduce for better readability
  const total = items.reduce((sum, item) => sum + item.price, 0);
  return total;
}`,
    },
    {
      type: 'typing',
      code: `/**
 * Calculates the total price of all items with optional discount
 * @param {Array} items - Array of items with price property
 * @param {number} discount - Optional discount percentage
 * @return {number} The total price
 */
function calculateTotal(items, discount = 0) {
  if (!Array.isArray(items)) {
    throw new TypeError('Items must be an array');
  }
  // Calculate sum using reduce for better readability
  const total = items.reduce((sum, item) => sum + item.price, 0);
  // Apply discount if provided
  return discount > 0
    ? total * (1 - discount / 100)
    : total;
}`,
    },
  ]
  const animate = (time: number) => {
    if (lastTimeRef.current === null) {
      lastTimeRef.current = time
    }
    const deltaTime = time - lastTimeRef.current
    lastTimeRef.current = time
    // Update progress
    setProgress((prev) => {
      const newProgress = prev + deltaTime / 15000 // Complete in 15 seconds
      // Update current step based on progress
      const stepIndex = Math.min(
        Math.floor(newProgress * steps.length),
        steps.length - 1,
      )
      setCurrentStep(stepIndex)
      if (newProgress >= 1) {
        setIsPlaying(false)
        return 1
      }
      return newProgress
    })
    if (isPlaying) {
      animationRef.current = requestAnimationFrame(animate)
    }
  }
  useEffect(() => {
    if (isPlaying) {
      lastTimeRef.current = null
      animationRef.current = requestAnimationFrame(animate)
    } else if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
    }
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isPlaying])
  const resetDemo = () => {
    setIsPlaying(false)
    setProgress(0)
    setCurrentStep(0)
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
    }
  }
  const togglePlayPause = () => {
    setIsPlaying(!isPlaying)
  }
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!demoContainerRef.current) return
    const rect = demoContainerRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    setMousePosition({
      x,
      y,
    })
  }
  const calculate3DTransform = (intensity: number = 3) => {
    const rotateX = -mousePosition.y * intensity
    const rotateY = mousePosition.x * intensity
    return `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`
  }
  const currentDisplay = () => {
    if (currentStep < 4) {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-full border-4 border-t-[#00c2ff] border-secondary animate-spin mb-4"></div>
            <p className="text-lg font-medium">{steps[currentStep].text}</p>
          </div>
        </div>
      )
    } else {
      return (
        <pre className="p-4 overflow-auto font-mono text-sm">
          {steps[currentStep].code}
        </pre>
      )
    }
  }
  return (
    <section id="demo" className="py-24 bg-blue-50/50 dark:bg-secondary/30">
      <div className="container px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#f24d33] to-[#ff8a00]">
            See It In Action
          </h2>
          <p className="text-xl text-muted-foreground">
            Watch as Async Coder transforms simple code into production-ready
            solutions
          </p>
        </div>
        <div
          ref={demoContainerRef}
          className="max-w-4xl mx-auto transition-all duration-300 ease-out"
          style={{
            transform: calculate3DTransform(),
          }}
          onMouseMove={handleMouseMove}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-background border border-blue-100/30 dark:border-border rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="bg-blue-50/80 dark:bg-secondary/50 px-4 py-2 border-b border-blue-100/30 dark:border-border flex items-center">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <div className="ml-4 text-sm font-medium">Original Code</div>
              </div>
              <pre className="p-4 overflow-auto font-mono text-sm h-80">
                {oldCode}
              </pre>
            </div>
            <div className="bg-white dark:bg-background border border-blue-100/30 dark:border-border rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="bg-blue-50/80 dark:bg-secondary/50 px-4 py-2 border-b border-blue-100/30 dark:border-border flex items-center">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <div className="ml-4 text-sm font-medium">
                  Async Coder Output
                </div>
              </div>
              <div className="h-80 overflow-auto">{currentDisplay()}</div>
            </div>
          </div>
          <div className="mt-8 flex items-center justify-center">
            <div className="flex items-center space-x-4">
              <button
                onClick={togglePlayPause}
                className="p-3 rounded-full bg-white dark:bg-secondary shadow-md hover:shadow-lg transition-all transform hover:scale-110"
                aria-label={isPlaying ? 'Pause demo' : 'Play demo'}
              >
                {isPlaying ? <Pause size={20} /> : <Play size={20} />}
              </button>
              <div className="w-64 h-2 bg-blue-100 dark:bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#f24d33] to-[#ff8a00] rounded-full"
                  style={{
                    width: `${progress * 100}%`,
                    boxShadow: '0 0 10px rgba(242, 77, 51, 0.5)',
                  }}
                ></div>
              </div>
              <button
                onClick={resetDemo}
                className="p-3 rounded-full bg-white dark:bg-secondary shadow-md hover:shadow-lg transition-all transform hover:scale-110"
                aria-label="Reset demo"
              >
                <RotateCw size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
