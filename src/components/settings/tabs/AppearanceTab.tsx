import React from 'react'
import { Save } from 'lucide-react'

export function AppearanceTab() {
  return (
    <div className="max-w-3xl">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-6">
          Appearance Settings
        </h2>
        <div className="space-y-6">
          {/* Theme */}
          <div>
            <label
              htmlFor="theme"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Theme
            </label>
            <select
              id="theme"
              className="w-full rounded-md border border-gray-300 py-2 px-3 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option>System (Auto)</option>
              <option>Light</option>
              <option>Dark</option>
            </select>
          </div>
          {/* Font Size */}
          <div>
            <label
              htmlFor="font-size"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Font Size
            </label>
            <select
              id="font-size"
              className="w-full rounded-md border border-gray-300 py-2 px-3 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option>Small</option>
              <option>Medium (Default)</option>
              <option>Large</option>
            </select>
          </div>
          {/* Compact Mode */}
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="compact-mode"
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
            </div>
            <div className="ml-3 text-sm">
              <label
                htmlFor="compact-mode"
                className="font-medium text-gray-700"
              >
                Compact mode
              </label>
              <p className="text-gray-500">
                Use a more compact interface layout to fit more content on screen
              </p>
            </div>
          </div>
          {/* High Contrast */}
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="high-contrast"
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
            </div>
            <div className="ml-3 text-sm">
              <label
                htmlFor="high-contrast"
                className="font-medium text-gray-700"
              >
                High contrast
              </label>
              <p className="text-gray-500">
                Increase contrast for better accessibility and readability
              </p>
            </div>
          </div>
          {/* Save Button */}
          <div className="pt-2">
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Save size={16} className="mr-2" />
              Save Appearance
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
