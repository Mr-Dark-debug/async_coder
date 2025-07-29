import React, { useEffect, useState } from 'react'
import { useTheme } from './ThemeProvider'
import { Moon, Sun, Menu, X, ChevronRight, Rocket } from 'lucide-react'
export function Header() {
  const { theme, toggleTheme } = useTheme()
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isDetached, setIsDetached] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)
  useEffect(() => {
    const handleScroll = () => {
      // Calculate scroll percentage for animations
      const scrollTop = window.scrollY
      const docHeight = document.body.offsetHeight
      const winHeight = window.innerHeight
      const scrollPercent = scrollTop / (docHeight - winHeight)
      setScrollProgress(Math.min(scrollPercent * 3, 1))
      // Set states based on scroll position
      setIsScrolled(window.scrollY > 10)
      // After scrolling 100px, make the navbar "detached"
      if (window.scrollY > 100) {
        setIsDetached(true)
      } else {
        setIsDetached(false)
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
  return (
    <header
      className={`fixed top-0 z-50 left-1/2 transform -translate-x-1/2 transition-all duration-500 ${isScrolled ? 'py-2' : 'py-4'} ${isDetached ? 'w-[94%] max-w-5xl mt-4 rounded-2xl backdrop-blur-xl bg-white/90 dark:bg-[#0a0a0c]/90 shadow-lg shadow-blue-500/10 border border-blue-100/20' : 'w-full bg-transparent'}`}
      style={{
        transform: `translate(-50%, ${isScrolled ? '0' : '4px'})`,
        opacity: isDetached ? 0.98 : 1,
      }}
    >
      <div className="container flex items-center justify-between">
        <div
          className="flex items-center space-x-2 group"
          style={{
            transform: `scale(${1 - scrollProgress * 0.05})`,
            transition: 'transform 0.3s ease-out',
          }}
        >
          <div
            className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#f24d33] to-[#ff8a00] flex items-center justify-center transform transition-transform group-hover:scale-110 group-hover:rotate-3"
            style={{
              boxShadow: '0 10px 20px rgba(242, 77, 51, 0.3)',
              transform: `perspective(1000px) rotateX(${scrollProgress * 5}deg) rotateY(${scrollProgress * 5}deg)`,
            }}
          >
            <Rocket size={20} className="text-white" />
          </div>
          <span
            className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#f24d33] to-[#ff8a00]"
            style={{
              letterSpacing: scrollProgress * -0.5 + 'px',
            }}
          >
            Async Coder
          </span>
        </div>
        <div
          className="hidden md:flex items-center space-x-8"
          style={{
            transform: `translateX(${scrollProgress * -10}px)`,
            opacity: 1 - scrollProgress * 0.3,
          }}
        >
          <nav className="flex space-x-8">
            {['Features', 'Demo', 'Pricing'].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="group relative text-foreground hover:text-[#f24d33] transition-colors"
              >
                <span className="relative z-10">{item}</span>
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-[#f24d33] to-[#ff8a00] transition-all duration-300 group-hover:w-full"></span>
              </a>
            ))}
          </nav>
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full bg-white dark:bg-[#1a1a24] shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5"
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              style={{
                boxShadow:
                  theme === 'light'
                    ? '0 4px 12px rgba(0, 194, 255, 0.1)'
                    : 'none',
              }}
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#f24d33] to-[#ff8a00] text-white font-medium transition-all transform hover:scale-105 hover:shadow-lg hover:shadow-orange-500/20"
              style={{
                boxShadow: '0 4px 12px rgba(242, 77, 51, 0.2)',
              }}
            >
              Join Waitlist
            </button>
          </div>
        </div>
        {/* Mobile menu button */}
        <button
          className="md:hidden p-2 rounded-md bg-white dark:bg-[#1a1a24] shadow-md"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 mx-4 mt-2 rounded-xl bg-white/95 dark:bg-[#0a0a0c]/95 backdrop-blur-xl shadow-lg py-4 border border-blue-100/20">
          <nav className="flex flex-col space-y-2 px-6">
            {['Features', 'Demo', 'Pricing'].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="flex items-center justify-between text-lg py-3 border-b border-blue-100/20 dark:border-gray-800"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span>{item}</span>
                <ChevronRight size={18} className="text-[#f24d33]" />
              </a>
            ))}
            <div className="flex items-center justify-between py-3">
              <span>Theme</span>
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full bg-secondary"
              >
                {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
              </button>
            </div>
            <button className="w-full py-3 rounded-xl bg-gradient-to-r from-[#f24d33] to-[#ff8a00] text-white font-medium shadow-lg shadow-orange-500/20">
              Join Waitlist
            </button>
          </nav>
        </div>
      )}
    </header>
  )
}
