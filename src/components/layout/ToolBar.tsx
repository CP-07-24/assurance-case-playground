import React, { useState } from 'react';
import { 
  Layout, Import, Upload, Undo2, Redo2, Type 
} from 'lucide-react';
import { useDiagramContext } from '../../context/DiagramContext';
import ZoomSlider from '../ui/ZoomSlider';
import ExportModal from '../export/export';
import ImportModal from '../import/import';

const ToolBar: React.FC = () => {
  const [showExportModal, setShowExportModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  
  const { 
    canUndo, 
    canRedo, 
    undo, 
    redo,
    zoomLevel,
    setZoomLevel
  } = useDiagramContext();

  return (
    <div className="flex items-center justify-between bg-white border-b border-gray-200 h-12 px-3">
      <div className="flex items-center space-x-2">
        <button className="p-1.5 rounded-md text-gray-700 hover:bg-gray-100 flex items-center">
          <Layout size={20} />
          <span className="ml-1.5 text-sm">Template</span>
        </button>
        
        <button 
          className="p-1.5 rounded-md text-gray-700 hover:bg-gray-100 flex items-center"
          onClick={() => setShowImportModal(true)}
        >
          <Import size={20} />
          <span className="ml-1.5 text-sm">Import</span>
        </button>
        
        <button 
          className="p-1.5 rounded-md text-gray-700 hover:bg-gray-100 flex items-center"
          onClick={() => setShowExportModal(true)}
        >
          <Upload size={20} />
          <span className="ml-1.5 text-sm">Export</span>
        </button>
        
        <div className="h-5 border-l border-gray-300 mx-1"></div>
        
        <button 
          className={`p-1.5 rounded-md ${canUndo ? 'text-gray-700 hover:bg-gray-100' : 'text-gray-400 cursor-not-allowed'}`}
          onClick={undo}
          disabled={!canUndo}
        >
          <Undo2 size={20} />
        </button>
        
        <button 
          className={`p-1.5 rounded-md ${canRedo ? 'text-gray-700 hover:bg-gray-100' : 'text-gray-400 cursor-not-allowed'}`}
          onClick={redo}
          disabled={!canRedo}
        >
          <Redo2 size={20} />
        </button>
        
        <div className="h-5 border-l border-gray-300 mx-1"></div>
        
        <button className="p-1.5 rounded-md text-gray-700 hover:bg-gray-100">
          <Type size={20} />
        </button>
      </div>
      
      <div className="flex items-center">
        <div className="flex items-center">
          <span className="text-xs text-gray-500 mr-2">Zoom</span>
          <ZoomSlider 
            value={zoomLevel} 
            onChange={setZoomLevel} 
          />
          <span className="text-xs text-gray-500 ml-2 w-8">{Math.round(zoomLevel * 100)}%</span>
        </div>
        
        <button className="p-1.5 ml-3 rounded-md text-gray-700 hover:bg-gray-100">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="4" y="4" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="2" />
          </svg>
        </button>
      </div>
      
      {/* Export Modal */}
      <ExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
      />
      
      {/* Import Modal */}
      <ImportModal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
      />
    </div>
  );
};

export default ToolBar;