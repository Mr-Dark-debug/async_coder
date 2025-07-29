import React, { useEffect, useState, useRef } from 'react'
import {
  Github,
  Twitter,
  Linkedin,
  MessageCircle,
  ArrowRight,
  Rocket,
  Star,
} from 'lucide-react'
export function Footer() {
  const footerRef = useRef<HTMLElement>(null)
  const [mousePosition, setMousePosition] = useState({
    x: 0,
    y: 0,
  })
  useEffect(() => {
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
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])
  const calculateParallax = (factor: number) => {
    return `translate(${mousePosition.x * factor}px, ${mousePosition.y * factor}px)`
  }
  return (
    <footer
      ref={footerRef}
      className="relative bg-gradient-to-br from-blue-50 to-white dark:from-[#0a0a0c] dark:to-[#13131a] overflow-hidden"
    >
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-40 left-10 w-32 h-32 bg-[#f24d33]/10 rounded-full blur-3xl"
          style={{
            transform: calculateParallax(-20),
          }}
        ></div>
        <div
          className="absolute bottom-20 right-10 w-64 h-64 bg-[#00c2ff]/10 rounded-full blur-3xl"
          style={{
            transform: calculateParallax(-15),
          }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#ff8a00]/5 rounded-full blur-3xl"
          style={{
            transform: `translate(-50%, -50%) ${calculateParallax(-10)}`,
          }}
        ></div>
        {/* Stars */}
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute text-[#f24d33]/20 dark:text-[#f24d33]/30"
            style={{
              top: `${10 + Math.random() * 80}%`,
              left: `${Math.random() * 90}%`,
              transform: `rotate(${Math.random() * 45}deg) scale(${0.5 + Math.random() * 1.5}) ${calculateParallax(-(5 + Math.random() * 15))}`,
            }}
          >
            <Star size={24} />
          </div>
        ))}
      </div>
      {/* Main content */}
      <div className="container pt-20 pb-12 relative z-10">
        {/* Newsletter section */}
        <div className="max-w-4xl mx-auto mb-20">
          <div className="bg-white/50 dark:bg-[#13131a]/50 backdrop-blur-lg rounded-3xl p-8 md:p-12 border border-blue-100/30 dark:border-gray-800/30 shadow-xl">
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="flex-1">
                <h3 className="text-2xl md:text-3xl font-bold mb-4">
                  Stay in the loop
                </h3>
                <p className="text-muted-foreground mb-0 md:mb-4">
                  Get notified when Async Coder launches and receive exclusive
                  early access.
                </p>
              </div>
              <div className="w-full md:w-auto flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="px-4 py-3 rounded-xl border border-blue-100/50 dark:border-gray-800/50 bg-white/80 dark:bg-[#1a1a24]/80 w-full focus:outline-none focus:ring-2 focus:ring-[#f24d33]/50"
                />
                <button className="px-5 py-3 rounded-xl bg-gradient-to-r from-[#f24d33] to-[#ff8a00] text-white font-medium hover:shadow-lg hover:shadow-orange-500/20 transition-all transform hover:scale-105 whitespace-nowrap flex items-center justify-center gap-2">
                  Subscribe <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* Links section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 mb-16">
          <div className="col-span-2">
            <div className="flex items-center space-x-2 mb-6">
              <div
                className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#f24d33] to-[#ff8a00] flex items-center justify-center transform transition-transform hover:scale-110"
                style={{
                  boxShadow: '0 10px 20px rgba(242, 77, 51, 0.2)',
                }}
              >
                <Rocket size={20} className="text-white" />
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#f24d33] to-[#ff8a00]">
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
                className="p-3 rounded-full bg-white/80 dark:bg-[#1a1a24]/80 hover:bg-white dark:hover:bg-[#1a1a24] transition-all transform hover:scale-110 hover:shadow-md"
                style={{
                  boxShadow: '0 4px 10px rgba(0, 0, 0, 0.05)',
                }}
                aria-label="GitHub"
              >
                <Github size={18} />
              </a>
              <a
                href="#"
                className="p-3 rounded-full bg-white/80 dark:bg-[#1a1a24]/80 hover:bg-white dark:hover:bg-[#1a1a24] transition-all transform hover:scale-110 hover:shadow-md"
                style={{
                  boxShadow: '0 4px 10px rgba(0, 0, 0, 0.05)',
                }}
                aria-label="Twitter"
              >
                <Twitter size={18} />
              </a>
              <a
                href="#"
                className="p-3 rounded-full bg-white/80 dark:bg-[#1a1a24]/80 hover:bg-white dark:hover:bg-[#1a1a24] transition-all transform hover:scale-110 hover:shadow-md"
                style={{
                  boxShadow: '0 4px 10px rgba(0, 0, 0, 0.05)',
                }}
                aria-label="LinkedIn"
              >
                <Linkedin size={18} />
              </a>
              <a
                href="#"
                className="p-3 rounded-full bg-white/80 dark:bg-[#1a1a24]/80 hover:bg-white dark:hover:bg-[#1a1a24] transition-all transform hover:scale-110 hover:shadow-md"
                style={{
                  boxShadow: '0 4px 10px rgba(0, 0, 0, 0.05)',
                }}
                aria-label="Discord"
              >
                <MessageCircle size={18} />
              </a>
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-lg">Product</h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="#features"
                  className="text-muted-foreground hover:text-[#f24d33] transition-colors flex items-center gap-2 group"
                >
                  <span className="w-0 h-0.5 bg-[#f24d33] transition-all group-hover:w-2"></span>
                  Features
                </a>
              </li>
              <li>
                <a
                  href="#demo"
                  className="text-muted-foreground hover:text-[#f24d33] transition-colors flex items-center gap-2 group"
                >
                  <span className="w-0 h-0.5 bg-[#f24d33] transition-all group-hover:w-2"></span>
                  Demo
                </a>
              </li>
              <li>
                <a
                  href="#pricing"
                  className="text-muted-foreground hover:text-[#f24d33] transition-colors flex items-center gap-2 group"
                >
                  <span className="w-0 h-0.5 bg-[#f24d33] transition-all group-hover:w-2"></span>
                  Pricing
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-[#f24d33] transition-colors flex items-center gap-2 group"
                >
                  <span className="w-0 h-0.5 bg-[#f24d33] transition-all group-hover:w-2"></span>
                  Roadmap
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-[#f24d33] transition-colors flex items-center gap-2 group"
                >
                  <span className="w-0 h-0.5 bg-[#f24d33] transition-all group-hover:w-2"></span>
                  Changelog
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-lg">Resources</h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-[#f24d33] transition-colors flex items-center gap-2 group"
                >
                  <span className="w-0 h-0.5 bg-[#f24d33] transition-all group-hover:w-2"></span>
                  Documentation
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-[#f24d33] transition-colors flex items-center gap-2 group"
                >
                  <span className="w-0 h-0.5 bg-[#f24d33] transition-all group-hover:w-2"></span>
                  GitHub
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-[#f24d33] transition-colors flex items-center gap-2 group"
                >
                  <span className="w-0 h-0.5 bg-[#f24d33] transition-all group-hover:w-2"></span>
                  Discord
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-[#f24d33] transition-colors flex items-center gap-2 group"
                >
                  <span className="w-0 h-0.5 bg-[#f24d33] transition-all group-hover:w-2"></span>
                  Blog
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-[#f24d33] transition-colors flex items-center gap-2 group"
                >
                  <span className="w-0 h-0.5 bg-[#f24d33] transition-all group-hover:w-2"></span>
                  Support
                </a>
              </li>
            </ul>
          </div>
        </div>
        {/* Bottom bar */}
        <div className="border-t border-blue-100/30 dark:border-gray-800/30 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-muted-foreground text-sm mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} Async Coder. All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center gap-6">
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
            <a
              href="#"
              className="text-sm text-muted-foreground hover:text-[#f24d33] transition-colors"
            >
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
