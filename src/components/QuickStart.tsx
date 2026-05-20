import { Download, Settings, Rocket } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: Download,
    title: "Install Async Coder",
    description: "Get started by installing Async Coder CLI tool with a simple pip command. Works on Windows, macOS, and Linux."
  },
  {
    number: "02",
    icon: Settings,
    title: "Configure Your Setup",
    description: "Set up your AI backend preferences by adding API keys for Claude, GPT-4, Gemini, or other supported models."
  },
  {
    number: "03",
    icon: Rocket,
    title: "Start Developing",
    description: "Begin using powerful AI modes like Debug, Ask, Documentation, Architect, or let Async Mode handle everything autonomously."
  }
];

export default function QuickStart() {
  return (
    <section id="quick-start" className="py-20 bg-transparent">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Get Started in 3 Steps
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Set up Async Coder in minutes and start leveraging AI-powered development immediately.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={index} className="relative">
                <div className="flex flex-col h-full p-8 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="text-3xl font-bold text-gray-300 dark:text-gray-700">
                      {step.number}
                    </div>
                    <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-blue-50 dark:bg-blue-950">
                      <Icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {step.description}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-16 -right-4 w-8 h-0.5 bg-gradient-to-r from-blue-300 to-transparent dark:from-blue-700" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
