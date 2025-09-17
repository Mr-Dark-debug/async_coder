"""
Request schemas for audio transcription endpoints.
These schemas define the structure and validation for incoming requests.
"""

from typing import Optional, List
from pydantic import BaseModel, Field, validator
from enum import Enum


class ResponseFormat(str, Enum):
    """Available response formats for transcription."""
    JSON = "json"
    TEXT = "text"
    VERBOSE_JSON = "verbose_json"


class TimestampGranularity(str, Enum):
    """Available timestamp granularities for transcription."""
    WORD = "word"
    SEGMENT = "segment"


class TranscriptionRequest(BaseModel):
    """Schema for audio transcription requests."""
    
    model: str = Field(
        default="whisper-large-v3-turbo",
        description="The Whisper model to use for transcription",
        example="whisper-large-v3-turbo"
    )
    
    language: Optional[str] = Field(
        default=None,
        description="Language of the input audio in ISO-639-1 format (e.g., 'en')",
        min_length=2,
        max_length=2,
        example="en"
    )
    
    prompt: Optional[str] = Field(
        default=None,
        description="Optional text to guide the model's style or continue a previous audio segment",
        max_length=224,
        example="This is a technical discussion about AI."
    )
    
    response_format: ResponseFormat = Field(
        default=ResponseFormat.VERBOSE_JSON,
        description="The format of the transcript output"
    )
    
    temperature: Optional[float] = Field(
        default=0.0,
        description="Sampling temperature between 0 and 1",
        ge=0.0,
        le=1.0,
        example=0.0
    )
    
    timestamp_granularities: Optional[List[TimestampGranularity]] = Field(
        default=None,
        description="Timestamp granularities to populate for this transcription"
    )
    
    @validator("model")
    def validate_model(cls, v):
        """Validate that the model is supported."""
        # Import here to avoid circular imports
        from app.core.config import get_settings
        settings = get_settings()
        
        if v not in settings.available_models:
            raise ValueError(
                f"Model '{v}' is not supported. Available models: {settings.available_models}"
            )
        return v
    
    @validator("language")
    def validate_language(cls, v):
        """Validate language code format."""
        if v is not None:
            if len(v) != 2:
                raise ValueError("Language must be a 2-character ISO-639-1 code (e.g., 'en', 'fr')")
            return v.lower()
        return v
    
    @validator("prompt")
    def validate_prompt(cls, v):
        """Validate prompt length and content."""
        if v is not None:
            if len(v.strip()) == 0:
                return None  # Treat empty strings as None
            if len(v) > 224:
                raise ValueError("Prompt cannot exceed 224 characters")
        return v
    
    @validator("timestamp_granularities")
    def validate_timestamp_granularities(cls, v, values):
        """Validate timestamp granularities with response format."""
        if v is not None:
            # Check if response format supports timestamps
            response_format = values.get("response_format")
            if response_format not in [ResponseFormat.JSON, ResponseFormat.VERBOSE_JSON]:
                raise ValueError(
                    "Timestamp granularities can only be used with 'json' or 'verbose_json' response formats"
                )
        return v
    
    class Config:
        """Pydantic configuration."""
        use_enum_values = True
        schema_extra = {
            "example": {
                "model": "whisper-large-v3-turbo",
                "language": "en",
                "prompt": "This is a technical discussion about AI and machine learning.",
                "response_format": "verbose_json",
                "temperature": 0.0,
                "timestamp_granularities": ["word", "segment"]
            }
        }


class TranslationRequest(BaseModel):
    """Schema for audio translation requests (translates to English)."""
    
    model: str = Field(
        default="whisper-large-v3-turbo",
        description="The Whisper model to use for translation",
        example="whisper-large-v3-turbo"
    )
    
    prompt: Optional[str] = Field(
        default=None,
        description="Optional text to guide the model's style (should be in English)",
        max_length=224,
        example="This is a business meeting discussion."
    )
    
    response_format: ResponseFormat = Field(
        default=ResponseFormat.VERBOSE_JSON,
        description="The format of the transcript output"
    )
    
    temperature: Optional[float] = Field(
        default=0.0,
        description="Sampling temperature between 0 and 1",
        ge=0.0,
        le=1.0,
        example=0.0
    )
    
    @validator("model")
    def validate_model(cls, v):
        """Validate that the model is supported."""
        from app.core.config import get_settings
        settings = get_settings()
        
        if v not in settings.available_models:
            raise ValueError(
                f"Model '{v}' is not supported. Available models: {settings.available_models}"
            )
        return v
    
    @validator("prompt")
    def validate_prompt(cls, v):
        """Validate prompt length and content."""
        if v is not None:
            if len(v.strip()) == 0:
                return None
            if len(v) > 224:
                raise ValueError("Prompt cannot exceed 224 characters")
        return v
    
    class Config:
        """Pydantic configuration."""
        use_enum_values = True
        schema_extra = {
            "example": {
                "model": "whisper-large-v3-turbo",
                "prompt": "This is a business meeting discussion.",
                "response_format": "verbose_json",
                "temperature": 0.0
            }
        }


class AudioFileMetadata(BaseModel):
    """Schema for audio file metadata."""
    
    filename: str = Field(description="Original filename")
    content_type: str = Field(description="MIME content type")
    file_size: int = Field(description="File size in bytes")
    duration: Optional[float] = Field(default=None, description="Audio duration in seconds")
    
    class Config:
        schema_extra = {
            "example": {
                "filename": "meeting_recording.wav",
                "content_type": "audio/wav",
                "file_size": 1048576,
                "duration": 120.5
            }
        }


class HealthCheckRequest(BaseModel):
    """Schema for health check requests (if needed)."""
    
    include_detailed_status: bool = Field(
        default=False,
        description="Whether to include detailed service status information"
    )
    
    check_groq_connection: bool = Field(
        default=True,
        description="Whether to test the connection to Groq API"
    )


class BatchTranscriptionRequest(BaseModel):
    """Schema for batch transcription requests (future feature)."""
    
    files: List[str] = Field(
        description="List of file URLs or identifiers to transcribe"
    )
    
    transcription_config: TranscriptionRequest = Field(
        description="Transcription configuration to apply to all files"
    )
    
    callback_url: Optional[str] = Field(
        default=None,
        description="URL to call when batch processing is complete"
    )
    
    priority: Optional[str] = Field(
        default="normal",
        description="Processing priority",
        pattern="^(low|normal|high)$"
    )


# Create type aliases for convenience
TranscribeRequestModel = TranscriptionRequest
TranslateRequestModel = TranslationRequest