import React from 'react'
import { Key, ExternalLink } from 'lucide-react'
import { useRouter } from 'next/navigation'

const providers = [
  {
    name: 'OpenAI',
    logo: '🤖',
    category: 'AI Models',
    description: 'Access GPT-4, GPT-3.5 and other OpenAI models',
    configured: true,
  },
  {
    name: 'Anthropic',
    logo: '🧠',
    category: 'AI Models',
    description: 'Access Claude and other Anthropic models',
    configured: true,
  },
  {
    name: 'Google AI',
    logo: '🔍',
    category: 'AI Models',
    description: 'Access Gemini and other Google AI models',
    configured: false,
  },
  {
    name: 'Groq',
    logo: '⚡',
    category: 'AI Models',
    description: 'Access LLM models with ultra-fast inference',
    configured: false,
  },
  {
    name: 'Tavily',
    logo: '🔎',
    category: 'Search APIs',
    description: 'AI-native search engine for developers',
    configured: true,
  },
  {
    name: 'GitHub',
    logo: '🐙',
    category: 'Development Tools',
    description: 'Access GitHub repositories and APIs',
    configured: true,
  },
]

export function APIKeysTab() {
  const router = useRouter()
  const configuredCount = providers.filter((p) => p.configured).length

  const handleOpenKeyManagement = () => {
    router.push('/task/settings/keys')
  }

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
                  <div className="h-8 w-8 mr-3 flex items-center justify-center text-lg">
                    {provider.logo}
                  </div>
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
                className={`w-full px-3 py-1.5 text-sm rounded-md ${
                  provider.configured
                    ? 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
                onClick={handleOpenKeyManagement}
              >
                {provider.configured ? 'Manage Key' : 'Add Key'}
              </button>
            </div>
          ))}
        </div>
        <div className="mt-8 text-center">
          <button 
            onClick={handleOpenKeyManagement}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Open Key Management
            <ExternalLink size={16} className="ml-2" />
          </button>
        </div>
      </div>
    </div>
  )
}
