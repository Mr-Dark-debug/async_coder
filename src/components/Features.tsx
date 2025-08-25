import { BentoDemo } from "@/components/ui/bento-demo";

export default function Features() {

  return (
    <section id="features" className="py-20 bg-transparent">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Multi-Mode AI Assistance
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Specialized modes for every stage of your development cycle. From debugging to deployment,
            Async Coder has the right mode for your needs.
          </p>
        </div>

        {/* BentoGrid Features */}
        <BentoDemo />

        {/* Additional Features */}
        <div className="mt-20">
          <h3 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-12">
            In-Built Development Tools
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: "🧪",
                title: "Automated Test Generation",
                description: "Unit tests, integration tests, and coverage reports"
              },
              {
                icon: "📊",
                title: "Intelligent Logging", 
                description: "Inserts optimized logging for easier debugging"
              },
              {
                icon: "🔍",
                title: "Code Review Assistant",
                description: "Detects anti-patterns and suggests clean refactors"
              },
              {
                icon: "🧠",
                title: "Continuous Learning",
                description: "Stores bug-fix patterns and reusable templates"
              }
            ].map((tool, index) => (
              <div
                key={index}
                className="text-center p-6 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700"
              >
                <div className="text-3xl mb-3">{tool.icon}</div>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {tool.title}
                </h4>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  {tool.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
