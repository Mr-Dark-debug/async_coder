"use client";
import React from "react";
import { CheckCircle2 } from "lucide-react";

const roadmapPhases = [
  {
    phase: "Phase 1",
    title: "Foundation",
    status: "In Progress",
    items: [
      "Debug Mode - Interactive debugging assistance",
      "Ask Mode - Natural language code queries",
      "Documentation Mode - Auto-generate docs",
      "Architect Mode - System design planning"
    ]
  },
  {
    phase: "Phase 2",
    title: "Automation",
    status: "Planned",
    items: [
      "Async Mode - Autonomous task chaining",
      "PR Creation & Review - Automated pull requests",
      "Intelligent Code Suggestions",
      "Multi-language support"
    ]
  },
  {
    phase: "Phase 3",
    title: "DevOps",
    status: "Planned",
    items: [
      "CI/CD Integration - GitHub Actions & GitLab",
      "Docker Containerization",
      "Kubernetes Orchestration",
      "Automated Deployment Pipelines"
    ]
  },
  {
    phase: "Phase 4",
    title: "Platform",
    status: "Planned",
    items: [
      "Web-based IDE Integration",
      "Plugin Architecture",
      "Team Collaboration Features",
      "Analytics Dashboard"
    ]
  }
];

export default function EnhancedRoadmap() {
  return (
    <section id="roadmap" className="py-20 bg-transparent">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Development Roadmap
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Our vision for the future of AI-powered development. Track our progress and see what&apos;s coming next.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {roadmapPhases.map((phase, index) => (
            <div
              key={index}
              className="p-8 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900"
            >
              <div className="flex items-start justify-between mb-6">
                <div>
                  <div className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-1">
                    {phase.phase}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {phase.title}
                  </h3>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800">
                  <div className={`w-2 h-2 rounded-full ${phase.status === 'In Progress' ? 'bg-blue-500' : 'bg-gray-400'}`} />
                  <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
                    {phase.status}
                  </span>
                </div>
              </div>
              <ul className="space-y-3">
                {phase.items.map((item, itemIndex) => (
                  <li key={itemIndex} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-gray-300 dark:text-gray-700 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-transparent dark:from-blue-950/20 dark:to-transparent rounded-xl border border-blue-200 dark:border-blue-800/50 p-8">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
              Help Shape the Future
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Async Coder is built with and for the open-source community. Your feedback, contributions, and feature requests directly influence our roadmap.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6">
              <a
                href="https://github.com/your-org/async-coder/discussions"
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
              >
                Discussions
              </a>
              <a
                href="https://github.com/your-org/async-coder/issues"
                className="px-6 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200"
              >
                Report Issues
              </a>
              <a
                href="https://github.com/your-org/async-coder"
                className="px-6 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200"
              >
                GitHub
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}