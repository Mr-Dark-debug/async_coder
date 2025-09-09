"use client";

import React, { useState } from 'react';
import { SettingsField, SettingsSelect, SettingsTextarea } from '@/components/ui/settings-components';

export function CodeReviewTab() {
  const [reviewLevel, setReviewLevel] = useState('standard');
  const [autoApprove, setAutoApprove] = useState('never');
  const [reviewTemplate, setReviewTemplate] = useState('');

  const reviewLevelOptions = [
    { value: 'basic', label: 'Basic review' },
    { value: 'standard', label: 'Standard review' },
    { value: 'thorough', label: 'Thorough review' },
    { value: 'security-focused', label: 'Security-focused' }
  ];

  const autoApproveOptions = [
    { value: 'never', label: 'Never auto-approve' },
    { value: 'minor', label: 'Minor changes only' },
    { value: 'trusted', label: 'Trusted contributors' },
    { value: 'always', label: 'Always auto-approve' }
  ];

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-white mb-2">Code review</h1>
      </div>

      <div className="space-y-8">
        {/* Review Level */}
        <SettingsField
          label="Review thoroughness"
          description="How thorough should the AI code review be"
        >
          <div className="w-48">
            <SettingsSelect
              value={reviewLevel}
              onChange={setReviewLevel}
              options={reviewLevelOptions}
            />
          </div>
        </SettingsField>

        {/* Auto-approve */}
        <SettingsField
          label="Auto-approve PRs"
          description="When to automatically approve pull requests"
        >
          <div className="w-48">
            <SettingsSelect
              value={autoApprove}
              onChange={setAutoApprove}
              options={autoApproveOptions}
            />
          </div>
        </SettingsField>

        {/* Review Template */}
        <SettingsField
          label="Review template"
          description="Custom template for code review comments"
        >
          <SettingsTextarea
            placeholder="Enter your custom review template...\\n\\nExample:\\n- Check for code quality\\n- Verify test coverage\\n- Review security implications"
            value={reviewTemplate}
            onChange={setReviewTemplate}
            rows={6}
          />
        </SettingsField>
      </div>
    </div>
  );
}