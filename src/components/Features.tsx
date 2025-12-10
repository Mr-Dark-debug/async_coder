import { Bug, MessageCircle, FileText, Blocks, GitPullRequest, Rocket } from "lucide-react";

const features = [
  {
    icon: Bug,
    title: "Debug Mode",
    description: "Automatically detects bugs, generates fixes, and adds intelligent logging for better runtime insights."
  },
  {
    icon: MessageCircle,
    title: "Ask Mode",
    description: "Ask anything about your codebase or a specific file. Fetches relevant context and provides real-world examples."
  },
  {
    icon: FileText,
    title: "Documentation",
    description: "Generates and updates project documentation, inline code comments, and API references."
  },
  {
    icon: Blocks,
    title: "Architect Mode",
    description: "Designs scalable architectures, proposes best practices, and outlines your technical roadmap."
  },
  {
    icon: GitPullRequest,
    title: "PR Review",
    description: "Creates new PRs or reviews incoming ones, offering detailed review comments and automated test suggestions."
  },
  {
    icon: Rocket,
    title: "Async Mode",
    description: "The most advanced mode. Autonomously chains all other modes to handle your project end-to-end."
  }
];

export default function Features() {
  return (
    <section id="features" className="py-20 bg-transparent">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Comprehensive AI Modes
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Specialized modes for every stage of your development cycle. From debugging to autonomous development,
            choose the mode that fits your workflow.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="group flex flex-col p-6 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:border-blue-300 dark:hover:border-blue-700 transition-colors duration-200"
              >
                <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-gray-100 dark:bg-gray-800 group-hover:bg-blue-50 dark:group-hover:bg-blue-950 transition-colors duration-200 mb-4">
                  <Icon className="w-6 h-6 text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
