// src/components/common/RouteIndicator.tsx (Enhanced - Auto Fix Support)
import React, { useState, useEffect } from 'react';
import { useRouter } from '../../router/RouterContext';
import { useNavigation } from '../../hooks/useNavigation';
import { normalizeUrl, isCurrentRoute } from '../../router/utils';

const RouteIndicator: React.FC = () => {
  const { currentRoute, currentView } = useRouter();
  const { forceSync, fixUrl } = useNavigation();
  const [browserUrl, setBrowserUrl] = useState('');
  const [timestamp, setTimestamp] = useState('');
  const [autoFixAttempted, setAutoFixAttempted] = useState(false);

  // Update browser URL dan timestamp
  useEffect(() => {
    const updateInfo = () => {
      setBrowserUrl(window.location.href);
      setTimestamp(new Date().toLocaleTimeString());
    };

    // Update immediately
    updateInfo();

    // Listen for URL changes
    const handleChange = () => {
      updateInfo();
    };

    window.addEventListener('popstate', handleChange);
    
    // Also check for URL changes via polling (for programmatic changes)
    const interval = setInterval(updateInfo, 1000);
    
    return () => {
      window.removeEventListener('popstate', handleChange);
      clearInterval(interval);
    };
  }, [currentRoute, currentView]);

  // Check if there's a mismatch
  const actualPath = window.location.pathname;
  const normalizedPath = normalizeUrl(actualPath);
  const expectedRoute = currentRoute;
  const isMismatch = !isCurrentRoute(currentView, actualPath);

  // Auto-fix untuk common issues
  useEffect(() => {
    if (isMismatch && !autoFixAttempted) {
      setAutoFixAttempted(true);
      
      // Auto-fix /home ke /
      if (actualPath === '/home' && expectedRoute === '/') {
        console.log('Auto-fixing /home to /');
        window.history.replaceState(null, '', '/');
        setTimeout(() => {
          setAutoFixAttempted(false);
        }, 2000);
        return;
      }

      // Auto-sync untuk small mismatches
      if (Math.abs(actualPath.length - expectedRoute.length) <= 5) {
        console.log('Auto-syncing router state');
        setTimeout(() => {
          forceSync();
          setAutoFixAttempted(false);
        }, 500);
      } else {
        setTimeout(() => {
          setAutoFixAttempted(false);
        }, 2000);
      }
    }
  }, [isMismatch, actualPath, expectedRoute, autoFixAttempted, forceSync]);

  const handleFixUrl = () => {
    fixUrl();
  };

  const handleForceSync = () => {
    forceSync();
  };

  const handleReload = () => {
    window.location.reload();
  };

  const getStatusColor = () => {
    if (isMismatch) return 'red';
    if (autoFixAttempted) return 'yellow';
    return 'blue';
  };

  const statusColor = getStatusColor();

  return (
    <div className={`border-b px-4 py-2 text-xs font-mono ${
      statusColor === 'red' ? 'bg-red-50 border-red-200' :
      statusColor === 'yellow' ? 'bg-yellow-50 border-yellow-200' :
      'bg-blue-50 border-blue-200'
    }`}>
      <div className={`space-y-1 ${
        statusColor === 'red' ? 'text-red-800' :
        statusColor === 'yellow' ? 'text-yellow-800' :
        'text-blue-800'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span className="font-semibold">Router Debug:</span>
            <span className="text-gray-600">{timestamp}</span>
            {isMismatch && (
              <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs">
                MISMATCH DETECTED
              </span>
            )}
            {autoFixAttempted && (
              <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-xs">
                AUTO-FIXING...
              </span>
            )}
          </div>
          
          {/* Quick Actions */}
          <div className="flex items-center space-x-2">
            {isMismatch && (
              <>
                <button 
                  onClick={handleFixUrl}
                  className="px-2 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700"
                  title="Normalize URL"
                >
                  Fix URL
                </button>
                <button 
                  onClick={handleForceSync}
                  className="px-2 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700"
                  title="Sync router state"
                >
                  Sync
                </button>
                <button 
                  onClick={handleReload}
                  className="px-2 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700"
                  title="Reload page"
                >
                  Reload
                </button>
              </>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div>
            <span className="font-medium">Browser URL:</span>
            <div className={`bg-white px-2 py-1 rounded mt-1 ${
              isMismatch ? 'border border-red-300' : 'border border-blue-300'
            }`}>
              {browserUrl}
            </div>
            <div className="text-xs text-gray-600 mt-1">
              Path: <span className="font-mono">{actualPath}</span>
              {normalizedPath !== actualPath && (
                <span className="text-orange-600"> → {normalizedPath}</span>
              )}
            </div>
          </div>
          
          <div>
            <span className="font-medium">Router State:</span>
            <div className="bg-white px-2 py-1 rounded mt-1 border border-gray-300">
              View: <span className="font-semibold">{currentView}</span><br />
              Route: <span className="font-semibold">{currentRoute}</span>
            </div>
          </div>
          
          <div>
            <span className="font-medium">Status:</span>
            <div className="bg-white px-2 py-1 rounded mt-1 border border-gray-300">
              Match: <span className={`font-semibold ${
                isMismatch ? 'text-red-600' : 'text-green-600'
              }`}>
                {isMismatch ? '❌ No' : '✅ Yes'}
              </span><br />
              Auto-fix: <span className={`font-semibold ${
                autoFixAttempted ? 'text-yellow-600' : 'text-gray-600'
              }`}>
                {autoFixAttempted ? '🔄 Running' : '⏸️ Idle'}
              </span>
            </div>
          </div>
        </div>

        {isMismatch && (
          <div className="bg-red-100 border border-red-300 rounded p-2 mt-2">
            <div className="font-medium text-red-800 mb-1">Sync Issue Details:</div>
            <div className="text-red-700 text-xs space-y-1">
              <div>Expected: <span className="font-mono bg-white px-1 rounded">{expectedRoute}</span></div>
              <div>Actual: <span className="font-mono bg-white px-1 rounded">{actualPath}</span></div>
              {normalizedPath !== actualPath && (
                <div>Normalized: <span className="font-mono bg-white px-1 rounded">{normalizedPath}</span></div>
              )}
            </div>
            
            <div className="mt-2 text-xs text-red-600">
              <strong>Common fixes:</strong>
              <ul className="list-disc list-inside mt-1 space-y-1">
                <li>Use "Fix URL" to normalize the URL format</li>
                <li>Use "Sync" to update router state from URL</li>
                <li>Use "Reload" as last resort</li>
              </ul>
            </div>
          </div>
        )}

        {!isMismatch && (
          <div className="bg-green-100 border border-green-300 rounded p-2 mt-2">
            <div className="text-green-700 text-xs">
              ✅ Router is working correctly. URL and state are in sync.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RouteIndicator;