"""
FastAPI endpoints for audio transcription and translation.
Handles file uploads and communicates with Groq API provider.
"""

import logging
from typing import Optional, Union
from datetime import datetime

from fastapi import APIRouter, UploadFile, File, Form, HTTPException, Depends, status
from fastapi.responses import JSONResponse

from app.core.config import get_settings, Settings
from app.providers.groq_provider import GroqProvider, GroqAPIError
from app.schemas.request.transcription import (
    TranscriptionRequest, 
    TranslationRequest,
    ResponseFormat,
    TimestampGranularity
)
from app.schemas.response.transcription import (
    TranscriptionResponse,
    TranslationResponse,
    ErrorResponse,
    HealthCheckResponse,
    ValidationErrorResponse
)

# Configure logging
logger = logging.getLogger(__name__)

# Create router
router = APIRouter()


def get_groq_provider(settings: Settings = Depends(get_settings)) -> GroqProvider:
    """Dependency to get Groq provider instance."""
    return GroqProvider(settings)


def create_error_response(
    error: Exception, 
    request_id: Optional[str] = None,
    default_message: str = "An error occurred"
) -> ErrorResponse:
    """
    Create standardized error response from exception.
    
    Args:
        error: Exception that occurred
        request_id: Optional request identifier
        default_message: Default message if none available
        
    Returns:
        ErrorResponse: Standardized error response
    """
    if isinstance(error, GroqAPIError):
        return ErrorResponse(
            success=False,
            message=error.message,
            error_code=error.error_code,
            error_details=error.details,
            request_id=request_id,
            timestamp=datetime.utcnow(),
            suggestions=_get_error_suggestions(error.error_code)
        )
    else:
        return ErrorResponse(
            success=False,
            message=str(error) or default_message,
            error_code="INTERNAL_ERROR",
            error_details={"type": type(error).__name__},
            request_id=request_id,
            timestamp=datetime.utcnow()
        )


def _get_error_suggestions(error_code: str) -> Optional[list]:
    """Get helpful suggestions based on error code."""
    suggestions_map = {
        "FILE_TOO_LARGE": [
            "Reduce the file size by compressing the audio",
            "Split long audio files into smaller segments",
            "Use a lower bitrate or different format"
        ],
        "INVALID_FILE_FORMAT": [
            "Convert your file to a supported format (MP3, WAV, FLAC, etc.)",
            "Check that the file is actually an audio file",
            "Ensure the file extension matches the actual format"
        ],
        "API_CONNECTION_ERROR": [
            "Check your internet connection",
            "Verify that api.groq.com is accessible",
            "Try again in a few moments"
        ],
        "RATE_LIMIT_ERROR": [
            "Wait a moment before making another request",
            "Consider implementing request queuing",
            "Check your API usage limits"
        ],
        "VALIDATION_ERROR": [
            "Check the request parameters",
            "Ensure all required fields are provided",
            "Verify that parameter values are within allowed ranges"
        ]
    }
    return suggestions_map.get(error_code)


@router.post(
    "/transcribe",
    response_model=TranscriptionResponse,
    status_code=status.HTTP_200_OK,
    summary="Transcribe audio to text",
    description="Upload an audio file and receive a text transcription using Groq's Whisper models",
    responses={
        200: {"description": "Transcription completed successfully"},
        400: {"model": ErrorResponse, "description": "Bad request or validation error"},
        413: {"model": ErrorResponse, "description": "File too large"},
        422: {"model": ValidationErrorResponse, "description": "Validation error"},
        500: {"model": ErrorResponse, "description": "Internal server error"}
    }
)
async def transcribe_audio(
    file: UploadFile = File(
        ..., 
        description="Audio file to transcribe (max 25MB)",
        media_type="audio/*"
    ),
    model: str = Form(
        default="whisper-large-v3-turbo",
        description="Whisper model to use for transcription"
    ),
    language: Optional[str] = Form(
        default=None,
        description="Language of the input audio (ISO-639-1 format, e.g., 'en')"
    ),
    prompt: Optional[str] = Form(
        default=None,
        description="Optional text to guide the model's style or context (max 224 chars)"
    ),
    response_format: str = Form(
        default="verbose_json",
        description="Format of the transcript output"
    ),
    temperature: float = Form(
        default=0.0,
        description="Sampling temperature between 0 and 1"
    ),
    timestamp_granularities: Optional[str] = Form(
        default=None,
        description="Comma-separated timestamp granularities (word,segment)"
    ),
    groq_provider: GroqProvider = Depends(get_groq_provider)
) -> TranscriptionResponse:
    """
    Transcribe an audio file to text.
    
    This endpoint accepts audio files in various formats and returns
    a text transcription using Groq's Whisper models.
    """
    try:
        logger.info(f"Received transcription request for file: {file.filename}")
        
        # Validate file upload
        if not file.filename:
            raise HTTPException(
                status_code=400,
                detail="No file provided"
            )
        
        # Read file content
        file_content = await file.read()
        
        if not file_content:
            raise HTTPException(
                status_code=400,
                detail="Empty file provided"
            )
        
        # Parse timestamp granularities
        parsed_granularities = None
        if timestamp_granularities:
            try:
                granularities_list = [
                    TimestampGranularity(g.strip()) 
                    for g in timestamp_granularities.split(",")
                    if g.strip()
                ]
                parsed_granularities = granularities_list if granularities_list else None
            except ValueError as e:
                raise HTTPException(
                    status_code=422,
                    detail=f"Invalid timestamp granularity: {e}"
                )
        
        # Create transcription request
        try:
            transcription_request = TranscriptionRequest(
                model=model,
                language=language,
                prompt=prompt,
                response_format=ResponseFormat(response_format),
                temperature=temperature,
                timestamp_granularities=parsed_granularities
            )
        except ValueError as e:
            raise HTTPException(
                status_code=422,
                detail=f"Invalid request parameters: {e}"
            )
        
        # FIXED: Call transcribe_audio instead of translate_audio
        result = groq_provider.transcribe_audio(
            file_content=file_content,
            filename=file.filename,
            content_type=file.content_type or "audio/unknown",
            request=transcription_request  # Use transcription_request not translation_request
        )
        
        logger.info(f"Transcription completed successfully for file: {file.filename}")
        return result
        
    except HTTPException:
        raise
    except GroqAPIError as e:
        logger.error(f"Groq API error during transcription: {e.message}")
        error_response = create_error_response(e)
        
        # Map error codes to HTTP status codes
        status_code_map = {
            "FILE_TOO_LARGE": 413,
            "INVALID_FILE_FORMAT": 400,
            "RATE_LIMIT_ERROR": 429,
            "API_CONNECTION_ERROR": 503,
            "VALIDATION_ERROR": 400
        }
        
        status_code = status_code_map.get(e.error_code, 500)
        
        raise HTTPException(
            status_code=status_code,
            detail=error_response.model_dump(mode='json')
        )
    except Exception as e:
        logger.error(f"Unexpected error during transcription: {e}", exc_info=True)
        error_response = create_error_response(e, default_message="Transcription failed")
        
        raise HTTPException(
            status_code=500,
            detail=error_response.model_dump(mode='json')
        )


@router.post(
    "/translate",
    response_model=TranslationResponse,
    status_code=status.HTTP_200_OK,
    summary="Translate audio to English",
    description="Upload an audio file and receive an English translation using Groq's Whisper models",
    responses={
        200: {"description": "Translation completed successfully"},
        400: {"model": ErrorResponse, "description": "Bad request or validation error"},
        413: {"model": ErrorResponse, "description": "File too large"},
        422: {"model": ValidationErrorResponse, "description": "Validation error"},
        500: {"model": ErrorResponse, "description": "Internal server error"}
    }
)
async def translate_audio(
    file: UploadFile = File(
        ..., 
        description="Audio file to translate to English (max 25MB)",
        media_type="audio/*"
    ),
    model: str = Form(
        default="whisper-large-v3-turbo",
        description="Whisper model to use for translation"
    ),
    prompt: Optional[str] = Form(
        default=None,
        description="Optional text to guide the model's style (should be in English, max 224 chars)"
    ),
    response_format: str = Form(
        default="verbose_json",
        description="Format of the transcript output"
    ),
    temperature: float = Form(
        default=0.0,
        description="Sampling temperature between 0 and 1"
    ),
    groq_provider: GroqProvider = Depends(get_groq_provider)
) -> TranslationResponse:
    """
    Translate an audio file to English text.
    
    This endpoint accepts audio files in any language and returns
    an English translation using Groq's Whisper models.
    """
    try:
        logger.info(f"Received translation request for file: {file.filename}")
        
        # Validate file upload
        if not file.filename:
            raise HTTPException(
                status_code=400,
                detail="No file provided"
            )
        
        # Read file content
        file_content = await file.read()
        
        if not file_content:
            raise HTTPException(
                status_code=400,
                detail="Empty file provided"
            )
        
        # Create translation request
        try:
            translation_request = TranslationRequest(
                model=model,
                prompt=prompt,
                response_format=ResponseFormat(response_format),
                temperature=temperature
            )
        except ValueError as e:
            raise HTTPException(
                status_code=422,
                detail=f"Invalid request parameters: {e}"
            )
        
        # Call translate_audio method
        result = groq_provider.translate_audio(
            file_content=file_content,
            filename=file.filename,
            content_type=file.content_type or "audio/unknown",
            request=translation_request
        )
        
        logger.info(f"Translation completed successfully for file: {file.filename}")
        return result
        
    except HTTPException:
        raise
    except GroqAPIError as e:
        logger.error(f"Groq API error during translation: {e.message}")
        error_response = create_error_response(e)
        
        # Map error codes to HTTP status codes
        status_code_map = {
            "FILE_TOO_LARGE": 413,
            "INVALID_FILE_FORMAT": 400,
            "RATE_LIMIT_ERROR": 429,
            "API_CONNECTION_ERROR": 503,
            "VALIDATION_ERROR": 400
        }
        
        status_code = status_code_map.get(e.error_code, 500)
        
        raise HTTPException(
            status_code=status_code,
            detail=error_response.model_dump(mode='json')
        )
    except Exception as e:
        logger.error(f"Unexpected error during translation: {e}", exc_info=True)
        error_response = create_error_response(e, default_message="Translation failed")
        
        raise HTTPException(
            status_code=500,
            detail=error_response.model_dump(mode='json')
        )


@router.get(
    "/health",
    response_model=HealthCheckResponse,
    summary="Health check",
    description="Check the health status of the transcription service and Groq API connection",
    responses={
        200: {"description": "Service is healthy"},
        503: {"description": "Service is unhealthy"}
    }
)
async def health_check(
    groq_provider: GroqProvider = Depends(get_groq_provider),
    settings: Settings = Depends(get_settings)
) -> HealthCheckResponse:
    """
    Check the health status of the transcription service.
    
    This endpoint verifies:
    - Service configuration
    - Groq API connectivity
    - File system access
    """
    try:
        logger.info("Performing health check")
        
        # Check Groq API health
        groq_health = groq_provider.health_check()
        
        # Check file system
        upload_dir_status = "healthy"
        try:
            settings.create_upload_directory()
        except Exception as e:
            upload_dir_status = f"unhealthy: {str(e)}"
        
        # Check log directory
        log_dir_status = "healthy"
        try:
            settings.create_log_directory()
        except Exception as e:
            log_dir_status = f"unhealthy: {str(e)}"
        
        # Determine overall status
        overall_status = "healthy"
        if (groq_health.get("status") != "healthy" or 
            "unhealthy" in upload_dir_status or 
            "unhealthy" in log_dir_status):
            overall_status = "unhealthy"
        
        response = HealthCheckResponse(
            status=overall_status,
            service=settings.app_name,
            version=settings.app_version,
            timestamp=datetime.utcnow(),
            checks={
                "groq_api": groq_health.get("status", "unknown"),
                "groq_models_available": groq_health.get("models_available", 0),
                "upload_directory": upload_dir_status,
                "log_directory": log_dir_status,
                "configuration": "healthy"
            }
        )
        
        # Return appropriate status code
        if overall_status == "healthy":
            return response
        else:
            raise HTTPException(
                status_code=503,
                detail=response.dict()
            )
            
    except Exception as e:
        logger.error(f"Health check failed: {e}", exc_info=True)
        error_response = HealthCheckResponse(
            status="unhealthy",
            service=settings.app_name,
            version=settings.app_version,
            timestamp=datetime.utcnow(),
            checks={
                "error": str(e)
            }
        )
        
        raise HTTPException(
            status_code=503,
            detail=error_response.dict()
        )


@router.get(
    "/models",
    response_model=None,
    summary="List available models",
    description="Get a list of available Whisper models for transcription and translation"
)
async def list_models(
    settings: Settings = Depends(get_settings)
) -> dict:
    """List available Whisper models."""
    try:
        return {
            "success": True,
            "models": [
                {
                    "id": model,
                    "name": model,
                    "description": _get_model_description(model),
                    "type": "speech-to-text",
                    "supports_transcription": True,
                    "supports_translation": True
                }
                for model in settings.available_models
            ],
            "default_model": settings.default_model,
            "timestamp": datetime.utcnow()
        }
    except Exception as e:
        logger.error(f"Failed to list models: {e}")
        raise HTTPException(
            status_code=500,
            detail={
                "success": False,
                "message": f"Failed to retrieve models: {str(e)}",
                "timestamp": datetime.utcnow()
            }
        )


@router.get(
    "/formats",
    response_model=None,
    summary="List supported audio formats",
    description="Get a list of supported audio file formats"
)
async def list_supported_formats(
    settings: Settings = Depends(get_settings)
) -> dict:
    """List supported audio formats."""
    try:
        return {
            "success": True,
            "supported_formats": settings.allowed_audio_formats,
            "max_file_size_mb": settings.max_file_size_mb,
            "recommendations": {
                "best_quality": ["flac", "wav"],
                "best_compatibility": ["mp3", "wav"],
                "smallest_size": ["mp3", "ogg"]
            },
            "timestamp": datetime.utcnow()
        }
    except Exception as e:
        logger.error(f"Failed to list formats: {e}")
        raise HTTPException(
            status_code=500,
            detail={
                "success": False,
                "message": f"Failed to retrieve formats: {str(e)}",
                "timestamp": datetime.utcnow()
            }
        )


def _get_model_description(model: str) -> str:
    """Get description for a model."""
    descriptions = {
        "whisper-large-v3-turbo": "Fastest model with good accuracy, optimized for speed",
        "whisper-large-v3": "Highest accuracy model, best for challenging audio conditions"
    }
    return descriptions.get(model, "Whisper speech-to-text model")