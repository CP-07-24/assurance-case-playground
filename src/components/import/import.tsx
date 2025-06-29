import React, { useState, useRef } from "react";
import { X, Upload, FileJson, Code, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { useDiagramContext } from "../../store/DiagramContext";

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ImportModal: React.FC<ImportModalProps> = ({ isOpen, onClose }) => {
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [importing, setImporting] = useState(false);
  const [importProgress, setImportProgress] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Use context functions
  const { addShape, addConnection } = useDiagramContext();

  if (!isOpen) return null;

  // Simple JSON parser
  const parseJSON = (content: string) => {
    try {
      const data = JSON.parse(content);
      
      if (!data.shapes || !Array.isArray(data.shapes)) {
        throw new Error('Format JSON tidak valid: properti "shapes" diperlukan');
      }
      
      return {
        shapes: data.shapes.map((shape: any) => ({
          ...shape,
          id: shape.id || `shape-${Date.now()}-${Math.random()}`,
          preview: null
        })),
        connections: data.connections || []
      };
    } catch (error) {
      throw new Error(`Gagal parsing file JSON: ${error}`);
    }
  };

  // Simple XML parser
  const parseXML = (content: string) => {
    try {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(content, 'text/xml');
      
      const parserError = xmlDoc.querySelector('parsererror');
      if (parserError) {
        throw new Error('File XML tidak valid');
      }
      
      const shapes: any[] = [];
      const connections: any[] = [];
      
      // Parse shapes
      const shapeElements = xmlDoc.querySelectorAll('diagram > shapes > shape');
      shapeElements.forEach((element) => {
        const getId = (tag: string) => element.querySelector(tag)?.textContent || '';
        
        shapes.push({
          id: getId('id') || `shape-${Date.now()}-${Math.random()}`,
          type: getId('type') || 'unknown',
          title: getId('title') || 'Untitled',
          x: parseFloat(getId('x') || '0'),
          y: parseFloat(getId('y') || '0'),
          width: parseFloat(getId('width') || '100'),
          height: parseFloat(getId('height') || '50'),
          text: getId('text') || '',
          mainText: getId('mainText') || getId('text') || '',
          preview: null
        });
      });
      
      // Parse connections  
      const connectionElements = xmlDoc.querySelectorAll('diagram > connections > connection');
      connectionElements.forEach((element) => {
        const getId = (tag: string) => element.querySelector(tag)?.textContent || '';
        
        connections.push({
          id: getId('id') || `connection-${Date.now()}-${Math.random()}`,
          from: getId('from'),
          to: getId('to'),
          style: 'arrow',
          points: []
        });
      });
      
      return { shapes, connections };
    } catch (error) {
      throw new Error(`Gagal parsing file XML: ${error}`);
    }
  };

  // Process file
  const processFile = async (file: File, type: string) => {
    try {
      setImporting(true);
      setError(null);
      setImportProgress("Membaca file...");
      
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const content = await file.text();
      
      setImportProgress("Memproses data...");
      await new Promise(resolve => setTimeout(resolve, 300));
      
      let data;
      if (type === 'json') {
        setImportProgress("Parsing JSON...");
        data = parseJSON(content);
      } else {
        setImportProgress("Parsing XML...");
        data = parseXML(content);
      }
      
      await new Promise(resolve => setTimeout(resolve, 300));
      
      setImportProgress("Mengimpor ke diagram...");
      
      // Add shapes
      data.shapes.forEach((shape: any) => {
        try {
          addShape({
            ...shape,
            id: `imported-${Date.now()}-${Math.random()}`,
            x: shape.x + 20,
            y: shape.y + 20
          });
        } catch (err) {
          console.warn('Failed to add shape:', err);
        }
      });

      // Add connections
      data.connections.forEach((connection: any) => {
        try {
          addConnection({
            ...connection,
            id: `imported-conn-${Date.now()}-${Math.random()}`
          });
        } catch (err) {
          console.warn('Failed to add connection:', err);
        }
      });
      
      setImportProgress("Import selesai!");
      
      // Close modal
      setTimeout(() => {
        onClose();
        setSelectedFile(null);
        setImportProgress("");
      }, 1000);
      
    } catch (err) {
      console.error("Import error:", err);
      setError(`${err}`);
      setImportProgress("");
    } finally {
      setTimeout(() => {
        setImporting(false);
      }, 1000);
    }
  };

  // Handle drag events
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  // Handle file drop
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (importing) return;

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFile(files[0]);
    }
  };

  // Handle file input change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (importing) return;
    
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  // Handle single file
  const handleFile = (file: File) => {
    setError(null);
    setSelectedFile(file);

    const fileName = file.name.toLowerCase();
    if (fileName.endsWith(".json")) {
      processFile(file, "json");
    } else if (fileName.endsWith(".xml")) {
      processFile(file, "xml");
    } else {
      setError("Format file tidak didukung. Pilih file .json atau .xml");
    }
  };

  // Handle button click
  const handleButtonClick = (fileType: string) => {
    if (importing || !fileInputRef.current) return;
    
    fileInputRef.current.accept = fileType === 'json' ? '.json' : '.xml';
    fileInputRef.current.click();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-96 shadow-lg overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-medium">Import Diagram</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
            disabled={importing}
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-4">
          <p className="text-sm text-gray-600 mb-4">
            Pilih file untuk import diagram:
          </p>

          {/* Drag and Drop Area */}
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
              dragActive
                ? "border-blue-500 bg-blue-50"
                : importing
                ? "border-gray-200 bg-gray-50"
                : "border-gray-300 hover:border-gray-400"
            }`}
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            onClick={() => !importing && fileInputRef.current?.click()}
          >
            {importing ? (
              <div className="flex flex-col items-center">
                <Loader2 className="animate-spin text-blue-500 mb-2" size={32} />
                <p className="text-sm text-blue-600">{importProgress}</p>
              </div>
            ) : selectedFile && !error ? (
              <div className="flex flex-col items-center">
                <CheckCircle className="text-green-500 mb-2" size={32} />
                <p className="text-sm text-green-600">File dipilih: {selectedFile.name}</p>
              </div>
            ) : (
              <>
                <Upload className="mx-auto text-gray-400 mb-2" size={32} />
                <p className="text-sm text-gray-600 mb-1">
                  Drag and drop file di sini, atau klik untuk pilih
                </p>
                <p className="text-xs text-gray-500">
                  Support: .json, .xml
                </p>
              </>
            )}
            
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept=".json,.xml"
              onChange={handleFileChange}
            />
          </div>

          {error && (
            <div className="mt-4 p-3 text-sm bg-red-50 text-red-600 rounded-md flex items-start">
              <AlertCircle className="mr-2 mt-0.5 flex-shrink-0" size={16} />
              <span>{error}</span>
            </div>
          )}

          <p className="text-sm text-gray-600 mb-4 mt-4">
            Atau pilih format file secara langsung:
          </p>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => handleButtonClick("json")}
              disabled={importing}
              className="flex items-center justify-center p-3 border rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FileJson className="mr-2 text-blue-500" size={20} />
              <span>JSON</span>
            </button>

            <button
              onClick={() => handleButtonClick("xml")}
              disabled={importing}
              className="flex items-center justify-center p-3 border rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Code className="mr-2 text-purple-500" size={20} />
              <span>XML</span>
            </button>
          </div>

          {/* Instructions */}
          <div className="mt-4 p-3 bg-gray-50 rounded-md">
            <h4 className="text-sm font-medium text-gray-800 mb-2">Cara Import:</h4>
            <ul className="text-xs text-gray-600 space-y-1">
              <li>• Drag file dari explorer ke area drop zone</li>
              <li>• Atau klik tombol format untuk pilih file</li>
              <li>• File akan diproses otomatis setelah dipilih</li>
              <li>• Import akan menambahkan ke diagram yang ada</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImportModal;