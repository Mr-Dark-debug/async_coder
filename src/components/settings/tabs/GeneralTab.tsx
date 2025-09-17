"use client";

import React, { useState, useEffect } from 'react';
import { SettingsField, SettingsTextarea, SettingsSelect, SettingsInput } from '@/components/ui/settings-components';
import { RefreshCw, HelpCircle, ExternalLink, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import config from '@/lib/config';

export function GeneralTab() {
  const [customInstructions, setCustomInstructions] = useState('');
  const [diffFormat, setDiffFormat] = useState('split');
  const [branchFormat, setBranchFormat] = useState('async/{feature}');
  const [themePreference, setThemePreference] = useState('auto');
  const [defaultAIBackend, setDefaultAIBackend] = useState('claude');
  const [claudeApiKey, setClaudeApiKey] = useState('');
  const [geminiApiKey, setGeminiApiKey] = useState('');
  const [openaiApiKey, setOpenaiApiKey] = useState('');
  const [qwenApiKey, setQwenApiKey] = useState('');
  const [deepseekApiKey, setDeepseekApiKey] = useState('');
  const [openrouterApiKey, setOpenrouterApiKey] = useState('');
  const [groqApiKey, setGroqApiKey] = useState('');
  const [elevenlabsApiKey, setElevenlabsApiKey] = useState('');
  const [tavilyApiKey, setTavilyApiKey] = useState('');

  // Loading and validation states
  const [validatingKeys, setValidatingKeys] = useState<Record<string, boolean>>({});
  const [keyStatuses, setKeyStatuses] = useState<Record<string, 'valid' | 'invalid' | 'pending' | null>>({});

  // API key provider configurations
  const apiProviders = [
    {
      id: 'claude',
      name: 'Claude API Key',
      description: 'Enter your Anthropic Claude API key for AI text generation',
      placeholder: 'sk-ant-...',
      value: claudeApiKey,
      setValue: setClaudeApiKey,
      getKeyUrl: 'https://console.anthropic.com/',
      docsUrl: 'https://docs.anthropic.com/'
    },
    {
      id: 'gemini',
      name: 'Gemini API Key',
      description: 'Enter your Google Gemini API key for AI text generation',
      placeholder: 'AIza...',
      value: geminiApiKey,
      setValue: setGeminiApiKey,
      getKeyUrl: 'https://ai.google.dev/',
      docsUrl: 'https://ai.google.dev/docs'
    },
    {
      id: 'openai',
      name: 'OpenAI API Key',
      description: 'Enter your OpenAI API key for GPT models',
      placeholder: 'sk-...',
      value: openaiApiKey,
      setValue: setOpenaiApiKey,
      getKeyUrl: 'https://platform.openai.com/api-keys',
      docsUrl: 'https://platform.openai.com/docs'
    },
    {
      id: 'qwen',
      name: 'Qwen API Key',
      description: 'Enter your Alibaba Cloud Qwen API key',
      placeholder: 'sk-...',
      value: qwenApiKey,
      setValue: setQwenApiKey,
      getKeyUrl: 'https://dashscope.aliyuncs.com/',
      docsUrl: 'https://help.aliyun.com/zh/dashscope/'
    },
    {
      id: 'deepseek',
      name: 'DeepSeek API Key',
      description: 'Enter your DeepSeek API key for reasoning models',
      placeholder: 'sk-...',
      value: deepseekApiKey,
      setValue: setDeepseekApiKey,
      getKeyUrl: 'https://platform.deepseek.com/',
      docsUrl: 'https://api-docs.deepseek.com/'
    },
    {
      id: 'openrouter',
      name: 'OpenRouter API Key',
      description: 'Enter your OpenRouter API key for unified model access',
      placeholder: 'sk-or-v1-...',
      value: openrouterApiKey,
      setValue: setOpenrouterApiKey,
      getKeyUrl: 'https://openrouter.ai/keys',
      docsUrl: 'https://openrouter.ai/docs'
    },
    {
      id: 'groq',
      name: 'Groq API Key',
      description: 'Enter your Groq API key for fast LLM inference',
      placeholder: 'gsk_...',
      value: groqApiKey,
      setValue: setGroqApiKey,
      getKeyUrl: 'https://console.groq.com/keys',
      docsUrl: 'https://console.groq.com/docs'
    },
    {
      id: 'elevenlabs',
      name: 'ElevenLabs API Key',
      description: 'Enter your ElevenLabs API key for AI voice generation',
      placeholder: 'Enter your 32-character key...',
      value: elevenlabsApiKey,
      setValue: setElevenlabsApiKey,
      getKeyUrl: 'https://elevenlabs.io/app/speech-synthesis',
      docsUrl: 'https://elevenlabs.io/docs'
    },
    {
      id: 'tavily',
      name: 'Tavily API Key',
      description: 'Enter your Tavily API key for AI-powered web search',
      placeholder: 'tvly-...',
      value: tavilyApiKey,
      setValue: setTavilyApiKey,
      getKeyUrl: 'https://app.tavily.com/',
      docsUrl: 'https://docs.tavily.com/'
    }
  ];

  // Automatic API key validation and saving
  const validateAndSaveApiKey = async (provider: string, keyValue: string, name: string) => {
    if (!keyValue.trim()) {
      setKeyStatuses(prev => ({ ...prev, [provider]: null }));
      return;
    }

    setValidatingKeys(prev => ({ ...prev, [provider]: true }));
    setKeyStatuses(prev => ({ ...prev, [provider]: 'pending' }));

    try {
      // First test the API key
      const testResponse = await fetch(`${config.api.baseUrl}/api-keys/test`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          provider,
          keyValue
        }),
      });

      const testData = await testResponse.json();

      if (!testResponse.ok) {
        throw new Error(testData.detail || 'Failed to validate API key');
      }

      if (!testData.valid) {
        setKeyStatuses(prev => ({ ...prev, [provider]: 'invalid' }));
        toast.error(`${name} validation failed: ${testData.error || 'Invalid API key'}`);
        return;
      }

      // If valid, save the API key
      const saveResponse = await fetch(`${config.api.baseUrl}/api-keys`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        },
        body: JSON.stringify({
          provider,
          name,
          keyValue,
          description: `${name} for ${provider}`
        }),
      });

      const saveData = await saveResponse.json();

      if (!saveResponse.ok) {
        throw new Error(saveData.detail || 'Failed to save API key');
      }

      setKeyStatuses(prev => ({ ...prev, [provider]: 'valid' }));
      toast.success(`${name} validated and saved successfully!`);

    } catch (error) {
      setKeyStatuses(prev => ({ ...prev, [provider]: 'invalid' }));
      const errorMessage = error instanceof Error ? error.message : 'Failed to process API key';
      toast.error(`${name} error: ${errorMessage}`);
    } finally {
      setValidatingKeys(prev => ({ ...prev, [provider]: false }));
    }
  };



  // Handle API key input changes with debounced validation
  useEffect(() => {
    const timeouts: Record<string, NodeJS.Timeout> = {};

    const providers = [
      { id: 'claude', value: claudeApiKey, name: 'Claude API Key' },
      { id: 'gemini', value: geminiApiKey, name: 'Gemini API Key' },
      { id: 'openai', value: openaiApiKey, name: 'OpenAI API Key' },
      { id: 'qwen', value: qwenApiKey, name: 'Qwen API Key' },
      { id: 'deepseek', value: deepseekApiKey, name: 'DeepSeek API Key' },
      { id: 'openrouter', value: openrouterApiKey, name: 'OpenRouter API Key' },
      { id: 'groq', value: groqApiKey, name: 'Groq API Key' },
      { id: 'elevenlabs', value: elevenlabsApiKey, name: 'ElevenLabs API Key' },
      { id: 'tavily', value: tavilyApiKey, name: 'Tavily API Key' }
    ];

    providers.forEach(provider => {
      if (provider.value.trim()) {
        if (timeouts[provider.id]) {
          clearTimeout(timeouts[provider.id]);
        }

        timeouts[provider.id] = setTimeout(() => {
          validateAndSaveApiKey(provider.id, provider.value, provider.name);
        }, 1500); // Wait 1.5 seconds after user stops typing
      }
    });

    return () => {
      Object.values(timeouts).forEach(timeout => clearTimeout(timeout));
    };
  }, [claudeApiKey, geminiApiKey, openaiApiKey, qwenApiKey, deepseekApiKey, openrouterApiKey, groqApiKey, elevenlabsApiKey, tavilyApiKey]);

  const diffFormatOptions = [
    { value: 'split', label: 'Split' },
    { value: 'unified', label: 'Unified' },
    { value: 'inline', label: 'Inline' }
  ];

  const themeOptions = [
    { value: 'auto', label: 'Auto (System)' },
    { value: 'light', label: 'Light' },
    { value: 'dark', label: 'Dark' }
  ];

  const aiBackendOptions = [
    { value: 'claude', label: 'Claude Code' },
    { value: 'gemini', label: 'Gemini CLI' },
    { value: 'aider', label: 'Aider' },
    { value: 'async', label: 'Async In-House AI' },
    { value: 'openai', label: 'OpenAI' },
    { value: 'mistral', label: 'Mistral' }
  ];

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-white mb-2">General</h1>
      </div>

      <div className="space-y-8">
        {/* General Settings Section */}
        <div>
          <h2 className="text-lg font-medium text-white mb-6">General Settings</h2>
          
          {/* Theme Preference */}
          <SettingsField
            label="Theme Preference"
            className="mb-6"
          >
            <div className="w-48">
              <SettingsSelect
                value={themePreference}
                onChange={setThemePreference}
                options={themeOptions}
              />
            </div>
          </SettingsField>

          {/* Default AI Backend */}
          <SettingsField
            label="Default AI Backend"
            className="mb-6"
          >
            <div className="w-48">
              <SettingsSelect
                value={defaultAIBackend}
                onChange={setDefaultAIBackend}
                options={aiBackendOptions}
              />
            </div>
          </SettingsField>
        </div>

        {/* API Configuration Section */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-white">
              <path fillRule="evenodd" d="M15.75 1.5a6.75 6.75 0 0 0-6.651 7.906c.067.39-.032.717-.221.906l-6.5 6.499a3 3 0 0 0-.878 2.121v2.818c0 .414.336.75.75.75H6a.75.75 0 0 0 .75-.75v-1.5h1.5A.75.75 0 0 0 9 19.5V18h1.5a.75.75 0 0 0 .53-.22l2.658-2.658c.19-.189.517-.288.906-.22A6.75 6.75 0 1 0 15.75 1.5Zm0 3a.75.75 0 0 0 0 1.5A2.25 2.25 0 0 1 18 8.25a.75.75 0 0 0 1.5 0 3.75 3.75 0 0 0-3.75-3.75Z" clipRule="evenodd" />
            </svg>
            <h2 className="text-lg font-medium text-white">API Configuration</h2>
          </div>

          {apiProviders.map((provider) => (
            <div key={provider.id} className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <label className="text-sm font-medium text-neutral-300">
                  {provider.name}
                </label>
                <div className="group relative">
                  <HelpCircle className="w-4 h-4 text-neutral-500 hover:text-neutral-300 cursor-help" />
                  <div className="absolute left-0 top-6 w-80 p-3 bg-neutral-800 border border-neutral-700 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none">
                    <p className="text-sm text-neutral-300 mb-2">{provider.description}</p>
                    <div className="flex gap-2">
                      <a
                        href={provider.getKeyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300"
                      >
                        Get API Key <ExternalLink className="w-3 h-3" />
                      </a>
                      <a
                        href={provider.docsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-neutral-400 hover:text-neutral-300"
                      >
                        Docs <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative">
                <SettingsInput
                  type="password"
                  value={provider.value}
                  onChange={provider.setValue}
                  placeholder={provider.placeholder}
                  className="pr-10"
                />

                {/* Status indicator */}
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  {validatingKeys[provider.id] ? (
                    <RefreshCw className="w-4 h-4 text-blue-400 animate-spin" />
                  ) : keyStatuses[provider.id] === 'valid' ? (
                    <CheckCircle className="w-4 h-4 text-green-400" />
                  ) : keyStatuses[provider.id] === 'invalid' ? (
                    <XCircle className="w-4 h-4 text-red-400" />
                  ) : null}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Custom Instructions */}
        <SettingsField
          label="Custom instructions"
          description="Custom instructions are used to customize the behavior of the Async model."
        >
          <SettingsTextarea
            placeholder="Example: Run tests and linters for every code change but not when changing code comments or documentation"
            value={customInstructions}
            onChange={setCustomInstructions}
            rows={6}
          />
        </SettingsField>

        {/* Diff Display Format */}
        <SettingsField
          label="Diff display format"
        >
          <div className="w-48">
            <SettingsSelect
              value={diffFormat}
              onChange={setDiffFormat}
              options={diffFormatOptions}
            />
          </div>
        </SettingsField>

        {/* Branch Format */}
        <SettingsField
          label="Branch format"
          description="Example: async/unit-tests-for-feature\nTags available: {feature}, {date}, {time}"
        >
          <div className="w-64">
            <SettingsInput
              value={branchFormat}
              onChange={setBranchFormat}
              placeholder="async/{feature}"
            />
          </div>
        </SettingsField>
      </div>
    </div>
  );
}
