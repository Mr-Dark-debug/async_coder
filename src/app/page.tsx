"use client";

import { HeroSection } from "@/components/ui/hero-section-1";
import Features from "@/components/Features";
import AIBackends from "@/components/AIBackends";
import QuickStart from "@/components/QuickStart";
import EnhancedRoadmap from "@/components/EnhancedRoadmap";
import Footer from "@/components/Footer";

import { Component as RaycastBackground } from "@/components/ui/raycast-animated-background";

export default function Home() {
  return (
    <div className="relative min-h-screen">
      {/* Raycast Animated Background for entire page */}
      <div className="fixed inset-0 z-0">
        <RaycastBackground />
      </div>
      
      {/* New Hero Section with integrated navigation */}
      <div className="relative z-10">
        <HeroSection />
      </div>
      
      {/* Remaining content sections */}
      <div className="relative z-10">
        <Features />
        <AIBackends />
        <QuickStart />
        <EnhancedRoadmap />
        <Footer />
      </div>
    </div>
  );
}
