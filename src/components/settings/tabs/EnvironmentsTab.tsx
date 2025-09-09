"use client";

import React, { useState } from 'react';
import { SettingsField, SettingsSelect, SettingsInput } from '@/components/ui/settings-components';

export function EnvironmentsTab() {
  const [defaultEnv, setDefaultEnv] = useState('production');
  const [nodeVersion, setNodeVersion] = useState('18.17.0');
  const [pythonVersion, setPythonVersion] = useState('3.11.0');

  const environmentOptions = [
    { value: 'development', label: 'Development' },
    { value: 'staging', label: 'Staging' },
    { value: 'production', label: 'Production' }
  ];

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-white mb-2">Environments</h1>
      </div>

      <div className="space-y-8">
        {/* Default Environment */}
        <SettingsField
          label="Default environment"
          description="The default environment to use for new projects"
        >
          <div className="w-48">
            <SettingsSelect
              value={defaultEnv}
              onChange={setDefaultEnv}
              options={environmentOptions}
            />
          </div>
        </SettingsField>

        {/* Node.js Version */}
        <SettingsField
          label="Node.js version"
          description="Default Node.js version for new projects"
        >
          <div className="w-48">
            <SettingsInput
              value={nodeVersion}
              onChange={setNodeVersion}
              placeholder="18.17.0"
            />
          </div>
        </SettingsField>

        {/* Python Version */}
        <SettingsField
          label="Python version"
          description="Default Python version for new projects"
        >
          <div className="w-48">
            <SettingsInput
              value={pythonVersion}
              onChange={setPythonVersion}
              placeholder="3.11.0"
            />
          </div>
        </SettingsField>
      </div>
    </div>
  );
}