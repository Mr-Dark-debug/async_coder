"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";

import {
  Badge,
} from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Github,
  Lock,
  ArrowRight,
  ShieldCheck,
  ServerCog,
  GitBranch,
  ExternalLink,
} from "lucide-react";

import { useGitHubConnector } from "@/hooks/use-github-connector";

const ENVIRONMENT_VARIABLES = [
  {
    key: "GITHUB_APP_ID",
    description:
      "Numeric identifier for your GitHub App. Found in the app's General settings page.",
  },
  {
    key: "GITHUB_CLIENT_ID",
    description:
      "OAuth Client ID that GitHub provides. Used when exchanging the authorization code for a token.",
  },
  {
    key: "GITHUB_CLIENT_SECRET",
    description:
      "OAuth Client Secret used to securely exchange authorization codes for access tokens.",
  },
  {
    key: "GITHUB_PRIVATE_KEY",
    description:
      "PEM-formatted private key generated for the GitHub App. Required to mint installation access tokens.",
  },
  {
    key: "GITHUB_WEBHOOK_SECRET",
    description:
      "Secret string used to verify webhook signatures from GitHub (optional but recommended).",
  },
  {
    key: "FRONTEND_BASE_URL",
    description:
      "Base URL for the dashboard. Used when the backend redirects back after GitHub authorization.",
  },
  {
    key: "MCP_CONNECTOR_URL",
    description:
      "Base URL of the MCP server that exposes repository actions to ChatGPT.",
  },
  {
    key: "GITHUB_REDIRECT_URI",
    description:
      "Callback URL that handles the OAuth authorization code exchange inside your backend.",
  },
  {
    key: "NEXT_PUBLIC_API_BASE_URL",
    description:
      "Frontend configuration pointing to this FastAPI backend (defaults to http://localhost:8000/api/v1).",
  },
];

const CONNECTOR_FLOW = [
  {
    title: "User authorizes via GitHub",
    description:
      "Async Coder redirects the user directly to GitHub's Install & Authorize screen. No intermediary popups are required.",
    details: [
      "Use the OAuth authorization-code flow or GitHub App installation flow.",
      "Request the minimal scopes needed (for example: repo, read:org).",
    ],
    icon: <Github className="w-5 h-5" />,
  },
  {
    title: "Backend exchanges the code",
    description:
      "Your FastAPI backend stores the short-lived authorization code, exchanges it for an access or installation token, and persists the mapping to the authenticated user.",
    details: [
      "Validate the OAuth state parameter before exchanging the code.",
      "Refresh or rotate installation tokens automatically before they expire.",
    ],
    icon: <ServerCog className="w-5 h-5" />,
  },
  {
    title: "Expose actions via MCP",
    description:
      "ChatGPT calls the MCP server you host (the \"connector\") to fetch repositories, read files, or trigger workflows using the stored GitHub credentials.",
    details: [
      "Implement MCP methods such as listRepos, getFile, and searchCode.",
      "Authorize every call with the user's GitHub installation token before reaching GitHub's REST or GraphQL APIs.",
    ],
    icon: <GitBranch className="w-5 h-5" />,
  },
  {
    title: "Secure, auditable responses",
    description:
      "Responses from GitHub are sanitized, logged, and returned to ChatGPT, keeping the connector compliant with enterprise policies.",
    details: [
      "Store only encrypted tokens and rotate them on revocation events.",
      "Emit audit logs (who accessed what) for compliance teams.",
    ],
    icon: <ShieldCheck className="w-5 h-5" />,
  },
];

const OAUTH_ERROR_MESSAGES: Record<string, string> = {
  configuration: "The GitHub connector is missing configuration values.",
  invalid_state: "The authorization request expired. Please try again.",
  network_failure: "We could not reach GitHub. Check your network and try again.",
  token_exchange_failed: "GitHub rejected the authorization code. Try connecting again.",
};

function resolveOAuthError(code: string | null): string {
  if (!code) {
    return "GitHub authorization was cancelled.";
  }

  return OAUTH_ERROR_MESSAGES[code] ?? "GitHub authorization failed. Please try again.";
}

export function IntegrationsTab() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useUser();
  const { status, isConnected, connecting, loadingStatus, startConnection, refreshStatus } =
    useGitHubConnector(user?.id);

  const connectedAtText = useMemo(() => {
    if (!status?.connectedAt) {
      return null;
    }

    const date = new Date(status.connectedAt);
    if (Number.isNaN(date.getTime())) {
      return null;
    }

    return formatDistanceToNow(date, { addSuffix: true });
  }, [status?.connectedAt]);

  useEffect(() => {
    if (!searchParams) return;

    const githubStatus = searchParams.get("github");
    if (!githubStatus) {
      return;
    }

    const errorCode = searchParams.get("error");

    if (githubStatus === "connected") {
      toast.success("GitHub account connected.");
      refreshStatus();
    } else if (githubStatus === "error") {
      toast.error(resolveOAuthError(errorCode));
    }

    router.replace("/task/settings?tab=integrations");
  }, [searchParams, refreshStatus, router]);

  const account = status?.account;
  const hasScopes = Boolean(status?.scopes?.length);

  return (
    <div className="max-w-5xl space-y-10">
      <header className="space-y-3">
        <Badge variant="secondary" className="gap-1">
          <Lock className="w-3 h-3" />
          Secure integrations
        </Badge>
        <h1 className="text-3xl font-semibold text-white">GitHub connector</h1>
        <p className="text-sm text-neutral-300 max-w-3xl">
          Async Coder now guides people straight to GitHub&apos;s Install &amp; Authorize flow so every team member can connect their repositories without confusing pop-ups. The integration follows OpenAI&apos;s Model Context Protocol (MCP) playbook for custom connectors, keeping authentication simple and secure.
        </p>
      </header>

      <Card className="bg-neutral-900 border-neutral-800">
        <CardHeader className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-2">
            <CardTitle className="flex items-center gap-2 text-white">
              <Github className="w-5 h-5" />
              {isConnected ? "GitHub connected" : "Connect GitHub directly"}
            </CardTitle>
            <CardDescription className="text-neutral-300">
              {isConnected
                ? `Connected as ${account?.login || account?.name || "your GitHub account"}. Async Coder securely stores the installation token in the backend.`
                : "Click the button to open GitHub's native Install & Authorize page. Once the user approves, the backend will exchange the code and persist the token."}
            </CardDescription>
          </div>
          <div className="flex flex-col items-stretch gap-2 sm:items-end sm:text-right">
            {isConnected && (
              <Badge variant="outline" className="self-start sm:self-end">
                Connected
              </Badge>
            )}
            <Button
              size="lg"
              className="gap-2"
              onClick={() => startConnection()}
              disabled={connecting}
            >
              {connecting
                ? "Opening GitHub..."
                : isConnected
                  ? "Reconnect GitHub"
                  : "Authorize with GitHub"}
              <ArrowRight className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => refreshStatus()}
              disabled={loadingStatus}
              className="mt-1"
            >
              {loadingStatus ? "Checking status..." : "Refresh status"}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-neutral-300">
          {isConnected ? (
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                {account?.avatarUrl && (
                  <Image
                    src={account.avatarUrl}
                    alt="GitHub avatar"
                    width={48}
                    height={48}
                    className="h-12 w-12 rounded-full border border-neutral-700"
                  />
                )}
                <div className="space-y-1">
                  <p className="text-white font-medium">
                    {account?.login || account?.name || "GitHub user"}
                  </p>
                  {account?.htmlUrl && (
                    <Link
                      href={account.htmlUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-neutral-400 underline"
                    >
                      View profile
                    </Link>
                  )}
                  {hasScopes && (
                    <p className="text-xs text-neutral-400">
                      Scopes: {status?.scopes?.join(", ")}
                    </p>
                  )}
                  {connectedAtText && (
                    <p className="text-xs text-neutral-500">
                      Connected {connectedAtText}
                    </p>
                  )}
                </div>
              </div>
              <p className="text-xs text-neutral-400 max-w-sm">
                The OAuth code exchange and token storage happen entirely in the FastAPI backend. Tokens never touch the browser.
              </p>
            </div>
          ) : (
            <p className="text-neutral-400">
              Async Coder creates a short-lived OAuth state and redirects you to GitHub. After authorization, the backend trades the code for an installation token and associates it with your user account.
            </p>
          )}
        </CardContent>
      </Card>

      <section className="grid gap-6 lg:grid-cols-2">
        {CONNECTOR_FLOW.map((step) => (
          <Card key={step.title} className="border-neutral-800 bg-neutral-900">
            <CardHeader className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-white">
                {step.icon}
                <CardTitle className="text-lg">{step.title}</CardTitle>
              </div>
              <CardDescription className="text-neutral-300">
                {step.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-neutral-400">
                {step.details.map((detail) => (
                  <li key={detail} className="flex gap-2">
                    <span className="mt-1 block h-1.5 w-1.5 rounded-full bg-neutral-500" aria-hidden />
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </section>

      <Card className="border-neutral-800 bg-neutral-900">
        <CardHeader>
          <CardTitle className="text-white">Environment variables</CardTitle>
          <CardDescription className="text-neutral-300">
            Configure these secrets so the backend can negotiate OAuth with GitHub and expose the connector to ChatGPT.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-hidden rounded-lg border border-neutral-800">
            <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-neutral-800">
              {ENVIRONMENT_VARIABLES.map((env) => (
                <div key={env.key} className="p-4">
                  <p className="font-mono text-sm text-white">{env.key}</p>
                  <p className="mt-1 text-sm text-neutral-300">{env.description}</p>
                </div>
              ))}
            </div>
          </div>
          <p className="mt-4 text-xs text-neutral-500">
            Need a refresher on GitHub Apps? Review the <Link href="https://docs.github.com/en/apps" target="_blank" rel="noopener noreferrer" className="underline">official documentation</Link> for generating keys and configuring callback URLs.
          </p>
        </CardContent>
      </Card>

      <Card className="border-neutral-800 bg-neutral-900">
        <CardHeader>
          <CardTitle className="text-white">Roll-out checklist</CardTitle>
          <CardDescription className="text-neutral-300">
            Follow these steps so every teammate can connect GitHub without friction.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ol className="list-decimal space-y-3 pl-5 text-sm text-neutral-300">
            <li>
              Register or reuse a GitHub App with the permissions you need (repository contents, pull requests, metadata, and optional organization access).
            </li>
            <li>
              Populate the environment variables above and restart the Async Coder backend so new credentials are loaded safely.
            </li>
            <li>
              Update your MCP discovery document to reference the connector&apos;s OAuth endpoints and absolute URLs.
            </li>
            <li>
              Invite a teammate to open <code className="mx-1 rounded bg-neutral-800 px-1.5 py-0.5 text-xs">Settings → Integrations</code>, click <em>Authorize with GitHub</em>, and confirm they land on GitHub&apos;s Install screen.
            </li>
            <li>
              Monitor the callback logs to verify that installation and access tokens are issued and encrypted at rest.
            </li>
          </ol>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild variant="outline" className="gap-2">
              <Link
                href="https://platform.openai.com/docs/actions#custom-actions"
                target="_blank"
                rel="noopener noreferrer"
              >
                Learn about MCP connectors
                <ExternalLink className="w-4 h-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" className="gap-2">
              <Link
                href="https://github.com/OBannon37/chatgpt-deep-research-connector-example"
                target="_blank"
                rel="noopener noreferrer"
              >
                Example GitHub connector
                <ExternalLink className="w-4 h-4" />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
