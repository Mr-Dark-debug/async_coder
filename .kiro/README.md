# .kiro - Async Coder Project Configuration

This folder contains all the configuration, design requirements, tasks, and guidelines for the Async Coder project. It serves as the central hub for project management and development standards.

## 📁 Folder Structure

```
.kiro/
├── settings/              # Project configuration
│   └── project.json      # Basic project metadata
├── design/               # Design system and requirements
│   ├── system.md         # Design system specifications
│   └── components.md     # Component design requirements
├── tasks/                # Project management
│   ├── current-sprint.md # Current sprint tasks and goals
│   ├── backlog.md        # Product backlog and user stories
│   └── technical-debt.md # Technical debt and refactoring tasks
├── architecture/         # System architecture
│   └── system-design.md  # High-level system architecture
├── steering/             # Development guidelines (auto-included)
│   ├── development-standards.md  # Code quality and standards
│   └── ai-integration.md        # AI integration guidelines
└── README.md            # This file
```

## 🎯 Project Overview

**Async Coder** is an open-source, end-to-end AI coding assistant built to empower developers with autonomous development capabilities. The project aims to provide:

- **Multi-Mode AI Assistance**: Debug, Ask, Documentation, Architect, PR Review, and Async modes
- **Multiple AI Backend Support**: OpenAI, Claude, Gemini, and local models
- **Autonomous Development**: End-to-end project handling with minimal human intervention
- **Developer Control**: Complete transparency and customization options

## 🚀 Current Status

### Phase 1: Landing Page ✅ (Completed)
- [x] Hero section with navigation
- [x] Features showcase (Bento grid)
- [x] AI backends demonstration
- [x] Quick start guide
- [x] Product roadmap
- [x] Footer with links
- [x] Theme system (light/dark mode)
- [x] Responsive design
- [x] Accessibility improvements

### Phase 2: Core Functionality 🔄 (In Progress)
- [ ] User authentication (Clerk integration)
- [ ] Dashboard layout and navigation
- [ ] Basic AI chat interface
- [ ] File management system
- [ ] Code editor integration (Monaco)
- [ ] Multi-AI provider support

### Phase 3: AI Modes 📋 (Planned)
- [ ] Debug Mode implementation
- [ ] Ask Mode with codebase context
- [ ] Documentation generation
- [ ] Architecture planning mode
- [ ] PR review capabilities

### Phase 4: Autonomous Features 🤖 (Future)
- [ ] Async Mode (autonomous chaining)
- [ ] Learning from user interactions
- [ ] Automated testing and deployment
- [ ] Continuous improvement system

## 🛠️ Technology Stack

### Frontend
- **Framework**: Next.js 15 (App Router)
- **Runtime**: React 19
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **Authentication**: Clerk
- **Animations**: Framer Motion
- **Icons**: Lucide React + Radix UI

### Backend (Planned)
- **API**: Next.js API Routes → Node.js/Express
- **Database**: PostgreSQL with Prisma ORM
- **File Storage**: Supabase Storage / AWS S3
- **AI Integration**: Multiple providers (OpenAI, Claude, Gemini)

### Development Tools
- **Package Manager**: npm
- **Linting**: ESLint + Prettier
- **Testing**: Jest + React Testing Library + Playwright
- **CI/CD**: GitHub Actions
- **Deployment**: Vercel

## 📋 Quick Start for Developers

### 1. Understanding the Codebase
```bash
# Read the design system
cat .kiro/design/system.md

# Check current tasks
cat .kiro/tasks/current-sprint.md

# Review development standards
cat .kiro/steering/development-standards.md
```

### 2. Setting Up Development Environment
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run linting
npm run lint

# Build for production
npm run build
```

### 3. Following Development Standards
- **Code Style**: Follow TypeScript and React guidelines in `steering/development-standards.md`
- **Component Structure**: Use the patterns defined in `design/components.md`
- **Git Workflow**: Follow branch naming and commit message conventions
- **Testing**: Write tests for all new components and features

## 🎨 Design System

### Color Palette
- **Light Mode**: Clean whites with slate accents
- **Dark Mode**: Deep darks with proper contrast
- **Semantic Colors**: Success (green), Warning (amber), Error (red), Info (blue)

### Typography
- **Primary Font**: Geist Sans
- **Code Font**: Geist Mono
- **Scale**: Responsive typography with proper hierarchy

### Components
- **Base Components**: Button, Input, Card, Modal, etc.
- **Feature Components**: Dashboard, AI Chat, Code Editor, etc.
- **Layout Components**: Header, Sidebar, Footer, etc.

## 📊 Project Metrics

### Current Metrics
- **Bundle Size**: ~2.1MB (Target: <1.5MB)
- **Performance Score**: 75 (Target: 90+)
- **Accessibility**: WCAG AA compliant
- **TypeScript Coverage**: 85% (Target: 95%)

### Quality Gates
- All tests must pass
- Bundle size under limits
- Performance score > 90
- Accessibility compliance
- Code review approval

## 🔄 Development Workflow

### Sprint Planning
1. **Review Backlog**: Check `tasks/backlog.md`
2. **Plan Sprint**: Update `tasks/current-sprint.md`
3. **Assign Tasks**: Use GitHub Issues/Projects
4. **Daily Standups**: Track progress and blockers

### Code Review Process
1. **Self Review**: Check against development standards
2. **Automated Checks**: CI/CD pipeline validation
3. **Peer Review**: Team member approval
4. **Testing**: Manual and automated testing
5. **Documentation**: Update relevant docs

### Release Process
1. **Feature Complete**: All sprint tasks done
2. **Testing**: Comprehensive QA testing
3. **Staging Deploy**: Deploy to staging environment
4. **Production Deploy**: Deploy to production
5. **Monitoring**: Track metrics and errors

## 🤝 Contributing Guidelines

### For Team Members
1. Read and follow development standards
2. Check current sprint tasks before starting work
3. Create feature branches with proper naming
4. Write comprehensive tests for new features
5. Update documentation as needed

### For External Contributors
1. Fork the repository
2. Read the contributing guidelines
3. Follow the established patterns and standards
4. Submit pull requests with clear descriptions
5. Respond to review feedback promptly

## 📞 Support and Resources

### Documentation
- **Design System**: `design/system.md`
- **Architecture**: `architecture/system-design.md`
- **API Guidelines**: `steering/ai-integration.md`
- **Standards**: `steering/development-standards.md`

### Communication
- **Issues**: GitHub Issues for bugs and features
- **Discussions**: GitHub Discussions for questions
- **Team Chat**: Internal team communication channels
- **Documentation**: Keep all docs updated in `.kiro/`

## 🔮 Future Enhancements

### Short Term (Next 2 Sprints)
- Complete core authentication and dashboard
- Implement basic AI chat functionality
- Add file management capabilities
- Integrate Monaco code editor

### Medium Term (Next 6 Months)
- Full AI mode implementation
- Multi-provider AI support
- Advanced code analysis features
- Team collaboration features

### Long Term (Next Year)
- Autonomous development capabilities
- Enterprise features and compliance
- Plugin system and extensibility
- Advanced analytics and insights

---

**Last Updated**: January 2025  
**Version**: 0.1.0-alpha  
**Maintainers**: Async Coder Team