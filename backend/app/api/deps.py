"""Shared API dependencies for FastAPI endpoints."""
from __future__ import annotations

from fastapi import Depends
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer


security = HTTPBearer()


def get_current_user_id(
    credentials: HTTPAuthorizationCredentials = Depends(security),
) -> str:
    """Extract the authenticated user identifier from the request."""
    # TODO: Replace mock implementation with JWT validation or session lookup.
    # This placeholder mirrors the existing API key endpoints.
    _ = credentials  # pragma: no cover - to silence unused variable in placeholder
    return "mock-user-id"
