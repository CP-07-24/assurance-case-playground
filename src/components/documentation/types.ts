export interface DocumentationModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialSection?: string;
}

import { LucideIcon } from 'lucide-react';

export interface DocumentationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface NavigationItem {
  id: string;
  label: string;
  icon: LucideIcon;
  children?: NavigationItem[];
}

export interface DocumentationContent {
  title: string;
  content: string;
}

export interface DocumentationNavigationProps {
  navigationStructure: NavigationItem[];
  activeSection: string;
  expandedItems: string[];
  onSectionChange: (sectionId: string) => void;
  onToggleExpanded: (itemId: string) => void;
}

export interface DocumentationContentProps {
  content: string;
}

export interface DocumentationFooterProps {
  onNext?: () => void;
  onPrevious?: () => void;
  showNavigation?: boolean;
}