"""
Configuration module for the FastAPI transcription application.
Handles environment variables and application settings using Pydantic Settings.
"""
import os
import json
from functools import lru_cache
from typing import Any, List, Optional

from pydantic import Field, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
    )

    # Application Configuration
    app_name: str = Field(default="Audio Transcription API", env="APP_NAME")
    app_version: str = Field(default="1.0.0", env="APP_VERSION")
    debug: bool = Field(default=False, env="DEBUG")
    environment: str = Field(default="development", env="ENVIRONMENT")

    # API Configuration
    host: str = Field(default="127.0.0.1", env="HOST")
    port: int = Field(default=8000, env="PORT")
    api_v1_prefix: str = Field(default="/api/v1", env="API_V1_PREFIX")

    # Security Configuration
    secret_key: str = Field(
        default="your-secret-key-here-change-in-production",
        env="SECRET_KEY",
    )
    allowed_hosts: List[str] | str = Field(default=["*"], env="ALLOWED_HOSTS")

    # CORS Configuration
    cors_origins: List[str] | str = Field(env="CORS_ORIGINS")
    cors_allow_credentials: bool = Field(default=True, env="CORS_ALLOW_CREDENTIALS")
    cors_allow_methods: List[str] | str = Field(default=["*"], env="CORS_ALLOW_METHODS")
    cors_allow_headers: List[str] | str = Field(default=["*"], env="CORS_ALLOW_HEADERS")

    # Groq API Configuration (Required)
    groq_api_key: str = Field(..., env="GROQ_API_KEY")
    groq_base_url: str = Field(
        default="https://api.groq.com/openai/v1",
        env="GROQ_BASE_URL",
    )
    groq_timeout: float = Field(default=30.0, env="GROQ_TIMEOUT")
    groq_max_retries: int = Field(default=2, env="GROQ_MAX_RETRIES")

    # Audio Processing Configuration
    max_file_size_mb: int = Field(default=25, env="MAX_FILE_SIZE_MB")
    allowed_audio_formats: List[str] | str = Field(
        default=["flac", "mp3", "mp4", "mpeg", "mpga", "m4a", "ogg", "wav", "webm"],
        env="ALLOWED_AUDIO_FORMATS",
    )

    # Whisper Model Configuration
    default_model: str = Field(default="whisper-large-v3-turbo", env="DEFAULT_MODEL")
    available_models: List[str] | str = Field(
        default=["whisper-large-v3-turbo", "whisper-large-v3"],
        env="AVAILABLE_MODELS",
    )

    # Logging Configuration
    log_level: str = Field(default="INFO", env="LOG_LEVEL")
    log_format: str = Field(
        default="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
        env="LOG_FORMAT",
    )
    log_file_path: str = Field(default="logs/app.log", env="LOG_FILE_PATH")

    # File Storage Configuration
    upload_dir: str = Field(default="uploads", env="UPLOAD_DIR")
    temp_file_cleanup: bool = Field(default=True, env="TEMP_FILE_CLEANUP")

    @field_validator("groq_api_key")
    def validate_groq_api_key(cls, value: str) -> str:
        """Validate that Groq API key is provided and not empty."""
        if not value or value.strip() == "":
            raise ValueError(
                "GROQ_API_KEY is required. Please set it in your environment variables. "
                "Get your API key from: https://console.groq.com/keys"
            )
        return value.strip()

    @field_validator("allowed_hosts", mode="before")
    def parse_allowed_hosts(cls, value: Any) -> List[str]:
        """Parse allowed hosts from string or list."""
        if value is None:
            return ["*"]

        if isinstance(value, str):
            if value.strip() == "*":
                return ["*"]
            try:
                parsed = json.loads(value)
                if isinstance(parsed, list):
                    return parsed
            except (json.JSONDecodeError, TypeError):
                return [host.strip() for host in value.split(",") if host.strip()]

        return value

    @field_validator(
        "cors_origins",
        "cors_allow_methods",
        "cors_allow_headers",
        "allowed_audio_formats",
        "available_models",
        mode="before",
    )
    def parse_list_fields(cls, value: Any) -> List[str]:
        """Parse list fields from comma-separated string or JSON."""
        if value is None:
            return []

        if isinstance(value, str):
            try:
                parsed = json.loads(value)
                if isinstance(parsed, list):
                    return parsed
            except (json.JSONDecodeError, TypeError):
                return [item.strip() for item in value.split(",") if item.strip()]

        return value

    @field_validator("log_level")
    def validate_log_level(cls, value: str) -> str:
        """Validate that log level is one of the supported levels."""
        valid_levels = ["DEBUG", "INFO", "WARNING", "ERROR", "CRITICAL"]
        if value.upper() not in valid_levels:
            raise ValueError(f"Log level must be one of: {valid_levels}")
        return value.upper()

    @property
    def max_file_size_bytes(self) -> int:
        """Convert max file size from MB to bytes."""
        return self.max_file_size_mb * 1024 * 1024

    def create_upload_directory(self) -> str:
        """Create upload directory if it doesn't exist."""
        if not os.path.exists(self.upload_dir):
            os.makedirs(self.upload_dir, exist_ok=True)
        return self.upload_dir

    def create_log_directory(self) -> str:
        """Create log directory if it doesn't exist."""
        log_dir = os.path.dirname(self.log_file_path)
        if log_dir and not os.path.exists(log_dir):
            os.makedirs(log_dir, exist_ok=True)
        return log_dir

    def is_production(self) -> bool:
        """Check if application is running in production."""
        return self.environment.lower() == "production"

    def get_database_url(self) -> Optional[str]:
        """Get database URL if needed (placeholder for future use)."""
        return None


@lru_cache()
def get_settings() -> Settings:
    """Get cached application settings."""
    return Settings()


settings = get_settings()
