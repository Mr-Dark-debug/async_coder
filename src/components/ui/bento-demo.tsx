import {
  Bug,
  MessageCircle,
  FileText,
  Blocks,
  GitPullRequest,
  Rocket,
} from "lucide-react";

import { BentoCard, BentoGrid } from "@/components/ui/bento-grid";

const features = [
  {
    Icon: Bug,
    name: "Debug Mode",
    description: "Automatically detects bugs, generates fixes, and adds intelligent logging for better runtime insights.",
    href: "#debug",
    cta: "Start Debugging",
    background: (
      <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 to-orange-500/20">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=300&fit=crop&auto=format')] bg-cover bg-center opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
      </div>
    ),
    className: "lg:row-start-1 lg:row-end-3 lg:col-start-1 lg:col-end-2",
  },
  {
    Icon: MessageCircle,
    name: "Ask Mode",
    description: "Ask anything about your codebase or a specific file. Fetches relevant context and provides real-world examples.",
    href: "#ask",
    cta: "Ask Questions",
    background: (
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-cyan-500/20">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1531498860502-7c67cf02f657?w=400&h=300&fit=crop&auto=format')] bg-cover bg-center opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
      </div>
    ),
    className: "lg:row-start-1 lg:row-end-4 lg:col-start-2 lg:col-end-3",
  },
  {
    Icon: FileText,
    name: "Documentation Mode",
    description: "Generates and updates project documentation, inline code comments, and API references.",
    href: "#docs",
    cta: "Generate Docs",
    background: (
      <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-emerald-500/20">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop&auto=format')] bg-cover bg-center opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
      </div>
    ),
    className: "lg:row-start-3 lg:row-end-4 lg:col-start-1 lg:col-end-2",
  },
  {
    Icon: Blocks,
    name: "Architect Planner Mode",
    description: "Designs scalable architectures, proposes best practices, and outlines your technical roadmap.",
    href: "#architect",
    cta: "Plan Architecture",
    background: (
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-violet-500/20">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=400&h=300&fit=crop&auto=format')] bg-cover bg-center opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
      </div>
    ),
    className: "lg:col-start-3 lg:col-end-4 lg:row-start-1 lg:row-end-2",
  },
  {
    Icon: GitPullRequest,
    name: "PR Review Mode",
    description: "Creates new PRs or reviews incoming ones, offering detailed review comments and automated test suggestions.",
    href: "#pr-review",
    cta: "Review Code",
    background: (
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-blue-600/20">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=300&fit=crop&auto=format')] bg-cover bg-center opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
      </div>
    ),
    className: "lg:col-start-3 lg:col-end-4 lg:row-start-2 lg:row-end-3",
  },
  {
    Icon: Rocket,
    name: "Async Mode (Autonomous)",
    description: "The most advanced mode. Autonomously chains all other modes to handle your project end-to-end.",
    href: "#async",
    cta: "Go Autonomous",
    background: (
      <div className="absolute inset-0 bg-gradient-to-br from-pink-500/20 to-rose-500/20">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=400&h=300&fit=crop&auto=format')] bg-cover bg-center opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <div className="absolute top-4 left-4">
          <span className="bg-gradient-to-r from-pink-600 to-rose-600 text-white px-2 py-1 rounded-full text-xs font-medium">
            Most Advanced
          </span>
        </div>
      </div>
    ),
    className: "lg:col-start-3 lg:col-end-4 lg:row-start-3 lg:row-end-4",
  },
];

function BentoDemo() {
  return (
    <BentoGrid className="lg:grid-rows-3">
      {features.map((feature) => (
        <BentoCard key={feature.name} {...feature} />
      ))}
    </BentoGrid>
  );
}

export { BentoDemo };
