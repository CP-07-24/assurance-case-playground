import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { DocumentationModalProps } from './types';
import { documentationData, navigationStructure } from './data';
import GuidanceNavigation from './DocumentationNavigation';
import DocumentationContent from './DocumentationContent';
import DocumentationFooter from './DocumentationFooter';

const DocumentationModal: React.FC<DocumentationModalProps> = ({ 
  isOpen, 
  onClose, 
  initialSection = 'introduction' 
}) => {
  const [activeSection, setActiveSection] = useState<string>(initialSection);
  const [expandedItems, setExpandedItems] = useState<string[]>(['getting-started']);

  useEffect(() => {
    if (isOpen && initialSection) {
      setActiveSection(initialSection);
    }
  }, [isOpen, initialSection]);

  if (!isOpen) return null;

  const currentContent = documentationData[activeSection];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-5/6 h-5/6 max-w-6xl max-h-[90vh] shadow-2xl overflow-hidden flex">
        {/* Sidebar Navigation */}
        <GuidanceNavigation
          navigationStructure={navigationStructure}
          activeSection={activeSection}
          expandedItems={expandedItems}
          onSectionChange={setActiveSection}
          onToggleExpanded={(itemId) => {
            setExpandedItems(prev => 
              prev.includes(itemId) 
                ? prev.filter(id => id !== itemId)
                : [...prev, itemId]
            );
          }}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h1 className="text-xl font-semibold text-gray-800">
              {currentContent?.title}
            </h1>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {/* Content */}
          <DocumentationContent content={currentContent?.content || ''} />

          {/* Footer */}
          <DocumentationFooter />
        </div>
      </div>
    </div>
  );
};

export default DocumentationModal;