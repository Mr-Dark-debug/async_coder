"""
API Key validation services for different providers.
"""

import re
import requests
import json
import logging
from typing import Dict, Any, Tuple, Optional
from abc import ABC, abstractmethod

logger = logging.getLogger(__name__)

class APIKeyValidator(ABC):
    """Abstract base class for API key validators."""
    
    @abstractmethod
    def validate_format(self, api_key: str) -> bool:
        """Validate the format of the API key."""
        pass
    
    @abstractmethod
    def test_api_key(self, api_key: str, metadata: Dict[str, Any] = None) -> Tuple[bool, Optional[str]]:
        """Test if the API key is valid by making a test request."""
        pass

class OpenAIValidator(APIKeyValidator):
    """Validator for OpenAI API keys."""
    
    def validate_format(self, api_key: str) -> bool:
        """Validate OpenAI API key format: sk-[A-Za-z0-9]{48}"""
        pattern = r'^sk-[A-Za-z0-9]{48}$'
        return bool(re.match(pattern, api_key))
    
    def test_api_key(self, api_key: str, metadata: Dict[str, Any] = None) -> Tuple[bool, Optional[str]]:
        """Test OpenAI API key by listing models."""
        try:
            headers = {
                'Authorization': f'Bearer {api_key}',
                'Content-Type': 'application/json'
            }
            
            response = requests.get(
                'https://api.openai.com/v1/models',
                headers=headers,
                timeout=10
            )
            
            if response.status_code == 200:
                return True, None
            elif response.status_code == 401:
                return False, "Invalid API key"
            else:
                return False, f"API test failed with status {response.status_code}"
                
        except requests.RequestException as e:
            return False, f"Network error: {str(e)}"

class ClaudeValidator(APIKeyValidator):
    """Validator for Anthropic Claude API keys."""
    
    def validate_format(self, api_key: str) -> bool:
        """Validate Claude API key format: sk-ant-[A-Za-z0-9-_]{95}"""
        pattern = r'^sk-ant-[A-Za-z0-9\-_]{95}$'
        return bool(re.match(pattern, api_key))
    
    def test_api_key(self, api_key: str, metadata: Dict[str, Any] = None) -> Tuple[bool, Optional[str]]:
        """Test Claude API key by making a simple message request."""
        try:
            headers = {
                'x-api-key': api_key,
                'Content-Type': 'application/json',
                'anthropic-version': '2023-06-01'
            }
            
            data = {
                'model': 'claude-3-haiku-20240307',
                'max_tokens': 10,
                'messages': [{'role': 'user', 'content': 'Hi'}]
            }
            
            response = requests.post(
                'https://api.anthropic.com/v1/messages',
                headers=headers,
                json=data,
                timeout=10
            )
            
            if response.status_code == 200:
                return True, None
            elif response.status_code == 401:
                return False, "Invalid API key"
            else:
                return False, f"API test failed with status {response.status_code}"
                
        except requests.RequestException as e:
            return False, f"Network error: {str(e)}"

class GeminiValidator(APIKeyValidator):
    """Validator for Google Gemini API keys."""
    
    def validate_format(self, api_key: str) -> bool:
        """Validate Gemini API key format: AIza[A-Za-z0-9_-]{35}"""
        pattern = r'^AIza[A-Za-z0-9_\-]{35}$'
        return bool(re.match(pattern, api_key))
    
    def test_api_key(self, api_key: str, metadata: Dict[str, Any] = None) -> Tuple[bool, Optional[str]]:
        """Test Gemini API key by listing models."""
        try:
            response = requests.get(
                f'https://generativelanguage.googleapis.com/v1/models?key={api_key}',
                timeout=10
            )
            
            if response.status_code == 200:
                return True, None
            elif response.status_code == 400:
                error_data = response.json()
                if 'API_KEY_INVALID' in str(error_data):
                    return False, "Invalid API key"
                return False, "API key validation failed"
            else:
                return False, f"API test failed with status {response.status_code}"
                
        except requests.RequestException as e:
            return False, f"Network error: {str(e)}"

class QwenValidator(APIKeyValidator):
    """Validator for Qwen API keys."""
    
    def validate_format(self, api_key: str) -> bool:
        """Validate Qwen API key format: sk-[A-Za-z0-9]{32,64}"""
        pattern = r'^sk-[A-Za-z0-9]{32,64}$'
        return bool(re.match(pattern, api_key))
    
    def test_api_key(self, api_key: str, metadata: Dict[str, Any] = None) -> Tuple[bool, Optional[str]]:
        """Test Qwen API key by listing models."""
        try:
            headers = {
                'Authorization': f'Bearer {api_key}',
                'Content-Type': 'application/json'
            }
            
            response = requests.get(
                'https://dashscope.aliyuncs.com/compatible-mode/v1/models',
                headers=headers,
                timeout=10
            )
            
            if response.status_code == 200:
                return True, None
            elif response.status_code == 401:
                return False, "Invalid API key"
            else:
                return False, f"API test failed with status {response.status_code}"
                
        except requests.RequestException as e:
            return False, f"Network error: {str(e)}"

class DeepSeekValidator(APIKeyValidator):
    """Validator for DeepSeek API keys."""
    
    def validate_format(self, api_key: str) -> bool:
        """Validate DeepSeek API key format: sk-[A-Za-z0-9]{32,64}"""
        pattern = r'^sk-[A-Za-z0-9]{32,64}$'
        return bool(re.match(pattern, api_key))
    
    def test_api_key(self, api_key: str, metadata: Dict[str, Any] = None) -> Tuple[bool, Optional[str]]:
        """Test DeepSeek API key by listing models."""
        try:
            headers = {
                'Authorization': f'Bearer {api_key}',
                'Content-Type': 'application/json'
            }
            
            response = requests.get(
                'https://api.deepseek.com/models',
                headers=headers,
                timeout=10
            )
            
            if response.status_code == 200:
                return True, None
            elif response.status_code == 401:
                return False, "Invalid API key"
            else:
                return False, f"API test failed with status {response.status_code}"
                
        except requests.RequestException as e:
            return False, f"Network error: {str(e)}"

class OpenRouterValidator(APIKeyValidator):
    """Validator for OpenRouter API keys."""
    
    def validate_format(self, api_key: str) -> bool:
        """Validate OpenRouter API key format: sk-or-v1-[A-Za-z0-9]{64}"""
        pattern = r'^sk-or-v1-[A-Za-z0-9]{64}$'
        return bool(re.match(pattern, api_key))
    
    def test_api_key(self, api_key: str, metadata: Dict[str, Any] = None) -> Tuple[bool, Optional[str]]:
        """Test OpenRouter API key by listing models."""
        try:
            headers = {
                'Authorization': f'Bearer {api_key}',
                'Content-Type': 'application/json'
            }
            
            response = requests.get(
                'https://openrouter.ai/api/v1/models',
                headers=headers,
                timeout=10
            )
            
            if response.status_code == 200:
                return True, None
            elif response.status_code == 401:
                return False, "Invalid API key"
            else:
                return False, f"API test failed with status {response.status_code}"
                
        except requests.RequestException as e:
            return False, f"Network error: {str(e)}"

class GroqValidator(APIKeyValidator):
    """Validator for Groq API keys."""

    def validate_format(self, api_key: str) -> bool:
        """Validate Groq API key format: gsk_[A-Za-z0-9]{52}"""
        pattern = r'^gsk_[A-Za-z0-9]{52}$'
        return bool(re.match(pattern, api_key))

    def test_api_key(self, api_key: str, metadata: Dict[str, Any] = None) -> Tuple[bool, Optional[str]]:
        """Test Groq API key by listing models."""
        try:
            headers = {
                'Authorization': f'Bearer {api_key}',
                'Content-Type': 'application/json'
            }

            response = requests.get(
                'https://api.groq.com/openai/v1/models',
                headers=headers,
                timeout=10
            )

            if response.status_code == 200:
                return True, None
            elif response.status_code == 401:
                return False, "Invalid API key"
            else:
                return False, f"API test failed with status {response.status_code}"

        except requests.RequestException as e:
            return False, f"Network error: {str(e)}"

class ElevenLabsValidator(APIKeyValidator):
    """Validator for ElevenLabs API keys."""

    def validate_format(self, api_key: str) -> bool:
        """Validate ElevenLabs API key format: [A-Za-z0-9]{32}"""
        pattern = r'^[A-Za-z0-9]{32}$'
        return bool(re.match(pattern, api_key))

    def test_api_key(self, api_key: str, metadata: Dict[str, Any] = None) -> Tuple[bool, Optional[str]]:
        """Test ElevenLabs API key by listing models."""
        try:
            headers = {
                'xi-api-key': api_key,
                'Content-Type': 'application/json'
            }

            response = requests.get(
                'https://api.elevenlabs.io/v1/models',
                headers=headers,
                timeout=10
            )

            if response.status_code == 200:
                return True, None
            elif response.status_code == 401:
                return False, "Invalid API key"
            else:
                return False, f"API test failed with status {response.status_code}"

        except requests.RequestException as e:
            return False, f"Network error: {str(e)}"

class TavilyValidator(APIKeyValidator):
    """Validator for Tavily API keys."""

    def validate_format(self, api_key: str) -> bool:
        """Validate Tavily API key format: tvly-[A-Za-z0-9]{32,64}"""
        pattern = r'^tvly-[A-Za-z0-9]{32,64}$'
        return bool(re.match(pattern, api_key))

    def test_api_key(self, api_key: str, metadata: Dict[str, Any] = None) -> Tuple[bool, Optional[str]]:
        """Test Tavily API key by checking usage endpoint."""
        try:
            headers = {
                'Authorization': f'Bearer {api_key}',
                'Content-Type': 'application/json'
            }

            response = requests.get(
                'https://api.tavily.com/usage',
                headers=headers,
                timeout=10
            )

            if response.status_code == 200:
                return True, None
            elif response.status_code == 401:
                return False, "Invalid API key"
            else:
                return False, f"API test failed with status {response.status_code}"

        except requests.RequestException as e:
            return False, f"Network error: {str(e)}"

class APIKeyValidationService:
    """Service for validating API keys across different providers."""
    
    _validators = {
        'openai': OpenAIValidator(),
        'claude': ClaudeValidator(),
        'gemini': GeminiValidator(),
        'qwen': QwenValidator(),
        'deepseek': DeepSeekValidator(),
        'openrouter': OpenRouterValidator(),
        'groq': GroqValidator(),
        'elevenlabs': ElevenLabsValidator(),
        'tavily': TavilyValidator()
    }
    
    @classmethod
    def validate_key_format(cls, provider: str, api_key: str) -> bool:
        """Validate API key format for a specific provider."""
        validator = cls._validators.get(provider)
        if not validator:
            logger.warning(f"No validator found for provider: {provider}")
            return False
        
        return validator.validate_format(api_key)
    
    @classmethod
    def test_api_key(cls, provider: str, api_key: str, metadata: Dict[str, Any] = None) -> Tuple[bool, Optional[str]]:
        """Test API key validity for a specific provider."""
        validator = cls._validators.get(provider)
        if not validator:
            return False, f"No validator found for provider: {provider}"
        
        # First check format
        if not validator.validate_format(api_key):
            return False, "Invalid API key format"
        
        # Then test the key
        return validator.test_api_key(api_key, metadata or {})
