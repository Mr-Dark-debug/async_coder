import React, { useEffect, useState, useRef } from 'react'
import { NeuralBackground } from './NeuralBackground'
import { ChevronDown } from 'lucide-react'
export function HeroSection() {
  const [scrollPosition, setScrollPosition] = useState(0)
  const sectionRef = useRef<HTMLDivElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  // Track mouse position for 3D effect
  const [mousePosition, setMousePosition] = useState({
    x: 0,
    y: 0,
  })
  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return
      const position = window.scrollY
      const sectionHeight = sectionRef.current.offsetHeight
      if (position <= sectionHeight) {
        setScrollPosition(position / sectionHeight)
      }
    }
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2 // -1 to 1
      const y = (e.clientY / window.innerHeight - 0.5) * 2 // -1 to 1
      setMousePosition({
        x,
        y,
      })
    }
    window.addEventListener('scroll', handleScroll)
    window.addEventListener('mousemove', handleMouseMove)
    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])
  const calculateTransform = (baseValue: number) => {
    return baseValue * scrollPosition
  }
  // Calculate 3D transform based on mouse position
  const calculate3DTransform = (intensity: number = 15) => {
    const rotateX = -mousePosition.y * intensity
    const rotateY = mousePosition.x * intensity
    return `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`
  }
  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen pt-24 flex flex-col items-center justify-center overflow-hidden"
    >
      <NeuralBackground />
      <div
        className="container relative z-10 flex flex-col items-center text-center px-4 transition-all duration-300"
        style={{
          transform: `translateY(${calculateTransform(-50)}px)`,
          opacity: 1 - scrollPosition * 0.8,
        }}
      >
        <div
          className="inline-block mb-6 px-5 py-2 rounded-full bg-white/20 dark:bg-secondary/50 backdrop-blur-sm border border-blue-100/30 dark:border-border shadow-lg shadow-blue-500/5 transform transition-transform hover:scale-105"
          style={{
            transform: calculate3DTransform(5),
          }}
        >
          <span className="text-sm font-medium bg-clip-text text-transparent bg-gradient-to-r from-[#f24d33] to-[#ff8a00]">
            Coming Soon
          </span>
        </div>
        <h1
          ref={headingRef}
          className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-[#f24d33] to-[#ff8a00] transition-all duration-300"
          style={{
            transform: calculate3DTransform(10),
            textShadow: '0 10px 30px rgba(242, 77, 51, 0.3)',
          }}
        >
          The Last AI Assistant You'll Ever Need
        </h1>
        <p
          className="text-xl md:text-2xl text-muted-foreground max-w-3xl mb-10 transition-all duration-300"
          style={{
            transform: calculate3DTransform(8),
          }}
        >
          Async Coder is a revolutionary AI coding assistant that empowers
          developers to go from prompt to pull request with unprecedented speed
          and precision.
        </p>
        <div
          className="flex flex-col sm:flex-row gap-4 w-full max-w-md transition-all duration-300"
          style={{
            transform: calculate3DTransform(12),
          }}
        >
          <button
            ref={buttonRef}
            className="flex-1 px-6 py-4 rounded-md bg-gradient-to-r from-[#f24d33] to-[#ff8a00] text-white font-medium hover:shadow-lg hover:shadow-orange-500/30 transition-all transform hover:scale-105"
            style={{
              boxShadow: '0 10px 25px rgba(242, 77, 51, 0.2)',
            }}
          >
            Join the Waitlist
          </button>
          <button
            className="flex-1 px-6 py-4 rounded-md bg-white dark:bg-secondary text-foreground font-medium hover:shadow-lg hover:shadow-blue-500/10 transition-all transform hover:scale-105"
            style={{
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.05)',
            }}
          >
            Learn More
          </button>
        </div>
        <div className="absolute bottom-12 left-0 right-0 flex justify-center animate-bounce">
          <ChevronDown size={32} className="text-muted-foreground" />
        </div>
      </div>
      <div
        className="absolute w-full h-32 bottom-0 left-0 bg-gradient-to-t from-background to-transparent"
        style={{
          opacity: scrollPosition * 1.5,
        }}
      />
    </section>
  )
}
