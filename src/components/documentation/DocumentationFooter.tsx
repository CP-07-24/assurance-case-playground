import React from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { DocumentationFooterProps } from './types';

const DocumentationFooter: React.FC<DocumentationFooterProps> = ({ 
  onNext, 
  onPrevious, 
  showNavigation = true 
}) => {
  if (!showNavigation) return null;

  return (
    <div className="p-4 border-t border-gray-200 flex justify-between">
      <button 
        onClick={onPrevious}
        className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors disabled:opacity-50"
        disabled={!onPrevious}
      >
        <ChevronLeft size={16} className="mr-1" />
        Previous
      </button>
      
      <button 
        onClick={onNext}
        className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
        disabled={!onNext}
      >
        Next
        <ChevronRight size={16} className="ml-1" />
      </button>
    </div>
  );
};

export default DocumentationFooter;