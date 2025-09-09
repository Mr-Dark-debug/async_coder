'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Eye, EyeOff, ExternalLink, CheckCircle, XCircle, TestTube } from 'lucide-react';
import { useAPIKeys, type APIKeyProvider } from '@/hooks/use-api-keys';
import { toast } from 'sonner';

interface APIKeyFormProps {
  provider: APIKeyProvider;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function APIKeyForm({ provider, onSuccess, onCancel }: APIKeyFormProps) {
  const { saveAPIKey, testAPIKey, saving, testing } = useAPIKeys();
  const [formData, setFormData] = useState({
    name: '',
    keyValue: '',
    metadata: {} as Record<string, any>,
  });
  const [showKey, setShowKey] = useState(false);
  const [testResult, setTestResult] = useState<{ valid: boolean; error?: string } | null>(null);

  const handleInputChange = (field: string, value: string) => {
    if (field === 'name' || field === 'keyValue') {
      setFormData(prev => ({ ...prev, [field]: value }));
    } else {
      setFormData(prev => ({
        ...prev,
        metadata: { ...prev.metadata, [field]: value },
      }));
    }
    // Clear test result when form changes
    setTestResult(null);
  };

  const handleTest = async () => {
    if (!formData.keyValue.trim()) {
      toast.error('Please enter an API key to test');
      return;
    }

    const result = await testAPIKey(provider.provider, formData.keyValue, formData.metadata);
    setTestResult(result);

    if (result.valid) {
      toast.success('API key is valid!');
    } else {
      toast.error(result.error || 'API key validation failed');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error('Please enter a name for this API key');
      return;
    }

    if (!formData.keyValue.trim()) {
      toast.error('Please enter the API key');
      return;
    }

    // Validate required fields
    const requiredFields = provider.configuration.requiredFields || [];
    for (const field of requiredFields) {
      if (!formData.metadata[field]) {
        toast.error(`${field} is required for ${provider.displayName}`);
        return;
      }
    }

    const success = await saveAPIKey(
      provider.provider,
      formData.name,
      formData.keyValue,
      formData.metadata
    );

    if (success) {
      onSuccess?.();
    }
  };

  const validateKeyFormat = (key: string): boolean => {
    if (!provider.configuration.keyFormat) return true;
    const regex = new RegExp(provider.configuration.keyFormat);
    return regex.test(key);
  };

  const isKeyFormatValid = !formData.keyValue || validateKeyFormat(formData.keyValue);

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <div className="flex items-center gap-3">
          {provider.logoUrl && (
            <img
              src={provider.logoUrl}
              alt={provider.displayName}
              className="w-8 h-8 rounded"
            />
          )}
          <div>
            <CardTitle className="flex items-center gap-2">
              {provider.displayName}
              <Badge variant="secondary">{provider.category.replace('_', ' ')}</Badge>
            </CardTitle>
            <CardDescription>{provider.description}</CardDescription>
          </div>
        </div>
        
        {provider.docsUrl && (
          <div className="flex gap-2">
            <Button variant="outline" size="sm" asChild>
              <a href={provider.docsUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-4 h-4 mr-2" />
                Documentation
              </a>
            </Button>
            {provider.websiteUrl && (
              <Button variant="outline" size="sm" asChild>
                <a href={provider.websiteUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Website
                </a>
              </Button>
            )}
          </div>
        )}
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Field */}
          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              placeholder="e.g., My OpenAI Key, Production Key"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              required
            />
          </div>

          {/* API Key Field */}
          <div className="space-y-2">
            <Label htmlFor="keyValue">API Key *</Label>
            <div className="relative">
              <Input
                id="keyValue"
                type={showKey ? 'text' : 'password'}
                placeholder={provider.configuration.keyPrefix ? `${provider.configuration.keyPrefix}...` : 'Enter your API key'}
                value={formData.keyValue}
                onChange={(e) => handleInputChange('keyValue', e.target.value)}
                className={!isKeyFormatValid ? 'border-red-500' : ''}
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
                onClick={() => setShowKey(!showKey)}
              >
                {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </Button>
            </div>
            {!isKeyFormatValid && (
              <p className="text-sm text-red-500">
                Invalid key format. Expected format: {provider.configuration.keyFormat}
              </p>
            )}
            {provider.configuration.keyPrefix && (
              <p className="text-sm text-muted-foreground">
                Key should start with: {provider.configuration.keyPrefix}
              </p>
            )}
          </div>

          {/* Required Fields */}
          {provider.configuration.requiredFields?.map((field) => (
            <div key={field} className="space-y-2">
              <Label htmlFor={field}>{field} *</Label>
              <Input
                id={field}
                placeholder={`Enter ${field}`}
                value={formData.metadata[field] || ''}
                onChange={(e) => handleInputChange(field, e.target.value)}
                required
              />
            </div>
          ))}

          {/* Optional Fields */}
          {provider.configuration.optionalFields?.map((field) => (
            <div key={field} className="space-y-2">
              <Label htmlFor={field}>{field}</Label>
              <Input
                id={field}
                placeholder={`Enter ${field} (optional)`}
                value={formData.metadata[field] || ''}
                onChange={(e) => handleInputChange(field, e.target.value)}
              />
            </div>
          ))}

          {/* Test Result */}
          {testResult && (
            <div className={`flex items-center gap-2 p-3 rounded-lg ${
              testResult.valid 
                ? 'bg-green-50 text-green-700 border border-green-200' 
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}>
              {testResult.valid ? (
                <CheckCircle className="w-5 h-5" />
              ) : (
                <XCircle className="w-5 h-5" />
              )}
              <span className="text-sm">
                {testResult.valid ? 'API key is valid!' : testResult.error}
              </span>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleTest}
              disabled={!formData.keyValue || testing || !isKeyFormatValid}
            >
              {testing ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <TestTube className="w-4 h-4 mr-2" />
              )}
              Test Key
            </Button>
            
            <Button
              type="submit"
              disabled={saving || !isKeyFormatValid}
              className="flex-1"
            >
              {saving ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : null}
              Save API Key
            </Button>
            
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
