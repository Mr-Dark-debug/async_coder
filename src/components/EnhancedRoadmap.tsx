"use client";
import React from "react";
import { RoadmapTimeline } from "@/components/ui/roadmap-timeline";

export default function EnhancedRoadmap() {
  return (
    <section id="roadmap" className="py-20 bg-transparent">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Development Roadmap
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
            Our vision for the future of AI-powered development. Track our progress and see what&apos;s coming next.
          </p>
          <div className="inline-flex items-center space-x-2 bg-white dark:bg-gray-800 px-4 py-2 rounded-full border border-gray-200 dark:border-gray-700">
            <span className="text-gray-600 dark:text-gray-300 text-sm font-medium">
              🎯 Version 0.1.0 Target
            </span>
          </div>
        </div>

        {/* Enhanced Timeline Component */}
        <div className="relative -mx-6">
          <RoadmapTimeline />
        </div>

        {/* Community Section */}
        <div className="mt-20 text-center">
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-8 shadow-lg">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Help Shape the Future
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
              Async Coder is built with and for the open-source community. Your feedback, 
              contributions, and feature requests directly influence our roadmap.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6">
              <a
                href="https://github.com/your-org/async-coder/discussions"
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-200"
              >
                💬 Join Discussions
              </a>
              <a
                href="https://github.com/your-org/async-coder/issues"
                className="px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200"
              >
                🐛 Report Issues
              </a>
              <a
                href="https://github.com/your-org/async-coder"
                className="px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200"
              >
                ⭐ Star on GitHub
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}