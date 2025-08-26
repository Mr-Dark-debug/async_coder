import { Octokit } from '@octokit/rest';
import { logger } from './logger';
import { EncryptionService } from './encryption';
import type { GitHubUser, GitHubRepository, GitHubWebhookPayload } from '@/types';

// GitHub OAuth configuration
const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
const GITHUB_WEBHOOK_SECRET = process.env.GITHUB_WEBHOOK_SECRET;

if (!GITHUB_CLIENT_ID || !GITHUB_CLIENT_SECRET) {
  throw new Error('GitHub OAuth configuration is required');
}

export class GitHubService {
  private octokit: Octokit;

  constructor(accessToken?: string) {
    this.octokit = new Octokit({
      auth: accessToken,
      userAgent: 'async-coder-api/1.0.0',
    });
  }

  /**
   * Exchange OAuth code for access token
   */
  static async exchangeCodeForToken(code: string): Promise<{
    accessToken: string;
    tokenType: string;
    scope: string;
  }> {
    try {
      const response = await fetch('https://github.com/login/oauth/access_token', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          client_id: GITHUB_CLIENT_ID,
          client_secret: GITHUB_CLIENT_SECRET,
          code,
        }),
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(`GitHub OAuth error: ${data.error_description}`);
      }

      return {
        accessToken: data.access_token,
        tokenType: data.token_type,
        scope: data.scope,
      };
    } catch (error) {
      logger.error('GitHub OAuth token exchange failed:', error);
      throw new Error('Failed to exchange code for access token');
    }
  }

  /**
   * Get authenticated user information
   */
  async getAuthenticatedUser(): Promise<GitHubUser> {
    try {
      const { data } = await this.octokit.rest.users.getAuthenticated();
      
      return {
        id: data.id,
        login: data.login,
        name: data.name || data.login,
        email: data.email || '',
        avatar_url: data.avatar_url,
      };
    } catch (error) {
      logger.error('Failed to get authenticated GitHub user:', error);
      throw new Error('Failed to fetch user information from GitHub');
    }
  }

  /**
   * Get user's primary email address
   */
  async getUserPrimaryEmail(): Promise<string> {
    try {
      const { data: emails } = await this.octokit.rest.users.listEmailsForAuthenticatedUser();
      const primaryEmail = emails.find(email => email.primary);
      
      if (!primaryEmail) {
        throw new Error('No primary email found');
      }
      
      return primaryEmail.email;
    } catch (error) {
      logger.error('Failed to get user primary email:', error);
      throw new Error('Failed to fetch user email from GitHub');
    }
  }

  /**
   * Get user repositories
   */
  async getUserRepositories(options: {
    type?: 'all' | 'owner' | 'member';
    sort?: 'created' | 'updated' | 'pushed' | 'full_name';
    direction?: 'asc' | 'desc';
    per_page?: number;
    page?: number;
  } = {}): Promise<GitHubRepository[]> {
    try {
      const { data } = await this.octokit.rest.repos.listForAuthenticatedUser({
        type: options.type || 'all',
        sort: options.sort || 'updated',
        direction: options.direction || 'desc',
        per_page: options.per_page || 100,
        page: options.page || 1,
      });

      return data.map(repo => ({
        id: repo.id,
        name: repo.name,
        full_name: repo.full_name,
        description: repo.description || '',
        private: repo.private,
        default_branch: repo.default_branch,
        language: repo.language || '',
        html_url: repo.html_url,
        clone_url: repo.clone_url,
        owner: {
          id: repo.owner.id,
          login: repo.owner.login,
        },
      }));
    } catch (error) {
      logger.error('Failed to get user repositories:', error);
      throw new Error('Failed to fetch repositories from GitHub');
    }
  }

  /**
   * Get repository information
   */
  async getRepository(owner: string, repo: string): Promise<GitHubRepository> {
    try {
      const { data } = await this.octokit.rest.repos.get({
        owner,
        repo,
      });

      return {
        id: data.id,
        name: data.name,
        full_name: data.full_name,
        description: data.description || '',
        private: data.private,
        default_branch: data.default_branch,
        language: data.language || '',
        html_url: data.html_url,
        clone_url: data.clone_url,
        owner: {
          id: data.owner.id,
          login: data.owner.login,
        },
      };
    } catch (error) {
      logger.error('Failed to get repository:', { owner, repo, error });
      throw new Error('Failed to fetch repository from GitHub');
    }
  }

  /**
   * Get repository branches
   */
  async getRepositoryBranches(owner: string, repo: string): Promise<Array<{
    name: string;
    commit: {
      sha: string;
      url: string;
    };
    protected: boolean;
  }>> {
    try {
      const { data } = await this.octokit.rest.repos.listBranches({
        owner,
        repo,
      });

      return data.map(branch => ({
        name: branch.name,
        commit: {
          sha: branch.commit.sha,
          url: branch.commit.url,
        },
        protected: branch.protected,
      }));
    } catch (error) {
      logger.error('Failed to get repository branches:', { owner, repo, error });
      throw new Error('Failed to fetch repository branches from GitHub');
    }
  }

  /**
   * Create a pull request
   */
  async createPullRequest(
    owner: string,
    repo: string,
    options: {
      title: string;
      head: string;
      base: string;
      body?: string;
      draft?: boolean;
    }
  ): Promise<{
    id: number;
    number: number;
    title: string;
    body: string;
    html_url: string;
    state: string;
    head: { ref: string };
    base: { ref: string };
  }> {
    try {
      const { data } = await this.octokit.rest.pulls.create({
        owner,
        repo,
        title: options.title,
        head: options.head,
        base: options.base,
        body: options.body || '',
        draft: options.draft || false,
      });

      return {
        id: data.id,
        number: data.number,
        title: data.title,
        body: data.body || '',
        html_url: data.html_url,
        state: data.state,
        head: { ref: data.head.ref },
        base: { ref: data.base.ref },
      };
    } catch (error) {
      logger.error('Failed to create pull request:', { owner, repo, options, error });
      throw new Error('Failed to create pull request on GitHub');
    }
  }

  /**
   * Get pull request information
   */
  async getPullRequest(owner: string, repo: string, pullNumber: number) {
    try {
      const { data } = await this.octokit.rest.pulls.get({
        owner,
        repo,
        pull_number: pullNumber,
      });

      return {
        id: data.id,
        number: data.number,
        title: data.title,
        body: data.body || '',
        html_url: data.html_url,
        state: data.state,
        merged: data.merged,
        head: { ref: data.head.ref },
        base: { ref: data.base.ref },
        created_at: data.created_at,
        updated_at: data.updated_at,
        merged_at: data.merged_at,
        closed_at: data.closed_at,
      };
    } catch (error) {
      logger.error('Failed to get pull request:', { owner, repo, pullNumber, error });
      throw new Error('Failed to fetch pull request from GitHub');
    }
  }

  /**
   * Create a webhook
   */
  async createWebhook(
    owner: string,
    repo: string,
    webhookUrl: string,
    events: string[] = ['pull_request', 'push']
  ): Promise<{
    id: number;
    url: string;
    events: string[];
    active: boolean;
  }> {
    try {
      const { data } = await this.octokit.rest.repos.createWebhook({
        owner,
        repo,
        config: {
          url: webhookUrl,
          content_type: 'json',
          secret: GITHUB_WEBHOOK_SECRET,
        },
        events,
        active: true,
      });

      return {
        id: data.id,
        url: data.config.url,
        events: data.events,
        active: data.active,
      };
    } catch (error) {
      logger.error('Failed to create webhook:', { owner, repo, webhookUrl, error });
      throw new Error('Failed to create webhook on GitHub');
    }
  }

  /**
   * Delete a webhook
   */
  async deleteWebhook(owner: string, repo: string, hookId: number): Promise<void> {
    try {
      await this.octokit.rest.repos.deleteWebhook({
        owner,
        repo,
        hook_id: hookId,
      });
    } catch (error) {
      logger.error('Failed to delete webhook:', { owner, repo, hookId, error });
      throw new Error('Failed to delete webhook from GitHub');
    }
  }

  /**
   * Verify webhook signature
   */
  static verifyWebhookSignature(payload: string, signature: string): boolean {
    if (!GITHUB_WEBHOOK_SECRET) {
      logger.error('GitHub webhook secret not configured');
      return false;
    }

    return EncryptionService.verifyWebhookSignature(payload, signature, GITHUB_WEBHOOK_SECRET);
  }

  /**
   * Parse webhook payload
   */
  static parseWebhookPayload(payload: any): GitHubWebhookPayload {
    return {
      action: payload.action,
      repository: payload.repository,
      pull_request: payload.pull_request,
      sender: payload.sender,
    };
  }

  /**
   * Create GitHub client with encrypted token
   */
  static createClientWithEncryptedToken(encryptedToken: string): GitHubService {
    const accessToken = EncryptionService.decryptGitHubToken(encryptedToken);
    return new GitHubService(accessToken);
  }

  /**
   * Check if user has repository access
   */
  async checkRepositoryAccess(owner: string, repo: string): Promise<{
    hasAccess: boolean;
    permission: string;
  }> {
    try {
      const { data } = await this.octokit.rest.repos.get({
        owner,
        repo,
      });

      // If we can fetch the repo, we have at least read access
      const permission = data.permissions?.admin ? 'admin' : 
                        data.permissions?.push ? 'write' : 'read';

      return {
        hasAccess: true,
        permission,
      };
    } catch (error) {
      if (error.status === 404) {
        return { hasAccess: false, permission: 'none' };
      }
      
      logger.error('Failed to check repository access:', { owner, repo, error });
      throw new Error('Failed to check repository access');
    }
  }
}
