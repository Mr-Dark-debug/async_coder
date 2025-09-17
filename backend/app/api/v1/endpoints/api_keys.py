"""
API Key management endpoints.
"""

from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import List, Dict, Any, Optional
import logging
from pydantic import BaseModel, Field

from app.database.api_keys import APIKeyManager
from app.services.api_key_validator import APIKeyValidationService

logger = logging.getLogger(__name__)
security = HTTPBearer()

router = APIRouter(prefix="/api-keys", tags=["api-keys"])

# Pydantic models for request/response
class APIKeyCreateRequest(BaseModel):
    provider: str = Field(..., description="API provider name")
    name: str = Field(..., description="Display name for the API key")
    keyValue: str = Field(..., description="The actual API key")
    description: Optional[str] = Field(None, description="Optional description")
    metadata: Optional[Dict[str, Any]] = Field(default_factory=dict, description="Additional metadata")

class APIKeyTestRequest(BaseModel):
    provider: str = Field(..., description="API provider name")
    keyValue: str = Field(..., description="The actual API key")
    metadata: Optional[Dict[str, Any]] = Field(default_factory=dict, description="Additional metadata")

class APIKeyResponse(BaseModel):
    id: str
    provider: str
    name: str
    description: Optional[str]
    key_preview: str
    is_active: bool
    usage_count: int
    last_used: Optional[str]
    created_at: str
    updated_at: str

class APIKeyTestResponse(BaseModel):
    valid: bool
    error: Optional[str] = None

class ProviderResponse(BaseModel):
    id: str
    provider: str
    display_name: str
    description: str
    category: str
    logo_url: Optional[str]
    website_url: Optional[str]
    docs_url: Optional[str]
    configuration: Dict[str, Any]

def get_current_user_id(credentials: HTTPAuthorizationCredentials = Depends(security)) -> str:
    """Extract user ID from JWT token. This is a placeholder - implement actual JWT validation."""
    # TODO: Implement proper JWT token validation
    # For now, return a mock user ID
    return "mock-user-id"

@router.get("/providers", response_model=List[ProviderResponse])
async def get_providers():
    """Get all available API key providers."""
    try:
        providers = APIKeyManager.get_providers()
        return providers
    except Exception as e:
        logger.error(f"Failed to get providers: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve providers"
        )

@router.get("/", response_model=List[APIKeyResponse])
async def get_api_keys(
    provider: Optional[str] = None,
    user_id: str = Depends(get_current_user_id)
):
    """Get API keys for the current user."""
    try:
        api_keys = APIKeyManager.get_user_api_keys(user_id, provider)
        return api_keys
    except Exception as e:
        logger.error(f"Failed to get API keys: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve API keys"
        )

@router.post("/", response_model=APIKeyResponse)
async def create_api_key(
    request: APIKeyCreateRequest,
    user_id: str = Depends(get_current_user_id)
):
    """Create a new API key."""
    try:
        # Validate provider exists
        provider_config = APIKeyManager.get_provider_by_name(request.provider)
        if not provider_config:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Unknown provider: {request.provider}"
            )
        
        # Validate API key format
        if not APIKeyValidationService.validate_key_format(request.provider, request.keyValue):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid API key format"
            )
        
        # Test API key validity
        is_valid, error_message = APIKeyValidationService.test_api_key(
            request.provider, 
            request.keyValue, 
            request.metadata
        )
        
        if not is_valid:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"API key validation failed: {error_message}"
            )
        
        # Save API key
        api_key = APIKeyManager.save_api_key(
            user_id=user_id,
            provider=request.provider,
            name=request.name,
            key_value=request.keyValue,
            description=request.description,
            metadata=request.metadata
        )
        
        return api_key
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to create API key: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create API key"
        )

@router.post("/test", response_model=APIKeyTestResponse)
async def test_api_key(request: APIKeyTestRequest):
    """Test an API key without saving it."""
    try:
        # Validate provider exists
        provider_config = APIKeyManager.get_provider_by_name(request.provider)
        if not provider_config:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Unknown provider: {request.provider}"
            )
        
        # Test API key
        is_valid, error_message = APIKeyValidationService.test_api_key(
            request.provider, 
            request.keyValue, 
            request.metadata
        )
        
        return APIKeyTestResponse(valid=is_valid, error=error_message)
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to test API key: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to test API key"
        )

@router.get("/{key_id}", response_model=APIKeyResponse)
async def get_api_key(
    key_id: str,
    user_id: str = Depends(get_current_user_id)
):
    """Get a specific API key."""
    try:
        api_key = APIKeyManager.get_api_key_by_id(key_id, user_id)
        if not api_key:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="API key not found"
            )
        return api_key
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to get API key: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve API key"
        )

@router.put("/{key_id}", response_model=APIKeyResponse)
async def update_api_key(
    key_id: str,
    request: APIKeyCreateRequest,
    user_id: str = Depends(get_current_user_id)
):
    """Update an existing API key."""
    try:
        # Check if API key exists
        existing_key = APIKeyManager.get_api_key_by_id(key_id, user_id)
        if not existing_key:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="API key not found"
            )
        
        # Validate new API key if provided
        if request.keyValue != existing_key.get('key_value'):
            if not APIKeyValidationService.validate_key_format(request.provider, request.keyValue):
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Invalid API key format"
                )
            
            is_valid, error_message = APIKeyValidationService.test_api_key(
                request.provider, 
                request.keyValue, 
                request.metadata
            )
            
            if not is_valid:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"API key validation failed: {error_message}"
                )
        
        # Update API key
        updates = {
            'name': request.name,
            'description': request.description,
            'key_value': request.keyValue,
            'metadata': request.metadata
        }
        
        success = APIKeyManager.update_api_key(key_id, user_id, updates)
        if not success:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to update API key"
            )
        
        # Return updated key
        updated_key = APIKeyManager.get_api_key_by_id(key_id, user_id)
        return updated_key
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to update API key: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update API key"
        )

@router.delete("/{key_id}")
async def delete_api_key(
    key_id: str,
    user_id: str = Depends(get_current_user_id)
):
    """Delete an API key."""
    try:
        success = APIKeyManager.delete_api_key(key_id, user_id)
        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="API key not found"
            )
        
        return {"message": "API key deleted successfully"}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to delete API key: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to delete API key"
        )
