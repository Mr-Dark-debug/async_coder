"""GitHub OAuth service helpers for the Async Coder backend."""
from __future__ import annotations

import logging
import secrets
from datetime import datetime, timedelta
from typing import Any, Dict, Optional
from urllib.parse import parse_qsl, urlencode, urlparse, urlunparse

import httpx

from app.core.config import Settings


logger = logging.getLogger(__name__)


class GitHubOAuthError(Exception):
    """Base exception for GitHub OAuth issues."""

    def __init__(self, message: str, code: str = "oauth_error", return_url: Optional[str] = None) -> None:
        super().__init__(message)
        self.code = code
        self.return_url = return_url


class GitHubOAuthConfigurationError(GitHubOAuthError):
    """Raised when required GitHub configuration is missing."""

    def __init__(self, message: str) -> None:
        super().__init__(message, code="configuration")


class GitHubOAuthStateError(GitHubOAuthError):
    """Raised when an OAuth state token is invalid or expired."""

    def __init__(self, message: str) -> None:
        super().__init__(message, code="invalid_state")


class GitHubOAuthService:
    """Handles OAuth authorization flows against GitHub."""

    STATE_TTL = timedelta(minutes=10)

    def __init__(self, settings: Settings) -> None:
        self.settings = settings
        self._state_store: Dict[str, Dict[str, Any]] = {}
        self._connections: Dict[str, Dict[str, Any]] = {}
        self._credentials: Dict[str, Dict[str, Any]] = {}

    # ------------------------------------------------------------------
    # Public helpers
    # ------------------------------------------------------------------
    @property
    def state_ttl_seconds(self) -> int:
        """Return the TTL for state tokens in seconds."""
        return int(self.STATE_TTL.total_seconds())

    def start_authorization(self, *, user_id: Optional[str], return_url: Optional[str]) -> tuple[str, str]:
        """Create an authorization URL and state token for a user."""
        self._ensure_configuration()
        self._cleanup_expired_states()

        sanitized_return_url = self._sanitize_return_url(return_url)
        state = secrets.token_urlsafe(32)
        self._state_store[state] = {
            "user_id": user_id,
            "return_url": sanitized_return_url,
            "created_at": datetime.utcnow(),
        }

        authorize_url = self._build_authorize_url(state)
        logger.info("Created GitHub OAuth state for user %s", user_id or "anonymous")
        return authorize_url, state

    async def complete_authorization(self, *, state: str, code: str) -> Dict[str, Any]:
        """Exchange the authorization code for a token and persist the connection."""
        state_data = self._consume_state(state)
        if not state_data:
            raise GitHubOAuthStateError("OAuth state is invalid or has expired.")

        try:
            token_payload = await self._exchange_code_for_token(code)
            access_token = token_payload.get("access_token")
            if not access_token:
                raise GitHubOAuthError(
                    "GitHub did not return an access token.",
                    code="token_exchange_failed",
                    return_url=state_data.get("return_url"),
                )

            user_profile = await self._fetch_user_profile(access_token)
            connection = self._persist_connection(
                user_id=state_data.get("user_id"),
                token_payload=token_payload,
                user_profile=user_profile,
            )
            redirect_url = self._build_redirect_url(
                state_data.get("return_url"),
                status="connected",
            )
            logger.info(
                "GitHub OAuth completed for user %s (login=%s)",
                state_data.get("user_id") or "anonymous",
                user_profile.get("login"),
            )
            return {
                "redirect_url": redirect_url,
                "connection": connection,
            }
        except GitHubOAuthError as exc:
            exc.return_url = exc.return_url or state_data.get("return_url")
            raise
        except httpx.HTTPStatusError as exc:
            logger.error("GitHub token exchange failed: %s", exc)
            raise GitHubOAuthError(
                "GitHub token endpoint returned an error.",
                code="token_exchange_failed",
                return_url=state_data.get("return_url"),
            ) from exc
        except httpx.RequestError as exc:
            logger.error("GitHub token exchange request failed: %s", exc)
            raise GitHubOAuthError(
                "Unable to reach GitHub token endpoint.",
                code="network_failure",
                return_url=state_data.get("return_url"),
            ) from exc
        except Exception as exc:  # noqa: BLE001
            logger.exception("Unexpected error completing GitHub OAuth: %s", exc)
            raise GitHubOAuthError(
                "Unexpected error completing GitHub OAuth.",
                return_url=state_data.get("return_url"),
            ) from exc

    def build_error_redirect(
        self,
        *,
        state: Optional[str],
        error_code: str,
        return_url: Optional[str] = None,
    ) -> str:
        """Create a redirect URL for error cases."""
        target_url = return_url
        if not target_url and state and state in self._state_store:
            state_data = self._consume_state(state)
            if state_data:
                target_url = state_data.get("return_url")
        return self._build_redirect_url(target_url, status="error", error_code=error_code)

    def get_connection_status(self, user_id: Optional[str]) -> Dict[str, Any]:
        """Return connection metadata for a user."""
        if not user_id:
            return {"connected": False}

        connection = self._connections.get(user_id)
        if not connection:
            return {"connected": False}

        return {
            "connected": True,
            "account": connection.get("account"),
            "scopes": connection.get("scopes", []),
            "connected_at": connection.get("connected_at"),
        }

    # ------------------------------------------------------------------
    # Internal helpers
    # ------------------------------------------------------------------
    def _ensure_configuration(self) -> None:
        missing = []
        if not self.settings.github_client_id:
            missing.append("GITHUB_CLIENT_ID")
        if not self.settings.github_client_secret:
            missing.append("GITHUB_CLIENT_SECRET")
        if not self.settings.github_redirect_uri:
            missing.append("GITHUB_REDIRECT_URI")

        if missing:
            raise GitHubOAuthConfigurationError(
                "Missing GitHub OAuth configuration: " + ", ".join(missing)
            )

    def _cleanup_expired_states(self) -> None:
        now = datetime.utcnow()
        expired = [
            state
            for state, meta in self._state_store.items()
            if now - meta.get("created_at", now) > self.STATE_TTL
        ]
        for state in expired:
            logger.debug("Cleaning up expired OAuth state %s", state)
            self._state_store.pop(state, None)

    def _sanitize_return_url(self, return_url: Optional[str]) -> str:
        default_base = self._default_return_base()
        if not return_url:
            return default_base

        parsed = urlparse(return_url)
        if not parsed.scheme or not parsed.netloc:
            raise GitHubOAuthStateError("Return URL must be absolute.")

        allowed_origin = urlparse(default_base)
        if parsed.scheme != allowed_origin.scheme or parsed.netloc != allowed_origin.netloc:
            raise GitHubOAuthStateError("Return URL host is not permitted.")

        return return_url

    def _default_return_base(self) -> str:
        base = (self.settings.frontend_base_url or "http://localhost:3000").rstrip("/")
        return f"{base}/task/settings?tab=integrations"

    def _build_authorize_url(self, state: str) -> str:
        scopes = self.settings.github_oauth_scopes
        if isinstance(scopes, list):
            scope_param = " ".join(scopes)
        else:
            scope_param = str(scopes)

        query = {
            "client_id": self.settings.github_client_id,
            "redirect_uri": self.settings.github_redirect_uri,
            "state": state,
            "allow_signup": "false",
        }
        if scope_param:
            query["scope"] = scope_param

        parsed = urlparse(self.settings.github_authorize_url)
        base = parsed._replace(query="")
        return urlunparse(base) + "?" + urlencode(query)

    def _consume_state(self, state: str) -> Optional[Dict[str, Any]]:
        data = self._state_store.pop(state, None)
        if not data:
            return None
        if datetime.utcnow() - data.get("created_at", datetime.utcnow()) > self.STATE_TTL:
            logger.info("Discarded expired OAuth state %s", state)
            return None
        return data

    async def _exchange_code_for_token(self, code: str) -> Dict[str, Any]:
        payload = {
            "client_id": self.settings.github_client_id,
            "client_secret": self.settings.github_client_secret,
            "code": code,
            "redirect_uri": self.settings.github_redirect_uri,
        }
        headers = {"Accept": "application/json"}
        async with httpx.AsyncClient(timeout=15.0) as client:
            response = await client.post(
                self.settings.github_token_url,
                data=payload,
                headers=headers,
            )
            response.raise_for_status()
            data = response.json()
            if data.get("error"):
                logger.error("GitHub token exchange error: %s", data)
                raise GitHubOAuthError(
                    data.get("error_description") or "GitHub token exchange failed.",
                    code="token_exchange_failed",
                )
            return data

    async def _fetch_user_profile(self, access_token: str) -> Dict[str, Any]:
        headers = {
            "Authorization": f"Bearer {access_token}",
            "Accept": "application/vnd.github+json",
        }
        async with httpx.AsyncClient(timeout=15.0) as client:
            response = await client.get(
                f"{self.settings.github_api_base_url.rstrip('/')}/user",
                headers=headers,
            )
            response.raise_for_status()
            return response.json()

    def _persist_connection(
        self,
        *,
        user_id: Optional[str],
        token_payload: Dict[str, Any],
        user_profile: Dict[str, Any],
    ) -> Dict[str, Any]:
        scopes = self._parse_scopes(token_payload.get("scope"))
        connection = {
            "account": {
                "login": user_profile.get("login"),
                "name": user_profile.get("name"),
                "avatar_url": user_profile.get("avatar_url"),
                "html_url": user_profile.get("html_url"),
            },
            "scopes": scopes,
            "connected_at": datetime.utcnow().isoformat(),
        }

        if user_id:
            self._connections[user_id] = connection
            self._credentials[user_id] = {
                "access_token": token_payload.get("access_token"),
                "token_type": token_payload.get("token_type"),
                "scope": scopes,
                "refresh_token": token_payload.get("refresh_token"),
                "expires_in": token_payload.get("expires_in"),
            }

        return connection

    def _parse_scopes(self, scopes: Optional[str]) -> list[str]:
        if not scopes:
            return []
        return [scope.strip() for scope in scopes.replace(",", " ").split() if scope.strip()]

    def _build_redirect_url(self, return_url: Optional[str], *, status: str, error_code: Optional[str] = None) -> str:
        base = return_url or self._default_return_base()
        parsed = urlparse(base)
        query = dict(parse_qsl(parsed.query))
        query["github"] = status
        if error_code:
            query["error"] = error_code
        new_query = urlencode(query, doseq=True)
        return urlunparse(parsed._replace(query=new_query))


__all__ = [
    "GitHubOAuthService",
    "GitHubOAuthError",
    "GitHubOAuthConfigurationError",
    "GitHubOAuthStateError",
]
