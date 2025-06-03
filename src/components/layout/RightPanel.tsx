import React, { useState } from 'react';
import { useDiagramContext } from '../../context/DiagramContext';
import ElementTab from '../properties/ElementTab';
import TextTab from '../properties/TextTab';

const RightPanel: React.FC = () => {
  const { selectedShape } = useDiagramContext();
  const [activeTab, setActiveTab] = useState<'element' | 'text'>('element');

  return (
    <div className="h-full flex flex-col">
      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        <button
          className={`flex-1 py-3 text-sm font-medium ${
            activeTab === 'element'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('element')}
        >
          Element
        </button>
        <button
          className={`flex-1 py-3 text-sm font-medium ${
            activeTab === 'text'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('text')}
        >
          Text
        </button>
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'element' ? (
          <ElementTab />
        ) : (
          <TextTab />
        )}
      </div>
    </div>
  );
};

export default RightPanel;