"use client";

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Select } from '@/components/ui/select';
import { X } from 'lucide-react';

interface PreinstalledPackagesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface PackageConfig {
  name: string;
  icon: string;
  color: string;
  defaultVersion: string;
  versions: string[];
}

const packages: PackageConfig[] = [
  {
    name: 'Python',
    icon: '🐍',
    color: 'text-blue-400',
    defaultVersion: '3.12',
    versions: ['3.8', '3.9', '3.10', '3.11', '3.12', '3.13']
  },
  {
    name: 'Node.js',
    icon: '🟢',
    color: 'text-green-400',
    defaultVersion: '20',
    versions: ['16', '18', '20', '22', '23']
  },
  {
    name: 'Ruby',
    icon: '💎',
    color: 'text-red-400',
    defaultVersion: '3.4.4',
    versions: ['3.0.0', '3.1.0', '3.2.0', '3.3.0', '3.4.4']
  },
  {
    name: 'Rust',
    icon: '🦀',
    color: 'text-orange-400',
    defaultVersion: '1.89.0',
    versions: ['1.85.0', '1.86.0', '1.87.0', '1.88.0', '1.89.0']
  },
  {
    name: 'Go',
    icon: '🐹',
    color: 'text-blue-300',
    defaultVersion: '1.24.3',
    versions: ['1.20.0', '1.21.0', '1.22.0', '1.23.0', '1.24.3']
  },
  {
    name: 'Bun',
    icon: '🥟',
    color: 'text-yellow-300',
    defaultVersion: '1.2.14',
    versions: ['1.0.0', '1.1.0', '1.2.0', '1.2.14']
  },
  {
    name: 'PHP',
    icon: '🐘',
    color: 'text-purple-400',
    defaultVersion: '8.4',
    versions: ['7.4', '8.0', '8.1', '8.2', '8.3', '8.4']
  },
  {
    name: 'Java',
    icon: '☕',
    color: 'text-orange-600',
    defaultVersion: '21',
    versions: ['11', '17', '21', '23']
  },
  {
    name: 'Swift',
    icon: '🦉',
    color: 'text-orange-500',
    defaultVersion: '6.1',
    versions: ['5.8', '5.9', '6.0', '6.1']
  }
];

export function PreinstalledPackagesDialog({ 
  open, 
  onOpenChange 
}: PreinstalledPackagesDialogProps) {
  const [packageVersions, setPackageVersions] = useState<Record<string, string>>(
    Object.fromEntries(packages.map(pkg => [pkg.name, pkg.defaultVersion]))
  );

  const updatePackageVersion = (packageName: string, version: string) => {
    setPackageVersions(prev => ({
      ...prev,
      [packageName]: version
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-neutral-800 border-neutral-700 text-white max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-white text-lg">
              Preinstalled packages
            </DialogTitle>
            <button
              onClick={() => onOpenChange(false)}
              className="text-neutral-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <p className="text-neutral-400 text-sm mt-2">
            Configure your own packages in the setup script.
          </p>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto pr-2 scrollbar-hide">
          <div className="space-y-4">
            {packages.map((pkg) => (
              <div key={pkg.name} className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <span className="text-lg">{pkg.icon}</span>
                  <span className={`font-medium ${pkg.color}`}>{pkg.name}</span>
                </div>
                <div className="relative">
                  <select
                    value={packageVersions[pkg.name]}
                    onChange={(e) => updatePackageVersion(pkg.name, e.target.value)}
                    className="bg-neutral-700 border border-neutral-600 rounded-lg px-3 py-2 text-white appearance-none pr-8 min-w-[100px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {pkg.versions.map((version) => (
                      <option key={version} value={version}>
                        {version}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <svg className="w-4 h-4 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}