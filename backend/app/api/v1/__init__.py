"""
API v1 router configuration.
"""

from fastapi import APIRouter

from .endpoints import api_keys, github, transcription

api_router = APIRouter()

# Include endpoint routers
api_router.include_router(transcription.router)
api_router.include_router(api_keys.router)
api_router.include_router(github.router)
