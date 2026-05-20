import { Box, Lock, Search, Settings, Sparkles } from "lucide-react";

const features = [
  {
    icon: Box,
    title: "Multiple AI Backends",
    description: "Choose from Claude, GPT-4, Gemini, or any OpenAI-compatible API. Switch between models seamlessly based on your project needs."
  },
  {
    icon: Settings,
    title: "Fully Customizable",
    description: "Configure every aspect of your AI assistant. From prompt templates to response formats, make it work exactly how you want."
  },
  {
    icon: Lock,
    title: "Data Privacy",
    description: "Self-hosted option available. Your code never leaves your environment when using local models or private API endpoints."
  },
  {
    icon: Sparkles,
    title: "Advanced Modes",
    description: "Beyond basic chat - Debug Mode for troubleshooting, Architect Mode for planning, and Async Mode for autonomous development."
  },
  {
    icon: Search,
    title: "Enterprise Security",
    description: "Built with security in mind. Audit logs, role-based access, and compliance features for enterprise development teams."
  }
];

export default function AIBackends() {
  return (
    <section id="ai-backends" className="py-20 bg-transparent">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Your Control, Your Rules
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Complete flexibility to choose your AI backend, customize your workflow, and maintain full control over your development process.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 md:gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="p-6 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:shadow-md dark:hover:shadow-lg transition-shadow duration-200"
              >
                <div className="flex items-start gap-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-gray-100 dark:bg-gray-800 flex-shrink-0">
                    <Icon className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
