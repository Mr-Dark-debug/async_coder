"""
Groq API provider for audio transcription and translation.
Handles communication with Groq's Whisper API endpoints.
"""

import os
import time
import tempfile
import uuid
from typing import Optional, BinaryIO, Dict, Any, Union
from pathlib import Path
import logging
import httpx

from groq import Groq
from groq.types.audio import Transcription, Translation
import groq

from app.core.config import get_settings
from app.schemas.request.transcription import (
    TranscriptionRequest, 
    TranslationRequest,
    AudioFileMetadata
)
from app.schemas.response.transcription import (
    TranscriptionData,
    TranscriptionResponse,
    TranslationResponse,
    ErrorResponse,
    WordTimestamp,
    SegmentTimestamp
)
from datetime import datetime

# Configure logging
logger = logging.getLogger(__name__)


class GroqAPIError(Exception):
    """Custom exception for Groq API errors."""
    
    def __init__(self, message: str, error_code: str, status_code: Optional[int] = None, details: Optional[Dict[str, Any]] = None):
        self.message = message
        self.error_code = error_code
        self.status_code = status_code
        self.details = details or {}
        super().__init__(message)


class GroqProvider:
    """
    Provider class for interacting with Groq's audio transcription API.
    Handles authentication, request formatting, and response processing.
    """
    
    def __init__(self, settings: Optional[Any] = None):
        """Initialize the Groq provider with configuration settings."""
        self.settings = settings or get_settings()
        
        # Initialize Groq client
        try:
            self.client = Groq(
                api_key=self.settings.groq_api_key,
                base_url=self.settings.groq_base_url,
                timeout=self.settings.groq_timeout,
                max_retries=self.settings.groq_max_retries
            )
            logger.info("Groq client initialized successfully")
        except Exception as e:
            logger.error(f"Failed to initialize Groq client: {e}")
            raise GroqAPIError(
                message=f"Failed to initialize Groq client: {str(e)}",
                error_code="CLIENT_INIT_ERROR",
                details={"original_error": str(e)}
            )
    
    def validate_audio_file(self, file_content: bytes, filename: str, content_type: str) -> AudioFileMetadata:
        """
        Validate audio file format, size, and metadata.
        
        Args:
            file_content: Binary content of the audio file
            filename: Original filename
            content_type: MIME content type
            
        Returns:
            AudioFileMetadata: Validated file metadata
            
        Raises:
            GroqAPIError: If file validation fails
        """
        try:
            # Check file size
            file_size = len(file_content)
            max_size = self.settings.max_file_size_bytes
            
            if file_size > max_size:
                raise GroqAPIError(
                    message=f"File size ({file_size / 1024 / 1024:.1f}MB) exceeds maximum allowed size ({self.settings.max_file_size_mb}MB)",
                    error_code="FILE_TOO_LARGE",
                    details={
                        "file_size_bytes": file_size,
                        "max_size_bytes": max_size,
                        "file_size_mb": file_size / 1024 / 1024,
                        "max_size_mb": self.settings.max_file_size_mb
                    }
                )
            
            # Check file extension
            file_extension = Path(filename).suffix.lower().lstrip('.')
            if not file_extension:
                # Try to determine from content type
                content_type_map = {
                    'audio/mpeg': 'mp3',
                    'audio/wav': 'wav',
                    'audio/x-wav': 'wav',
                    'audio/flac': 'flac',
                    'audio/mp4': 'm4a',
                    'audio/ogg': 'ogg',
                    'video/mp4': 'mp4',
                    'video/webm': 'webm'
                }
                file_extension = content_type_map.get(content_type, 'unknown')
            
            if file_extension not in self.settings.allowed_audio_formats:
                raise GroqAPIError(
                    message=f"Unsupported file format: '{file_extension}'. Supported formats: {', '.join(self.settings.allowed_audio_formats)}",
                    error_code="INVALID_FILE_FORMAT",
                    details={
                        "provided_format": file_extension,
                        "supported_formats": self.settings.allowed_audio_formats,
                        "content_type": content_type
                    }
                )
            
            # Create metadata object
            metadata = AudioFileMetadata(
                filename=filename,
                content_type=content_type,
                file_size=file_size
            )
            
            logger.info(f"Audio file validated successfully: {filename} ({file_size} bytes, {file_extension})")
            return metadata
            
        except GroqAPIError:
            raise
        except Exception as e:
            logger.error(f"Unexpected error during file validation: {e}")
            raise GroqAPIError(
                message=f"File validation failed: {str(e)}",
                error_code="VALIDATION_ERROR",
                details={"original_error": str(e)}
            )
    
    def _save_temp_file(self, file_content: bytes, filename: str) -> Path:
        """
        Save uploaded file content to a temporary file.
        
        Args:
            file_content: Binary content of the file
            filename: Original filename
            
        Returns:
            Path: Path to the temporary file
        """
        try:
            # Create upload directory if it doesn't exist
            self.settings.create_upload_directory()
            
            # Generate unique filename to avoid conflicts
            file_extension = Path(filename).suffix
            unique_name = f"{uuid.uuid4()}{file_extension}"
            temp_path = Path(self.settings.upload_dir) / unique_name
            
            # Write file content
            with open(temp_path, 'wb') as temp_file:
                temp_file.write(file_content)
        
            logger.debug(f"Temporary file saved: {temp_path}")
            return temp_path
        
        except Exception as e:
            logger.error(f"Failed to save temporary file: {e}")
            raise GroqAPIError(
                message=f"Failed to save temporary file: {str(e)}",
                error_code="FILE_SAVE_ERROR",
                details={"original_error": str(e)}
            )

    def _save_permanent_file(self, file_content: bytes, filename: str, request_id: str) -> Path:
        """
        Save uploaded file content to a permanent location for storage/debugging.
        
        Args:
            file_content: Binary content of the file
            filename: Original filename  
            request_id: Unique request identifier
            
        Returns:
            Path: Path to the permanent file
        """
        try:
            # Create recordings directory if it doesn't exist
            recordings_dir = Path(self.settings.upload_dir) / "recordings"
            recordings_dir.mkdir(exist_ok=True)
            
            # Generate filename with request ID and timestamp
            file_extension = Path(filename).suffix
            timestamp = datetime.utcnow().strftime("%Y%m%d_%H%M%S")
            permanent_name = f"{timestamp}_{request_id[:8]}{file_extension}"
            permanent_path = recordings_dir / permanent_name
            
            # Write file content
            with open(permanent_path, 'wb') as perm_file:
                perm_file.write(file_content)
        
            logger.debug(f"Permanent file saved: {permanent_path}")
            return permanent_path
        
        except Exception as e:
            logger.error(f"Failed to save permanent file: {e}")
            raise GroqAPIError(
                message=f"Failed to save permanent file: {str(e)}",
                error_code="FILE_SAVE_ERROR",
                details={"original_error": str(e)}
            )

    def _cleanup_temp_file(self, file_path: Path) -> None:
        """
        Remove temporary file from disk.
        
        Args:
            file_path: Path to the temporary file to remove
        """
        if not self.settings.temp_file_cleanup:
            return
            
        try:
            if file_path.exists():
                file_path.unlink()
                logger.debug(f"Temporary file cleaned up: {file_path}")
        except Exception as e:
            logger.warning(f"Failed to cleanup temporary file {file_path}: {e}")
    
    def _convert_groq_response(self, response: Union[Transcription, Translation], task: str) -> TranscriptionData:
        """
        Convert Groq API response to our standardized format.
        
        Args:
            response: Raw response from Groq API
            task: Type of task performed ("transcribe" or "translate")
            
        Returns:
            TranscriptionData: Standardized transcription data
        """
        try:
            # Log the response for debugging
            logger.debug(f"Processing Groq response type: {type(response)}")
            
            # Handle different response types
            if isinstance(response, str):
                # Simple text response
                return TranscriptionData(
                    task=task,
                    language='unknown' if task == 'transcribe' else 'en',
                    duration=None,
                    text=response,
                    words=None,
                    segments=None
                )
            
            # Handle Groq response objects
            if hasattr(response, 'model_dump'):
                data = response.model_dump()
            elif hasattr(response, 'dict'):
                data = response.dict()
            elif hasattr(response, '__dict__'):
                data = response.__dict__
            else:
                # Fallback for basic response with just text
                text = getattr(response, 'text', str(response))
                return TranscriptionData(
                    task=task,
                    language='unknown' if task == 'transcribe' else 'en',
                    duration=None,
                    text=text,
                    words=None,
                    segments=None
                )
            
            # Extract basic fields
            text = data.get('text', '')
            language = data.get('language', 'unknown' if task == 'transcribe' else 'en')
            duration = data.get('duration', None)
            
            # Convert word timestamps if present
            words = None
            if 'words' in data and data['words']:
                words = [
                    WordTimestamp(
                        word=word.get('word', ''),
                        start=word.get('start', 0.0),
                        end=word.get('end', 0.0)
                    )
                    for word in data['words']
                ]
            
            # Convert segment timestamps if present
            segments = None
            if 'segments' in data and data['segments']:
                segments = []
                for segment in data['segments']:
                    # Convert word timestamps for this segment
                    segment_words = None
                    if 'words' in segment and segment['words']:
                        segment_words = [
                            WordTimestamp(
                                word=word.get('word', ''),
                                start=word.get('start', 0.0),
                                end=word.get('end', 0.0)
                            )
                            for word in segment['words']
                        ]
                    
                    segments.append(SegmentTimestamp(
                        id=segment.get('id', 0),
                        seek=segment.get('seek', 0),
                        start=segment.get('start', 0.0),
                        end=segment.get('end', 0.0),
                        text=segment.get('text', ''),
                        tokens=segment.get('tokens', []),
                        temperature=segment.get('temperature', 0.0),
                        avg_logprob=segment.get('avg_logprob', 0.0),
                        compression_ratio=segment.get('compression_ratio', 1.0),
                        no_speech_prob=segment.get('no_speech_prob', 0.0),
                        words=segment_words
                    ))
            
            return TranscriptionData(
                task=task,
                language=language,
                duration=duration,
                text=text,
                words=words,
                segments=segments
            )
            
        except Exception as e:
            logger.error(f"Failed to convert Groq response: {e}")
            logger.error(f"Response data: {locals().get('data', 'Not available')}")
            raise GroqAPIError(
                message=f"Failed to process API response: {str(e)}",
                error_code="RESPONSE_PROCESSING_ERROR",
                details={"original_error": str(e)}
            )
    
    def transcribe_audio(
        self, 
        file_content: bytes, 
        filename: str, 
        content_type: str,
        request: TranscriptionRequest
    ) -> TranscriptionResponse:
        """
        Transcribe audio file using Groq's Whisper API.
        
        Args:
            file_content: Binary content of the audio file
            filename: Original filename
            content_type: MIME content type
            request: Transcription request parameters
            
        Returns:
            TranscriptionResponse: Transcription results
            
        Raises:
            GroqAPIError: If transcription fails
        """
        request_id = str(uuid.uuid4())
        start_time = time.time()
        temp_file_path = None
        
        try:
            logger.info(f"Starting transcription request {request_id} for file: {filename}")
            
            # Validate audio file
            file_metadata = self.validate_audio_file(file_content, filename, content_type)
            
            # Save to temporary file
            temp_file_path = self._save_temp_file(file_content, filename)

            # Also save a permanent copy for debugging/storage
            try:
                permanent_path = self._save_permanent_file(file_content, filename, request_id)
                logger.info(f"Audio file saved permanently: {permanent_path}")
            except Exception as e:
                logger.warning(f"Failed to save permanent audio file: {e}")

            # Prepare transcription parameters
            transcription_params = {
                "model": request.model,
                "response_format": request.response_format,  # Use enum directly
                "temperature": request.temperature or 0.0
            }
            
            # Add optional parameters
            if request.language:
                transcription_params["language"] = request.language
            
            if request.prompt:
                transcription_params["prompt"] = request.prompt
            
            if request.timestamp_granularities:
                transcription_params["timestamp_granularities"] = [
                    str(tg) for tg in request.timestamp_granularities  # Convert enum to string
                ]
            
            # Open file and make API request
            with open(temp_file_path, 'rb') as audio_file:
                logger.debug(f"Making Groq API request with params: {list(transcription_params.keys())}")
                
                transcription = self.client.audio.transcriptions.create(
                    file=audio_file,
                    **transcription_params
                )
            
            # Process response
            processing_time = (time.time() - start_time) * 1000
            transcription_data = self._convert_groq_response(transcription, "transcribe")
            
            # Create response
            response = TranscriptionResponse(
                success=True,
                message="Transcription completed successfully",
                data=transcription_data,
                metadata={
                    "model_used": request.model,
                    "file_size_bytes": file_metadata.file_size,
                    "audio_format": Path(filename).suffix.lower().lstrip('.'),
                    "language_requested": request.language,
                    "response_format": str(request.response_format),  # Convert enum to string for metadata
                    "temperature": request.temperature,
                    "prompt_provided": bool(request.prompt)
                },
                request_id=request_id,
                processing_time_ms=processing_time,
                timestamp=datetime.utcnow()
            )
            
            logger.info(f"Transcription completed successfully for request {request_id} in {processing_time:.1f}ms")
            return response
            
        except groq.APIConnectionError as e:
            logger.error(f"Groq API connection error: {e}")
            raise GroqAPIError(
                message="Unable to connect to Groq API. Please check your internet connection.",
                error_code="API_CONNECTION_ERROR",
                details={"original_error": str(e)}
            )
        except groq.RateLimitError as e:
            logger.error(f"Groq API rate limit exceeded: {e}")
            raise GroqAPIError(
                message="API rate limit exceeded. Please try again later.",
                error_code="RATE_LIMIT_ERROR",
                status_code=429,
                details={"original_error": str(e)}
            )
        except groq.APIStatusError as e:
            logger.error(f"Groq API status error: {e}")
            raise GroqAPIError(
                message=f"API request failed with status {e.status_code}: {e.message}",
                error_code="API_STATUS_ERROR",
                status_code=e.status_code,
                details={"original_error": str(e)}
            )
        except GroqAPIError:
            raise
        except Exception as e:
            logger.error(f"Unexpected error during transcription: {e}")
            raise GroqAPIError(
                message=f"Transcription failed: {str(e)}",
                error_code="TRANSCRIPTION_ERROR",
                details={"original_error": str(e), "request_id": request_id}
            )
        finally:
            # Always cleanup temporary file
            if temp_file_path:
                self._cleanup_temp_file(temp_file_path)
    
    def translate_audio(
        self, 
        file_content: bytes, 
        filename: str, 
        content_type: str,
        request: TranslationRequest
    ) -> TranslationResponse:
        """
        Translate audio file to English using Groq's Whisper API.
        
        Args:
            file_content: Binary content of the audio file
            filename: Original filename
            content_type: MIME content type
            request: Translation request parameters
            
        Returns:
            TranslationResponse: Translation results
            
        Raises:
            GroqAPIError: If translation fails
        """
        request_id = str(uuid.uuid4())
        start_time = time.time()
        temp_file_path = None
        
        try:
            logger.info(f"Starting translation request {request_id} for file: {filename}")
            
            # Validate audio file
            file_metadata = self.validate_audio_file(file_content, filename, content_type)
            
            # Save to temporary file
            temp_file_path = self._save_temp_file(file_content, filename)
            
            # Prepare translation parameters
            translation_params = {
                "model": request.model,
                "response_format": request.response_format,  # Use enum directly
                "temperature": request.temperature or 0.0
            }
            
            # Add optional parameters
            if request.prompt:
                translation_params["prompt"] = request.prompt
            
            # Open file and make API request
            with open(temp_file_path, 'rb') as audio_file:
                logger.debug(f"Making Groq translation API request with params: {list(translation_params.keys())}")
                
                translation = self.client.audio.translations.create(
                    file=audio_file,
                    **translation_params
                )
            
            # Process response
            processing_time = (time.time() - start_time) * 1000
            translation_data = self._convert_groq_response(translation, "translate")
            
            # Create response
            response = TranslationResponse(
                success=True,
                message="Translation completed successfully",
                data=translation_data,
                metadata={
                    "model_used": request.model,
                    "file_size_bytes": file_metadata.file_size,
                    "audio_format": Path(filename).suffix.lower().lstrip('.'),
                    "response_format": str(request.response_format),  # Convert enum to string for metadata
                    "temperature": request.temperature,
                    "prompt_provided": bool(request.prompt),
                    "target_language": "en"
                },
                request_id=request_id,
                processing_time_ms=processing_time,
                timestamp=datetime.utcnow()
            )
            
            logger.info(f"Translation completed successfully for request {request_id} in {processing_time:.1f}ms")
            return response
            
        except groq.APIConnectionError as e:
            logger.error(f"Groq API connection error: {e}")
            raise GroqAPIError(
                message="Unable to connect to Groq API. Please check your internet connection.",
                error_code="API_CONNECTION_ERROR",
                details={"original_error": str(e)}
            )
        except groq.RateLimitError as e:
            logger.error(f"Groq API rate limit exceeded: {e}")
            raise GroqAPIError(
                message="API rate limit exceeded. Please try again later.",
                error_code="RATE_LIMIT_ERROR",
                status_code=429,
                details={"original_error": str(e)}
            )
        except groq.APIStatusError as e:
            logger.error(f"Groq API status error: {e}")
            raise GroqAPIError(
                message=f"API request failed with status {e.status_code}: {e.message}",
                error_code="API_STATUS_ERROR",
                status_code=e.status_code,
                details={"original_error": str(e)}
            )
        except GroqAPIError:
            raise
        except Exception as e:
            logger.error(f"Unexpected error during translation: {e}")
            raise GroqAPIError(
                message=f"Translation failed: {str(e)}",
                error_code="TRANSLATION_ERROR",
                details={"original_error": str(e), "request_id": request_id}
            )
        finally:
            # Always cleanup temporary file
            if temp_file_path:
                self._cleanup_temp_file(temp_file_path)
    

    def health_check(self) -> Dict[str, Any]:
        """Perform a lightweight Groq API health check."""
        base_url = self.settings.groq_base_url.rstrip('/')
        if not base_url.endswith('/openai/v1'):
            base_url = f"{base_url}/openai/v1"
        endpoint = f"{base_url}/models"

        headers = {
            'Authorization': f'Bearer {self.settings.groq_api_key}',
        }

        transport = httpx.HTTPTransport(retries=self.settings.groq_max_retries)
        try:
            with httpx.Client(timeout=self.settings.groq_timeout, transport=transport) as client:
                response = client.get(endpoint, headers=headers)
                response.raise_for_status()
        except httpx.HTTPStatusError as exc:
            logger.error(
                "Groq health check failed with status %s: %s",
                exc.response.status_code,
                exc.response.text,
            )
            return {
                'status': 'unhealthy',
                'service': 'groq_api',
                'endpoint_available': False,
                'status_code': exc.response.status_code,
                'error': exc.response.text,
            }
        except httpx.RequestError as exc:
            logger.error("Groq health check request error: %s", exc)
            return {
                'status': 'unhealthy',
                'service': 'groq_api',
                'endpoint_available': False,
                'error': str(exc),
            }

        payload = response.json() if response.content else {}
        rate_limits = {
            'requests_limit': response.headers.get('x-ratelimit-limit-requests'),
            'requests_remaining': response.headers.get('x-ratelimit-remaining-requests'),
            'requests_reset': response.headers.get('x-ratelimit-reset-requests'),
            'tokens_limit': response.headers.get('x-ratelimit-limit-tokens'),
            'tokens_remaining': response.headers.get('x-ratelimit-remaining-tokens'),
            'tokens_reset': response.headers.get('x-ratelimit-reset-tokens'),
        }

        return {
            'status': 'healthy',
            'service': 'groq_api',
            'version': 'v1',
            'endpoint_available': True,
            'rate_limits': rate_limits,
            'available_models': [item.get('id') for item in payload.get('data', [])],
        }
