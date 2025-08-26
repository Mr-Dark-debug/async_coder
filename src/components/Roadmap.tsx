export default function Roadmap() {
  const roadmapItems = [
    {
      title: "Core modes (Debug, Ask, Documentation, Architect)",
      description: "Foundation modes for debugging, questioning, documentation generation, and architecture planning",
      status: "in-progress",
      progress: 25
    },
    {
      title: "Async Mode (autonomous chaining)",
      description: "Autonomous mode that chains multiple AI modes to handle end-to-end project development",
      status: "planned",
      progress: 0
    },
    {
      title: "PR creation and review",
      description: "Automated pull request creation, review, and intelligent code suggestions",
      status: "planned", 
      progress: 0
    },
    {
      title: "CI/CD integrations (GitHub Actions, GitLab)",
      description: "Seamless integration with popular CI/CD platforms for automated workflows",
      status: "planned",
      progress: 0
    },
    {
      title: "Containerized DevOps Mode (Docker + Kubernetes)",
      description: "Full DevOps automation including containerization and orchestration setup",
      status: "planned",
      progress: 0
    },
    {
      title: "GUI Dashboard for Non-CLI Users",
      description: "Web-based interface for developers who prefer graphical tools over command-line",
      status: "planned",
      progress: 0
    },
    {
      title: "AI Model Plugins (easily add new backends)",
      description: "Plugin system to easily integrate new AI models and backends",
      status: "research",
      progress: 0
    }
  ];

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "completed":
        return {
          color: "bg-green-500",
          text: "text-green-700 dark:text-green-300",
          bg: "bg-green-50 dark:bg-green-900",
          label: "Completed"
        };
      case "in-progress": 
        return {
          color: "bg-blue-500",
          text: "text-blue-700 dark:text-blue-300",
          bg: "bg-blue-50 dark:bg-blue-900",
          label: "In Progress"
        };
      case "planned":
        return {
          color: "bg-gray-400",
          text: "text-gray-700 dark:text-gray-300",
          bg: "bg-gray-50 dark:bg-gray-800",
          label: "Planned"
        };
      case "research":
        return {
          color: "bg-purple-500",
          text: "text-purple-700 dark:text-purple-300",
          bg: "bg-purple-50 dark:bg-purple-900",
          label: "Research"
        };
      default:
        return {
          color: "bg-gray-400",
          text: "text-gray-700 dark:text-gray-300",
          bg: "bg-gray-50 dark:bg-gray-800",
          label: "Planned"
        };
    }
  };

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

        {/* Roadmap Timeline */}
        <div className="relative">
          {/* Vertical Line */}
          <div className="absolute left-4 md:left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-400 via-purple-400 to-pink-400"></div>

          {/* Roadmap Items */}
          <div className="space-y-8">
            {roadmapItems.map((item, index) => {
              const statusConfig = getStatusConfig(item.status);
              return (
                <div key={index} className="relative flex items-start space-x-8">
                  {/* Timeline Dot */}
                  <div className="relative z-10 flex-shrink-0">
                    <div className={`w-8 h-8 ${statusConfig.color} rounded-full flex items-center justify-center shadow-lg`}>
                      <div className="w-3 h-3 bg-white rounded-full"></div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 pb-8">
                    <div className={`p-6 ${statusConfig.bg} rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow duration-200`}>
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white pr-4">
                          {item.title}
                        </h3>
                        <span className={`px-3 py-1 text-xs font-medium rounded-full ${statusConfig.text} ${statusConfig.bg}`}>
                          {statusConfig.label}
                        </span>
                      </div>
                      
                      <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                        {item.description}
                      </p>

                      {/* Progress Bar */}
                      {item.progress > 0 && (
                        <div className="mb-3">
                          <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-300 mb-2">
                            <span>Progress</span>
                            <span>{item.progress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${statusConfig.color} transition-all duration-300`}
                              style={{ width: `${item.progress}%` }}
                            ></div>
                          </div>
                        </div>
                      )}

                      {/* Checkboxes for visual representation */}
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <input 
                          type="checkbox" 
                          checked={item.status === "completed"}
                          readOnly
                          className="mr-2 rounded"
                        />
                        <span>
                          {item.status === "completed" ? "Completed" : 
                           item.status === "in-progress" ? "In Development" :
                           item.status === "research" ? "Research Phase" : "Planned for v0.1.0"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
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
