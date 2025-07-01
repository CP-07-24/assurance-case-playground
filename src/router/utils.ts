// src/router/utils.ts
import { ViewType } from '../types/router';

export const ROUTES = {
  HOME: '/home',
  TEMPLATES: '/templates',  
  CANVAS: '/canvas'
} as const;

export const getRouteFromView = (view: ViewType): string => {
  switch (view) {
    case 'landing':
      return ROUTES.HOME;
    case 'template-selection':
      return ROUTES.TEMPLATES;
    case 'editor':
      return ROUTES.CANVAS;
    default:
      return ROUTES.HOME;
  }
};

export const getViewFromRoute = (path: string): ViewType => {
  switch (path) {
    case ROUTES.HOME:
    case '/':
      return 'landing';
    case ROUTES.TEMPLATES:
      return 'template-selection';
    case ROUTES.CANVAS:
      return 'editor';
    default:
      return 'landing';
  }
};

export const navigateToRoute = (route: string) => {
  window.history.pushState(null, '', route);
  
  // Dispatch custom event untuk memberitahu router
  window.dispatchEvent(new PopStateEvent('popstate'));
};