"""
Response schemas for audio transcription endpoints.
These schemas define the structure of API responses.
"""

from typing import Optional, List, Dict, Any, Union
from pydantic import BaseModel, Field
from datetime import datetime


class WordTimestamp(BaseModel):
    """Schema for word-level timestamp information."""
    
    word: str = Field(description="The transcribed word")
    start: float = Field(description="Start time in seconds")
    end: float = Field(description="End time in seconds")
    
    class Config:
        json_schema_extra = {
            "example": {
                "word": "hello",
                "start": 0.5,
                "end": 0.8
            }
        }


class SegmentTimestamp(BaseModel):
    """Schema for segment-level timestamp information."""
    
    id: int = Field(description="Segment identifier")
    seek: int = Field(description="Seek position")
    start: float = Field(description="Start time in seconds")
    end: float = Field(description="End time in seconds")
    text: str = Field(description="Segment text")
    tokens: List[int] = Field(description="Token IDs for this segment")
    temperature: float = Field(description="Temperature used for this segment")
    avg_logprob: float = Field(description="Average log probability of the segment")
    compression_ratio: float = Field(description="Compression ratio of the segment")
    no_speech_prob: float = Field(description="Probability that this segment contains no speech")
    words: Optional[List[WordTimestamp]] = Field(
        default=None,
        description="Word-level timestamps if requested"
    )
    
    class Config:
        schema_extra = {
            "example": {
                "id": 0,
                "seek": 0,
                "start": 0.0,
                "end": 3.5,
                "text": "Hello, this is a test.",
                "tokens": [1234, 5678, 9012],
                "temperature": 0.0,
                "avg_logprob": -0.25,
                "compression_ratio": 1.2,
                "no_speech_prob": 0.01,
                "words": [
                    {"word": "Hello", "start": 0.0, "end": 0.5},
                    {"word": "this", "start": 0.8, "end": 1.0}
                ]
            }
        }


class TranscriptionData(BaseModel):
    """Schema for transcription data."""
    
    task: str = Field(description="The task performed (transcribe or translate)")
    language: Optional[str] = Field(description="Detected or specified language")
    duration: Optional[float] = Field(description="Duration of the audio in seconds")
    text: str = Field(description="The transcribed text")
    words: Optional[List[WordTimestamp]] = Field(
        default=None,
        description="Word-level timestamps if requested"
    )
    segments: Optional[List[SegmentTimestamp]] = Field(
        default=None,
        description="Segment-level information if available"
    )
    
    class Config:
        schema_extra = {
            "example": {
                "task": "transcribe",
                "language": "en",
                "duration": 10.5,
                "text": "Hello, this is a test transcription.",
                "segments": [
                    {
                        "id": 0,
                        "start": 0.0,
                        "end": 10.5,
                        "text": "Hello, this is a test transcription."
                    }
                ]
            }
        }


class TranscriptionResponse(BaseModel):
    """Schema for successful transcription responses."""
    
    success: bool = Field(default=True, description="Whether the request was successful")
    message: str = Field(description="Response message")
    data: TranscriptionData = Field(description="Transcription results")
    metadata: Dict[str, Any] = Field(
        description="Additional metadata about the transcription"
    )
    request_id: str = Field(description="Unique request identifier")
    processing_time_ms: float = Field(description="Processing time in milliseconds")
    timestamp: datetime = Field(description="Response timestamp")
    
    class Config:
        schema_extra = {
            "example": {
                "success": True,
                "message": "Transcription completed successfully",
                "data": {
                    "task": "transcribe",
                    "language": "en",
                    "duration": 10.5,
                    "text": "Hello, this is a test transcription."
                },
                "metadata": {
                    "model_used": "whisper-large-v3-turbo",
                    "file_size_bytes": 1048576,
                    "audio_format": "wav"
                },
                "request_id": "req_12345",
                "processing_time_ms": 1250.5,
                "timestamp": "2025-01-15T10:30:00Z"
            }
        }


class TranslationResponse(BaseModel):
    """Schema for successful translation responses."""
    
    success: bool = Field(default=True, description="Whether the request was successful")
    message: str = Field(description="Response message")
    data: TranscriptionData = Field(description="Translation results")
    metadata: Dict[str, Any] = Field(
        description="Additional metadata about the translation"
    )
    request_id: str = Field(description="Unique request identifier")
    processing_time_ms: float = Field(description="Processing time in milliseconds")
    timestamp: datetime = Field(description="Response timestamp")
    
    class Config:
        schema_extra = {
            "example": {
                "success": True,
                "message": "Translation completed successfully",
                "data": {
                    "task": "translate",
                    "language": "en",
                    "duration": 10.5,
                    "text": "Hello, this is a test translation to English."
                },
                "metadata": {
                    "model_used": "whisper-large-v3-turbo",
                    "file_size_bytes": 1048576,
                    "source_language_detected": "es"
                },
                "request_id": "req_67890",
                "processing_time_ms": 1150.2,
                "timestamp": "2025-01-15T10:35:00Z"
            }
        }


class ErrorResponse(BaseModel):
    """Schema for error responses."""
    
    success: bool = Field(default=False, description="Always false for errors")
    message: str = Field(description="Error message")
    error_code: str = Field(description="Specific error code")
    error_details: Optional[Dict[str, Any]] = Field(
        default=None,
        description="Additional error details"
    )
    request_id: Optional[str] = Field(
        default=None,
        description="Request identifier if available"
    )
    timestamp: datetime = Field(description="Error timestamp")
    suggestions: Optional[List[str]] = Field(
        default=None,
        description="Suggested actions to resolve the error"
    )
    
    class Config:
        schema_extra = {
            "example": {
                "success": False,
                "message": "Invalid audio file format",
                "error_code": "INVALID_FILE_FORMAT",
                "error_details": {
                    "provided_format": "txt",
                    "supported_formats": ["mp3", "wav", "flac", "m4a"]
                },
                "request_id": "req_error_123",
                "timestamp": "2025-01-15T10:40:00Z",
                "suggestions": [
                    "Please upload an audio file in one of the supported formats",
                    "Convert your file to WAV or MP3 format before uploading"
                ]
            }
        }


class HealthCheckResponse(BaseModel):
    """Schema for health check responses."""
    
    status: str = Field(description="Overall service status")
    service: str = Field(description="Service name")
    version: str = Field(description="Service version")
    timestamp: datetime = Field(description="Health check timestamp")
    checks: Dict[str, Any] = Field(
        description="Individual component health checks"
    )
    uptime_seconds: Optional[float] = Field(
        default=None,
        description="Service uptime in seconds"
    )
    
    class Config:
        schema_extra = {
            "example": {
                "status": "healthy",
                "service": "Audio Transcription API",
                "version": "1.0.0",
                "timestamp": "2025-01-15T10:45:00Z",
                "checks": {
                    "groq_api": "healthy",
                    "file_system": "healthy",
                    "configuration": "healthy"
                },
                "uptime_seconds": 3600.5
            }
        }


class ValidationErrorResponse(BaseModel):
    """Schema for validation error responses."""
    
    success: bool = Field(default=False)
    message: str = Field(default="Validation error")
    error_code: str = Field(default="VALIDATION_ERROR")
    validation_errors: List[Dict[str, Any]] = Field(
        description="Detailed validation errors"
    )
    request_id: Optional[str] = Field(default=None)
    timestamp: datetime = Field(description="Error timestamp")
    
    class Config:
        schema_extra = {
            "example": {
                "success": False,
                "message": "Request validation failed",
                "error_code": "VALIDATION_ERROR",
                "validation_errors": [
                    {
                        "field": "model",
                        "message": "Model 'invalid-model' is not supported",
                        "input": "invalid-model"
                    }
                ],
                "request_id": "req_validation_456",
                "timestamp": "2025-01-15T10:50:00Z"
            }
        }


class FileUploadResponse(BaseModel):
    """Schema for file upload responses."""
    
    success: bool = Field(description="Whether the upload was successful")
    message: str = Field(description="Upload status message")
    file_id: Optional[str] = Field(
        default=None,
        description="Unique file identifier"
    )
    file_metadata: Optional[Dict[str, Any]] = Field(
        default=None,
        description="File metadata"
    )
    upload_url: Optional[str] = Field(
        default=None,
        description="URL for accessing the uploaded file"
    )
    expires_at: Optional[datetime] = Field(
        default=None,
        description="When the uploaded file expires"
    )
    
    class Config:
        schema_extra = {
            "example": {
                "success": True,
                "message": "File uploaded successfully",
                "file_id": "file_abc123",
                "file_metadata": {
                    "filename": "recording.wav",
                    "size_bytes": 1048576,
                    "content_type": "audio/wav"
                },
                "upload_url": "/api/v1/files/file_abc123",
                "expires_at": "2025-01-16T10:30:00Z"
            }
        }


class BatchOperationResponse(BaseModel):
    """Schema for batch operation responses (future feature)."""
    
    success: bool = Field(description="Whether the batch operation was initiated")
    message: str = Field(description="Batch operation status message")
    batch_id: str = Field(description="Unique batch identifier")
    total_files: int = Field(description="Total number of files to process")
    estimated_completion_time: Optional[datetime] = Field(
        default=None,
        description="Estimated completion time"
    )
    status_url: str = Field(description="URL to check batch status")
    
    class Config:
        schema_extra = {
            "example": {
                "success": True,
                "message": "Batch transcription started",
                "batch_id": "batch_xyz789",
                "total_files": 5,
                "estimated_completion_time": "2025-01-15T11:00:00Z",
                "status_url": "/api/v1/batch/batch_xyz789/status"
            }
        }


# Union types for different response scenarios
APIResponse = Union[TranscriptionResponse, TranslationResponse, ErrorResponse]
SuccessResponse = Union[TranscriptionResponse, TranslationResponse]