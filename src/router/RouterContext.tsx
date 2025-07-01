// src/router/RouterContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { RouterContextType, ViewType } from '../types/router';
import { getRouteFromView, getViewFromRoute } from './utils';

const RouterContext = createContext<RouterContextType | undefined>(undefined);

interface RouterProviderProps {
  children: ReactNode;
}

export const RouterProvider: React.FC<RouterProviderProps> = ({ children }) => {
  const [currentView, setCurrentView] = useState<ViewType>(() => {
    // Initialize from current URL
    const currentPath = window.location.pathname;
    return getViewFromRoute(currentPath);
  });

  // Navigate function that updates both state and URL
  const navigate = (view: ViewType) => {
    const route = getRouteFromView(view);
    
    // Update browser URL without page reload
    if (window.location.pathname !== route) {
      window.history.pushState({ view }, '', route);
    }
    
    // Update state
    setCurrentView(view);
  };

  // Listen for browser back/forward button and manual URL changes
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      const currentPath = window.location.pathname;
      const viewFromPath = getViewFromRoute(currentPath);
      
      // Only update if different to prevent infinite loops
      if (viewFromPath !== currentView) {
        setCurrentView(viewFromPath);
      }
    };

    // Handle initial page load and refresh
    const handleLoad = () => {
      const currentPath = window.location.pathname;
      const viewFromPath = getViewFromRoute(currentPath);
      
      if (viewFromPath !== currentView) {
        setCurrentView(viewFromPath);
      }
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('load', handleLoad);
    
    // Set initial route if not already set
    const currentRoute = getRouteFromView(currentView);
    if (window.location.pathname === '/' && currentRoute !== '/') {
      window.history.replaceState({ view: currentView }, '', currentRoute);
    }
    
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('load', handleLoad);
    };
  }, [currentView]);

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