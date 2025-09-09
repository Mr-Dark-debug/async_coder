# Async Coder Backend

**A comprehensive Python backend API for the Async Coder AI coding assistant platform.**

## 🏗️ Architecture Overview

The Async Coder backend is built using **Python FastAPI** with a modular, scalable architecture designed to handle AI-powered coding tasks, user management, repository integration, and subscription billing.

### Core Components

```
backend/
├── app/
│   ├── api/                 # API route definitions
│   │   ├── api.py          # Main API router
│   │   ├── deps.py         # Dependency injection
│   │   └── v1/             # API v1 endpoints
│   │       └── endpoints/  # Individual endpoint modules
│   ├── core/               # Core application logic
│   │   └── config.py       # Configuration management
│   ├── db/                 # Database configurations
│   ├── schema/             # Database schema definitions
│   │   └── newschema.sql   # PostgreSQL schema
│   ├── services/           # Business logic services
│   └── utils/              # Utility functions
├── log/                    # Application logs
├── test/                   # Test suite
├── main.py                 # Application entry point
└── requirements.txt        # Python dependencies
```

## 🗄️ Database Architecture

The backend uses **PostgreSQL** with a comprehensive schema supporting:

### Core Tables

#### **Users Management**
- `users` - User accounts with Clerk integration and GitHub connectivity
- `user_repository_access` - Repository access permissions

#### **AI & Models**
- `ai_models` - Available AI models (Claude, GPT, Gemini, etc.)
- `ai_provider_configs` - AI provider configurations
- `model_usage_stats` - Model performance and usage analytics

#### **Repository Integration**
- `repositories` - Connected GitHub repositories
- `repository_webhooks` - GitHub webhook configurations
- `pull_requests` - PR management and tracking
- `pull_request_reviews` - Code review data
- `pull_request_comments` - Review comments

#### **Task Management**
- `tasks` - AI coding tasks and requests
- `task_results` - Task execution results
- `task_logs` - Detailed task execution logs
- `task_analytics` - Performance metrics

#### **API Key Management**
- `api_keys` - User-managed API keys for AI providers
- `api_key_providers` - Supported API providers
- `api_key_usage_logs` - API usage tracking

#### **Billing & Credits**
- `subscription_plans` - Available subscription tiers
- `subscriptions` - User subscription management
- `subscription_invoices` - Billing history
- `subscription_usage` - Usage tracking
- `credit_packages` - Available credit packages
- `credit_purchases` - Credit purchase history
- `credit_transactions` - Credit usage transactions

## 🔧 Key Features

### **Authentication & Authorization**
- **Clerk.js Integration** - Secure user authentication
- **GitHub OAuth** - Repository access and collaboration
- **Role-based Access Control** - Multi-level permissions

### **AI Model Management**
- **Multi-Provider Support** - Claude, GPT, Gemini, Aider, custom models
- **Dynamic Model Selection** - Based on task requirements
- **Usage Analytics** - Performance tracking and optimization
- **Cost Management** - Token usage and billing integration

### **Repository Integration**
- **GitHub API Integration** - Repository management
- **Webhook Support** - Real-time event processing
- **Branch Management** - Multi-branch task execution
- **Pull Request Automation** - Automated PR creation and review

### **Task Execution Engine**
- **Asynchronous Processing** - Non-blocking task execution
- **Multi-mode Support** - Debug, Ask, Documentation, Architect, PR Review
- **Result Tracking** - Comprehensive execution logs
- **Error Handling** - Robust error recovery and reporting

### **Billing & Subscription**
- **Stripe Integration** - Secure payment processing
- **Credit System** - Flexible usage tracking
- **Multiple Plans** - Free, Pro, Enterprise tiers
- **Usage Analytics** - Detailed billing insights

## 🚀 API Endpoints

### **Authentication**
```
POST /api/v1/auth/register     # User registration
POST /api/v1/auth/login        # User login
POST /api/v1/auth/refresh      # Token refresh
POST /api/v1/auth/logout       # User logout
```

### **User Management**
```
GET  /api/v1/users/profile     # Get user profile
PUT  /api/v1/users/profile     # Update user profile
GET  /api/v1/users/credits     # Get credit balance
POST /api/v1/users/github      # Connect GitHub account
```

### **Repository Management**
```
GET  /api/v1/repositories      # List user repositories
POST /api/v1/repositories      # Connect new repository
GET  /api/v1/repositories/{id} # Get repository details
DEL  /api/v1/repositories/{id} # Disconnect repository
```

### **Task Management**
```
POST /api/v1/tasks             # Create new task
GET  /api/v1/tasks             # List user tasks
GET  /api/v1/tasks/{id}        # Get task details
PUT  /api/v1/tasks/{id}        # Update task
DEL  /api/v1/tasks/{id}        # Cancel task
```

### **AI Models**
```
GET  /api/v1/models            # List available models
GET  /api/v1/models/{id}       # Get model details
POST /api/v1/models/test       # Test model connectivity
```

### **API Keys**
```
GET  /api/v1/api-keys          # List user API keys
POST /api/v1/api-keys          # Add new API key
PUT  /api/v1/api-keys/{id}     # Update API key
DEL  /api/v1/api-keys/{id}     # Delete API key
```

## 🔒 Security Features

- **JWT Authentication** - Secure token-based auth
- **API Key Encryption** - Encrypted storage of user API keys
- **Rate Limiting** - DDoS protection and abuse prevention
- **Input Validation** - Comprehensive request validation
- **SQL Injection Prevention** - Parameterized queries
- **CORS Configuration** - Secure cross-origin requests

## 📊 Monitoring & Analytics

- **Request Logging** - Comprehensive API request logs
- **Performance Metrics** - Response time and throughput tracking
- **Error Tracking** - Automated error reporting
- **Usage Analytics** - User behavior and system usage insights
- **Health Checks** - System health monitoring

## 🔧 Development Setup

### **Prerequisites**
- Python 3.9+
- PostgreSQL 13+
- Redis (for caching)

### **Installation**
```bash
# Clone and navigate to backend
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Linux/Mac
# or
venv\Scripts\activate     # Windows

# Install dependencies
pip install -r requirements.txt

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Run database migrations
python -m alembic upgrade head

# Start development server
python main.py
```

### **Environment Variables**
```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/async_coder

# Authentication
CLERK_SECRET_KEY=your_clerk_secret
JWT_SECRET=your_jwt_secret

# GitHub Integration
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret

# AI Providers
CLAUDE_API_KEY=your_claude_key
OPENAI_API_KEY=your_openai_key
GEMINI_API_KEY=your_gemini_key

# Stripe Billing
STRIPE_SECRET_KEY=your_stripe_secret
STRIPE_WEBHOOK_SECRET=your_webhook_secret

# Redis
REDIS_URL=redis://localhost:6379
```

## 🧪 Testing

```bash
# Run all tests
pytest

# Run with coverage
pytest --cov=app

# Run specific test module
pytest test/test_users.py
```

## 📦 Deployment

### **Docker Deployment**
```bash
# Build image
docker build -t async-coder-backend .

# Run container
docker run -p 8000:8000 async-coder-backend
```

### **Production Considerations**
- Use **Gunicorn** with **Uvicorn** workers for production
- Configure **SSL/TLS** certificates
- Set up **load balancing** for high availability
- Implement **database connection pooling**
- Configure **logging aggregation**

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Run the test suite
6. Submit a pull request

## 📄 License

This project is licensed under the Apache 2.0 License - see the [LICENSE](../LICENSE) file for details.