'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { GeneralTab } from './tabs/GeneralTab';
import { EnvironmentsTab } from './tabs/EnvironmentsTab';
import { DataControlsTab } from './tabs/DataControlsTab';
import { CodeReviewTab } from './tabs/CodeReviewTab';

const settingsTabs = [
  { id: 'general', label: 'General', component: GeneralTab },
  { id: 'environments', label: 'Environments', component: EnvironmentsTab },
  { id: 'data-controls', label: 'Data controls', component: DataControlsTab },
  { id: 'code-review', label: 'Code review', component: CodeReviewTab },
];

export function SettingsContent() {
  const [activeTab, setActiveTab] = useState('general');

  const ActiveComponent = settingsTabs.find(tab => tab.id === activeTab)?.component || GeneralTab;

  return (
    <div className="flex-1 w-full h-screen flex flex-col">
      {/* Breadcrumbs */}
      <div className="px-6 py-4 border-b border-neutral-800 flex-shrink-0">
        <nav className="flex items-center space-x-2 text-sm">
          <Link 
            href="/task" 
            className="text-neutral-400 hover:text-white transition-colors"
          >
            Dashboard
          </Link>
          <ChevronRight className="w-4 h-4 text-neutral-600" />
          <span className="text-white">Settings</span>
        </nav>
      </div>

      <div className="flex flex-1 min-h-0">
        {/* Settings Sidebar */}
        <div className="w-60 bg-neutral-900 border-r border-neutral-800 flex-shrink-0">
          <div className="p-6">
            <h1 className="text-xl font-semibold text-white mb-6">Settings</h1>
            <nav className="space-y-1">
              {settingsTabs.map((tab) => (
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
        <div className="flex-1 overflow-y-auto scrollbar-hide">
          <div className="p-8 pb-16">
            <ActiveComponent />
          </div>
        </div>
      </div>
    </div>
  );
}


