import { FeatureSteps } from "@/components/ui/feature-section";

const features = [
  {
    step: "Step 1",
    title: "Install Async Coder",
    content: "Get started by installing Async Coder CLI tool with simple pip command. Works on Windows, macOS, and Linux.",
    image: "https://images.unsplash.com/photo-1629904853716-f0bc54eea481?q=80&w=2070&auto=format&fit=crop"
  },
  {
    step: "Step 2", 
    title: "Configure API Keys",
    content: "Set up your AI backend preferences by adding API keys for Claude, Gemini, OpenAI, or other supported models.",
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=2070&auto=format&fit=crop"
  },
  {
    step: "Step 3",
    title: "Start Coding with AI",
    content: "Begin using powerful AI modes like Debug, Ask, Documentation, Architect, or let Async Mode handle everything autonomously.",
    image: "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?q=80&w=2069&auto=format&fit=crop"
  }
];

export default function QuickStart() {
  return (
    <section id="quick-start" className="py-20 bg-transparent">
      <FeatureSteps 
        features={features}
        title="Quick Start Guide"
        autoPlayInterval={4000}
        imageHeight="h-[400px]"
      />
    </section>
  );
}
