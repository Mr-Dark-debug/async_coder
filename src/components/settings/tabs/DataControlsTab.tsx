"use client";

import React, { useState } from 'react';
import { SettingsField, SettingsSelect } from '@/components/ui/settings-components';

export function DataControlsTab() {
  const [dataRetention, setDataRetention] = useState('30days');
  const [exportFormat, setExportFormat] = useState('json');
  const [analyticsLevel, setAnalyticsLevel] = useState('minimal');

  const retentionOptions = [
    { value: '7days', label: '7 days' },
    { value: '30days', label: '30 days' },
    { value: '90days', label: '90 days' },
    { value: '1year', label: '1 year' },
    { value: 'forever', label: 'Forever' }
  ];

  const exportOptions = [
    { value: 'json', label: 'JSON' },
    { value: 'csv', label: 'CSV' },
    { value: 'xml', label: 'XML' }
  ];

  const analyticsOptions = [
    { value: 'none', label: 'No analytics' },
    { value: 'minimal', label: 'Minimal analytics' },
    { value: 'standard', label: 'Standard analytics' },
    { value: 'detailed', label: 'Detailed analytics' }
  ];

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-white mb-2">Data controls</h1>
      </div>

      <div className="space-y-8">
        {/* Data Retention */}
        <SettingsField
          label="Data retention period"
          description="How long to keep your project data and analytics"
        >
          <div className="w-48">
            <SettingsSelect
              value={dataRetention}
              onChange={setDataRetention}
              options={retentionOptions}
            />
          </div>
        </SettingsField>

        {/* Export Format */}
        <SettingsField
          label="Export format"
          description="Default format for data exports"
        >
          <div className="w-48">
            <SettingsSelect
              value={exportFormat}
              onChange={setExportFormat}
              options={exportOptions}
            />
          </div>
        </SettingsField>

        {/* Analytics Level */}
        <SettingsField
          label="Analytics collection"
          description="Level of usage analytics to collect"
        >
          <div className="w-48">
            <SettingsSelect
              value={analyticsLevel}
              onChange={setAnalyticsLevel}
              options={analyticsOptions}
            />
          </div>
        </SettingsField>
      </div>
    </div>
  );
}