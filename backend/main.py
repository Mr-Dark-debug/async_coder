"""
Main FastAPI application entry point for the Audio Transcription API.
Configures the application, middleware, and routing.
"""

import logging
import time
from contextlib import asynccontextmanager
from typing import Dict, Any
import sys
import io

from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
import uvicorn

from app.core.config import get_settings
from app.api.v1.endpoints.transcription import router as transcription_router
from app.providers.groq_provider import GroqAPIError

# Configure logging with colors
class ColoredFormatter(logging.Formatter):
    grey = "\033[90m"
    green = "\033[92m"
    yellow = "\033[93m"
    red = "\033[91m"
    bold_red = "\033[1;31m"
    reset = "\033[0m"
    
    def __init__(self, fmt):
        super().__init__()
        self.fmt = fmt
        self.FORMATS = {
            logging.DEBUG: self.grey + self.fmt + self.reset,
            logging.INFO: self.green + self.fmt + self.reset,
            logging.WARNING: self.yellow + self.fmt + self.reset,
            logging.ERROR: self.red + self.fmt + self.reset,
            logging.CRITICAL: self.bold_red + self.fmt + self.reset
        }
    
    def format(self, record):
        log_fmt = self.FORMATS.get(record.levelno, self.fmt)
        formatter = logging.Formatter(log_fmt)
        return formatter.format(record)

# Set up logger
logger = logging.getLogger()
logger.setLevel(logging.INFO)

# Create console handler with colored output
console_handler = logging.StreamHandler()
console_handler.setLevel(logging.INFO)

# Create formatter and add it to the handler
log_format = "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
colored_formatter = ColoredFormatter(log_format)
console_handler.setFormatter(colored_formatter)

# Create file handler
file_handler = logging.FileHandler('logs/app.log', mode='a', encoding='utf-8')
file_handler.setLevel(logging.DEBUG)
file_formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
file_handler.setFormatter(file_formatter)

# Add handlers to the logger
logger.addHandler(console_handler)
logger.addHandler(file_handler)

# Fix for Windows console encoding
if sys.platform == 'win32':
    import io
    import sys
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')

# Get settings
settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Application lifespan context manager.
    Handles startup and shutdown events.
    """
    # Startup
    logger.info(f"Starting {settings.app_name} v{settings.app_version}")
    logger.info(f"Environment: {settings.environment}")
    logger.info(f"Debug mode: {settings.debug}")
    
    # Create required directories
    try:
        settings.create_upload_directory()
        settings.create_log_directory()
        logger.info("Required directories created/verified")
    except Exception as e:
        logger.error(f"Failed to create directories: {e}")
        raise
    
    # Test Groq API connection
    try:
        from app.providers.groq_provider import GroqProvider
        groq_provider = GroqProvider(settings)
        health = groq_provider.health_check()
        if health.get("status") == "healthy":
            logger.info("✅ Groq API connection verified")
        else:
            logger.warning("⚠️ Groq API connection issue detected")
    except Exception as e:
        logger.error(f"❌ Groq API connection failed: {e}")
        if settings.is_production():
            raise  # Fail startup in production if API is not accessible
    
    logger.info("🚀 Application startup completed")
    
    yield  # Application runs here
    
    # Shutdown
    logger.info("🛑 Application shutdown initiated")
    
    # Cleanup tasks
    try:
        # Clean up any temporary files if needed
        import os
        import glob
        temp_files = glob.glob(os.path.join(settings.upload_dir, "*"))
        for temp_file in temp_files:
            try:
                os.remove(temp_file)
            except Exception as e:
                logger.warning(f"Failed to cleanup temp file {temp_file}: {e}")
        
        logger.info("Cleanup completed")
    except Exception as e:
        logger.error(f"Cleanup failed: {e}")
    
    logger.info("👋 Application shutdown completed")


# Create FastAPI application
app = FastAPI(
    title=settings.app_name,
    description="""
    🎵 **Audio Transcription API**
    
    A high-performance API for converting audio to text using Groq's lightning-fast Whisper models.
    
    ## Features
    
    - **🚀 Ultra-fast transcription** - Powered by Groq's optimized inference
    - **🌍 Multi-language support** - Transcribe audio in 90+ languages
    - **🔄 Translation capabilities** - Translate any language to English
    - **📊 Detailed metadata** - Get timestamps, confidence scores, and more
    - **🛡️ Production-ready** - Comprehensive error handling and validation
    
    ## Supported Audio Formats
    
    MP3, WAV, FLAC, M4A, OGG, MP4, MPEG, MPGA, WebM
    
    ## Models Available
    
    - **whisper-large-v3-turbo** - Fastest processing, great accuracy
    - **whisper-large-v3** - Highest accuracy, best for challenging audio
    
    ## Getting Started
    
    1. Upload an audio file to `/api/v1/transcribe` or `/api/v1/translate`
    2. Choose your preferred model and options
    3. Receive your transcription with detailed metadata
    
    For more information, visit our [documentation](#) or check the health endpoint.
    """,
    version=settings.app_version,
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
    lifespan=lifespan,
    debug=settings.debug
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=settings.cors_allow_credentials,
    allow_methods=settings.cors_allow_methods,
    allow_headers=settings.cors_allow_headers,
)

# Add trusted host middleware (configure properly in production)
if settings.is_production():
    app.add_middleware(
        TrustedHostMiddleware,
        allowed_hosts=settings.allowed_hosts
    )


# Request logging middleware
@app.middleware("http")
async def log_requests(request: Request, call_next):
    """Log all HTTP requests with timing information."""
    start_time = time.time()
    
    # Extract client information
    client_ip = request.client.host if request.client else "unknown"
    user_agent = request.headers.get("user-agent", "unknown")
    
    # Log request
    logger.info(
        f"Request started: {request.method} {request.url.path} "
        f"from {client_ip} ({user_agent})"
    )
    
    # Process request
    try:
        response = await call_next(request)
        
        # Calculate processing time
        process_time = time.time() - start_time
        
        # Log response
        logger.info(
            f"Request completed: {request.method} {request.url.path} "
            f"-> {response.status_code} in {process_time:.3f}s"
        )
        
        # Add processing time header
        response.headers["X-Process-Time"] = str(process_time)
        
        return response
        
    except Exception as e:
        process_time = time.time() - start_time
        logger.error(
            f"Request failed: {request.method} {request.url.path} "
            f"-> Error in {process_time:.3f}s: {str(e)}"
        )
        raise


# Global exception handlers
@app.exception_handler(GroqAPIError)
async def groq_api_exception_handler(request: Request, exc: GroqAPIError):
    """Handle Groq API errors globally."""
    logger.error(f"Groq API error on {request.url.path}: {exc.message}")
    
    # Map error codes to HTTP status codes
    status_code_map = {
        "FILE_TOO_LARGE": 413,
        "INVALID_FILE_FORMAT": 400,
        "RATE_LIMIT_ERROR": 429,
        "API_CONNECTION_ERROR": 503,
        "VALIDATION_ERROR": 400,
        "CLIENT_INIT_ERROR": 503
    }
    
    status_code = status_code_map.get(exc.error_code, 500)
    
    return JSONResponse(
        status_code=status_code,
        content={
            "success": False,
            "message": exc.message,
            "error_code": exc.error_code,
            "error_details": exc.details,
            "timestamp": time.time()
        }
    )


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    """Handle request validation errors."""
    logger.warning(f"Validation error on {request.url.path}: {exc}")
    
    return JSONResponse(
        status_code=422,
        content={
            "success": False,
            "message": "Request validation failed",
            "error_code": "VALIDATION_ERROR",
            "validation_errors": [
                {
                    "field": ".".join(str(loc) for loc in error["loc"]),
                    "message": error["msg"],
                    "type": error["type"],
                    "input": error.get("input")
                }
                for error in exc.errors()
            ],
            "timestamp": time.time()
        }
    )


@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    """Handle HTTP exceptions."""
    logger.warning(f"HTTP exception on {request.url.path}: {exc.status_code} - {exc.detail}")
    
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "success": False,
            "message": exc.detail,
            "error_code": f"HTTP_{exc.status_code}",
            "timestamp": time.time()
        }
    )


@app.exception_handler(Exception)
async def general_exception_handler(request: Request, exc: Exception):
    """Handle unexpected exceptions."""
    logger.error(f"Unexpected error on {request.url.path}: {exc}", exc_info=True)
    
    return JSONResponse(
        status_code=500,
        content={
            "success": False,
            "message": "An unexpected error occurred" if settings.is_production() else str(exc),
            "error_code": "INTERNAL_ERROR",
            "timestamp": time.time()
        }
    )


# Root endpoint
@app.get("/", tags=["Root"])
async def root() -> Dict[str, Any]:
    """
    Root endpoint with API information and status.
    """
    return {
        "message": f"Welcome to {settings.app_name}! 🎵",
        "description": "High-performance audio transcription API powered by Groq",
        "version": settings.app_version,
        "status": "operational",
        "environment": settings.environment,
        "endpoints": {
            "docs": "/docs",
            "health": f"{settings.api_v1_prefix}/health",
            "transcribe": f"{settings.api_v1_prefix}/transcribe",
            "translate": f"{settings.api_v1_prefix}/translate",
            "models": f"{settings.api_v1_prefix}/models",
            "formats": f"{settings.api_v1_prefix}/formats"
        },
        "features": [
            "Multi-language transcription",
            "Audio translation to English",
            "Word and segment timestamps",
            "Multiple response formats",
            "Fast Groq-powered inference"
        ],
        "supported_formats": settings.allowed_audio_formats,
        "max_file_size_mb": settings.max_file_size_mb,
        "timestamp": time.time()
    }


# Basic health check endpoint
@app.get("/health", tags=["Health"])
async def basic_health_check() -> Dict[str, Any]:
    """Basic health check endpoint."""
    return {
        "status": "healthy",
        "service": settings.app_name,
        "version": settings.app_version,
        "timestamp": time.time()
    }


# Include API routers
app.include_router(
    transcription_router,
    prefix=settings.api_v1_prefix,
    tags=["Audio Transcription"]
)


# Custom startup message
@app.on_event("startup")
async def startup_message():
    """Display startup message with useful information."""
    print("\n" + "="*60)
    print(f"🎵 {settings.app_name} v{settings.app_version}")
    print("="*60)
    print(f"📡 Server: http://{settings.host}:{settings.port}")
    print(f"📚 Docs: http://{settings.host}:{settings.port}/docs")
    print(f"🏥 Health: http://{settings.host}:{settings.port}/health")
    print(f"🔧 Environment: {settings.environment}")
    print(f"📝 Debug: {settings.debug}")
    print("="*60)
    print("🚀 Ready to transcribe audio!")
    print("="*60 + "\n")


if __name__ == "__main__":
    # Run the application
    uvicorn.run(
        "main:app",
        host=settings.host,
        port=settings.port,
        reload=settings.debug,
        log_level=settings.log_level.lower(),
        access_log=True
    )