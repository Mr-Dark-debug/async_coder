import React from 'react'
import { Save } from 'lucide-react'

export function NotificationsTab() {
  return (
    <div className="max-w-3xl">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-6">
          Notification Preferences
        </h2>
        <div className="space-y-6">
          {/* Task Completion */}
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="task-completion"
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                defaultChecked
              />
            </div>
            <div className="ml-3 text-sm">
              <label
                htmlFor="task-completion"
                className="font-medium text-gray-700"
              >
                Task Completion notifications
              </label>
              <p className="text-gray-500">
                Receive notifications when your AI tasks are completed
              </p>
            </div>
          </div>
          {/* Email Notifications */}
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="email-notifications"
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                defaultChecked
              />
            </div>
            <div className="ml-3 text-sm">
              <label
                htmlFor="email-notifications"
                className="font-medium text-gray-700"
              >
                Email notifications
              </label>
              <p className="text-gray-500">
                Receive email updates about your account and important
                announcements
              </p>
            </div>
          </div>
          {/* Weekly Reports */}
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="weekly-reports"
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                defaultChecked
              />
            </div>
            <div className="ml-3 text-sm">
              <label
                htmlFor="weekly-reports"
                className="font-medium text-gray-700"
              >
                Weekly reports
              </label>
              <p className="text-gray-500">
                Receive a weekly summary of your usage and productivity metrics
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
              Save Preferences
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
