// src/hooks/useNavigation.ts
import { useRouter } from '../router/RouterContext';
import { ROUTES } from '../router/utils';

export const useNavigation = () => {
  const { navigate, currentView, currentRoute } = useRouter();

  const navigateToHome = () => navigate('landing');
  const navigateToTemplates = () => navigate('template-selection');
  const navigateToCanvas = () => navigate('editor');

  // Navigate by route path
  const navigateToRoute = (route: string) => {
    switch (route) {
      case ROUTES.HOME:
      case '/':
        navigate('landing');
        break;
      case ROUTES.TEMPLATES:
        navigate('template-selection');
        break;
      case ROUTES.CANVAS:
        navigate('editor');
        break;
      default:
        navigate('landing');
    }
  };

  const goBack = () => {
    if (currentView === 'editor') {
      navigate('template-selection');
    } else if (currentView === 'template-selection') {
      navigate('landing');
    }
  };

  const refresh = () => {
    window.location.reload();
  };

  return {
    navigate,
    navigateToHome,
    navigateToTemplates,
    navigateToCanvas,
    navigateToRoute,
    goBack,
    refresh,
    currentView,
    currentRoute,
    isHome: currentView === 'landing',
    isTemplates: currentView === 'template-selection',
    isCanvas: currentView === 'editor',
    // Route constants for external use
    routes: ROUTES
  };
};