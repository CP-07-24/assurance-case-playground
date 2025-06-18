import React, { useState, useCallback } from 'react';
import { X, FileText, Image, Code, FileJson } from 'lucide-react';
import { useDiagramContext } from '../../store/DiagramContext';


interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const exportOptions = [
  { format: 'pdf', label: 'PDF', icon: FileText, color: 'text-red-500', testId: 'export-pdf' },
  { format: 'png', label: 'PNG', icon: Image, color: 'text-green-500', testId: 'export-png' },
  { format: 'json', label: 'JSON', icon: FileJson, color: 'text-blue-500', testId: 'export-json' },
  { format: 'xml', label: 'XML', icon: Code, color: 'text-purple-500', testId: 'export-xml' },
];

const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose }) => {
  const { exportDiagram } = useDiagramContext();
  const [error, setError] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);

  const handleExport = useCallback(async (format: string) => {
    try {
      setExporting(true);
      setError(null);

      await exportDiagram(format);
      onClose();
    } catch (err) {
      console.error('Export error:', err);
      setError(`Failed to export as ${format.toUpperCase()}: ${String(err)}`);

    } finally {
      setExporting(false);
    }
  }, [exportDiagram, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-96 shadow-lg overflow-hidden">
        <header className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-medium">Export Diagram</h2>
          <button
            onClick={onClose}
            aria-label="Close export modal"
            className="text-gray-500 hover:text-gray-700 transition-colors"
            data-testid="close-export-modal"
          >
            <X size={20} />
          </button>

        </header>

        <section className="p-4">

          <p className="text-sm text-gray-600 mb-4">
            Select a format to export your diagram:
          </p>

          {error && (
            <div
              role="alert"
              className="mb-4 p-3 text-sm bg-red-50 text-red-600 rounded-md"
              data-testid="export-error"
            >
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">

            {exportOptions.map(({ format, label, icon: Icon, color, testId }) => (
              <button
                key={format}
                onClick={() => handleExport(format)}
                disabled={exporting}
                data-testid={testId}
                className={`flex items-center justify-center p-3 border rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <Icon className={`mr-2 ${color}`} size={20} />
                <span>{label}</span>
              </button>
            ))}

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
        </section>
      </div>
    </div>
  );
};

export default ExportModal;
