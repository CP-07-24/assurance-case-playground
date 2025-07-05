// src/components/common/RouterLink.tsx
import React, { ReactNode } from 'react';
import { useNavigation } from '../../hooks/useNavigation';

interface RouterLinkProps {
  to: 'home' | 'templates' | 'canvas';
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

const RouterLink: React.FC<RouterLinkProps> = ({ 
  to, 
  children, 
  className = '', 
  onClick 
}) => {
  const { navigateToHome, navigateToTemplates, navigateToCanvas, routes } = useNavigation();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    
    // Call custom onClick first
    if (onClick) {
      onClick();
    }
    
    // Navigate based on 'to' prop
    switch (to) {
      case 'home':
        navigateToHome();
        break;
      case 'templates':
        navigateToTemplates();
        break;
      case 'canvas':
        navigateToCanvas();
        break;
    }
  };

  // Get href for proper link behavior
  const getHref = () => {
    switch (to) {
      case 'home':
        return routes.HOME;
      case 'templates':
        return routes.TEMPLATES;
      case 'canvas':
        return routes.CANVAS;
      default:
        return routes.HOME;
    }
  };

  return (
    <a 
      href={getHref()}
      onClick={handleClick}
      className={className}
    >
      {children}
    </a>
  );
};

export default RouterLink;