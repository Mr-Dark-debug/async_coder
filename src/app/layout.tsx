import React from 'react'
import { ThemeProvider } from './components/ThemeProvider'
import { Header } from './components/Header'
import { HeroSection } from './components/HeroSection'
import { FeaturesSection } from './components/FeaturesSection'
import { LiveDiffDemo } from './components/LiveDiffDemo'
import { PricingSection } from './components/PricingSection'
import { Footer } from './components/Footer'
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
