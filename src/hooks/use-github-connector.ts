'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api/v1';

export interface GitHubConnectorAccount {
  login?: string | null;
  name?: string | null;
  avatarUrl?: string | null;
  htmlUrl?: string | null;
}

export interface GitHubConnectorStatus {
  connected: boolean;
  account: GitHubConnectorAccount | null;
  scopes: string[];
  connectedAt: string | null;
}

interface RawStatusAccount {
  login?: string | null;
  name?: string | null;
  avatarUrl?: string | null;
  avatar_url?: string | null;
  htmlUrl?: string | null;
  html_url?: string | null;
}

interface RawStatusPayload {
  connected?: boolean;
  account?: RawStatusAccount | null;
  scopes?: string[] | null;
  connectedAt?: string | null;
  connected_at?: string | null;
}

interface StartConnectionOptions {
  returnTo?: string;
}

interface UseGitHubConnectorOptions {
  autoFetch?: boolean;
}

const buildAuthHeaders = (): Record<string, string> => {
  if (typeof window === 'undefined') {
    return {};
  }

  const token = localStorage.getItem('auth_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const normalizeStatus = (payload: RawStatusPayload | null | undefined): GitHubConnectorStatus => {
  if (!payload || !payload.connected) {
    return {
      connected: false,
      account: null,
      scopes: [],
      connectedAt: null,
    };
  }

  const account = payload.account || {};

  return {
    connected: true,
    account: {
      login: account.login ?? null,
      name: account.name ?? null,
      avatarUrl: account.avatarUrl ?? account.avatar_url ?? null,
      htmlUrl: account.htmlUrl ?? account.html_url ?? null,
    },
    scopes: Array.isArray(payload.scopes) ? payload.scopes : [],
    connectedAt: payload.connectedAt ?? payload.connected_at ?? null,
  };
};

export function useGitHubConnector(
  userId?: string | null,
  options?: UseGitHubConnectorOptions,
) {
  const [status, setStatus] = useState<GitHubConnectorStatus | null>(null);
  const [connecting, setConnecting] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState(false);

  const autoFetch = options?.autoFetch ?? true;

  const refreshStatus = useCallback(async (): Promise<GitHubConnectorStatus> => {
    if (!userId) {
      const emptyStatus: GitHubConnectorStatus = {
        connected: false,
        account: null,
        scopes: [],
        connectedAt: null,
      };
      setStatus(null);
      return emptyStatus;
    }

    setLoadingStatus(true);
    try {
      const params = new URLSearchParams({ user_id: userId });
      const response = await fetch(`${API_BASE_URL}/github/oauth/status?${params.toString()}`, {
        headers: {
          Accept: 'application/json',
          ...buildAuthHeaders(),
        },
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        if (response.status >= 500) {
          console.error('GitHub status request failed', data);
        }
        const normalized = normalizeStatus(null);
        setStatus(null);
        return normalized;
      }

      const normalized = normalizeStatus(data);
      setStatus(normalized.connected ? normalized : null);
      return normalized;
    } catch (error) {
      console.error('Error fetching GitHub connection status', error);
      const normalized = normalizeStatus(null);
      setStatus(null);
      return normalized;
    } finally {
      setLoadingStatus(false);
    }
  }, [userId]);

  const startConnection = useCallback(
    async (startOptions?: StartConnectionOptions) => {
      if (!userId) {
        toast.error('You need to be signed in to connect GitHub.');
        return;
      }

      if (typeof window === 'undefined') {
        return;
      }

      const returnTo = startOptions?.returnTo || `${window.location.origin}/task/settings?tab=integrations`;

      setConnecting(true);
      try {
        const response = await fetch(`${API_BASE_URL}/github/oauth/start`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            ...buildAuthHeaders(),
          },
          body: JSON.stringify({
            user_id: userId,
            return_url: returnTo,
          }),
        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
          const message = data.detail || data.message || 'Unable to start GitHub authorization.';
          toast.error(message);
          return;
        }

        const authorizationUrl = data.authorizationUrl || data.authorization_url;
        if (!authorizationUrl) {
          toast.error('GitHub authorization URL was missing from the response.');
          return;
        }

        window.location.assign(authorizationUrl);
      } catch (error) {
        console.error('Error starting GitHub OAuth flow', error);
        toast.error('Failed to start GitHub authorization.');
      } finally {
        setConnecting(false);
      }
    },
    [userId],
  );

  useEffect(() => {
    if (autoFetch) {
      refreshStatus().catch(() => undefined);
    }
  }, [autoFetch, refreshStatus]);

  const isConnected = useMemo(() => Boolean(status?.connected), [status]);

  return {
    status,
    isConnected,
    connecting,
    loadingStatus,
    startConnection,
    refreshStatus,
  };
}
