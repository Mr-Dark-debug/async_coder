import React from 'react'
import { ThemeProvider } from '../app/components/ThemeProvider'
import { Header } from '../app/components/Header'
import { HeroSection } from '../app/components/HeroSection'
import { FeaturesSection } from '../app/components/FeaturesSection'
import { LiveDiffDemo } from '../app/components/LiveDiffDemo'
import { PricingSection } from '../app/components/PricingSection'
import { Footer } from '../app/components/Footer'
export function App() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background text-foreground overflow-hidden">
        <Header />
        <main>
          <HeroSection />
          <FeaturesSection />
          <LiveDiffDemo />
          <PricingSection />
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  )
}
