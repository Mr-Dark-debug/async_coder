"use client";

import React, { useState } from 'react';
import { SettingsField, SettingsTextarea, SettingsSelect, SettingsInput } from '@/components/ui/settings-components';

export function GeneralTab() {
  const [customInstructions, setCustomInstructions] = useState('');
  const [diffFormat, setDiffFormat] = useState('split');
  const [branchFormat, setBranchFormat] = useState('async/{feature}');
  const [themePreference, setThemePreference] = useState('auto');
  const [defaultAIBackend, setDefaultAIBackend] = useState('claude');
  const [claudeApiKey, setClaudeApiKey] = useState('');
  const [geminiApiKey, setGeminiApiKey] = useState('');
  const [openaiApiKey, setOpenaiApiKey] = useState('');

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
          <h2 className="text-lg font-medium text-white mb-6">API Configuration</h2>
          
          {/* Claude API Key */}
          <SettingsField
            label="Claude API Key"
            className="mb-6"
          >
            <SettingsInput
              type="password"
              value={claudeApiKey}
              onChange={setClaudeApiKey}
              placeholder="sk-ant-..."
            />
          </SettingsField>

          {/* Gemini API Key */}
          <SettingsField
            label="Gemini API Key"
            className="mb-6"
          >
            <SettingsInput
              type="password"
              value={geminiApiKey}
              onChange={setGeminiApiKey}
              placeholder="AIza..."
            />
          </SettingsField>

          {/* OpenAI API Key */}
          <SettingsField
            label="OpenAI API Key"
            className="mb-6"
          >
            <SettingsInput
              type="password"
              value={openaiApiKey}
              onChange={setOpenaiApiKey}
              placeholder="sk-..."
            />
          </SettingsField>
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
