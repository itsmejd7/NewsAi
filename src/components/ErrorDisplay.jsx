import React from 'react';

const ErrorDisplay = ({ error, onRetry }) => {
  const isApiKeyError = error?.includes('API key is missing') || error?.includes('Invalid API key');
  
  return (
    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center">
      <div className="text-red-600 dark:text-red-400 mb-4">
        <svg className="w-12 h-12 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
        <h3 className="text-lg font-semibold mb-2">API Error</h3>
        <p className="text-sm">{error}</p>
      </div>
      
      {isApiKeyError && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-4 text-left">
          <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">How to fix:</h4>
          <ol className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1 list-decimal list-inside">
            <li>Create a <code className="bg-yellow-100 dark:bg-yellow-800 px-1 rounded">.env</code> file in your project root</li>
            <li>Add your API keys:</li>
          </ol>
          <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded mt-2 font-mono text-xs">
            <div>VITE_NEWSAPI_KEY=your_news_api_key_here</div>
            <div>VITE_OPENAI_API_KEY=your_openai_api_key_here</div>
          </div>
          <div className="mt-3 text-sm">
            <p className="mb-2">Get your API keys from:</p>
            <div className="space-y-1">
              <a href="https://newsapi.org/" target="_blank" rel="noopener noreferrer" 
                 className="text-blue-600 dark:text-blue-400 hover:underline block">
                → News API (free tier available)
              </a>
              <a href="https://platform.openai.com/" target="_blank" rel="noopener noreferrer" 
                 className="text-blue-600 dark:text-blue-400 hover:underline block">
                → OpenAI Platform
              </a>
            </div>
          </div>
          <div className="mt-3">
            <button 
              onClick={() => window.open('https://newsapi.org/', '_blank')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm mr-2"
            >
              Get News API Key
            </button>
            <button 
              onClick={() => window.open('https://platform.openai.com/', '_blank')}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm"
            >
              Get OpenAI Key
            </button>
          </div>
        </div>
      )}
      
      {onRetry && (
        <button
          onClick={onRetry}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
        >
          Try Again
        </button>
      )}
    </div>
  );
};

export default ErrorDisplay;

