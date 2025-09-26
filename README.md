# Async Coder
**_The last AI assistant you'll ever need for coding._**

Async Coder is an **open-source, end-to-end AI coding assistant** built to empower developers with full control, unmatched flexibility, and an **autonomous development pipeline**. Think of it as your **developer co-pilot on steroids** — capable of debugging, writing, refactoring, documenting, testing, creating PRs, and even reviewing pull requests, all while learning from every mistake and continuously improving.

Whether you want to use **Claude Code, Gemini CLI, Aider, or our in-house AI**, Async Coder lets you **plug in your own API keys**, switch between engines, or simply run in **Async Mode**, where it autonomously handles your coding tasks **from idea to PR merge**.

🌐 **New Web Interface Available!** Experience Async Coder through our modern, AI-powered dashboard with voice input, real-time chat, and comprehensive settings management.

---

## **Why Async Coder?**

Modern coding assistants are either closed-box SaaS tools or limited single-engine CLI apps. **Async Coder is different:**

- **Open-Source Core** – Complete transparency, self-host forever, and contribute to its evolution.  
- **End-to-End Autonomy** – With **Async Mode**, it can design, build, debug, test, document, and review code independently.  
- **Multi-Engine Support** – Use Claude, Gemini CLI, Aider, or our in-house AI. **Your choice. Your rules.**  
- **Modern Web Interface** – Intuitive dashboard with AI chat, voice input, repository integration, and real-time collaboration.
- **Self-Learning Agent** – Learns from bugs, fixes, and past projects for better accuracy over time.  
- **Developer-Centric Design** – Write test cases, perform code reviews, generate documentation, and manage PRs directly.
- **Secure Authentication** – Built with Clerk.js for enterprise-grade user management and security.
- **Future-Ready** – Architected to integrate with modern CI/CD pipelines and GitHub Actions.

---

## **Key Features**

### **🌐 Modern Web Dashboard**
Experience Async Coder through our cutting-edge web interface:

- **AI-Powered Chat Interface** – v0-style chat with auto-resizing input and intelligent responses
- **Voice Input Support** – Record instructions with real-time visualizer and seamless transcription
- **Repository Integration** – Connect GitHub repositories with branch selection and real-time sync
- **Comprehensive Settings** – Manage AI backends, API keys, custom instructions, and preferences
- **Dark Theme Design** – Professional interface optimized for extended coding sessions
- **Responsive Layout** – Perfect experience across desktop, tablet, and mobile devices

### **🤖 Multi-Mode AI Assistance**
Async Coder offers specialized modes for every stage of your development cycle:

- **Debug Mode**  
  Automatically detects bugs, generates fixes, and adds **intelligent logging** for better runtime insights.  
  _Example:_  
  ```bash
  async-coder --debug my_app.py
  ```

- **Ask Mode**  
  Ask anything about your codebase or a specific file. Async Coder fetches relevant context, explains concepts, and provides real-world examples.  
  _Example:_  
  ```bash
  async-coder --ask "How do I optimize this API route?"
  ```

- **Documentation Mode**  
  Generates and updates project documentation, inline code comments, and API references.  
  _Example:_  
  ```bash
  async-coder --doc ./src/
  ```

- **Architect Planner Mode**  
  Designs scalable architectures, proposes best practices, and even outlines your technical roadmap.  
  _Example:_  
  ```bash
  async-coder --architect "Build a SaaS platform with microservices"
  ```

- **PR Review Mode**  
  Creates new PRs or reviews incoming ones, offering **detailed review comments** and **automated test suggestions**.  
  _Example:_  
  ```bash
  async-coder --pr-review my-feature-branch
  ```

- **Async Mode (Autonomous)**  
  The most advanced mode. Async Coder autonomously **chains all other modes** to handle your project end-to-end:

  - Fetches relevant tech docs and frameworks from the internet.
  - Codes features and tests.
  - Fixes bugs and saves learnings for future usage.
  - Creates PRs, reviews others' PRs, and provides actionable comments.

  _Example:_  
  ```bash
  async-coder --async
  ```

---

## **In-Built Development Tools**

Async Coder doesn't just stop at coding. It comes with **full-stack development intelligence:**

- **Automated Test Generation** – Unit tests, integration tests, and coverage reports.
- **Intelligent Logging** – Inserts optimized logging for easier debugging.
- **Code Review Assistant** – Detects anti-patterns and suggests clean refactors.
- **Continuous Learning** – Stores bug-fix patterns and reusable templates.

---

## **Supported AI Backends**

- **Claude Code** (Anthropic).
- **Gemini CLI** (Google DeepMind).
- **Aider** (Open-Source CLI AI).
- **Async In-House AI** (custom LLMs optimized for coding).
- **Bring Your Own API (BYO-AI)** – Plug in **OpenAI, Mistral, or LLaMA APIs** effortlessly.

---

## **Technology Stack**

**Frontend:**
- **Next.js 15.5.0** with App Router
- **React 19.1.0** with TypeScript
- **Tailwind CSS v4** for styling
- **Framer Motion** for animations
- **Radix UI** for components
- **Lucide React** for icons

**Backend & Services:**
- **Node.js** with TypeScript
- **PostgreSQL** with Drizzle ORM
- **Clerk.js** for authentication
- **RESTful APIs** and Server Actions

**AI Integrations:**
- **Claude Code** (Anthropic)
- **Gemini CLI** (Google DeepMind)
- **OpenAI GPT** models
- **Mistral AI**
- **Aider** (Open-Source)
- **Custom LLaMA** implementations

---

## **Quick Start**

### **1. Installation**

```bash
# Clone the repository
git clone https://github.com/your-org/async-coder.git
cd async-coder

# Install dependencies (recommended: pnpm)
npm install -g pnpm
pnpm install

# Alternative: using npm
npm install
```

### **2. Development Setup**

```bash
# Start the development server
npm run dev
# or
pnpm dev

# Build for production
npm run build
# or
pnpm build

# Start production server
npm start
# or
pnpm start
```

### **3. Configure AI Backends**

Access the web dashboard at `http://localhost:3000` and navigate to Settings to configure your AI backends:

- **Claude API Key**: `sk-ant-...`
- **Gemini API Key**: `AIza...`
- **OpenAI API Key**: `sk-...`

Or create a `.env.local` file:

```env
CLAUDE_API_KEY=your_claude_key_here
GEMINI_API_KEY=your_gemini_key_here
OPENAI_API_KEY=your_openai_key_here
```

### **4. Start Coding with Async Coder**

**Web Interface:**
1. Visit `http://localhost:3000`
2. Sign in with Clerk authentication
3. Navigate to the Task page
4. Start chatting with your AI assistant
5. Use voice input or text to interact
6. Connect your repositories and select branches

### **5. Connect GitHub via MCP**

The GitHub connector lets ChatGPT (or other MCP-compatible clients) talk to your repositories using OAuth. Follow the dedicated [GitHub connector setup guide](docs/github-connector.md) and the new environment samples (`backend/.env.example`, `.env.local.example`) to:

- Register a GitHub App with the correct callback URL.
- Populate the Async Coder backend with your GitHub credentials.
- Launch the **Authorize with GitHub** flow directly from **Settings → Integrations** without intermediary pop-ups.
- Verify connection status and scopes inside the dashboard.

Once connected, update your MCP discovery document so ChatGPT can call the connector endpoints exposed by the FastAPI backend.

**CLI Mode (Coming Soon):**
```bash
# Launch interactive mode
async-coder --ask "Generate a FastAPI boilerplate"

# Or run full autonomous mode
async-coder --async
```

---

## **Roadmap & Current Status**

### **✅ Completed (v0.1.0)**
- [x] **Modern Web Dashboard** with responsive design
- [x] **AI Chat Interface** with v0-style interactions
- [x] **Voice Input System** with real-time visualizer
- [x] **Repository Integration** with GitHub connectivity
- [x] **Comprehensive Settings** management
- [x] **User Authentication** with Clerk.js
- [x] **Dark Theme** optimized interface
- [x] **Multi-AI Backend** support (Claude, Gemini, OpenAI)

### **🚧 In Development (v0.2.0)**
- [ ] **CLI Integration** with web dashboard sync
- [ ] **Real-time Collaboration** features
- [ ] **Advanced Code Analysis** and suggestions
- [ ] **Project Templates** and boilerplates

### **🔮 Future Releases**
- [ ] **Core modes (Debug, Ask, Documentation, Architect)**
- [ ] **Async Mode (autonomous chaining)**
- [ ] **PR creation and review**
- [ ] **CI/CD integrations (GitHub Actions, GitLab)**
- [ ] **Containerized DevOps Mode (Docker + Kubernetes)**
- [ ] **AI Model Plugins (easily add new backends)**
- [ ] **Mobile Application** for iOS and Android

---

## **Contributing**

We're building Async Coder **with and for the open-source community.**

### **Development Setup**
```bash
# Fork and clone the repository
git clone https://github.com/your-username/async-coder.git
cd async-coder

# Install dependencies
pnpm install

# Start development server
pnpm dev

# Run tests
pnpm test

# Build for production
pnpm build
```

### **Project Structure**
```
async-coder/
├── src/
│   ├── app/                 # Next.js App Router pages
│   ├── components/          # React components
│   │   ├── ui/              # Reusable UI components
│   │   └── settings/        # Settings-specific components
│   ├── hooks/               # Custom React hooks
│   ├── lib/                 # Utility functions
│   └── json/                # Configuration files
├── backend/                 # Backend services
└── public/                  # Static assets
```

### **Ways to Contribute**
- **Submit PRs** – Bug fixes, features, and improvements
- **Report Issues** – Bug reports and feature requests
- **Join Discussions** – Share ideas and help shape the roadmap
- **Documentation** – Improve guides and API documentation
- **Plugins & Extensions** – Build your own AI modes or backend support

**Repository Links:**
- **Issues:** [GitHub Issues](https://github.com/your-org/async-coder/issues)
- **Discussions:** [GitHub Discussions](https://github.com/your-org/async-coder/discussions)
- **Contributing Guide:** [CONTRIBUTING.md](./CONTRIBUTING.md)

---

## **License**

Async Coder is licensed under the **Apache 2.0 License**, giving you **freedom to self-host and modify** while encouraging community contributions.

---

## **Tagline**

***"Async Coder – The last AI assistant you'll ever need for coding."***