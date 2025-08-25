"use client";

import Hero from "@/components/Hero";
import Features from "@/components/Features";
import AIBackends from "@/components/AIBackends";
import QuickStart from "@/components/QuickStart";
import Roadmap from "@/components/Roadmap";
import Footer from "@/components/Footer";
import { Component as AnimatedBackground } from "@/components/ui/raycast-animated-background";

export default function Home() {
  return (
    <div className="relative min-h-screen">
      {/* Full-page Animated Background */}
      <div className="fixed inset-0 z-0">
        <AnimatedBackground />
      </div>
      
      {/* Content Overlay */}
      <div className="relative z-10 bg-white/20 dark:bg-black/20 backdrop-blur-sm">
        <Hero />
        <Features />
        <AIBackends />
        <QuickStart />
        <Roadmap />
        <Footer />
      </div>
    </div>
  );
}
