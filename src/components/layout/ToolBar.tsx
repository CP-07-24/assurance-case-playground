import React, { useState } from "react";
import {
  Layout,
  Import,
  Upload,
  Undo2,
  Redo2,
  Type,
  PanelRight,
  MoveUpLeft,
} from "lucide-react";
import { useDiagramContext } from "../../store/DiagramContext";
import ZoomSlider from "../ui/ZoomSlider";
import TemplateDialog from "../dialogs/TemplateDialog";
import InitialTemplateDialog from "../dialogs/InitialTemplateDialog";
import ExportModal from "../export/export";
import ImportModal from "../import/import";

const ToolBar: React.FC = () => {
  const {
    canUndo,
    canRedo,
    undo,
    redo,
    zoomLevel,
    setZoomLevel,
    addTextElement,
  } = useDiagramContext();

  // State untuk semua modal dan menu
  const [showConnectionMenu, setShowConnectionMenu] = useState(false);
  const [showTemplateDialog, setShowTemplateDialog] = useState(false);
  const [showInitialTemplateDialog, setShowInitialTemplateDialog] =
    useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);

  const handleTextClick = () => {
    console.log("Text button clicked");

    // Determine position based on stage and viewport
    const stageContainer =
      document.querySelector(".konva-stage-content") ||
      document.querySelector(".stage-container") ||
      document.querySelector(".canvas-container");

    let x = 50;
    let y = 50;

    if (stageContainer) {
      // Get the visible area of the canvas
      const viewportX = stageContainer.scrollLeft || 0;
      const viewportY = stageContainer.scrollTop || 0;

      // Calculate position in the top-left of the visible area
      // Adjust for zoom level
      x = viewportX / zoomLevel + 50;
      y = viewportY / zoomLevel + 50;
    }

    addTextElement({
      x: x,
      y: y,
      text: "Text",
      width: 100,
      height: 40,
      editable: true,
    });
  };

  const handleConnectionClick = () => {
    setShowConnectionMenu(!showConnectionMenu);
  };

  const handleUseTemplate = () => {
    setShowInitialTemplateDialog(false);
    setShowTemplateDialog(true);
  };

  const handleStartBlank = () => {
    setShowInitialTemplateDialog(false);
    // Handle starting with blank canvas
  };

  const handleTemplateSelect = (template: string) => {
    // Handle template selection here
    console.log("Selected template:", template);
    setShowTemplateDialog(false);
  };

  return (
    <div className="flex items-center justify-between bg-white border-b border-gray-200 h-12 px-3">
      <div className="flex items-center space-x-2">
        {/* Template Button */}
        <button
          className="p-1.5 rounded-md text-gray-700 hover:bg-gray-100 flex items-center"
          onClick={handleUseTemplate}
        >
          <Layout size={20} />
          <span className="ml-1.5 text-sm">Template</span>
        </button>

        {/* Import Button - dengan modal functionality */}
        <button
          className="p-1.5 rounded-md text-gray-700 hover:bg-gray-100 flex items-center"
          onClick={() => setShowImportModal(true)}
        >
          <Import size={20} />
          <span className="ml-1.5 text-sm">Import</span>
        </button>

        {/* Export Button - dengan modal functionality */}
        <button
          className="p-1.5 rounded-md text-gray-700 hover:bg-gray-100 flex items-center"
          onClick={() => setShowExportModal(true)}
        >
          <Upload size={20} />
          <span className="ml-1.5 text-sm">Export</span>
        </button>

        <div className="h-5 border-l border-gray-300 mx-1"></div>

        {/* Undo/Redo Buttons */}
        <button
          className={`p-1.5 rounded-md ${
            canUndo
              ? "text-gray-700 hover:bg-gray-100"
              : "text-gray-400 cursor-not-allowed"
          }`}
          onClick={undo}
          disabled={!canUndo}
        >
          <Undo2 size={20} />
        </button>
        <button
          className={`p-1.5 rounded-md ${
            canRedo
              ? "text-gray-700 hover:bg-gray-100"
              : "text-gray-400 cursor-not-allowed"
          }`}
          onClick={redo}
          disabled={!canRedo}
        >
          <Redo2 size={20} />
        </button>

        <div className="h-5 border-l border-gray-300 mx-1"></div>

        {/* Text Tool - dengan full functionality */}
        <button
          className="p-1.5 rounded-md text-gray-700 hover:bg-gray-100"
          onClick={handleTextClick}
          title="Add Text (Click to add text directly to canvas)"
        >
          <Type size={20} />
        </button>

        {/* Connection Tool - dengan dropdown menu */}
        <div className="relative">
          <button
            className="p-1.5 rounded-md text-gray-700 hover:bg-gray-100"
            onClick={handleConnectionClick}
          >
            <MoveUpLeft size={20} />
          </button>
          {showConnectionMenu && (
            <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50">
              <div className="p-2">
                <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md">
                  Line
                </button>
                <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md">
                  Arrow
                </button>
                <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md">
                  Double Arrow
                </button>
                <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md">
                  Dashed Line
                </button>
                <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md">
                  Dotted Line
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right Side - Zoom Controls dan Panel Button */}
      <div className="flex items-center">
        <div className="flex items-center">
          <span className="text-xs text-gray-500 mr-2">Zoom</span>
          <ZoomSlider value={zoomLevel} onChange={setZoomLevel} />
          <span className="text-xs text-gray-500 ml-2 w-8">
            {Math.round(zoomLevel * 100)}%
          </span>
        </div>
        <button className="p-1.5 ml-3 rounded-md text-gray-700 hover:bg-gray-100">
          <PanelRight size={20} />
        </button>
      </div>

      {/* All Modals */}
      <InitialTemplateDialog
        isOpen={showInitialTemplateDialog}
        onClose={() => setShowInitialTemplateDialog(false)}
        onUseTemplate={handleUseTemplate}
        onStartBlank={handleStartBlank}
      />

      <TemplateDialog
        isOpen={showTemplateDialog}
        onClose={() => setShowTemplateDialog(false)}
        onSelect={handleTemplateSelect}
      />

      <ExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
      />

      <ImportModal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
      />
    </div>
  );
};

export default ToolBar;
