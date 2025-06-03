import React, { useState, useRef } from 'react';
import { X, FileJson, Code, Upload } from 'lucide-react';
import { useDiagramContext } from '../../context/DiagramContext';

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ImportModal: React.FC<ImportModalProps> = ({ isOpen, onClose }) => {
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { importDiagram } = useDiagramContext();

  if (!isOpen) return null;

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = (files: FileList) => {
    setError(null);
    const file = files[0];
    
    if (!file) return;
    
    const fileName = file.name.toLowerCase();
    
    if (fileName.endsWith('.json')) {
      readFile(file, 'json');
    } else if (fileName.endsWith('.xml')) {
      readFile(file, 'xml');
    } else {
      setError('Unsupported file format. Please upload a JSON or XML file.');
    }
  };

  const readFile = (file: File, format: 'json' | 'xml') => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        importDiagram(content, format);
        onClose();
      } catch (err) {
        setError(`Error parsing ${format.toUpperCase()} file: ${err}`);
      }
    };
    
    reader.onerror = () => {
      setError(`Error reading ${format.toUpperCase()} file`);
    };
    
    reader.readAsText(file);
  };

  const handleButtonClick = (format: 'json' | 'xml') => {
    if (fileInputRef.current) {
      fileInputRef.current.setAttribute('accept', `.${format}`);
      fileInputRef.current.click();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-96 shadow-lg overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-medium">Import Diagram</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="p-4">
          <div 
            className={`border-2 border-dashed rounded-lg p-8 mb-4 text-center ${
              dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
            }`}
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
          >
            <Upload className="mx-auto text-gray-400 mb-2" size={32} />
            <p className="text-sm text-gray-600 mb-1">
              Drag and drop a file here, or
            </p>
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              onChange={handleChange}
            />
          </div>
          
          {error && (
            <div className="mb-4 p-3 text-sm bg-red-50 text-red-600 rounded-md">
              {error}
            </div>
          )}
          
          <p className="text-sm text-gray-600 mb-4">
            Select a file format to import:
          </p>
          
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => handleButtonClick('json')}
              className="flex items-center justify-center p-3 border rounded-md hover:bg-gray-50 transition-colors"
            >
              <FileJson className="mr-2 text-blue-500" size={20} />
              <span>JSON</span>
            </button>
            
            <button
              onClick={() => handleButtonClick('xml')}
              className="flex items-center justify-center p-3 border rounded-md hover:bg-gray-50 transition-colors"
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

export default ImportModal;