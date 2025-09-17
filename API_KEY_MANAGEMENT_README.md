# API Key Management System

A comprehensive API key management system for the Async Coder project, supporting multiple AI providers with validation, testing, and secure storage.

## Supported Providers

- **OpenAI** - GPT models and APIs
- **Anthropic Claude** - Claude AI models  
- **Google Gemini** - Gemini AI models
- **Qwen** - Alibaba Cloud Qwen models
- **DeepSeek** - DeepSeek AI models and reasoning
- **OpenRouter** - Unified API for multiple AI models

## Features

- ✅ **Format Validation** - Validates API key formats for each provider
- ✅ **Live Testing** - Tests API keys against provider endpoints
- ✅ **Secure Storage** - Encrypted storage in Supabase database
- ✅ **User Management** - Per-user API key management
- ✅ **Usage Tracking** - Logs API key usage and statistics
- ✅ **Modern UI** - Clean settings interface with save/test buttons
- ✅ **Error Handling** - Comprehensive error messages and validation

## Setup Instructions

### Backend Setup

1. **Install Dependencies**
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

2. **Environment Configuration**
   ```bash
   cp .env.example .env
   ```
   
   Update `.env` with your Supabase credentials:
   ```env
   DATABASE_URL=https://your-project.supabase.co
   SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_PUBLIC_KEY=your-service-role-key
   ```

3. **Database Setup**
   - Run the SQL schema in `backend/app/dbSchema/newschema.sql` in your Supabase SQL editor
   - This will create all necessary tables and insert default provider configurations

4. **Start Backend Server**
   ```bash
   python -m uvicorn main:app --reload
   ```
   
   Server will be available at `http://localhost:8000`

### Frontend Setup

1. **Environment Configuration**
   ```bash
   cp .env.local.example .env.local
   ```
   
   Update `.env.local`:
   ```env
   NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api/v1
   ```

2. **Start Frontend**
   ```bash
   npm run dev
   ```
   
   Frontend will be available at `http://localhost:3000`

## Usage

### Settings Page

Navigate to `/settings` in your application to access the API key management interface.

For each provider, you can:
1. **Enter API Key** - Paste your API key in the input field
2. **Test Key** - Click "Test" to validate the key against the provider's API
3. **Save Key** - Click "Save" to store the validated key in the database

### API Endpoints

The system provides REST API endpoints for programmatic access:

- `GET /api/v1/api-keys/providers` - List all supported providers
- `GET /api/v1/api-keys` - Get user's API keys
- `POST /api/v1/api-keys` - Save a new API key
- `POST /api/v1/api-keys/test` - Test an API key
- `PUT /api/v1/api-keys/{id}` - Update an API key
- `DELETE /api/v1/api-keys/{id}` - Delete an API key

## Testing

Run the test suite to verify everything is working:

```bash
cd backend
python test_api_keys.py
```

This will test:
- API key format validation
- Database connectivity
- API endpoint functionality

## API Key Formats

Each provider has specific API key formats:

- **OpenAI**: `sk-[A-Za-z0-9]{48}`
- **Claude**: `sk-ant-[A-Za-z0-9-_]{95}`
- **Gemini**: `AIza[A-Za-z0-9_-]{35}`
- **Qwen**: `sk-[A-Za-z0-9]{32,64}`
- **DeepSeek**: `sk-[A-Za-z0-9]{32,64}`
- **OpenRouter**: `sk-or-v1-[A-Za-z0-9]{64}`

## Security Features

- **Encrypted Storage** - API keys are stored securely in the database
- **User Isolation** - Each user can only access their own API keys
- **Key Masking** - Only partial keys are shown in the UI (first 8 + last 4 characters)
- **Validation** - All keys are validated before storage
- **Usage Logging** - API key usage is tracked for monitoring

## Database Schema

The system uses the following main tables:

- `api_key_providers` - Provider configurations and metadata
- `api_keys` - User API keys with encrypted storage
- `api_key_usage_logs` - Usage tracking and statistics
- `ai_models` - Supported AI models per provider
- `ai_provider_configs` - Provider-specific configurations

## Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Verify Supabase credentials in `.env`
   - Check if Supabase project is active
   - Ensure service role key has proper permissions

2. **API Key Validation Failed**
   - Check API key format matches provider requirements
   - Verify the API key is active and has proper permissions
   - Check network connectivity to provider APIs

3. **Frontend API Calls Failing**
   - Ensure backend server is running on port 8000
   - Check CORS configuration if needed
   - Verify API base URL in frontend config

### Getting API Keys

- **OpenAI**: https://platform.openai.com/api-keys
- **Claude**: https://console.anthropic.com/
- **Gemini**: https://ai.google.dev/
- **Qwen**: https://dashscope.aliyuncs.com/
- **DeepSeek**: https://platform.deepseek.com/
- **OpenRouter**: https://openrouter.ai/keys

## Contributing

When adding new providers:

1. Add provider configuration to `newschema.sql`
2. Create validator class in `api_key_validator.py`
3. Update frontend UI to include the new provider
4. Add tests for the new provider
5. Update documentation

## License

This API key management system is part of the Async Coder project.
