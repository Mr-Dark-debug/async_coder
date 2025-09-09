```AppRouter.tsx
import React from "react";
  import { BrowserRouter, Routes, Route } from "react-router-dom";
  import { App } from "./App";

  export function AppRouter() {
    return (
      <BrowserRouter>
          <Routes>
            <Route path="/" element={<App />} />
          </Routes>
      </BrowserRouter>
    );
  }
```
```tailwind.config.js
module.exports = {
  darkMode: "selector",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "caret-blink": {
          "0%,70%,100%": { opacity: "1" },
          "20%,50%": { opacity: "0" },
        },
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "caret-blink": "caret-blink 1.25s ease-out infinite",
      },
    },
  },
}
```
```index.css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 47.4% 11.2%;

    --muted: 210 40% 96.1%;
    --muted-foreground: 215.4 16.3% 46.9%;

    --popover: 0 0% 100%;
    --popover-foreground: 222.2 47.4% 11.2%;

    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;

    --card: 0 0% 100%;
    --card-foreground: 222.2 47.4% 11.2%;

    --primary: 222.2 47.4% 11.2%;
    --primary-foreground: 210 40% 98%;

    --secondary: 210 40% 96.1%;
    --secondary-foreground: 222.2 47.4% 11.2%;

    --accent: 210 40% 96.1%;
    --accent-foreground: 222.2 47.4% 11.2%;

    --destructive: 0 100% 50%;
    --destructive-foreground: 210 40% 98%;

    --ring: 215 20.2% 65.1%;

    --radius: 0.5rem;
  }

  :root[class~="dark"] {
    --background: 224 71% 4%;
    --foreground: 213 31% 91%;

    --muted: 223 47% 11%;
    --muted-foreground: 215.4 16.3% 56.9%;

    --accent: 216 34% 17%;
    --accent-foreground: 210 40% 98%;

    --popover: 224 71% 4%;
    --popover-foreground: 215 20.2% 65.1%;

    --border: 216 34% 17%;
    --input: 216 34% 17%;

    --card: 224 71% 4%;
    --card-foreground: 213 31% 91%;

    --primary: 210 40% 98%;
    --primary-foreground: 222.2 47.4% 1.2%;

    --secondary: 222.2 47.4% 11.2%;
    --secondary-foreground: 210 40% 98%;

    --destructive: 0 63% 31%;
    --destructive-foreground: 210 40% 98%;

    --ring: 216 34% 17%;

    --radius: 0.5rem;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
    font-feature-settings: "rlig" 1, "calt" 1;
  }
}
```
```pages/SettingsPage.tsx
import React, { useState } from 'react'
import {
  Settings,
  Key,
  User,
  Bell,
  Shield,
  Palette,
  ChevronRight,
  Home,
} from 'lucide-react'
import { GeneralTab } from '../components/settings/tabs/GeneralTab'
import { APIKeysTab } from '../components/settings/tabs/APIKeysTab'
import { ProfileTab } from '../components/settings/tabs/ProfileTab'
import { NotificationsTab } from '../components/settings/tabs/NotificationsTab'
import { SecurityTab } from '../components/settings/tabs/SecurityTab'
import { AppearanceTab } from '../components/settings/tabs/AppearanceTab'
const tabs = [
  {
    id: 'general',
    label: 'General',
    icon: Settings,
  },
  {
    id: 'api-keys',
    label: 'API Keys',
    icon: Key,
  },
  {
    id: 'profile',
    label: 'Profile',
    icon: User,
  },
  {
    id: 'notifications',
    label: 'Notifications',
    icon: Bell,
  },
  {
    id: 'security',
    label: 'Security',
    icon: Shield,
  },
  {
    id: 'appearance',
    label: 'Appearance',
    icon: Palette,
  },
]
export function SettingsPage() {
  const [activeTab, setActiveTab] = useState('api-keys')
  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return <GeneralTab />
      case 'api-keys':
        return <APIKeysTab />
      case 'profile':
        return <ProfileTab />
      case 'notifications':
        return <NotificationsTab />
      case 'security':
        return <SecurityTab />
      case 'appearance':
        return <AppearanceTab />
      default:
        return <GeneralTab />
    }
  }
  return (
    <div className="w-full min-h-screen bg-gray-50 pb-16">
      {/* Header */}
      <header className="w-full bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-6">
          {/* Breadcrumb */}
          <div className="flex items-center text-sm text-gray-500 mb-4">
            <a href="#" className="hover:text-blue-600 flex items-center">
              <Home size={14} className="mr-1" />
              Dashboard
            </a>
            <ChevronRight size={14} className="mx-2" />
            <span className="text-gray-900">Settings</span>
          </div>
          {/* Page Title */}
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-500 mt-1">
            Manage your account settings and preferences
          </p>
        </div>
      </header>
      {/* Main Content */}
      <main className="container mx-auto px-4 mt-8">
        {/* Tab Navigation */}
        <div className="border-b border-gray-200">
          <nav className="flex flex-wrap -mb-px">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`mr-8 py-4 px-1 flex items-center text-sm font-medium whitespace-nowrap ${activeTab === tab.id ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                >
                  <Icon size={18} className="mr-2" />
                  {tab.label}
                </button>
              )
            })}
          </nav>
        </div>
        {/* Tab Content */}
        <div className="mt-8">{renderTabContent()}</div>
      </main>
    </div>
  )
}

```
```components/settings/tabs/GeneralTab.tsx
import React from 'react'
import { Save } from 'lucide-react'
export function GeneralTab() {
  return (
    <div className="max-w-3xl">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-6">
          General Settings
        </h2>
        <div className="space-y-6">
          {/* Default AI Backend */}
          <div>
            <label
              htmlFor="ai-backend"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Default AI Backend
            </label>
            <select
              id="ai-backend"
              className="w-full rounded-md border border-gray-300 py-2 px-3 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option>Claude Code</option>
              <option>Gemini CLI</option>
              <option>Aider</option>
              <option>Async In-House AI</option>
            </select>
          </div>
          {/* Daily Task Limit */}
          <div>
            <label
              htmlFor="task-limit"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Daily Task Limit
            </label>
            <div className="flex items-center">
              <input
                type="number"
                id="task-limit"
                defaultValue={50}
                min={1}
                max={1000}
                className="rounded-md border border-gray-300 py-2 px-3 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-500">tasks per day</span>
            </div>
          </div>
          {/* Usage Analytics */}
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="analytics"
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                defaultChecked
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="analytics" className="font-medium text-gray-700">
                Enable usage analytics
              </label>
              <p className="text-gray-500">
                Help us improve Async Coder by sharing anonymous usage data
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
              Save Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

```
```components/settings/tabs/APIKeysTab.tsx
import React from 'react'
import { Key, ExternalLink } from 'lucide-react'
const providers = [
  {
    name: 'OpenAI',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg',
    category: 'AI Models',
    description: 'Access GPT-4, GPT-3.5 and other OpenAI models',
    configured: true,
  },
  {
    name: 'Anthropic',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/2/25/Anthropic_logo.svg',
    category: 'AI Models',
    description: 'Access Claude and other Anthropic models',
    configured: true,
  },
  {
    name: 'Google AI',
    logo: 'https://www.gstatic.com/lamda/images/gemini_logo_96.png',
    category: 'AI Models',
    description: 'Access Gemini and other Google AI models',
    configured: false,
  },
  {
    name: 'Groq',
    logo: 'https://groq.com/wp-content/themes/groq/assets/images/logo-light.svg',
    category: 'AI Models',
    description: 'Access LLM models with ultra-fast inference',
    configured: false,
  },
  {
    name: 'Tavily',
    logo: 'https://tavily.com/images/tavily.svg',
    category: 'Search APIs',
    description: 'AI-native search engine for developers',
    configured: true,
  },
  {
    name: 'GitHub',
    logo: 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png',
    category: 'Development Tools',
    description: 'Access GitHub repositories and APIs',
    configured: true,
  },
]
export function APIKeysTab() {
  const configuredCount = providers.filter((p) => p.configured).length
  return (
    <div>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-lg font-medium text-gray-900 flex items-center">
              <Key className="mr-2 text-blue-600" size={20} />
              API Key Management
            </h2>
            <p className="text-gray-500 mt-1">
              Securely manage your API keys for various services and providers
            </p>
          </div>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {configuredCount} keys configured
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {providers.map((provider) => (
            <div
              key={provider.name}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center">
                  <img
                    src={provider.logo}
                    alt={`${provider.name} logo`}
                    className="h-8 w-8 mr-3 object-contain"
                  />
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {provider.name}
                    </h3>
                    <span className="inline-block px-2 py-0.5 mt-1 text-xs rounded-full bg-gray-100 text-gray-700">
                      {provider.category}
                    </span>
                  </div>
                </div>
                <div
                  className="h-2 w-2 rounded-full bg-green-500"
                  style={{
                    display: provider.configured ? 'block' : 'none',
                  }}
                ></div>
              </div>
              <p className="text-sm text-gray-500 mb-4">
                {provider.description}
              </p>
              <button
                className={`w-full px-3 py-1.5 text-sm rounded-md ${provider.configured ? 'border border-gray-300 text-gray-700 hover:bg-gray-50' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
              >
                {provider.configured ? 'Manage Key' : 'Add Key'}
              </button>
            </div>
          ))}
        </div>
        <div className="mt-8 text-center">
          <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            Open Key Management
            <ExternalLink size={16} className="ml-2" />
          </button>
        </div>
      </div>
    </div>
  )
}

```
```components/settings/tabs/ProfileTab.tsx
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

```
```components/settings/tabs/NotificationsTab.tsx
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

```
```components/settings/tabs/SecurityTab.tsx
import React from 'react'
import { Shield, Users, Download } from 'lucide-react'
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
            <div className="flex items-start">
              <Shield className="h-6 w-6 text-gray-400 mr-3" />
              <div>
                <h3 className="text-sm font-medium text-gray-900">
                  Two-Factor Authentication
                </h3>
                <p className="text-sm text-gray-500">
                  Add an extra layer of security to your account
                </p>
              </div>
            </div>
            <button
              type="button"
              className="ml-4 inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Configure
            </button>
          </div>
          {/* Session Management */}
          <div className="flex items-center justify-between py-4 border-b border-gray-200">
            <div className="flex items-start">
              <Users className="h-6 w-6 text-gray-400 mr-3" />
              <div>
                <h3 className="text-sm font-medium text-gray-900">
                  Session Management
                </h3>
                <p className="text-sm text-gray-500">
                  Manage active sessions and sign out from other devices
                </p>
              </div>
            </div>
            <button
              type="button"
              className="ml-4 inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Manage Sessions
            </button>
          </div>
          {/* Data Export */}
          <div className="flex items-center justify-between py-4">
            <div className="flex items-start">
              <Download className="h-6 w-6 text-gray-400 mr-3" />
              <div>
                <h3 className="text-sm font-medium text-gray-900">
                  Data Export
                </h3>
                <p className="text-sm text-gray-500">
                  Download a copy of your personal data
                </p>
              </div>
            </div>
            <button
              type="button"
              className="ml-4 inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Export Data
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

```
```components/settings/tabs/AppearanceTab.tsx
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
              <option>System</option>
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
              <option selected>Medium</option>
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
                Compact Mode
              </label>
              <p className="text-gray-500">
                Reduce spacing and padding for a more dense interface
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

```