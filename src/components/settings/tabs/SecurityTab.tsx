import React from 'react'
import { Shield, Key, Download, Settings } from 'lucide-react'

export function SecurityTab() {
  return (
    <div className="max-w-3xl">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-6">
          Security Settings
        </h2>
        <div className="space-y-6">
          {/* Two-Factor Authentication */}
          <div className="flex items-center justify-between py-4 border-b border-gray-200">
            <div className="flex items-center">
              <Shield className="h-5 w-5 text-gray-400 mr-3" />
              <div>
                <h3 className="text-sm font-medium text-gray-900">
                  Two-Factor Authentication
                </h3>
                <p className="text-sm text-gray-500">
                  Add an extra layer of security to your account
                </p>
              </div>
            </div>
            <button className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              Configure
            </button>
          </div>
          {/* Session Management */}
          <div className="flex items-center justify-between py-4 border-b border-gray-200">
            <div className="flex items-center">
              <Settings className="h-5 w-5 text-gray-400 mr-3" />
              <div>
                <h3 className="text-sm font-medium text-gray-900">
                  Session Management
                </h3>
                <p className="text-sm text-gray-500">
                  View and manage your active sessions across devices
                </p>
              </div>
            </div>
            <button className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              Manage Sessions
            </button>
          </div>
          {/* API Keys */}
          <div className="flex items-center justify-between py-4 border-b border-gray-200">
            <div className="flex items-center">
              <Key className="h-5 w-5 text-gray-400 mr-3" />
              <div>
                <h3 className="text-sm font-medium text-gray-900">
                  API Key Security
                </h3>
                <p className="text-sm text-gray-500">
                  Review and manage your API key security settings
                </p>
              </div>
            </div>
            <button className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              Review Keys
            </button>
          </div>
          {/* Data Export */}
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center">
              <Download className="h-5 w-5 text-gray-400 mr-3" />
              <div>
                <h3 className="text-sm font-medium text-gray-900">
                  Data Export
                </h3>
                <p className="text-sm text-gray-500">
                  Download your data and activity history
                </p>
              </div>
            </div>
            <button className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              Export Data
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
