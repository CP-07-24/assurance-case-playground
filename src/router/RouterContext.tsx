// src/router/RouterContext.tsx (Fixed - Handle Root Path)
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { RouterContextType, ViewType } from '../types/router';
import { getRouteFromView, getViewFromRoute, normalizeUrl } from './utils';

const RouterContext = createContext<RouterContextType | undefined>(undefined);

interface RouterProviderProps {
  children: ReactNode;
}

export const RouterProvider: React.FC<RouterProviderProps> = ({ children }) => {
  // Initialize state from current URL on mount
  const [currentView, setCurrentView] = useState<ViewType>(() => {
    // Safe initialization - check if window exists (SSR compatibility)
    if (typeof window === 'undefined') return 'landing';
    
    const currentPath = normalizeUrl(window.location.pathname);
    return getViewFromRoute(currentPath);
  });

  const [isInitialized, setIsInitialized] = useState(false);

  // Navigate function that updates both state and URL
  const navigate = (view: ViewType) => {
    const route = getRouteFromView(view);
    
    // Prevent navigation during initialization
    if (!isInitialized) return;
    
    // Normalize current URL untuk comparison
    const currentPath = normalizeUrl(window.location.pathname);
    
    // Update browser URL hanya jika different
    if (currentPath !== route) {
      window.history.pushState({ view, route }, '', route);
    }
    
    // Update state hanya jika different
    if (currentView !== view) {
      setCurrentView(view);
    }
  };

  // Initialize route on mount
  useEffect(() => {
    const currentPath = normalizeUrl(window.location.pathname);
    const viewFromPath = getViewFromRoute(currentPath);
    const expectedRoute = getRouteFromView(viewFromPath);
    
    // Set initial state from URL
    if (currentView !== viewFromPath) {
      setCurrentView(viewFromPath);
    }
    
    // Replace current history entry with proper normalized state
    // Jika user mengakses /home, redirect ke /
    if (currentPath !== expectedRoute) {
      window.history.replaceState(
        { view: viewFromPath, route: expectedRoute }, 
        '', 
        expectedRoute
      );
    } else {
      // Set proper state untuk current URL
      window.history.replaceState(
        { view: viewFromPath, route: currentPath }, 
        '', 
        currentPath
      );
    }
    
    setIsInitialized(true);
  }, []);

  // Listen for browser back/forward button
  useEffect(() => {
    if (!isInitialized) return;
    
    const handlePopState = (event: PopStateEvent) => {
      const currentPath = normalizeUrl(window.location.pathname);
      const viewFromPath = getViewFromRoute(currentPath);
      
      // Only update if view is different to prevent loops
      if (viewFromPath !== currentView) {
        setCurrentView(viewFromPath);
      }
    };

    window.addEventListener('popstate', handlePopState);
    
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [currentView, isInitialized]);

  const value: RouterContextType = {
    currentView,
    navigate,
    currentRoute: getRouteFromView(currentView)
  };

  return (
    <RouterContext.Provider value={value}>
      {children}
    </RouterContext.Provider>
  );
};

export const useRouter = (): RouterContextType => {
  const context = useContext(RouterContext);
  if (!context) {
    throw new Error('useRouter must be used within a RouterProvider');
  }
  return context;
};