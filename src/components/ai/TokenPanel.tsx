import React, { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';
import { validateApiKey, setApiKey } from '../../services/aiService';
import { useAuth } from '../../context/AuthContext';

interface TokenPanelProps {
  onSuccess: () => void;
}

const TokenPanel: React.FC<TokenPanelProps> = ({ onSuccess }) => {
  const { apikey } = useAuth();
  const [token, setToken] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showToken, setShowToken] = useState(false);

  useEffect(() => {
    // Check for stored token on mount
    const storedToken = localStorage.getItem('aiToken');
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  const handleGetTokenClick = () => {
    window.open('https://api.chatanywhere.org/v1/oauth/free/render', '_blank');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    apikey(token);
    if (!token.trim()) {
      setError('Please enter a valid token');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const isValid = await validateApiKey(token);
      if (isValid) {
        setApiKey(token);
        if (typeof onSuccess === 'function') { // Add this check
          onSuccess();
        }
      } else {
        setError('Invalid token. Please check and try again.');
      }
    } catch (err) {
      setError('Failed to validate token. Please check your connection.');
      console.error('Token validation error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 flex flex-col items-center justify-center h-full">
      <div className="bg-blue-50 rounded-full p-3 mb-4">
        <Sparkles size={24} className="text-blue-500" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">AI Diagram Assistant</h3>
      <p className="text-sm text-gray-500 text-center mb-6">
        Use AI to generate diagrams, analyze existing diagrams, or get suggestions for improvements.
      </p>

      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
        <div>
          <div className="flex justify-between items-center mb-1">
            <label htmlFor="token" className="block text-sm font-medium text-gray-700">
              API Token
            </label>
            <button
              type="button"
              onClick={() => setShowToken(!showToken)}
              className="text-xs text-blue-600 hover:text-blue-800"
            >
              {showToken ? 'Hide' : 'Show'}
            </button>
          </div>
          <input
            type={showToken ? "text" : "password"}
            id="token"
            value={token}
            onChange={(e) => {
              setToken(e.target.value);
              setError('');
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter your API token"
            required
          />
          {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>

        <div className="flex space-x-3">
          <button
            type="button"
            onClick={handleGetTokenClick}
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-md text-sm font-medium transition-colors"
          >
            Get Token
          </button>
          <button
            type="submit"
            disabled={isLoading || !token.trim()}
            className={`flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors ${isLoading || !token.trim() ? 'opacity-50 cursor-not-allowed' : ''
              }`}
          >
            {isLoading ? (
              <span className="inline-flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Verifying...
              </span>
            ) : (
              'Submit'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TokenPanel;
