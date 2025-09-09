'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Trash2, Eye, Calendar, Activity, TrendingUp, Copy } from 'lucide-react';
import { useAPIKeys, type APIKey, type APIKeyProvider } from '@/hooks/use-api-keys';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';

interface APIKeyListProps {
  provider: APIKeyProvider;
  onAddKey?: () => void;
}

export function APIKeyList({ provider, onAddKey }: APIKeyListProps) {
  const { getAPIKeysByProvider, deleteAPIKey, getUsageStats } = useAPIKeys();
  const [deletingKeyId, setDeletingKeyId] = useState<string | null>(null);
  const [usageStats, setUsageStats] = useState<Record<string, any>>({});

  const apiKeys = getAPIKeysByProvider(provider.provider);

  const handleDelete = async (keyId: string) => {
    setDeletingKeyId(keyId);
    const success = await deleteAPIKey(keyId);
    setDeletingKeyId(null);
  };

  const handleCopyKey = (keyPreview: string) => {
    navigator.clipboard.writeText(keyPreview);
    toast.success('Key preview copied to clipboard');
  };

  const loadUsageStats = async (keyId: string) => {
    if (usageStats[keyId]) return; // Already loaded
    
    const stats = await getUsageStats(keyId, 30);
    if (stats) {
      setUsageStats(prev => ({ ...prev, [keyId]: stats }));
    }
  };

  if (apiKeys.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="text-center space-y-3">
            <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center">
              {provider.logoUrl ? (
                <img
                  src={provider.logoUrl}
                  alt={provider.displayName}
                  className="w-8 h-8 rounded"
                />
              ) : (
                <Activity className="w-8 h-8 text-muted-foreground" />
              )}
            </div>
            <div>
              <h3 className="font-medium">No API keys configured</h3>
              <p className="text-sm text-muted-foreground">
                Add your {provider.displayName} API key to get started
              </p>
            </div>
            {onAddKey && (
              <Button onClick={onAddKey} className="mt-4">
                Add {provider.displayName} Key
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">{provider.displayName} Keys</h3>
          <p className="text-sm text-muted-foreground">
            {apiKeys.length} key{apiKeys.length !== 1 ? 's' : ''} configured
          </p>
        </div>
        {onAddKey && (
          <Button onClick={onAddKey} size="sm">
            Add Key
          </Button>
        )}
      </div>

      <div className="grid gap-4">
        {apiKeys.map((apiKey) => (
          <APIKeyCard
            key={apiKey.id}
            apiKey={apiKey}
            provider={provider}
            onDelete={() => handleDelete(apiKey.id)}
            onCopyKey={() => handleCopyKey(apiKey.keyPreview)}
            onLoadStats={() => loadUsageStats(apiKey.id)}
            usageStats={usageStats[apiKey.id]}
            isDeleting={deletingKeyId === apiKey.id}
          />
        ))}
      </div>
    </div>
  );
}

interface APIKeyCardProps {
  apiKey: APIKey;
  provider: APIKeyProvider;
  onDelete: () => void;
  onCopyKey: () => void;
  onLoadStats: () => void;
  usageStats?: any;
  isDeleting: boolean;
}

function APIKeyCard({ 
  apiKey, 
  provider, 
  onDelete, 
  onCopyKey, 
  onLoadStats, 
  usageStats, 
  isDeleting 
}: APIKeyCardProps) {
  const [showStats, setShowStats] = useState(false);

  const handleToggleStats = () => {
    if (!showStats && !usageStats) {
      onLoadStats();
    }
    setShowStats(!showStats);
  };

  return (
    <Card className={`transition-all ${!apiKey.isActive ? 'opacity-60' : ''}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <CardTitle className="text-base">{apiKey.name}</CardTitle>
              <Badge variant={apiKey.isActive ? 'default' : 'secondary'}>
                {apiKey.isActive ? 'Active' : 'Inactive'}
              </Badge>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={onCopyKey}
                      className="flex items-center gap-1 hover:text-foreground transition-colors"
                    >
                      <Eye className="w-3 h-3" />
                      {apiKey.keyPreview}
                      <Copy className="w-3 h-3" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Click to copy key preview</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleToggleStats}
              className="text-muted-foreground hover:text-foreground"
            >
              <TrendingUp className="w-4 h-4" />
            </Button>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={isDeleting}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete API Key</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete "{apiKey.name}"? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={onDelete}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              Created {formatDistanceToNow(new Date(apiKey.createdAt), { addSuffix: true })}
            </div>
            {apiKey.lastUsed && (
              <div className="flex items-center gap-1">
                <Activity className="w-3 h-3" />
                Used {formatDistanceToNow(new Date(apiKey.lastUsed), { addSuffix: true })}
              </div>
            )}
          </div>
          <div className="text-right">
            <span className="font-medium">{apiKey.usageCount}</span> uses
          </div>
        </div>

        {/* Usage Statistics */}
        {showStats && (
          <div className="mt-4 pt-4 border-t">
            {usageStats ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-lg font-semibold">{usageStats.totalRequests}</div>
                  <div className="text-xs text-muted-foreground">Total Requests</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-green-600">
                    {usageStats.successfulRequests}
                  </div>
                  <div className="text-xs text-muted-foreground">Successful</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-red-600">
                    {usageStats.failedRequests}
                  </div>
                  <div className="text-xs text-muted-foreground">Failed</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold">
                    {Math.round(usageStats.averageResponseTime)}ms
                  </div>
                  <div className="text-xs text-muted-foreground">Avg Response</div>
                </div>
                {usageStats.totalTokens > 0 && (
                  <>
                    <div className="text-center">
                      <div className="text-lg font-semibold">{usageStats.totalTokens.toLocaleString()}</div>
                      <div className="text-xs text-muted-foreground">Tokens Used</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-semibold">${usageStats.totalCost.toFixed(4)}</div>
                      <div className="text-xs text-muted-foreground">Total Cost</div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="text-center py-4">
                <div className="animate-pulse">Loading usage statistics...</div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
