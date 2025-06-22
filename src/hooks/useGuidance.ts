import { useState, useCallback } from 'react';

interface UseGuidanceReturn {
  isOpen: boolean;
  activeSection: string;
  openGuidance: (section?: string) => void;
  closeGuidance: () => void;
  goToSection: (sectionId: string) => void;
}

export const useGuidance = (initialSection: string = 'introduction'): UseGuidanceReturn => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState(initialSection);

  const openGuidance = useCallback((section?: string) => {
    setIsOpen(true);
    if (section) {
      setActiveSection(section);
    }
  }, []);

  const closeGuidance = useCallback(() => {
    setIsOpen(false);
  }, []);

  const goToSection = useCallback((sectionId: string) => {
    setActiveSection(sectionId);
  }, []);

  return {
    isOpen,
    activeSection,
    openGuidance,
    closeGuidance,
    goToSection
  };
};