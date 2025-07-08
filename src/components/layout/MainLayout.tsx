import React, { useState } from "react";
import TopBar from "./TopBar";
import ToolBar from "./ToolBar";
import LeftSidebar from "./LeftSidebar";
import RightPanel from "./RightPanel";
import DiagramCanvas from "../canvas/DiagramCanvas";
import TabsBar from "./TabsBar";

const MainLayout: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'shapes' | 'ai'>('shapes');

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Top navigation */}
      <TopBar />

      {/* Toolbar */}
      <ToolBar />

      {/* Main content area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left sidebar - Perubahan utama di sini */}
        <div className="w-72 flex flex-col border-r border-gray-200 bg-white">
          {/* TabsBar dibuat fixed */}
          <div className="h-12 shrink-0 border-b border-gray-200">
            <TabsBar activeTab={activeTab} setActiveTab={setActiveTab} />
          </div>

          {/* Konten sidebar dengan overflow terpisah */}
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
    </div>
  );
};

export default MainLayout;
