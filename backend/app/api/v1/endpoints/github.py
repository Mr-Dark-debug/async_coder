"""FastAPI endpoints for managing the GitHub OAuth connector."""
from __future__ import annotations

import logging
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from fastapi.responses import RedirectResponse
from pydantic import AnyHttpUrl, BaseModel, Field

from app.core.config import Settings, get_settings
from app.services.github_oauth_service import (
    GitHubOAuthConfigurationError,
    GitHubOAuthError,
    GitHubOAuthService,
    GitHubOAuthStateError,
)


logger = logging.getLogger(__name__)

router = APIRouter(prefix="/github", tags=["GitHub OAuth"])


def get_github_service(settings: Settings = Depends(get_settings)) -> GitHubOAuthService:
    """Provide a GitHub OAuth service instance."""
    # Using a module-level cache ensures state persistence within the process.
    if not hasattr(get_github_service, "_instance"):
        setattr(get_github_service, "_instance", GitHubOAuthService(settings))
    return getattr(get_github_service, "_instance")


class OAuthStartRequest(BaseModel):
    """Request payload for starting the OAuth flow."""

    user_id: Optional[str] = Field(default=None, description="Authenticated user identifier")
    return_url: Optional[AnyHttpUrl] = Field(
        default=None,
        description="URL to redirect back to once OAuth completes",
    )


class OAuthStartResponse(BaseModel):
    """Response describing the GitHub authorization URL."""

    authorization_url: AnyHttpUrl = Field(alias="authorizationUrl")
    state: str
    expires_in: int = Field(alias="expiresIn")

    class Config:
        populate_by_name = True


class GitHubAccount(BaseModel):
    """Simplified GitHub account details for the frontend."""

    login: Optional[str] = None
    name: Optional[str] = None
    avatar_url: Optional[AnyHttpUrl] = Field(default=None, alias="avatarUrl")
    html_url: Optional[AnyHttpUrl] = Field(default=None, alias="htmlUrl")

    class Config:
        populate_by_name = True


class GitHubConnectionStatus(BaseModel):
    """Connection status returned to the frontend."""

    connected: bool
    account: Optional[GitHubAccount] = None
    scopes: list[str] = Field(default_factory=list)
    connected_at: Optional[str] = Field(default=None, alias="connectedAt")

    class Config:
        populate_by_name = True


@router.post("/oauth/start", response_model=OAuthStartResponse)
async def start_github_oauth(
    payload: OAuthStartRequest,
    service: GitHubOAuthService = Depends(get_github_service),
) -> OAuthStartResponse:
    """Begin the GitHub OAuth flow by generating an authorization URL."""
    try:
        authorization_url, state = service.start_authorization(
            user_id=payload.user_id,
            return_url=str(payload.return_url) if payload.return_url else None,
        )
    except GitHubOAuthConfigurationError as exc:
        logger.error("GitHub OAuth configuration error: %s", exc)
        raise HTTPException(status_code=500, detail=str(exc)) from exc
    except GitHubOAuthStateError as exc:
        logger.warning("GitHub OAuth state error: %s", exc)
        raise HTTPException(status_code=400, detail=str(exc)) from exc

    return OAuthStartResponse(
        authorization_url=authorization_url,
        state=state,
        expires_in=service.state_ttl_seconds,
    )


@router.get("/oauth/callback")
async def github_oauth_callback(
    code: str = Query(..., description="GitHub authorization code"),
    state: str = Query(..., description="OAuth state token"),
    service: GitHubOAuthService = Depends(get_github_service),
) -> RedirectResponse:
    """Handle the OAuth callback from GitHub."""
    try:
        result = await service.complete_authorization(code=code, state=state)
        redirect_url = result["redirect_url"]
    except GitHubOAuthStateError as exc:
        logger.warning("GitHub OAuth callback failed due to state error: %s", exc)
        redirect_url = service.build_error_redirect(state=state, error_code=exc.code)
    except GitHubOAuthError as exc:
        logger.error("GitHub OAuth callback failed: %s", exc)
        redirect_url = service.build_error_redirect(
            state=state,
            error_code=exc.code,
            return_url=getattr(exc, "return_url", None),
        )
    except Exception as exc:  # noqa: BLE001
        logger.exception("Unexpected error while handling GitHub callback: %s", exc)
        redirect_url = service.build_error_redirect(state=state, error_code="unexpected")

    return RedirectResponse(url=redirect_url, status_code=303)


@router.get("/oauth/status", response_model=GitHubConnectionStatus)
async def github_connection_status(
    user_id: str = Query(..., description="Authenticated user identifier"),
    service: GitHubOAuthService = Depends(get_github_service),
) -> GitHubConnectionStatus:
    """Return the GitHub connector status for the current user."""
    status_payload = service.get_connection_status(user_id)
    account_payload = status_payload.get("account") if status_payload.get("connected") else None

    return GitHubConnectionStatus(
        connected=status_payload.get("connected", False),
        account=GitHubAccount(**account_payload) if account_payload else None,
        scopes=status_payload.get("scopes", []),
        connected_at=status_payload.get("connected_at"),
    )
