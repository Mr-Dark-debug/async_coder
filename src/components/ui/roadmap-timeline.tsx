"use client";
import React from "react";
import Image from "next/image";
import { Timeline } from "@/components/ui/timeline";
import { CheckCircle, Clock, Search, Wrench } from "lucide-react";

export function RoadmapTimeline() {
  // Define roadmap data with proper status indicators and content
  const roadmapData = [
    {
      title: "Phase 1 - Foundation",
      content: (
        <div>
          <p className="text-neutral-800 dark:text-neutral-200 text-xs md:text-sm font-normal mb-8">
            Core modes foundation including Debug, Ask, Documentation, and Architecture planning capabilities
          </p>
          
          <div className="mb-8 space-y-3">
            <div className="flex gap-3 items-center text-neutral-700 dark:text-neutral-300 text-xs md:text-sm">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>Debug Mode - Interactive debugging assistance</span>
            </div>
            <div className="flex gap-3 items-center text-neutral-700 dark:text-neutral-300 text-xs md:text-sm">
              <Clock className="w-4 h-4 text-orange-500" />
              <span>Ask Mode - Natural language code queries (25% complete)</span>
            </div>
            <div className="flex gap-3 items-center text-neutral-700 dark:text-neutral-300 text-xs md:text-sm">
              <Wrench className="w-4 h-4 text-blue-500" />
              <span>Documentation Mode - Auto-generate docs</span>
            </div>
            <div className="flex gap-3 items-center text-neutral-700 dark:text-neutral-300 text-xs md:text-sm">
              <Search className="w-4 h-4 text-purple-500" />
              <span>Architect Mode - System design planning</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Image
              src="https://images.unsplash.com/photo-1555949963-aa79dcee981c"
              alt="Code debugging interface"
              width={500}
              height={300}
              className="rounded-lg object-cover h-32 md:h-44 lg:h-60 w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
            />
            <Image
              src="https://images.unsplash.com/photo-1517180102446-f3ece451e9d8"
              alt="Architecture planning"
              width={500}
              height={300}
              className="rounded-lg object-cover h-32 md:h-44 lg:h-60 w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
            />
          </div>
        </div>
      ),
    },
    {
      title: "Phase 2 - Automation",
      content: (
        <div>
          <p className="text-neutral-800 dark:text-neutral-200 text-xs md:text-sm font-normal mb-8">
            Autonomous chaining capabilities and intelligent PR management for seamless development workflows
          </p>
          
          <div className="mb-8 space-y-3">
            <div className="flex gap-3 items-center text-neutral-700 dark:text-neutral-300 text-xs md:text-sm">
              <Clock className="w-4 h-4 text-blue-500" />
              <span>Async Mode - Autonomous task chaining</span>
            </div>
            <div className="flex gap-3 items-center text-neutral-700 dark:text-neutral-300 text-xs md:text-sm">
              <Clock className="w-4 h-4 text-blue-500" />
              <span>PR Creation & Review - Automated pull requests</span>
            </div>
            <div className="flex gap-3 items-center text-neutral-700 dark:text-neutral-300 text-xs md:text-sm">
              <Clock className="w-4 h-4 text-blue-500" />
              <span>Intelligent Code Suggestions</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Image
              src="https://images.unsplash.com/photo-1618477388954-7852f32655ec"
              alt="Automated workflows"
              width={500}
              height={300}
              className="rounded-lg object-cover h-32 md:h-44 lg:h-60 w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
            />
            <Image
              src="https://images.unsplash.com/photo-1556075798-4825dfaaf498"
              alt="Pull request automation"
              width={500}
              height={300}
              className="rounded-lg object-cover h-32 md:h-44 lg:h-60 w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
            />
          </div>
        </div>
      ),
    },
    {
      title: "Phase 3 - DevOps",
      content: (
        <div>
          <p className="text-neutral-800 dark:text-neutral-200 text-xs md:text-sm font-normal mb-8">
            Full DevOps integration with CI/CD pipelines, containerization, and Kubernetes orchestration
          </p>
          
          <div className="mb-8 space-y-3">
            <div className="flex gap-3 items-center text-neutral-700 dark:text-neutral-300 text-xs md:text-sm">
              <Clock className="w-4 h-4 text-purple-500" />
              <span>CI/CD Integration - GitHub Actions & GitLab</span>
            </div>
            <div className="flex gap-3 items-center text-neutral-700 dark:text-neutral-300 text-xs md:text-sm">
              <Clock className="w-4 h-4 text-purple-500" />
              <span>Docker Containerization</span>
            </div>
            <div className="flex gap-3 items-center text-neutral-700 dark:text-neutral-300 text-xs md:text-sm">
              <Clock className="w-4 h-4 text-purple-500" />
              <span>Kubernetes Orchestration</span>
            </div>
            <div className="flex gap-3 items-center text-neutral-700 dark:text-neutral-300 text-xs md:text-sm">
              <Clock className="w-4 h-4 text-purple-500" />
              <span>Automated Deployment Pipelines</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Image
              src="https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9"
              alt="DevOps automation"
              width={500}
              height={300}
              className="rounded-lg object-cover h-32 md:h-44 lg:h-60 w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
            />
            <Image
              src="https://images.unsplash.com/photo-1558494949-ef010cbdcc31"
              alt="Container orchestration"
              width={500}
              height={300}
              className="rounded-lg object-cover h-32 md:h-44 lg:h-60 w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
            />
          </div>
        </div>
      ),
    },
    {
      title: "Phase 4 - Platform",
      content: (
        <div>
          <p className="text-neutral-800 dark:text-neutral-200 text-xs md:text-sm font-normal mb-8">
            User-friendly interfaces and extensible plugin architecture for broad accessibility and customization
          </p>
          
          <div className="mb-8 space-y-3">
            <div className="flex gap-3 items-center text-neutral-700 dark:text-neutral-300 text-xs md:text-sm">
              <Search className="w-4 h-4 text-indigo-500" />
              <span>GUI Dashboard - Web-based interface</span>
            </div>
            <div className="flex gap-3 items-center text-neutral-700 dark:text-neutral-300 text-xs md:text-sm">
              <Search className="w-4 h-4 text-indigo-500" />
              <span>AI Model Plugin System</span>
            </div>
            <div className="flex gap-3 items-center text-neutral-700 dark:text-neutral-300 text-xs md:text-sm">
              <Search className="w-4 h-4 text-indigo-500" />
              <span>Custom Backend Integration</span>
            </div>
            <div className="flex gap-3 items-center text-neutral-700 dark:text-neutral-300 text-xs md:text-sm">
              <Search className="w-4 h-4 text-indigo-500" />
              <span>Community Extensions Marketplace</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Image
              src="https://images.unsplash.com/photo-1551288049-bebda4e38f71"
              alt="Dashboard interface"
              width={500}
              height={300}
              className="rounded-lg object-cover h-32 md:h-44 lg:h-60 w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
            />
            <Image
              src="https://images.unsplash.com/photo-1518364538800-6bae3c2ea0f2"
              alt="Plugin architecture"
              width={500}
              height={300}
              className="rounded-lg object-cover h-32 md:h-44 lg:h-60 w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
            />
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="w-full bg-transparent">
      <div className="w-full">
        <Timeline data={roadmapData} />
      </div>
    </div>
  );
}