import React, { useState, useRef } from 'react'
import { Check } from 'lucide-react'
interface PricingTierProps {
  name: string
  price: string
  description: string
  features: string[]
  isPopular?: boolean
  ctaText: string
}
function PricingTier({
  name,
  price,
  description,
  features,
  isPopular,
  ctaText,
}: PricingTierProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [mousePosition, setMousePosition] = useState({
    x: 0,
    y: 0,
  })
  const cardRef = useRef<HTMLDivElement>(null)
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
    const rotateX = mousePosition.y * -8
    const rotateY = mousePosition.x * 8
    return `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`
  }
  return (
    <div
      ref={cardRef}
      className={`
        relative rounded-xl border transition-all duration-300
        ${isPopular ? 'border-[#00c2ff] bg-white dark:bg-secondary/50 shadow-xl' : 'border-blue-100/30 dark:border-border bg-white dark:bg-secondary/30 shadow-lg'}
      `}
      style={{
        transform: `${calculateTransform()} ${isHovered ? 'translateY(-8px)' : 'translateY(0)'}`,
        boxShadow: isPopular
          ? isHovered
            ? '0 30px 60px rgba(0, 194, 255, 0.2)'
            : '0 20px 40px rgba(0, 194, 255, 0.15)'
          : isHovered
            ? '0 20px 40px rgba(0, 0, 0, 0.1)'
            : '0 10px 30px rgba(0, 0, 0, 0.05)',
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isPopular && (
        <div className="absolute -top-4 left-0 right-0 flex justify-center">
          <div className="px-4 py-1 rounded-full bg-[#00c2ff] text-white text-sm font-medium shadow-lg shadow-[#00c2ff]/20">
            Most Popular
          </div>
        </div>
      )}
      <div className="p-6 md:p-8">
        <h3
          className="text-xl font-bold mb-2"
          style={{
            transform: isHovered ? 'translateZ(20px)' : 'translateZ(0)',
            transition: 'transform 0.3s ease-out',
          }}
        >
          {name}
        </h3>
        <div
          className="mb-4"
          style={{
            transform: isHovered ? 'translateZ(15px)' : 'translateZ(0)',
            transition: 'transform 0.3s ease-out',
          }}
        >
          <span className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#f24d33] to-[#ff8a00]">
            {price}
          </span>
          {price !== 'Custom' && price !== '$0' && (
            <span className="text-muted-foreground">/user/month</span>
          )}
        </div>
        <p
          className="text-muted-foreground mb-6"
          style={{
            transform: isHovered ? 'translateZ(10px)' : 'translateZ(0)',
            transition: 'transform 0.3s ease-out',
          }}
        >
          {description}
        </p>
        <ul
          className="space-y-3 mb-8"
          style={{
            transform: isHovered ? 'translateZ(5px)' : 'translateZ(0)',
            transition: 'transform 0.3s ease-out',
          }}
        >
          {features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <div className="mr-2 mt-1 text-[#00c2ff]">
                <Check size={16} />
              </div>
              <span>{feature}</span>
            </li>
          ))}
        </ul>
        <button
          className={`
            w-full py-3 rounded-md font-medium transition-all duration-300
            ${isPopular ? 'bg-gradient-to-r from-[#f24d33] to-[#ff8a00] text-white hover:shadow-lg hover:shadow-orange-500/20' : 'bg-white dark:bg-secondary hover:bg-gray-50 dark:hover:bg-secondary/80 text-foreground hover:shadow-md'}
          `}
          style={{
            transform: isHovered ? 'translateZ(25px)' : 'translateZ(0)',
            boxShadow: isHovered
              ? '0 10px 20px rgba(0, 0, 0, 0.1)'
              : '0 4px 6px rgba(0, 0, 0, 0.05)',
            transition: 'transform 0.3s ease-out, box-shadow 0.3s ease-out',
          }}
        >
          {ctaText}
        </button>
      </div>
    </div>
  )
}
export function PricingSection() {
  return (
    <section id="pricing" className="py-24">
      <div className="container px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#f24d33] to-[#ff8a00]">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-muted-foreground">
            Choose the plan that's right for you or your team
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <PricingTier
            name="Developer"
            price="$0"
            description="Self-hosted, open-source solution for individual developers."
            features={[
              'All core features',
              'Browser-based interface',
              'Multiple model support',
              'GitHub integration',
              'Self-hosting required',
              'Community support',
            ]}
            ctaText="Join Waitlist"
          />
          <PricingTier
            name="Team"
            price="$20"
            description="Hosted solution with team collaboration features."
            features={[
              'All Developer features',
              'Hosted cloud service',
              'Centralized billing & policies',
              'Team-wide API key management',
              'Shared sandbox environments',
              'Priority email & chat support',
            ]}
            isPopular={true}
            ctaText="Join Waitlist"
          />
          <PricingTier
            name="Enterprise"
            price="Custom"
            description="Advanced security and customization for large organizations."
            features={[
              'All Team features',
              'On-premise & VPC deployment',
              'Fine-tuned private models',
              'Custom integrations',
              'Dedicated account manager',
              '24/7 support & SLA',
            ]}
            ctaText="Contact Sales"
          />
        </div>
      </div>
    </section>
  )
}
