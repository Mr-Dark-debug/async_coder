# Async Coder  
**_The last AI assistant you'll ever need for coding._**

Async Coder is an **open-source, end-to-end AI coding assistant** built to empower developers with full control, unmatched flexibility, and an **autonomous development pipeline**. Think of it as your **developer co-pilot on steroids** — capable of debugging, writing, refactoring, documenting, testing, creating PRs, and even reviewing pull requests, all while learning from every mistake and continuously improving.

Whether you want to use **Claude Code, Gemini CLI, Aider, or our in-house AI**, Async Coder lets you **plug in your own API keys**, switch between engines, or simply run in **Async Mode**, where it autonomously handles your coding tasks **from idea to PR merge**.

---

## **Why Async Coder?**

Modern coding assistants are either closed-box SaaS tools or limited single-engine CLI apps. **Async Coder is different:**

- **Open-Source Core** – Complete transparency, self-host forever, and contribute to its evolution.  
- **End-to-End Autonomy** – With **Async Mode**, it can design, build, debug, test, document, and review code independently.  
- **Multi-Engine Support** – Use Claude, Gemini CLI, Aider, or our in-house AI. **Your choice. Your rules.**  
- **Self-Learning Agent** – Learns from bugs, fixes, and past projects for better accuracy over time.  
- **Developer-Centric Design** – Write test cases, perform code reviews, generate documentation, and manage PRs directly from your CLI.  
- **Future-Ready** – Architected to integrate with modern CI/CD pipelines and GitHub Actions.

---

## **Key Features**

### **1. Multi-Mode AI Assistance**
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

## **Quick Start**

### **1. Installation**

```bash
# Clone the repository
git clone https://github.com/your-org/async-coder.git
cd async-coder

# Install dependencies
pip install -r requirements.txt
```

### **2. Configure AI Backends**

Create a `.env` file and add your API keys:

```env
CLAUDE_API_KEY=your_key_here
GEMINI_API_KEY=your_key_here
AIDER_KEY=your_key_here
```

### **3. Run Async Coder**

```bash
# Launch interactive mode
async-coder --ask "Generate a FastAPI boilerplate"

# Or run full autonomous mode
async-coder --async
```

---

## **Roadmap (v0.1.0)**

- [ ] **Core modes (Debug, Ask, Documentation, Architect)**
- [ ] **Async Mode (autonomous chaining)**
- [ ] **PR creation and review**
- [ ] **CI/CD integrations (GitHub Actions, GitLab)**
- [ ] **Containerized DevOps Mode (Docker + Kubernetes)**
- [ ] **GUI Dashboard for Non-CLI Users**
- [ ] **AI Model Plugins (easily add new backends)**

---

## **Community & Open Source**

We're building Async Coder **with and for the open-source community.**

- **Contribute** – Submit PRs, bug reports, and feature requests.
- **Join Discussions** – Share ideas, suggest integrations, or help shape the roadmap.
- **Plugins & Extensions** – Build your own AI mode or backend support.

**Repo Links:**

- **Issues:** [GitHub Issues](https://github.com/your-org/async-coder/issues)
- **Discussions:** [GitHub Discussions](https://github.com/your-org/async-coder/discussions)

---

## **License**

Async Coder is licensed under the **Apache 2.0 License**, giving you **freedom to self-host and modify** while encouraging community contributions.

---

## **Tagline**

***"Async Coder – The last AI assistant you'll ever need for coding."***
