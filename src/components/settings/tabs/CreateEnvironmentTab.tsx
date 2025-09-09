"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { ChevronRight, Github, Search, Settings, Info, Plus } from 'lucide-react';

interface Repository {
  name: string;
  visibility: 'Private' | 'Public';
  icon?: React.ReactNode;
}

export function CreateEnvironmentTab({ onBack }: { onBack: () => void }) {
  const [selectedOrg, setSelectedOrg] = useState('enact-on');
  const [searchRepo, setSearchRepo] = useState('');
  const [selectedRepo, setSelectedRepo] = useState('');
  const [envName, setEnvName] = useState('');
  const [description, setDescription] = useState('');
  const [containerImage, setContainerImage] = useState('universal');
  const [preinstalledPackages, setPreinstalledPackages] = useState(false);
  const [containerCaching, setContainerCaching] = useState(false);
  const [setupScript, setSetupScript] = useState('Automatic');
  const [agentAccess, setAgentAccess] = useState(false);

  const repositories: Repository[] = [
    { name: 'admin-cashdrill', visibility: 'Private', icon: <div className="w-3 h-3 rounded-full bg-yellow-500" /> },
    { name: 'admin.profitsplit.in', visibility: 'Private' },
    { name: 'Affyscout', visibility: 'Private' },
    { name: 'agile-biz-track', visibility: 'Private', icon: <div className="w-3 h-3 rounded-full bg-gray-400" /> },
  ];

  const filteredRepos = repositories.filter(repo =>
    repo.name.toLowerCase().includes(searchRepo.toLowerCase())
  );

  return (
    <div className="w-full max-w-6xl">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-8 text-sm">
        <button 
          onClick={onBack}
          className="text-neutral-400 hover:text-white transition-colors"
        >
          Environments
        </button>
        <ChevronRight className="w-4 h-4 text-neutral-600" />
        <span className="text-white">New</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Form */}
        <div className="space-y-8">
          {/* Basic Section */}
          <div>
            <h2 className="text-xl font-semibold text-white mb-6">Basic</h2>
            
            {/* GitHub Organization */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-white mb-3">
                GitHub organization
              </label>
              <div className="relative">
                <div className="flex items-center gap-2 bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2.5">
                  <Github className="w-4 h-4 text-white" />
                  <span className="text-white">{selectedOrg}</span>
                  <ChevronRight className="w-4 h-4 text-neutral-400 ml-auto rotate-90" />
                </div>
              </div>
            </div>

            {/* Repository */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-white mb-3">
                Repository
              </label>
              <div className="relative mb-3">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <Input
                  type="text"
                  placeholder="Search"
                  value={searchRepo}
                  onChange={(e) => setSearchRepo(e.target.value)}
                  className="pl-10 bg-neutral-800 border-neutral-700 text-white placeholder-neutral-400"
                />
              </div>
              
              {/* Repository List */}
              <div className="bg-neutral-800 border border-neutral-700 rounded-lg max-h-48 overflow-y-auto">
                {filteredRepos.map((repo, index) => (
                  <div
                    key={index}
                    className={`flex items-center justify-between px-4 py-3 hover:bg-neutral-700 cursor-pointer border-b border-neutral-700 last:border-b-0 ${
                      selectedRepo === repo.name ? 'bg-neutral-700' : ''
                    }`}
                    onClick={() => setSelectedRepo(repo.name)}
                  >
                    <div className="flex items-center gap-3">
                      {repo.icon}
                      <div>
                        <div className="text-white font-medium">{repo.name}</div>
                        <div className="text-neutral-400 text-sm">{repo.visibility}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-3 text-sm text-neutral-400">
                This list only includes repositories that you have access to in GitHub and can use with Codex.
                <br />
                Missing a repo?{' '}
                <button className="text-white underline hover:no-underline">
                  Configure repository access.
                </button>
              </div>
            </div>

            {/* Name */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-white mb-3">
                Name
              </label>
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Name"
                  value={envName}
                  onChange={(e) => setEnvName(e.target.value)}
                  className="bg-neutral-800 border-neutral-700 text-white placeholder-neutral-400"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 text-sm">
                  0/64
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-white mb-3">
                Description
              </label>
              <Textarea
                placeholder="1-2 sentence description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="bg-neutral-800 border-neutral-700 text-white placeholder-neutral-400 resize-none"
                rows={3}
              />
              <div className="text-neutral-400 text-sm mt-1">0/512</div>
            </div>
          </div>

          {/* Code Execution Section */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <h2 className="text-xl font-semibold text-white">Code execution</h2>
              <span className="text-neutral-400 text-sm">Set up dependencies, lint, and tests.</span>
              <button className="text-neutral-400 hover:text-white">
                <Info className="w-4 h-4" />
              </button>
            </div>

            {/* Container Image */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-white mb-3">
                Container image
              </label>
              <div className="flex items-center gap-3">
                <div className="relative flex-1">
                  <select
                    value={containerImage}
                    onChange={(e) => setContainerImage(e.target.value)}
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2.5 text-white appearance-none"
                  >
                    <option value="universal">universal</option>
                    <option value="node">node</option>
                    <option value="python">python</option>
                  </select>
                  <ChevronRight className="absolute right-3 top-1/2 transform -translate-y-1/2 rotate-90 w-4 h-4 text-neutral-400 pointer-events-none" />
                </div>
                <Button className="bg-neutral-800 border border-neutral-700 text-white hover:bg-neutral-700 px-4 py-2.5">
                  <Settings className="w-4 h-4 mr-2" />
                  Preinstalled packages
                </Button>
              </div>
              <div className="text-neutral-400 text-sm mt-2">
                Universal is an image based on Ubuntu 24.04 - see{' '}
                <button className="text-white underline hover:no-underline">
                  opencai/codex-universal
                </button>{' '}
                to learn more.
                <br />
                The repository will be cloned to /workspace.{' '}
                <button className="text-white underline hover:no-underline">
                  Edit workspace directory.
                </button>
              </div>
            </div>

            {/* Environment Variables */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-white mb-3">
                Environment variables
              </label>
              <Button className="bg-neutral-800 border border-neutral-700 text-white hover:bg-neutral-700 px-3 py-2">
                <Plus className="w-4 h-4 mr-2" />
                Add
              </Button>
            </div>

            {/* Secrets */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-white mb-3">
                Secrets
              </label>
              <Button className="bg-neutral-800 border border-neutral-700 text-white hover:bg-neutral-700 px-3 py-2">
                <Plus className="w-4 h-4 mr-2" />
                Add
              </Button>
            </div>

            {/* Container Caching */}
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <label className="block text-sm font-medium text-white mb-1">
                    Container Caching
                  </label>
                  <p className="text-neutral-400 text-sm">
                    Speed up container start by caching state after running the setup script. Maintenance scripts are run before every task.
                  </p>
                </div>
                <div className="flex items-center gap-4 ml-6">
                  <button
                    onClick={() => setContainerCaching(false)}
                    className={`px-3 py-1 rounded text-sm ${
                      !containerCaching ? 'bg-neutral-700 text-white' : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    Off
                  </button>
                  <button
                    onClick={() => setContainerCaching(true)}
                    className={`px-3 py-1 rounded text-sm ${
                      containerCaching ? 'bg-neutral-700 text-white' : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    On
                  </button>
                </div>
              </div>
            </div>

            {/* Setup Script */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-white mb-3">
                Setup script
              </label>
              <div className="flex gap-2 mb-2">
                <button
                  onClick={() => setSetupScript('Automatic')}
                  className={`px-4 py-2 rounded text-sm ${
                    setupScript === 'Automatic' ? 'bg-neutral-700 text-white' : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  Automatic
                </button>
                <button
                  onClick={() => setSetupScript('Manual')}
                  className={`px-4 py-2 rounded text-sm ${
                    setupScript === 'Manual' ? 'bg-neutral-700 text-white' : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  Manual
                </button>
              </div>
              <p className="text-neutral-400 text-sm">
                Runs the install commands like npm install for common package managers.{' '}
                <button className="text-white underline hover:no-underline">
                  Learn more.
                </button>
              </p>
            </div>

            {/* Agent Internet Access */}
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <label className="block text-sm font-medium text-white mb-1">
                    Agent internet access
                  </label>
                  <p className="text-neutral-400 text-sm">
                    Internet access will be disabled after setup. Codex will only be able to use dependencies installed by the setup script.
                  </p>
                </div>
                <div className="flex items-center gap-4 ml-6">
                  <button
                    onClick={() => setAgentAccess(false)}
                    className={`px-3 py-1 rounded text-sm ${
                      !agentAccess ? 'bg-neutral-700 text-white' : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    Off
                  </button>
                  <button
                    onClick={() => setAgentAccess(true)}
                    className={`px-3 py-1 rounded text-sm ${
                      agentAccess ? 'bg-neutral-700 text-white' : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    On
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Terminal Preview */}
        <div className="bg-neutral-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-medium">Terminal</h3>
            <Button className="bg-neutral-700 hover:bg-neutral-600 text-white text-sm px-4 py-2">
              ▶ Connect interactive terminal
            </Button>
          </div>
          <div className="bg-neutral-900 rounded p-4 font-mono text-sm">
            <div className="text-green-400">/workspace $</div>
          </div>
        </div>
      </div>

      {/* Create Button */}
      <div className="flex justify-end mt-8">
        <Button 
          className="bg-white text-black hover:bg-neutral-100 font-medium px-6 py-2"
          disabled={!selectedRepo || !envName}
        >
          Create environment
        </Button>
      </div>
    </div>
  );
}