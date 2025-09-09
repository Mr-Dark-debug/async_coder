import { useState, useEffect } from 'react';
import { toast } from 'sonner';

export interface APIKeyProvider {
  id: string;
  provider: string;
  displayName: string;
  description: string;
  category: 'ai_models' | 'search' | 'development' | 'cloud' | 'communication' | 'analytics' | 'other';
  logoUrl?: string;
  websiteUrl?: string;
  docsUrl?: string;
  isActive: boolean;
  configuration: {
    keyFormat?: string;
    keyPrefix?: string;
    baseUrl?: string;
    authType?: 'bearer' | 'header' | 'query';
    headerName?: string;
    testEndpoint?: string;
    requiredFields?: string[];
    optionalFields?: string[];
    [key: string]: any;
  };
}

export interface APIKey {
  id: string;
  provider: string;
  name: string;
  keyPreview: string;
  isActive: boolean;
  lastUsed?: string;
  usageCount: number;
  metadata: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface APIKeyUsageStats {
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  totalTokens: number;
  totalCost: number;
  averageResponseTime: number;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export function useAPIKeys() {
  const [providers, setProviders] = useState<APIKeyProvider[]>([]);
  const [apiKeys, setApiKeys] = useState<APIKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);

  // Fetch providers
  const fetchProviders = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/api-keys/providers`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch providers');
      }

      const data = await response.json();
      setProviders(data.data.providers);
    } catch (error) {
      console.error('Error fetching providers:', error);
      toast.error('Failed to load API key providers');
    }
  };

  // Fetch user's API keys
  const fetchAPIKeys = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/api-keys`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch API keys');
      }

      const data = await response.json();
      setApiKeys(data.data.apiKeys);
    } catch (error) {
      console.error('Error fetching API keys:', error);
      toast.error('Failed to load API keys');
    }
  };

  // Save API key
  const saveAPIKey = async (
    provider: string,
    name: string,
    keyValue: string,
    metadata: Record<string, any> = {}
  ): Promise<boolean> => {
    setSaving(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/api-keys`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        },
        body: JSON.stringify({
          provider,
          name,
          keyValue,
          metadata,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || 'Failed to save API key');
      }

      toast.success('API key saved successfully');
      await fetchAPIKeys(); // Refresh the list
      return true;
    } catch (error) {
      console.error('Error saving API key:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to save API key');
      return false;
    } finally {
      setSaving(false);
    }
  };

  // Test API key
  const testAPIKey = async (
    provider: string,
    keyValue: string,
    metadata: Record<string, any> = {}
  ): Promise<{ valid: boolean; error?: string }> => {
    setTesting(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/api-keys/test`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        },
        body: JSON.stringify({
          provider,
          keyValue,
          metadata,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || 'Failed to test API key');
      }

      return data.data;
    } catch (error) {
      console.error('Error testing API key:', error);
      return {
        valid: false,
        error: error instanceof Error ? error.message : 'Failed to test API key',
      };
    } finally {
      setTesting(false);
    }
  };

  // Delete API key
  const deleteAPIKey = async (keyId: string): Promise<boolean> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/api-keys/${keyId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        },
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error?.message || 'Failed to delete API key');
      }

      toast.success('API key deleted successfully');
      await fetchAPIKeys(); // Refresh the list
      return true;
    } catch (error) {
      console.error('Error deleting API key:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to delete API key');
      return false;
    }
  };

  // Get usage statistics
  const getUsageStats = async (keyId?: string, days: number = 30): Promise<APIKeyUsageStats | null> => {
    try {
      const endpoint = keyId 
        ? `${API_BASE_URL}/api/api-keys/usage/${keyId}?days=${days}`
        : `${API_BASE_URL}/api/api-keys/usage?days=${days}`;

      const response = await fetch(endpoint, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch usage statistics');
      }

      const data = await response.json();
      return data.data.stats;
    } catch (error) {
      console.error('Error fetching usage stats:', error);
      toast.error('Failed to load usage statistics');
      return null;
    }
  };

  // Group providers by category
  const providersByCategory = providers.reduce((acc, provider) => {
    if (!acc[provider.category]) {
      acc[provider.category] = [];
    }
    acc[provider.category].push(provider);
    return acc;
  }, {} as Record<string, APIKeyProvider[]>);

  // Get provider by name
  const getProvider = (providerName: string) => {
    return providers.find(p => p.provider === providerName);
  };

  // Get API keys by provider
  const getAPIKeysByProvider = (providerName: string) => {
    return apiKeys.filter(key => key.provider === providerName);
  };

  // Initial load
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchProviders(), fetchAPIKeys()]);
      setLoading(false);
    };

    loadData();
  }, []);

  return {
    providers,
    providersByCategory,
    apiKeys,
    loading,
    saving,
    testing,
    saveAPIKey,
    testAPIKey,
    deleteAPIKey,
    getUsageStats,
    getProvider,
    getAPIKeysByProvider,
    refreshData: () => Promise.all([fetchProviders(), fetchAPIKeys()]),
  };
}
