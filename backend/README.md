# Async Coder Backend

This directory hosts the FastAPI application that powers Async Coder. It exposes transcription services, API-key management, and the GitHub OAuth connector that integrates with OpenAI's Model Context Protocol (MCP) custom connectors.

## Getting started

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
uvicorn main:app --reload
```

The server listens on `http://localhost:8000` by default and mounts all routes under the `/api/v1` prefix. Update `.env` to match your environment—see the sample file for guidance.

## Key packages

- `app/api/v1/endpoints` – FastAPI routers for transcription, API-key management, and GitHub OAuth.
- `app/services` – Business logic (e.g. `GitHubOAuthService`) used by the endpoints.
- `app/core/config.py` – Pydantic settings loader for all environment variables.

## GitHub OAuth endpoints

| Method & Path | Description |
| --- | --- |
| `POST /api/v1/github/oauth/start` | Generates an authorization URL and state token for the signed-in user (requires `Authorization: Bearer <token>`). |
| `GET /api/v1/github/oauth/callback` | Exchanges the GitHub `code` for tokens and redirects back to the frontend with the outcome. |
| `GET /api/v1/github/oauth/status` | Returns the stored connection metadata for the authenticated caller (connected flag, account info, scopes, timestamp). |

These endpoints rely on the configuration described in [`docs/github-connector.md`](../docs/github-connector.md). For production deployments replace the in-memory token storage in `GitHubOAuthService` with calls to your database or secret store.

## Useful environment variables

| Variable | Purpose |
| --- | --- |
| `FRONTEND_BASE_URL` | Determines where users are redirected after OAuth completes (`/task/settings?tab=integrations`). |
| `GITHUB_REDIRECT_URI` | Must match the callback URL registered in your GitHub App. |
| `GITHUB_OAUTH_SCOPES` | Customise the scopes that appear on GitHub's Install & Authorize screen. |
| `GROQ_API_KEY` | Required for Groq transcription requests. |

Consult [`backend/.env.example`](./.env.example) for the complete list.

## Running tests

```bash
pytest
```

The existing test suite covers the API-key management flow. Add your own tests to exercise `GitHubOAuthService` once you introduce persistent storage or extend the connector.
