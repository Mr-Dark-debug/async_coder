"""
API Key management database operations.
"""

import uuid
from typing import List, Dict, Any, Optional
from datetime import datetime
import logging
from .connection import db

logger = logging.getLogger(__name__)

class APIKeyManager:
    """Manages API key database operations."""
    
    @staticmethod
    def get_providers() -> List[Dict[str, Any]]:
        """Get all available API key providers."""
        try:
            result = db.execute_query(
                table='api_key_providers',
                operation='select',
                filters={'is_active': True}
            )
            return result.data if result.data else []
        except Exception as e:
            logger.error(f"Failed to get providers: {e}")
            return []
    
    @staticmethod
    def get_provider_by_name(provider: str) -> Optional[Dict[str, Any]]:
        """Get provider configuration by name."""
        try:
            result = db.execute_query(
                table='api_key_providers',
                operation='select',
                filters={'provider': provider, 'is_active': True}
            )
            return result.data[0] if result.data else None
        except Exception as e:
            logger.error(f"Failed to get provider {provider}: {e}")
            return None
    
    @staticmethod
    def save_api_key(user_id: str, provider: str, name: str, key_value: str, 
                    description: str = None, metadata: Dict[str, Any] = None) -> Dict[str, Any]:
        """Save a new API key."""
        try:
            api_key_data = {
                'id': str(uuid.uuid4()),
                'user_id': user_id,
                'provider': provider,
                'name': name,
                'description': description,
                'key_value': key_value,
                'metadata': metadata or {},
                'is_active': True,
                'usage_count': 0,
                'created_at': datetime.utcnow().isoformat(),
                'updated_at': datetime.utcnow().isoformat()
            }
            
            result = db.execute_query(
                table='api_keys',
                operation='insert',
                data=api_key_data
            )
            
            if result.data:
                logger.info(f"API key saved for user {user_id}, provider {provider}")
                return result.data[0]
            else:
                raise Exception("Failed to save API key")
                
        except Exception as e:
            logger.error(f"Failed to save API key: {e}")
            raise
    
    @staticmethod
    def get_user_api_keys(user_id: str, provider: str = None) -> List[Dict[str, Any]]:
        """Get API keys for a user, optionally filtered by provider."""
        try:
            filters = {'user_id': user_id, 'is_active': True}
            if provider:
                filters['provider'] = provider
            
            result = db.execute_query(
                table='api_keys',
                operation='select',
                filters=filters
            )
            
            # Remove sensitive key values from response
            api_keys = result.data if result.data else []
            for key in api_keys:
                if 'key_value' in key:
                    # Show only first 8 and last 4 characters
                    key_val = key['key_value']
                    if len(key_val) > 12:
                        key['key_preview'] = f"{key_val[:8]}...{key_val[-4:]}"
                    else:
                        key['key_preview'] = f"{key_val[:4]}...{key_val[-2:]}"
                    del key['key_value']  # Remove full key from response
            
            return api_keys
            
        except Exception as e:
            logger.error(f"Failed to get API keys for user {user_id}: {e}")
            return []
    
    @staticmethod
    def get_api_key_by_id(key_id: str, user_id: str) -> Optional[Dict[str, Any]]:
        """Get a specific API key by ID (with user verification)."""
        try:
            result = db.execute_query(
                table='api_keys',
                operation='select',
                filters={'id': key_id, 'user_id': user_id, 'is_active': True}
            )
            return result.data[0] if result.data else None
        except Exception as e:
            logger.error(f"Failed to get API key {key_id}: {e}")
            return None
    
    @staticmethod
    def update_api_key(key_id: str, user_id: str, updates: Dict[str, Any]) -> bool:
        """Update an API key."""
        try:
            updates['updated_at'] = datetime.utcnow().isoformat()
            
            result = db.execute_query(
                table='api_keys',
                operation='update',
                data=updates,
                filters={'id': key_id, 'user_id': user_id}
            )
            
            return bool(result.data)
            
        except Exception as e:
            logger.error(f"Failed to update API key {key_id}: {e}")
            return False
    
    @staticmethod
    def delete_api_key(key_id: str, user_id: str) -> bool:
        """Soft delete an API key."""
        try:
            result = db.execute_query(
                table='api_keys',
                operation='update',
                data={'is_active': False, 'updated_at': datetime.utcnow().isoformat()},
                filters={'id': key_id, 'user_id': user_id}
            )
            
            return bool(result.data)
            
        except Exception as e:
            logger.error(f"Failed to delete API key {key_id}: {e}")
            return False
    
    @staticmethod
    def log_api_key_usage(api_key_id: str, endpoint: str = None, method: str = None,
                         status_code: int = None, response_time: int = None,
                         tokens_used: int = None, cost: float = None,
                         error_message: str = None, metadata: Dict[str, Any] = None) -> bool:
        """Log API key usage."""
        try:
            usage_data = {
                'id': str(uuid.uuid4()),
                'api_key_id': api_key_id,
                'endpoint': endpoint,
                'method': method,
                'status_code': status_code,
                'response_time': response_time,
                'tokens_used': tokens_used,
                'cost': cost,
                'error_message': error_message,
                'metadata': metadata or {},
                'created_at': datetime.utcnow().isoformat()
            }
            
            result = db.execute_query(
                table='api_key_usage_logs',
                operation='insert',
                data=usage_data
            )
            
            # Update usage count
            if result.data:
                db.execute_query(
                    table='api_keys',
                    operation='update',
                    data={
                        'usage_count': 'usage_count + 1',
                        'last_used': datetime.utcnow().isoformat()
                    },
                    filters={'id': api_key_id}
                )
            
            return bool(result.data)
            
        except Exception as e:
            logger.error(f"Failed to log API key usage: {e}")
            return False
