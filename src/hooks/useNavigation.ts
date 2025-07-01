// src/hooks/useNavigation.ts (Fixed - Root Path Support)
import { useRouter } from '../router/RouterContext';
import { ROUTES, normalizeUrl } from '../router/utils';
import { useRef } from 'react';

export const useNavigation = () => {
  const { navigate, currentView, currentRoute } = useRouter();
  const isNavigatingRef = useRef(false);

  // Safe navigation function
  const safeNavigate = (view: "landing" | "template-selection" | "editor") => {
    if (isNavigatingRef.current) return;
    
    isNavigatingRef.current = true;
    navigate(view);
    
    // Reset flag after navigation
    setTimeout(() => {
      isNavigatingRef.current = false;
    }, 100);
  };

  const navigateToHome = () => safeNavigate('landing');
  const navigateToTemplates = () => safeNavigate('template-selection');
  const navigateToCanvas = () => safeNavigate('editor');

  // Navigate by route path
  const navigateToRoute = (route: string) => {
    if (isNavigatingRef.current) return;
    
    const normalizedRoute = normalizeUrl(route);
    
    switch (normalizedRoute) {
      case '/':
      case '/home':
        navigateToHome();
        break;
      case '/templates':
        navigateToTemplates();
        break;
      case '/canvas':
        navigateToCanvas();
        break;
      default:
        console.warn(`Unknown route: ${normalizedRoute}, navigating to home`);
        navigateToHome();
    }
  };

  const goBack = () => {
    if (isNavigatingRef.current) return;
    
    // Use browser back if available and safe
    if (window.history.length > 1) {
      window.history.back();
    } else {
      // Fallback navigation logic
      if (currentView === 'editor') {
        navigateToTemplates();
      } else if (currentView === 'template-selection') {
        navigateToHome();
      } else {
        navigateToHome();
      }
    }
  };

  const refresh = () => {
    window.location.reload();
  };

  // Force sync - untuk debugging dengan normalization
  const forceSync = () => {
    const currentPath = normalizeUrl(window.location.pathname);
    let targetView: "landing" | "template-selection" | "editor" = "landing";
    
    switch (currentPath) {
      case '/':
      case '/home':
        targetView = 'landing';
        break;
      case '/templates':
        targetView = 'template-selection';
        break;
      case '/canvas':
        targetView = 'editor';
        break;
    }
    
    navigate(targetView);
  };

  // Fix URL - normalize ke format yang benar
  const fixUrl = () => {
    const currentPath = window.location.pathname;
    const normalizedPath = normalizeUrl(currentPath);
    
    if (currentPath !== normalizedPath) {
      window.history.replaceState(null, '', normalizedPath);
      window.location.reload();
    }
  };

  return {
    navigate: safeNavigate,
    navigateToHome,
    navigateToTemplates,
    navigateToCanvas,
    navigateToRoute,
    goBack,
    refresh,
    forceSync, // untuk debugging
    fixUrl,    // untuk fix URL normalization
    currentView,
    currentRoute,
    isHome: currentView === 'landing',
    isTemplates: currentView === 'template-selection',
    isCanvas: currentView === 'editor',
    // Route constants untuk external use - updated
    routes: {
      HOME: '/',              // ← Updated: gunakan root path
      TEMPLATES: '/templates',
      CANVAS: '/canvas'
    }
  };
};