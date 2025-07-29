import React, { useEffect, useState, useRef } from 'react'
import { Github, Twitter } from 'lucide-react'
export function Footer() {
  const footerRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const wallRef = useRef<HTMLDivElement>(null)
  const [mousePosition, setMousePosition] = useState({
    x: 0,
    y: 0,
  })
  useEffect(() => {
    const handleScroll = () => {
      if (!footerRef.current || !contentRef.current || !wallRef.current) return
      const footerRect = footerRef.current.getBoundingClientRect()
      const windowHeight = window.innerHeight
      const visibleAmount = Math.max(
        0,
        Math.min(windowHeight - footerRect.top, windowHeight),
      )
      const visibilityRatio = visibleAmount / windowHeight
      if (visibilityRatio > 0) {
        contentRef.current.style.opacity = Math.min(
          visibilityRatio * 2,
          1,
        ).toString()
        wallRef.current.style.opacity = Math.min(
          visibilityRatio * 1.5,
          1,
        ).toString()
        // Parallax effect for the wall
        wallRef.current.style.transform = `translateY(${visibilityRatio * -50}px)
          perspective(1000px) rotateX(${mousePosition.y * -5}deg) rotateY(${mousePosition.x * 5}deg)`
      }
    }
    const handleMouseMove = (e: MouseEvent) => {
      if (!footerRef.current) return
      const rect = footerRef.current.getBoundingClientRect()
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2
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
  }, [mousePosition])
  return (
    <footer
      ref={footerRef}
      className="relative h-screen overflow-hidden bg-white dark:bg-background"
    >
      {/* The "Wall" background */}
      <div
        ref={wallRef}
        className="absolute inset-0 bg-gradient-to-b from-blue-500 to-[#f24d33] dark:bg-[#0a0a0c] opacity-0 transition-opacity duration-300"
      >
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
          <div className="mb-4">
            <div
              className="inline-block h-24 w-24 rounded-xl bg-gradient-to-br from-[#f24d33] to-[#ff8a00] flex items-center justify-center"
              style={{
                boxShadow: '0 20px 60px rgba(242, 77, 51, 0.4)',
                transform: 'perspective(1000px) rotateX(10deg) rotateY(10deg)',
              }}
            >
              <span className="text-white font-bold text-5xl">A</span>
            </div>
          </div>
          <h2
            className="text-4xl md:text-6xl font-bold text-white mb-2"
            style={{
              textShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
            }}
          >
            Async Coder
          </h2>
          <p className="text-xl text-white/80">
            The Last AI Assistant You'll Ever Need
          </p>
        </div>
      </div>
      {/* Footer content */}
      <div
        ref={contentRef}
        className="relative z-10 container h-full flex flex-col justify-between py-16 opacity-0 transition-opacity duration-500"
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div
                className="h-8 w-8 rounded-md bg-gradient-to-br from-[#f24d33] to-[#ff8a00] flex items-center justify-center transform transition-transform hover:scale-110"
                style={{
                  boxShadow: '0 10px 20px rgba(242, 77, 51, 0.2)',
                }}
              >
                <span className="text-white font-bold text-lg">A</span>
              </div>
              <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#f24d33] to-[#ff8a00]">
                Async Coder
              </span>
            </div>
            <p className="text-muted-foreground mb-6 max-w-md">
              A revolutionary AI coding assistant that empowers developers to go
              from prompt to pull request with unprecedented speed and
              precision.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="p-2 rounded-full bg-white dark:bg-secondary hover:bg-gray-50 dark:hover:bg-secondary/80 transition-all transform hover:scale-110 hover:shadow-md"
                style={{
                  boxShadow: '0 4px 10px rgba(0, 0, 0, 0.05)',
                }}
              >
                <Github size={20} />
              </a>
              <a
                href="#"
                className="p-2 rounded-full bg-white dark:bg-secondary hover:bg-gray-50 dark:hover:bg-secondary/80 transition-all transform hover:scale-110 hover:shadow-md"
                style={{
                  boxShadow: '0 4px 10px rgba(0, 0, 0, 0.05)',
                }}
              >
                <Twitter size={20} />
              </a>
            </div>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Product</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#features"
                  className="text-muted-foreground hover:text-[#f24d33] transition-colors"
                >
                  Features
                </a>
              </li>
              <li>
                <a
                  href="#demo"
                  className="text-muted-foreground hover:text-[#f24d33] transition-colors"
                >
                  Demo
                </a>
              </li>
              <li>
                <a
                  href="#pricing"
                  className="text-muted-foreground hover:text-[#f24d33] transition-colors"
                >
                  Pricing
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-[#f24d33] transition-colors"
                >
                  Roadmap
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-[#f24d33] transition-colors"
                >
                  Documentation
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-[#f24d33] transition-colors"
                >
                  GitHub
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-[#f24d33] transition-colors"
                >
                  Discord
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-[#f24d33] transition-colors"
                >
                  Blog
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-blue-100/30 dark:border-border pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-muted-foreground text-sm mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} Async Coder. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <a
              href="#"
              className="text-sm text-muted-foreground hover:text-[#f24d33] transition-colors"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="text-sm text-muted-foreground hover:text-[#f24d33] transition-colors"
            >
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
