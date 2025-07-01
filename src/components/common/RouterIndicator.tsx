// src/components/common/RouteIndicator.tsx
import React, { useState, useEffect } from 'react';
import { useRouter } from '../../router/RouterContext';

const RouteIndicator: React.FC = () => {
  const { currentRoute, currentView } = useRouter();
  const [realUrl, setRealUrl] = useState(window.location.pathname);

  // Update real URL when it changes
  useEffect(() => {
    const updateUrl = () => {
      setRealUrl(window.location.pathname);
    };

    window.addEventListener('popstate', updateUrl);
    
    // Update when route changes
    updateUrl();
    
    return () => {
      window.removeEventListener('popstate', updateUrl);
    };
  }, [currentRoute]);

  return (
    <div className="bg-blue-50 border-b border-blue-200 px-4 py-2">
      <div className="text-sm text-blue-800 flex items-center space-x-4">
        <span>
          URL: <span className="font-mono bg-blue-100 px-2 py-1 rounded">
            {window.location.origin}{realUrl}
          </span>
        </span>
        <span className="text-blue-600">
          View: <span className="font-semibold">{currentView}</span>
        </span>
        <span className="text-blue-600">
          Route: <span className="font-mono">{currentRoute}</span>
        </span>
      </div>
    </div>
  );
};

export default RouteIndicator;