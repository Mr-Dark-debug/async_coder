"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search } from 'lucide-react';
import { CreateEnvironmentTab } from './CreateEnvironmentTab';

interface Environment {
  name: string;
  repo: string;
  tasksCount: number;
  creator: string;
  createdAt: string;
}

export function EnvironmentsTab() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  
  // Empty array - no dummy data
  const environments: Environment[] = [];

  const filteredEnvironments = environments.filter(env =>
    env.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    env.repo.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (showCreateForm) {
    return <CreateEnvironmentTab onBack={() => setShowCreateForm(false)} />;
  }

  return (
    <div className="w-full">
      {/* Header with search and create button */}
      <div className="flex items-center justify-between mb-6">
        <div className="relative w-80">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <Input
            type="text"
            placeholder="Search environments"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-neutral-800 border-neutral-700 text-white placeholder-neutral-400"
          />
        </div>
        <Button 
          onClick={() => setShowCreateForm(true)}
          className="bg-white text-black hover:bg-neutral-100 font-medium px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Create environment
        </Button>
      </div>

      {/* Environments table */}
      <div className="bg-neutral-900 rounded-lg border border-neutral-800">
        {/* Table header */}
        <div className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-neutral-800 text-sm font-medium text-neutral-300">
          <div className="col-span-3">Name</div>
          <div className="col-span-3">Repo</div>
          <div className="col-span-2">Number of tasks</div>
          <div className="col-span-2">Creator</div>
          <div className="col-span-2">Created at</div>
        </div>

        {/* Table body */}
        <div className="divide-y divide-neutral-800">
          {filteredEnvironments.map((env, index) => (
            <div 
              key={index} 
              className="grid grid-cols-12 gap-4 px-6 py-4 hover:bg-neutral-800/50 transition-colors cursor-pointer"
            >
              <div className="col-span-3 text-white font-medium truncate">
                {env.name}
              </div>
              <div className="col-span-3 text-neutral-300 truncate">
                {env.repo}
              </div>
              <div className="col-span-2 text-neutral-300">
                {env.tasksCount}
              </div>
              <div className="col-span-2 text-neutral-300 truncate">
                {env.creator}
              </div>
              <div className="col-span-2 text-neutral-300">
                {env.createdAt}
              </div>
            </div>
          ))}
        </div>

        {/* Empty state */}
        {environments.length === 0 && (
          <div className="px-6 py-12 text-center">
            <div className="text-neutral-400 text-lg">
              No environments created.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}