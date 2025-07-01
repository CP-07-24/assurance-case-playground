// src/router/utils.ts (Fixed - Handle Root Path Properly)
import { ViewType } from '../types/router';

export const ROUTES = {
  HOME: '/',              // ← UBAH: Gunakan root path sebagai home
  TEMPLATES: '/templates',  
  CANVAS: '/canvas'
} as const;

export const getRouteFromView = (view: ViewType): string => {
  switch (view) {
    case 'landing':
      return ROUTES.HOME;    // ← Sekarang return '/' bukan '/home'
    case 'template-selection':
      return ROUTES.TEMPLATES;
    case 'editor':
      return ROUTES.CANVAS;
    default:
      console.warn(`Unknown view: ${view}, defaulting to home`);
      return ROUTES.HOME;
  }
};

export const getViewFromRoute = (path: string): ViewType => {
  // Normalize path - remove trailing slash and query params
  const normalizedPath = path.split('?')[0].replace(/\/+$/, '') || '/';
  
  switch (normalizedPath) {
    case '/':               // ← Root path
    case '/home':          // ← Legacy support untuk /home
      return 'landing';
    case '/templates':
      return 'template-selection';
    case '/canvas':
      return 'editor';
    default:
      console.warn(`Unknown route: ${normalizedPath}, defaulting to landing`);
      return 'landing';
  }
};

// Helper function to check if current route matches view
export const isCurrentRoute = (view: ViewType, currentPath: string): boolean => {
  const expectedRoute = getRouteFromView(view);
  const normalizedPath = currentPath.split('?')[0].replace(/\/+$/, '') || '/';
  
  // Special handling untuk home route
  if (view === 'landing') {
    return normalizedPath === '/' || normalizedPath === '/home';
  }
  
  return expectedRoute === normalizedPath;
};

// Helper to get initial view safely
export const getInitialView = (): ViewType => {
  if (typeof window === 'undefined') return 'landing';
  
  try {
    const currentPath = window.location.pathname;
    return getViewFromRoute(currentPath);
  } catch (error) {
    console.error('Error getting initial view:', error);
    return 'landing';
  }
};

// Helper to normalize URL untuk konsistensi
export const normalizeUrl = (path: string): string => {
  const normalized = path.split('?')[0].replace(/\/+$/, '') || '/';
  
  // Convert /home ke / untuk konsistensi
  if (normalized === '/home') {
    return '/';
  }
  
  return normalized;
};