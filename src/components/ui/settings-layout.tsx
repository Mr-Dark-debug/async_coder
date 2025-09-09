"use client";

import React, { useState } from 'react';
import { cn } from '@/lib/utils';

interface SettingsTab {
  id: string;
  label: string;
  component: React.ComponentType;
}

interface SettingsLayoutProps {
  tabs: SettingsTab[];
  defaultTab?: string;
}

export function SettingsLayout({ tabs, defaultTab }: SettingsLayoutProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);

  const activeTabComponent = tabs.find(tab => tab.id === activeTab)?.component;

  return (
    <div className="flex h-screen bg-black text-white">
      {/* Sidebar */}
      <div className="w-60 bg-neutral-900 border-r border-neutral-800">
        <div className="p-6">
          <h1 className="text-xl font-semibold text-white mb-6">Settings</h1>
          <nav className="space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  activeTab === tab.id
                    ? "bg-neutral-700 text-white"
                    : "text-neutral-400 hover:text-white hover:bg-neutral-800"
                )}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          {activeTabComponent && React.createElement(activeTabComponent)}
        </div>
      </div>
    </div>
  );
}