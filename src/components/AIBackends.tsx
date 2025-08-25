export default function AIBackends() {
  const backends = [
    {
      name: "Claude Code",
      company: "Anthropic",
      description: "Advanced reasoning and code generation with Claude's latest models",
      logo: "🤖",
      color: "from-orange-500 to-red-500",
      features: ["Advanced reasoning", "Large context window", "Code analysis"]
    },
    {
      name: "Gemini CLI",
      company: "Google DeepMind", 
      description: "Google's cutting-edge multimodal AI for coding and development",
      logo: "💎",
      color: "from-blue-500 to-indigo-500",
      features: ["Multimodal capabilities", "Fast inference", "Code optimization"]
    },
    {
      name: "Aider",
      company: "Open-Source CLI AI",
      description: "The popular open-source AI pair programmer for terminal use",
      logo: "🔧",
      color: "from-green-500 to-emerald-500", 
      features: ["Git integration", "Local models", "Command-line focused"]
    },
    {
      name: "Async In-House AI",
      company: "Custom LLMs",
      description: "Custom language models specifically optimized for coding tasks",
      logo: "⚡",
      color: "from-purple-500 to-pink-500",
      features: ["Coding-optimized", "Custom fine-tuning", "Specialized models"]
    },
    {
      name: "Bring Your Own API",
      company: "BYO-AI",
      description: "Plug in OpenAI, Mistral, LLaMA, or any other API effortlessly",
      logo: "🔌",
      color: "from-gray-600 to-gray-800",
      features: ["API flexibility", "Easy integration", "Model choice"],
      featured: true
    }
  ];

  return (
    <section className="py-20 bg-transparent">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Your Choice. Your Rules.
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
            Async Coder supports multiple AI backends. Switch between engines, use your own API keys, 
            or even bring your own custom models. Complete flexibility and control.
          </p>
          <div className="inline-flex items-center space-x-2 bg-blue-100 dark:bg-blue-900 px-4 py-2 rounded-full">
            <span className="text-blue-600 dark:text-blue-400 text-sm font-medium">
              🔑 All backends support your own API keys
            </span>
          </div>
        </div>

        {/* Backends Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {backends.map((backend, index) => (
            <div
              key={index}
              className={`relative p-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 ${
                backend.featured ? 'ring-2 ring-blue-200 dark:ring-blue-800' : ''
              }`}
            >
              {backend.featured && (
                <div className="absolute -top-3 left-6">
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                    Most Flexible
                  </span>
                </div>
              )}

              <div className="flex items-start space-x-4 mb-4">
                <div className={`w-12 h-12 bg-gradient-to-r ${backend.color} rounded-xl flex items-center justify-center text-white text-xl flex-shrink-0`}>
                  {backend.logo}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    {backend.name}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {backend.company}
                  </p>
                </div>
              </div>

              <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                {backend.description}
              </p>

              <div className="space-y-2">
                {backend.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Configuration Example */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-8">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
            Easy Configuration
          </h3>
          <div className="max-w-3xl mx-auto">
            <div className="bg-gray-900 dark:bg-black rounded-lg p-6 font-mono text-sm">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-gray-400 ml-4">.env</span>
              </div>
              <div className="space-y-2">
                <div className="text-gray-400"># Configure your preferred AI backends</div>
                <div><span className="text-blue-400">CLAUDE_API_KEY</span>=<span className="text-green-400">your_key_here</span></div>
                <div><span className="text-blue-400">GEMINI_API_KEY</span>=<span className="text-green-400">your_key_here</span></div>
                <div><span className="text-blue-400">AIDER_KEY</span>=<span className="text-green-400">your_key_here</span></div>
                <div><span className="text-blue-400">OPENAI_API_KEY</span>=<span className="text-green-400">your_key_here</span></div>
                <div><span className="text-blue-400">MISTRAL_API_KEY</span>=<span className="text-green-400">your_key_here</span></div>
              </div>
            </div>
            <div className="mt-4 text-center">
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Switch between backends on the fly or let Async Mode choose the best one for each task
              </p>
            </div>
          </div>
        </div>

        {/* Why Multiple Backends */}
        <div className="mt-16 text-center">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
            Why Multiple AI Backends?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: "🎯",
                title: "Task Specialization",
                description: "Different models excel at different tasks. Use the best tool for each job."
              },
              {
                icon: "🔄",
                title: "Redundancy & Reliability",
                description: "If one service is down, seamlessly switch to another without interruption."
              },
              {
                icon: "💰",
                title: "Cost Optimization", 
                description: "Choose cheaper models for simple tasks, premium models for complex work."
              }
            ].map((benefit, index) => (
              <div key={index} className="p-6">
                <div className="text-4xl mb-4">{benefit.icon}</div>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {benefit.title}
                </h4>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
