import Link from "next/link";

export default function Hero() {
  return (
    <section className="min-h-screen flex items-center justify-center bg-transparent">
      <div className="max-w-6xl mx-auto px-6 py-20 text-center">
        <div className="space-y-8">
          {/* Logo/Brand */}
          <div className="inline-flex items-center space-x-3 mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">AC</span>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Async Coder
            </h1>
          </div>

          {/* Main Tagline */}
          <h2 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white leading-tight">
            The last{" "}
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              AI assistant
            </span>
            <br />
            you&apos;ll ever need for coding.
          </h2>

          {/* Description */}
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed">
            An <strong>open-source, end-to-end AI coding assistant</strong> built to empower developers with full control, 
            unmatched flexibility, and an <strong>autonomous development pipeline</strong>. Think of it as your{" "}
            <strong>developer co-pilot on steroids</strong>.
          </p>

          {/* Key Features Pills */}
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            {[
              "🔍 Debug Mode",
              "💬 Ask Mode", 
              "📚 Documentation",
              "🏗️ Architect Planner",
              "🔄 PR Review",
              "🚀 Async Mode"
            ].map((feature) => (
              <span
                key={feature}
                className="px-4 py-2 bg-white dark:bg-gray-800 rounded-full border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 shadow-sm"
              >
                {feature}
              </span>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
            <Link
              href="/sign-up"
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-200 text-lg"
            >
              Get Started Now
            </Link>
            <Link
              href="https://github.com/your-org/async-coder"
              className="px-8 py-4 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200 text-lg"
            >
              View on GitHub
            </Link>
          </div>

          {/* Stats or Social Proof */}
          <div className="pt-12 text-gray-500 dark:text-gray-400">
            <p className="text-sm">
              Open source • Apache 2.0 License • Built for developers, by developers
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
