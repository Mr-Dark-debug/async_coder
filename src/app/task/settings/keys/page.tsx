'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Search, Plus, Key, Zap, Cloud, Code, MessageSquare, BarChart3, Settings } from 'lucide-react';
import { useAPIKeys, type APIKeyProvider } from '@/hooks/use-api-keys';
import { APIKeyForm } from '@/components/settings/api-key-form';
import { APIKeyList } from '@/components/settings/api-key-list';
import Link from 'next/link';

const categoryIcons = {
  ai_models: Zap,
  search: Search,
  development: Code,
  cloud: Cloud,
  communication: MessageSquare,
  analytics: BarChart3,
  other: Settings,
};

const categoryLabels = {
  ai_models: 'AI Models',
  search: 'Search APIs',
  development: 'Development',
  cloud: 'Cloud Services',
  communication: 'Communication',
  analytics: 'Analytics',
  other: 'Other',
};

export default function KeyManagementPage() {
  const { providers, providersByCategory, apiKeys, loading } = useAPIKeys();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProvider, setSelectedProvider] = useState<APIKeyProvider | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  // Filter providers based on search query
  const filteredProviders = providers.filter(provider =>
    provider.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    provider.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    provider.provider.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get categories with provider counts
  const categoriesWithCounts = Object.entries(providersByCategory).map(([category, categoryProviders]) => ({
    category,
    label: categoryLabels[category as keyof typeof categoryLabels] || category,
    count: categoryProviders.length,
    icon: categoryIcons[category as keyof typeof categoryIcons] || Settings,
  }));

  // Get providers for active category
  const getProvidersForCategory = (category: string) => {
    if (category === 'all') return filteredProviders;
    return filteredProviders.filter(p => p.category === category);
  };

  const handleAddKey = (provider: APIKeyProvider) => {
    setSelectedProvider(provider);
    setShowAddDialog(true);
  };

  const handleFormSuccess = () => {
    setShowAddDialog(false);
    setSelectedProvider(null);
  };

  const handleFormCancel = () => {
    setShowAddDialog(false);
    setSelectedProvider(null);
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-muted rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-32 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/task">Dashboard</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/task/settings">Settings</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Key Management</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">API Key Management</h1>
          <p className="text-muted-foreground">
            Securely manage your API keys for various services and providers
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="flex items-center gap-1">
            <Key className="w-3 h-3" />
            {apiKeys.length} keys configured
          </Badge>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          placeholder="Search providers..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Category Tabs */}
      <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-full">
        <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8">
          <TabsTrigger value="all" className="flex items-center gap-1">
            <Settings className="w-3 h-3" />
            All ({providers.length})
          </TabsTrigger>
          {categoriesWithCounts.map(({ category, label, count, icon: Icon }) => (
            <TabsTrigger key={category} value={category} className="flex items-center gap-1">
              <Icon className="w-3 h-3" />
              {label} ({count})
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={activeCategory} className="mt-6">
          <ProvidersGrid
            providers={getProvidersForCategory(activeCategory)}
            onAddKey={handleAddKey}
          />
        </TabsContent>
      </Tabs>

      {/* Add Key Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add API Key</DialogTitle>
            <DialogDescription>
              Configure your API key for {selectedProvider?.displayName}
            </DialogDescription>
          </DialogHeader>
          {selectedProvider && (
            <APIKeyForm
              provider={selectedProvider}
              onSuccess={handleFormSuccess}
              onCancel={handleFormCancel}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

interface ProvidersGridProps {
  providers: APIKeyProvider[];
  onAddKey: (provider: APIKeyProvider) => void;
}

function ProvidersGrid({ providers, onAddKey }: ProvidersGridProps) {
  const { getAPIKeysByProvider } = useAPIKeys();

  if (providers.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Search className="w-12 h-12 text-muted-foreground mb-4" />
          <h3 className="font-medium mb-2">No providers found</h3>
          <p className="text-sm text-muted-foreground text-center">
            Try adjusting your search query or browse different categories
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {providers.map((provider) => {
        const userKeys = getAPIKeysByProvider(provider.provider);
        const hasKeys = userKeys.length > 0;

        return (
          <Card key={provider.id} className="relative group hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  {provider.logoUrl && (
                    <img
                      src={provider.logoUrl}
                      alt={provider.displayName}
                      className="w-8 h-8 rounded"
                    />
                  )}
                  <div>
                    <CardTitle className="text-base">{provider.displayName}</CardTitle>
                    <Badge variant="outline" className="text-xs">
                      {categoryLabels[provider.category] || provider.category}
                    </Badge>
                  </div>
                </div>
                {hasKeys && (
                  <Badge variant="default" className="text-xs">
                    {userKeys.length} key{userKeys.length !== 1 ? 's' : ''}
                  </Badge>
                )}
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <CardDescription className="text-sm">
                {provider.description}
              </CardDescription>

              {hasKeys ? (
                <APIKeyList provider={provider} onAddKey={() => onAddKey(provider)} />
              ) : (
                <Button
                  onClick={() => onAddKey(provider)}
                  className="w-full"
                  variant="outline"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add {provider.displayName} Key
                </Button>
              )}

              {provider.docsUrl && (
                <Button variant="ghost" size="sm" asChild className="w-full">
                  <a href={provider.docsUrl} target="_blank" rel="noopener noreferrer">
                    View Documentation
                  </a>
                </Button>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
