import React, { useState } from "react";
import { X, FileText, Image, Code, FileJson } from "lucide-react";
import { useDiagramContext } from "../../store/DiagramContext";

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose }) => {
  const { exportDiagram } = useDiagramContext();
  const [error, setError] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);

  if (!isOpen) return null;

  const handleExport = async (format: string) => {
    try {
      setExporting(true);
      setError(null);

      // Call the export function
      await exportDiagram(format);

      // Close the modal after successful export
      onClose();
    } catch (err) {
      console.error("Export error:", err);
      setError(`Failed to export as ${format.toUpperCase()}: ${err}`);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-96 shadow-lg overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-medium">Export Diagram</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-4">
          <p className="text-sm text-gray-600 mb-4">
            Select a format to export your diagram:
          </p>

          {error && (
            <div className="mb-4 p-3 text-sm bg-red-50 text-red-600 rounded-md">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => handleExport("pdf")}
              disabled={exporting}
              className="flex items-center justify-center p-3 border rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FileText className="mr-2 text-red-500" size={20} />
              <span>PDF</span>
            </button>

            <button
              onClick={() => handleExport("png")}
              disabled={exporting}
              className="flex items-center justify-center p-3 border rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Image className="mr-2 text-green-500" size={20} />
              <span>PNG</span>
            </button>

            <button
              onClick={() => handleExport("json")}
              disabled={exporting}
              className="flex items-center justify-center p-3 border rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FileJson className="mr-2 text-blue-500" size={20} />
              <span>JSON</span>
            </button>

            <button
              onClick={() => handleExport("xml")}
              disabled={exporting}
              className="flex items-center justify-center p-3 border rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Code className="mr-2 text-purple-500" size={20} />
              <span>XML</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExportModal;
