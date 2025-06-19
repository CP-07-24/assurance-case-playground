
import React, { useState } from 'react';
import TopBar from './TopBar';
import ToolBar from './ToolBar';
import LeftSidebar from './LeftSidebar';
import RightPanel from './RightPanel';
import DiagramCanvas from '../canvas/DiagramCanvas';
import TabsBar from './TabsBar';
// import ExportModal from '../export/export'; // 🔹 Pastikan path-nya sesuai

const MainLayout: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'shapes' | 'ai'>('shapes');
  // const [isExportOpen, setExportOpen] = useState(false); // 🔹 Modal state


  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Top navigation */}
      <TopBar />

      {/* Toolbar */}
      <ToolBar />

      {/* Main content area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left sidebar */}
        <div className="w-72 flex flex-col border-r border-gray-200 bg-white">

          <div className="h-12 shrink-0 border-b border-gray-200">
            <TabsBar activeTab={activeTab} setActiveTab={setActiveTab} />
          </div>
          <div className="flex-1 flex flex-col overflow-hidden">
            <LeftSidebar activeTab={activeTab} />
          </div>

        </div>

        {/* Canvas area */}
        <div className="flex-1 overflow-auto">
          <DiagramCanvas />
        </div>

        {/* Right panel */}
        <div
          id="properties-panel"
          data-preserve-selection="true"
          className="w-80 border-l border-gray-200 bg-white overflow-y-auto"
        >
          <RightPanel />
        </div>
      </div>

      {/* Modal export */}
      {/* <ExportModal isOpen={isExportOpen} onClose={() => setExportOpen(false)} />

      <button
        onClick={() => setExportOpen(true)}
        data-testid="open-export-modal-button"
      >
        Export Diagram
      </button> */}

    </div>
  );
};

export default MainLayout;
