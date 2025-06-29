import React, { useState, useRef } from "react";
import { X, FileJson, Code, Upload, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { useDiagramContext } from "../../store/DiagramContext";

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ImportModal: React.FC<ImportModalProps> = ({ isOpen, onClose }) => {
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [importing, setImporting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { importDiagram } = useDiagramContext();

  if (!isOpen) return null;

  const resetMessages = () => {
    setError(null);
    setSuccess(null);
    setUploadProgress(0);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX;
      const y = e.clientY;
      
      // Only set drag inactive if mouse is outside the drop area
      if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
        setDragActive(false);
      }
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFiles(files);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  const validateFile = (file: File): { isValid: boolean; format?: 'json' | 'xml'; error?: string } => {
    const fileName = file.name.toLowerCase();
    const maxSize = 10 * 1024 * 1024; // 10MB max

    if (file.size > maxSize) {
      return { isValid: false, error: 'File size must be less than 10MB' };
    }

    if (fileName.endsWith('.json')) {
      return { isValid: true, format: 'json' };
    } else if (fileName.endsWith('.xml')) {
      return { isValid: true, format: 'xml' };
    } else {
      return { 
        isValid: false, 
        error: 'Unsupported file format. Please upload a .json or .xml file.' 
      };
    }
  };

  const handleFiles = (files: FileList) => {
    resetMessages();
    const file = files[0];

    if (!file) return;

    const validation = validateFile(file);
    if (!validation.isValid) {
      setError(validation.error || 'Invalid file');
      return;
    }

    readFile(file, validation.format!);
  };

  const readFile = (file: File, format: "json" | "xml") => {
    setImporting(true);
    resetMessages();

    const reader = new FileReader();

    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 100);

    reader.onload = (e) => {
      try {
        setUploadProgress(100);
        clearInterval(progressInterval);

        const content = e.target?.result as string;
        importDiagram(content, format);
        
        setSuccess(`${format.toUpperCase()} file imported successfully! ${file.name}`);
        
        // Auto close after success
        setTimeout(() => {
          onClose();
        }, 2000);
      } catch (err) {
        setError(`Error parsing ${format.toUpperCase()} file: ${err}`);
      } finally {
        setImporting(false);
        setUploadProgress(0);
      }
    };

    reader.onerror = () => {
      clearInterval(progressInterval);
      setError(`Error reading ${format.toUpperCase()} file: ${file.name}`);
      setImporting(false);
      setUploadProgress(0);
    };

    reader.readAsText(file);
  };

  const handleButtonClick = (format: "json" | "xml") => {
    resetMessages();
    if (fileInputRef.current) {
      fileInputRef.current.setAttribute("accept", `.${format}`);
      fileInputRef.current.click();
    }
  };

  return (
    <div 
      data-testid="import-modal-overlay"
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <div 
        data-testid="import-modal-container"
        className="bg-white rounded-lg w-full max-w-md shadow-xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-gray-50">
          <h2 className="text-lg font-semibold text-gray-800">Import Diagram</h2>
          <button
            data-testid="import-modal-close"
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors p-1 rounded"
            disabled={importing}
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          {/* Drag & Drop Area */}
          <div
            data-testid="import-drag-drop-area"
            className={`
              border-2 border-dashed rounded-lg p-8 mb-6 text-center transition-all duration-200
              ${dragActive 
                ? "border-blue-500 bg-blue-50 scale-105" 
                : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
              }
              ${importing ? "opacity-50 pointer-events-none" : "cursor-pointer"}
            `}
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            onClick={() => !importing && fileInputRef.current?.click()}
          >
            {importing ? (
              <Loader2 className="mx-auto text-blue-500 mb-3 animate-spin" size={40} />
            ) : (
              <Upload 
                className={`mx-auto mb-3 transition-colors ${
                  dragActive ? 'text-blue-500' : 'text-gray-400'
                }`} 
                size={40} 
              />
            )}
            
            <p className="text-sm text-gray-600 mb-2 font-medium">
              {importing ? 'Processing file...' : (
                dragActive ? 'Drop your file here' : 'Drag and drop a file here'
              )}
            </p>
            
            {!importing && (
              <p className="text-xs text-gray-500">
                or{' '}
                <button
                  data-testid="import-browse-files-button"
                  className="text-blue-600 hover:text-blue-800 font-medium underline"
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                >
                  browse files
                </button>
              </p>
            )}

            <input
              data-testid="import-file-input"
              ref={fileInputRef}
              type="file"
              className="hidden"
              onChange={handleChange}
              accept=".json,.xml"
              disabled={importing}
            />
          </div>

          {/* Upload Progress */}
          {importing && uploadProgress > 0 && (
            <div className="mb-4 p-3 bg-blue-50 rounded-md">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-blue-700">
                  Uploading file...
                </span>
                <span className="text-sm text-blue-600">{uploadProgress}%</span>
              </div>
              <div className="w-full bg-blue-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div 
              data-testid="import-success-message"
              className="mb-4 p-3 bg-green-50 text-green-700 rounded-md flex items-start"
            >
              <CheckCircle size={16} className="mr-2 mt-0.5 flex-shrink-0" />
              <span className="text-sm">{success}</span>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div 
              data-testid="import-error-message"
              className="mb-4 p-3 bg-red-50 text-red-700 rounded-md flex items-start"
            >
              <AlertCircle size={16} className="mr-2 mt-0.5 flex-shrink-0" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          {/* File Format Buttons */}
          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-3 font-medium">
              Or select a specific file format:
            </p>

            <div className="grid grid-cols-2 gap-3">
              <button
                data-testid="import-json-button"
                onClick={() => handleButtonClick("json")}
                disabled={importing}
                className="flex items-center justify-center p-3 border border-gray-200 rounded-md hover:bg-blue-50 hover:border-blue-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                <FileJson className="mr-2 text-blue-500 group-hover:text-blue-600" size={20} />
                <span className="font-medium">JSON</span>
              </button>

              <button
                data-testid="import-xml-button"
                onClick={() => handleButtonClick("xml")}
                disabled={importing}
                className="flex items-center justify-center p-3 border border-gray-200 rounded-md hover:bg-purple-50 hover:border-purple-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                <Code className="mr-2 text-purple-500 group-hover:text-purple-600" size={20} />
                <span className="font-medium">XML</span>
              </button>
            </div>
          </div>

          {/* File Info */}
          <div className="text-xs text-gray-500 text-center">
            Supported formats: JSON (.json), XML (.xml) • Max file size: 10MB
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImportModal;