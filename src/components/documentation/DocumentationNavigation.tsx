import React from 'react';
import { ChevronRight, ChevronDown } from 'lucide-react';
import { DocumentationNavigationProps, NavigationItem } from './types';

const DocumentationNavigation: React.FC<DocumentationNavigationProps> = ({
  navigationStructure,
  activeSection,
  expandedItems,
  onSectionChange,
  onToggleExpanded
}) => {
  const handleItemClick = (itemId: string, hasChildren: boolean) => {
    if (hasChildren) {
      onToggleExpanded(itemId);
    } else {
      onSectionChange(itemId);
    }
  };

  const renderNavigationItem = (item: NavigationItem, isChild: boolean = false) => {
    const Icon = item.icon;
    const isExpanded = expandedItems.includes(item.id);
    const isActive = activeSection === item.id;
    const hasChildren = item.children && item.children.length > 0;

    return (
      <div key={item.id}>
        <div
          className={`flex items-center p-2 cursor-pointer rounded-md transition-colors ${
            isActive 
              ? 'bg-blue-100 text-blue-700' 
              : 'hover:bg-gray-100'
          } ${isChild ? 'ml-4' : ''}`}
          onClick={() => handleItemClick(item.id, !!hasChildren)}
        >
          {hasChildren && (
            <div className="mr-1">
              {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </div>
          )}
          <Icon size={16} className="mr-2" />
          <span className="text-sm font-medium">{item.label}</span>
        </div>
        
        {hasChildren && isExpanded && (
          <div className="mt-1">
            {item.children!.map(child => renderNavigationItem(child, true))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-1/4 bg-gray-50 border-r border-gray-200 overflow-y-auto">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800">Documentation</h2>
      </div>
      
      <div className="p-3 space-y-1">
        {navigationStructure.map(item => renderNavigationItem(item))}
      </div>
    </div>
  );
};

export default DocumentationNavigation;