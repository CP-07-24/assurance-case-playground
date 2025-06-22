export interface GuidanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialSection?: string;
}

import { LucideIcon } from 'lucide-react';

export interface GuidanceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface NavigationItem {
  id: string;
  label: string;
  icon: LucideIcon;
  children?: NavigationItem[];
}

export interface GuidanceContent {
  title: string;
  content: string;
}

export interface GuidanceNavigationProps {
  navigationStructure: NavigationItem[];
  activeSection: string;
  expandedItems: string[];
  onSectionChange: (sectionId: string) => void;
  onToggleExpanded: (itemId: string) => void;
}

export interface GuidanceContentProps {
  content: string;
}

export interface GuidanceFooterProps {
  onNext?: () => void;
  onPrevious?: () => void;
  showNavigation?: boolean;
}