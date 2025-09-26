# GitHub Connector Setup

This guide explains how to wire Async Coder to GitHub using OAuth and the Model Context Protocol (MCP) connector architecture. It covers the GitHub App configuration, backend API endpoints, frontend behaviour, and the environment variables required to run the flow locally or in production.

> **TL;DR**
> 1. Register a GitHub App (or OAuth App) with the callback URL `https://<your-backend-domain>/api/v1/github/oauth/callback`.
> 2. Copy the credentials into `backend/.env` (see `backend/.env.example`) and `/.env.local`.
> 3. Start the FastAPI backend and Next.js frontend.
> 4. Visit **Settings → Integrations → GitHub connector** and click **Authorize with GitHub**. You should land on GitHub's native Install & Authorize page.
> 5. After approving, Async Coder redirects back with the connection status and surfaces the account details.

---

## 1. GitHub App configuration

1. Navigate to **GitHub → Settings → Developer settings → GitHub Apps → New GitHub App**.
2. Fill in the basic metadata (name, homepage URL, description).
3. Under **Webhook**, set a secret if you want to receive events (optional but recommended).
4. Under **Permissions**, grant the minimal scopes required, for example:
   - Repository contents: **Read-only**
   - Metadata: **Read-only**
   - Issues / Pull requests: **Read-only** (if you intend to surface them via MCP)
5. Under **Where can this GitHub App be installed?**, choose "Any account" unless you want to restrict it to a single organisation.
6. Set the **Callback URL** to `https://<your-backend-domain>/api/v1/github/oauth/callback` (use `http://localhost:8000/api/v1/github/oauth/callback` in development).
7. Save the app and record the following values:
   - **App ID**
   - **Client ID**
   - **Client Secret**
   - **Private key** (download the PEM file)
   - **Webhook secret** (if configured)

If you prefer the classic OAuth App flow you can re-use the same endpoints; the backend exchanges the `code` for an access token at `https://github.com/login/oauth/access_token`.

---

## 2. Backend configuration (`backend/.env`)

The FastAPI backend uses `app/core/config.py` to load environment variables. Copy `backend/.env.example` to `backend/.env` and populate the GitHub fields with the values from your GitHub App.

| Variable | Description |
| --- | --- |
| `GITHUB_APP_ID` | Numeric identifier of the GitHub App. Required when minting installation tokens. |
| `GITHUB_CLIENT_ID` | OAuth client ID. Used when generating the authorization URL and exchanging the code. |
| `GITHUB_CLIENT_SECRET` | OAuth client secret. Required for the token exchange. |
| `GITHUB_PRIVATE_KEY` | PEM-formatted private key. Paste as a single line with `\n` escaped or use a multiline value in your hosting provider's secret manager. |
| `GITHUB_WEBHOOK_SECRET` | Shared secret for validating webhook payloads. Optional but strongly recommended. |
| `GITHUB_REDIRECT_URI` | Must match the callback URL registered on the GitHub App. Defaults to `http://localhost:8000/api/v1/github/oauth/callback`. |
| `GITHUB_OAUTH_SCOPES` | List or comma-separated string of scopes requested during authorization. Defaults to `repo, read:org`. |
| `FRONTEND_BASE_URL` | Base URL of the dashboard. Used when redirecting back to `/task/settings?tab=integrations`. |

Other backend variables (database, Supabase, Groq, etc.) remain unchanged—see the sample file for defaults.

---

## 3. Frontend configuration (`.env.local`)

Copy `.env.local.example` to `.env.local` and confirm the following values:

| Variable | Description |
| --- | --- |
| `NEXT_PUBLIC_API_BASE_URL` | Points the UI to the FastAPI backend (`http://localhost:8000/api/v1` in development). |
| `NEXT_PUBLIC_API_URL` | Legacy alias used by older hooks. Keep this identical to `NEXT_PUBLIC_API_BASE_URL`. |
| `BACKEND_URL` | Used by API routes when proxying transcription requests. |
| `NEXT_PUBLIC_CLERK_*` / `CLERK_SECRET_KEY` | Clerk authentication keys. Without these the dashboard will redirect to the sign-in screen. |
| `NEXT_PUBLIC_GITHUB_CONNECTOR_DOCS` | Optional override for the "Open the full setup guide" button shown in Settings. |

Restart the Next.js dev server after editing `.env.local` so new environment variables are picked up.

---

## 4. Backend API endpoints

The following endpoints live under `/api/v1/github`:

| Method & Path | Purpose |
| --- | --- |
| `POST /oauth/start` | Generates a GitHub authorization URL and opaque state token. Requires `user_id` in the payload. |
| `GET /oauth/callback` | Handles the GitHub redirect, exchanges the `code` for an access token or installation token, and redirects back to the frontend with `github=connected` or `github=error`. |
| `GET /oauth/status` | Returns the connection status for a given `user_id` (connected flag, account info, scopes, timestamp). |

All endpoints rely on in-memory storage for demo purposes. Replace `GitHubOAuthService` with your persistence layer before shipping to production.

---

## 5. Frontend behaviour

The **Integrations → GitHub connector** tab:

1. Calls `GET /github/oauth/status` on mount when a user is signed in.
2. Launches the GitHub OAuth flow by POSTing to `/github/oauth/start` and redirecting the browser to the returned URL.
3. Listens for `github=connected` or `github=error` query parameters after the backend redirects back.
4. Shows the connected account, scopes, and "Connected X minutes ago" timestamp.
5. Links to this document so operators can review configuration steps without digging into the repository.

The button labelled **Authorize with GitHub** opens GitHub's native Install & Authorize page directly—no intermediate popups.

---

## 6. MCP connector considerations

* Update your MCP discovery document to reference the FastAPI OAuth endpoints with absolute URLs.
* Map ChatGPT user identifiers to GitHub installation tokens in your datastore. The included implementation keeps them in memory for brevity.
* Refresh installation access tokens before they expire (typically every hour for GitHub Apps). The service exposes the raw token payload so you can persist the expiry metadata.
* Handle webhook events (`installation`, `installation_repositories`, `installation_target`) if you need to respond to repo access changes.

---

## 7. Troubleshooting

| Symptom | Likely cause | Fix |
| --- | --- | --- |
| Redirect loops back to `/task/settings` with `github=error&error=configuration` | Missing GitHub credentials in `backend/.env`. | Double-check `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`, and `GITHUB_REDIRECT_URI`. |
| GitHub shows `redirect_uri_mismatch` | The callback URL in your GitHub App does not match `GITHUB_REDIRECT_URI`. | Update the GitHub App or environment variable so both values match exactly. |
| State mismatch error | The authorization link expired (default TTL is 10 minutes). | Retry the connection or increase `STATE_TTL` in `GitHubOAuthService`. |
| Avatar images blocked in UI | `next.config.ts` is missing the GitHub avatars domain. | Already configured in this repository; ensure your production Next.js build includes the same entry. |

If you run into other issues, check the FastAPI logs around `GitHubOAuthService` for context—the service logs state lifecycle and token exchanges.

---

## 8. Next steps

Once GitHub connectivity works end-to-end you can extend the connector to:

- Persist installation tokens in your database.
- Offer repository-scoped controls directly in the Async Coder UI.
- Implement MCP methods (e.g. `listRepos`, `getFile`, `searchCode`).
- Sync GitHub events into Async Coder's task timelines.

Happy connecting!
