import React from 'react';
import { DocumentationContentProps } from './types';

const DocumentationContent: React.FC<DocumentationContentProps> = ({ content }) => {
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="p-6">
        <div 
          className="prose max-w-none"
          dangerouslySetInnerHTML={{ __html: content }}
          style={{
            lineHeight: '1.6',
          }}
        />
      </div>
    </div>
  );
};

export default DocumentationContent;