import React from 'react'
import { Save } from 'lucide-react'

export function ProfileTab() {
  return (
    <div className="max-w-3xl">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-6">
          Profile Settings
        </h2>
        <div className="space-y-6">
          {/* Display Name */}
          <div>
            <label
              htmlFor="display-name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Display Name
            </label>
            <input
              type="text"
              id="display-name"
              defaultValue="John Developer"
              className="w-full rounded-md border border-gray-300 py-2 px-3 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              defaultValue="john.developer@example.com"
              className="w-full rounded-md border border-gray-300 py-2 px-3 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          {/* Timezone */}
          <div>
            <label
              htmlFor="timezone"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Timezone
            </label>
            <select
              id="timezone"
              className="w-full rounded-md border border-gray-300 py-2 px-3 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option>(UTC-08:00) Pacific Time</option>
              <option>(UTC-05:00) Eastern Time</option>
              <option>(UTC+00:00) UTC</option>
              <option>(UTC+01:00) Central European Time</option>
              <option>(UTC+05:30) Indian Standard Time</option>
              <option>(UTC+08:00) China Standard Time</option>
              <option>(UTC+09:00) Japan Standard Time</option>
            </select>
          </div>
          {/* Save Button */}
          <div className="pt-2">
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Save size={16} className="mr-2" />
              Save Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
