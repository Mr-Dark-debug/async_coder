import React, { useEffect, useState, useRef } from 'react'
import { Terminal, Github, Cloud, Code, Zap, Server } from 'lucide-react'
interface FeatureCardProps {
  icon: React.ReactNode
  title: string
  description: string
  delay: number
}
function FeatureCard({ icon, title, description, delay }: FeatureCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)
  const [mousePosition, setMousePosition] = useState({
    x: 0,
    y: 0,
  })
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.classList.add('opacity-100', 'translate-y-0')
            }, delay)
            observer.unobserve(entry.target)
          }
        })
      },
      {
        threshold: 0.1,
      },
    )
    if (cardRef.current) {
      observer.observe(cardRef.current)
    }
    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current)
      }
    }
  }, [delay])
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    setMousePosition({
      x,
      y,
    })
  }
  const calculateTransform = () => {
    if (!isHovered) return 'perspective(1000px) rotateX(0deg) rotateY(0deg)'
    const rotateX = mousePosition.y * -10
    const rotateY = mousePosition.x * 10
    return `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`
  }
  return (
    <div
      ref={cardRef}
      className="bg-white dark:bg-secondary/50 backdrop-blur-sm border border-blue-100/30 dark:border-border rounded-xl p-6 transition-all duration-500 opacity-0 translate-y-10 shadow-lg hover:shadow-xl"
      style={{
        transform: calculateTransform(),
        boxShadow: isHovered
          ? '0 20px 40px rgba(0, 194, 255, 0.1)'
          : '0 10px 30px rgba(0, 0, 0, 0.05)',
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className="h-12 w-12 rounded-lg bg-gradient-to-br from-[#f24d33] to-[#ff8a00] flex items-center justify-center mb-4 transition-transform transform"
        style={{
          boxShadow: '0 10px 20px rgba(242, 77, 51, 0.2)',
          transform: isHovered ? 'translateZ(20px)' : 'translateZ(0)',
        }}
      >
        <div className="text-white">{icon}</div>
      </div>
      <h3
        className="text-xl font-semibold mb-2 transition-transform"
        style={{
          transform: isHovered ? 'translateZ(15px)' : 'translateZ(0)',
        }}
      >
        {title}
      </h3>
      <p
        className="text-muted-foreground transition-transform"
        style={{
          transform: isHovered ? 'translateZ(10px)' : 'translateZ(0)',
        }}
      >
        {description}
      </p>
    </div>
  )
}
export function FeaturesSection() {
  return (
    <section id="features" className="py-24 relative">
      <div className="container px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#f24d33] to-[#ff8a00]">
            Core Features
          </h2>
          <p className="text-xl text-muted-foreground">
            An open-source AI coding assistant that seamlessly integrates with
            your workflow
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard
            icon={<Terminal size={24} />}
            title="Browser-Based Interface"
            description="A sleek, intuitive interface with multiple terminal-based agent windows for maximum productivity."
            delay={100}
          />
          <FeatureCard
            icon={<Zap size={24} />}
            title="Multiple Model Support"
            description="Switch between different models like GPT-4 and Claude 3 for different tasks."
            delay={200}
          />
          <FeatureCard
            icon={<Cloud size={24} />}
            title="Cloud Sandbox Environment"
            description="A secure, containerized environment to test code, debug, and run agents."
            delay={300}
          />
          <FeatureCard
            icon={<Github size={24} />}
            title="GitHub Integration"
            description="Generate and review pull requests directly from your Async Coder workspace."
            delay={400}
          />
          <FeatureCard
            icon={<Code size={24} />}
            title="Agent Capabilities"
            description="Debug, implement new features, and refactor code with AI assistance."
            delay={500}
          />
          <FeatureCard
            icon={<Server size={24} />}
            title="Self-Hosting"
            description="All features available in the free, open-source version that you can self-host."
            delay={600}
          />
        </div>
      </div>
    </section>
  )
}
