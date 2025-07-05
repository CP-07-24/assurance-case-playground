import React from 'react';
import { DocumentationContentProps } from './types';

const DocumentationContent: React.FC<DocumentationContentProps> = ({ content }) => {
  return (
    <div className="flex-1 overflow-y-auto bg-white">
      <div className="p-8">
        <div 
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: content }}
          style={{
            lineHeight: '1.8',
            fontSize: '16px',
            color: '#374151'
          }}
        />
      </div>
    </div>
  );
};

export default DocumentationContent;