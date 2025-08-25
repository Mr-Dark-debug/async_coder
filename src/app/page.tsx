"use client";

import { HeroSection } from "@/components/ui/hero-section-1";
import Features from "@/components/Features";
import AIBackends from "@/components/AIBackends";
import QuickStart from "@/components/QuickStart";
import Roadmap from "@/components/Roadmap";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="relative min-h-screen">
      {/* New Hero Section with integrated navigation */}
      <HeroSection />
      
      {/* Remaining content sections */}
      <div className="relative z-10">
        <Features />
        <AIBackends />
        <QuickStart />
        <Roadmap />
        <Footer />
      </div>
    </div>
  );
}
