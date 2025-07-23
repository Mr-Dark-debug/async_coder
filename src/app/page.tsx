import { Github, Bot, Code, Book, ShieldCheck, GitPullRequest, Search, Terminal } from 'lucide-react';
import Auth from '@/components/Auth';

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen bg-background font-sans">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto flex justify-between items-center p-4">
          <div className="flex items-center space-x-2">
            <Bot size={32} className="text-primary" />
            <h1 className="text-2xl font-bold text-text">Async Coder</h1>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <a href="#features" className="text-gray-600 hover:text-accent">Features</a>
            <a href="#how-it-works" className="text-gray-600 hover:text-accent">How It Works</a>
            <a href="#community" className="text-gray-600 hover:text-accent">Community</a>
          </nav>
          <div className="bg-accent text-white font-bold py-2 px-4 rounded-lg hover:bg-primary transition-colors duration-300">
            <Auth />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center py-20 px-4 bg-white">
        <h1 className="text-5xl md:text-6xl font-bold text-text mb-4">
          Async Coder
        </h1>
        <p className="text-2xl text-text mb-6">
          The last AI assistant you'll ever need for coding.
        </p>
        <p className="text-lg text-gray-600 mb-10 max-w-2xl">
          Open-source, multi-engine AI assistant with autonomous coding modes. Build, debug, document, and review PRs—all in one CLI tool.
        </p>
        <div className="flex space-x-4">
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="bg-primary text-white font-bold py-3 px-6 rounded-lg text-lg hover:bg-accent transition-colors duration-300 shadow-lg flex items-center space-x-2">
            <Github size={20} />
            <span>Get Started on GitHub</span>
          </a>
          <a href="#" className="bg-gray-200 text-text font-bold py-3 px-6 rounded-lg text-lg hover:bg-gray-300 transition-colors duration-300 shadow-lg">
            Join the Community
          </a>
        </div>
      </section>

      {/* Features Overview Section */}
      <section id="features" className="py-20 px-4 bg-background">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16 text-text">
            Modes for Every Workflow
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Mode 1: Debug */}
            <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-center space-x-4 mb-4">
                <Search size={32} className="text-accent" />
                <h3 className="text-2xl font-semibold text-text">Debug</h3>
              </div>
              <p className="text-gray-600 mb-4">Find and fix bugs automatically.</p>
              <code className="bg-gray-100 text-sm p-2 rounded-md block">async-coder --debug path/to/file.js</code>
            </div>
            {/* Mode 2: Ask */}
            <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-center space-x-4 mb-4">
                <Bot size={32} className="text-accent" />
                <h3 className="text-2xl font-semibold text-text">Ask</h3>
              </div>
              <p className="text-gray-600 mb-4">Ask questions about your codebase.</p>
              <code className="bg-gray-100 text-sm p-2 rounded-md block">async-coder --ask "How does this function work?"</code>
            </div>
            {/* Mode 3: Docs */}
            <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-center space-x-4 mb-4">
                <Book size={32} className="text-accent" />
                <h3 className="text-2xl font-semibold text-text">Docs</h3>
              </div>
              <p className="text-gray-600 mb-4">Generate documentation for your code.</p>
              <code className="bg-gray-100 text-sm p-2 rounded-md block">async-coder --docs path/to/file.js</code>
            </div>
            {/* Mode 4: Architect */}
            <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="flex items-center space-x-4 mb-4">
                    <Code size={32} className="text-accent" />
                    <h3 className="text-2xl font-semibold text-text">Architect</h3>
                </div>
                <p className="text-gray-600 mb-4">Design and build new features.</p>
                <code className="bg-gray-100 text-sm p-2 rounded-md block">async-coder --architect "Create a new API endpoint"</code>
            </div>
            {/* Mode 5: PR Review */}
            <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="flex items-center space-x-4 mb-4">
                    <GitPullRequest size={32} className="text-accent" />
                    <h3 className="text-2xl font-semibold text-text">PR Review</h3>
                </div>
                <p className="text-gray-600 mb-4">Review pull requests for quality and correctness.</p>
                <code className="bg-gray-100 text-sm p-2 rounded-md block">async-coder --review-pr 123</code>
            </div>
            {/* Mode 6: Async Mode */}
            <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="flex items-center space-x-4 mb-4">
                    <Terminal size={32} className="text-accent" />
                    <h3 className="text-2xl font-semibold text-text">Async Mode</h3>
                </div>
                <p className="text-gray-600 mb-4">Fully autonomous end-to-end coding.</p>
                <code className="bg-gray-100 text-sm p-2 rounded-md block">async-coder --async "Implement feature X"</code>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16 text-text">
            How It Works
          </h2>
          <div className="flex flex-col md:flex-row justify-around items-start gap-10">
            {/* Step 1 */}
            <div className="flex flex-col items-center text-center md:w-1/3 p-6">
              <div className="bg-accent text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mb-6 shadow-md">
                1
              </div>
              <h3 className="text-2xl font-semibold mb-3 text-text">
                Install
              </h3>
              <p className="text-gray-600">
                Install via `pip install async-coder` or `git clone`.
              </p>
            </div>
            {/* Step 2 */}
            <div className="flex flex-col items-center text-center md:w-1/3 p-6">
              <div className="bg-accent text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mb-6 shadow-md">
                2
              </div>
              <h3 className="text-2xl font-semibold mb-3 text-text">
                Configure
              </h3>
              <p className="text-gray-600">
                Add API keys for your preferred AI backends.
              </p>
            </div>
            {/* Step 3 */}
            <div className="flex flex-col items-center text-center md:w-1/3 p-6">
              <div className="bg-accent text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mb-6 shadow-md">
                3
              </div>
              <h3 className="text-2xl font-semibold mb-3 text-text">
                Run
              </h3>
              <p className="text-gray-600">
                Use modes or `--async` for full autonomy.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Community Section */}
      <section id="community" className="py-20 px-4 bg-background">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold text-text mb-8">
            Join Our Open-Source Community
          </h2>
          <p className="text-lg text-gray-600 mb-10 max-w-2xl mx-auto">
            Async Coder is built by the community, for the community. Contribute on GitHub, share your ideas, and help us shape the future of AI-powered development.
          </p>
          <div className="flex justify-center space-x-6 mb-8">
              <div className="text-center">
                  <p className="text-3xl font-bold text-primary">1,234+</p>
                  <p className="text-gray-600">GitHub Stars</p>
              </div>
              <div className="text-center">
                  <p className="text-3xl font-bold text-primary">56+</p>
                  <p className="text-gray-600">Contributors</p>
              </div>
              <div className="text-center">
                  <p className="text-3xl font-bold text-primary">12</p>
                  <p className="text-gray-600">Open Issues</p>
              </div>
          </div>
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="bg-primary text-white font-bold py-3 px-6 rounded-lg text-lg hover:bg-accent transition-colors duration-300 shadow-lg">
            Contribute on GitHub
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white pt-10 border-t">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-between items-center mb-8">
            <div className="w-full md:w-auto text-center md:text-left mb-6 md:mb-0">
              <h3 className="text-2xl font-semibold text-text">Async Coder</h3>
              <p className="text-sm text-gray-500">The last AI assistant you'll ever need for coding.</p>
            </div>
            <div className="flex flex-wrap justify-center md:justify-end gap-x-6 gap-y-3 text-sm">
              <a href="#" className="text-gray-600 hover:text-accent">GitHub</a>
              <a href="#" className="text-gray-600 hover:text-accent">Docs</a>
              <a href="#" className="text-gray-600 hover:text-accent">Community</a>
              <a href="#" className="text-gray-600 hover:text-accent">License</a>
              <a href="#" className="text-gray-600 hover:text-accent">Privacy Policy</a>
            </div>
          </div>
          <div className="text-center text-sm text-gray-500 py-4 border-t">
            &copy; {new Date().getFullYear()} Async Coder. Open-source project.
          </div>
        </div>
      </footer>
    </main>
  );
}
