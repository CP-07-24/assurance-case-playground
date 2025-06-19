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
  ArrowRight,
  ArrowLeftRight,
  MinusIcon,
  MoreHorizontal,
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
    startDrawingConnection,
    isDrawingConnection,
    cancelDrawingConnection,
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
      width: 150, // Ukuran lebih besar sesuai perubahan default
      height: 60, // Ukuran lebih besar sesuai perubahan default
      editable: true,
    });
  };

  const handleConnectionClick = () => {
    // If already drawing a connection, cancel it
    if (isDrawingConnection) {
      cancelDrawingConnection();
    }
    setShowConnectionMenu(!showConnectionMenu);
  };

  // Implement fungsi untuk menangani pemilihan connection style
  const handleConnectionStyleSelect = (
    style: "line" | "arrow" | "solidArrow" | "doubleArrow" | "dashed" | "dotted"
  ) => {
    startDrawingConnection(style);
    setShowConnectionMenu(false);
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

        {/* Connection Tool - dengan improved dropdown menu */}
        <div className="relative">
          <button
            className={`p-1.5 rounded-md ${
              isDrawingConnection
                ? "bg-blue-100 text-blue-700"
                : "text-gray-700 hover:bg-gray-100"
            }`}
            onClick={handleConnectionClick}
          >
            <MoveUpLeft size={20} />
          </button>

          {showConnectionMenu && (
            <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50">
              <div className="p-2">
                <button
                  className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md flex items-center"
                  onClick={() => handleConnectionStyleSelect("line")}
                >
                  <MinusIcon size={16} className="mr-2" />
                  Line
                </button>
                <button
                  className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md flex items-center"
                  onClick={() => handleConnectionStyleSelect("arrow")}
                >
                  <ArrowRight size={16} className="mr-2" />
                  InContextOf
                </button>
                <button
                  className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md flex items-center"
                  onClick={() => handleConnectionStyleSelect("solidArrow")}
                >
                  <ArrowRight
                    size={16}
                    className="mr-2"
                    style={{ fill: "currentColor" }}
                  />
                  SupportedBy
                </button>
                <button
                  className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md flex items-center"
                  onClick={() => handleConnectionStyleSelect("doubleArrow")}
                >
                  <ArrowLeftRight size={16} className="mr-2" />
                  Double Arrow
                </button>
                <button
                  className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md flex items-center"
                  onClick={() => handleConnectionStyleSelect("dashed")}
                >
                  <MinusIcon
                    size={16}
                    className="mr-2"
                    style={{ strokeDasharray: "4,4" }}
                  />
                  Dashed Line
                </button>
                <button
                  className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md flex items-center"
                  onClick={() => handleConnectionStyleSelect("dotted")}
                >
                  <MoreHorizontal size={16} className="mr-2" />
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
