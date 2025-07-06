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

  // Generate unique ID for imported items
  const generateId = () => `imported-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  // Simple JSON parser with better error handling
  const parseJSON = (content: string) => {
    try {
      const data = JSON.parse(content);
      
      // Validate basic structure
      if (!data || typeof data !== 'object') {
        throw new Error('Invalid JSON format: Must be an object');
      }
      
      if (!data.shapes || !Array.isArray(data.shapes)) {
        throw new Error('Invalid JSON format: "shapes" property is required and must be an array');
      }
      
      // Process shapes with better validation
      const shapes = data.shapes.map((shape: any, index: number) => {
        if (!shape || typeof shape !== 'object') {
          throw new Error(`Shape ${index + 1} is invalid`);
        }
        
        return {
          id: shape.id || generateId(),
          type: shape.type || 'rectangle',
          title: shape.title || 'Untitled',
          x: typeof shape.x === 'number' ? shape.x : 0,
          y: typeof shape.y === 'number' ? shape.y : 0,
          width: typeof shape.width === 'number' ? shape.width : 100,
          height: typeof shape.height === 'number' ? shape.height : 50,
          cornerRadius: typeof shape.cornerRadius === 'number' ? shape.cornerRadius : 0,
          text: shape.text || '',
          mainText: shape.mainText || shape.text || '',
          idText: shape.idText || '',
          value: shape.value || '',
          fontFamily: shape.fontFamily || 'Arial',
          fontSize: typeof shape.fontSize === 'number' ? shape.fontSize : 14,
          fontWeight: shape.fontWeight || 'normal',
          fontStyle: shape.fontStyle || 'normal',
          align: shape.align || 'center',
          textDecoration: shape.textDecoration || 'none',
          interLine: shape.interLine || 'normal',
          description: shape.description || '',
          preview: null
        };
      });
      
      // Process connections with validation
      const connections = (data.connections || []).map((connection: any, index: number) => {
        if (!connection || typeof connection !== 'object') {
          throw new Error(`Connection ${index + 1} is invalid`);
        }
        
        return {
          id: connection.id || generateId(),
          from: connection.from || '',
          to: connection.to || '',
          style: connection.style || 'arrow',
          points: Array.isArray(connection.points) ? connection.points : []
        };
      });
      
      return { shapes, connections };
    } catch (error) {
      if (error instanceof SyntaxError) {
        throw new Error('Invalid JSON file: Syntax error in JSON');
      }
      throw new Error(`Failed to parse JSON file: ${error}`);
    }
  };

  // Simple XML parser with better error handling
  const parseXML = (content: string) => {
    try {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(content, 'text/xml');
      
      // Check for parsing errors
      const parserError = xmlDoc.querySelector('parsererror');
      if (parserError) {
        throw new Error('Invalid XML file: XML syntax error');
      }
      
      const shapes: any[] = [];
      const connections: any[] = [];
      
      // Helper function to get element value safely
      const getElementValue = (parent: Element, tagName: string): string => {
        const element = parent.querySelector(tagName);
        return element ? (element.textContent || '').trim() : '';
      };
      
      // Parse shapes
      const shapeElements = xmlDoc.querySelectorAll('diagram > shapes > shape');
      shapeElements.forEach((element, index) => {
        try {
          shapes.push({
            id: getElementValue(element, 'id') || generateId(),
            type: getElementValue(element, 'type') || 'rectangle',
            title: getElementValue(element, 'title') || 'Untitled',
            x: parseFloat(getElementValue(element, 'x') || '0'),
            y: parseFloat(getElementValue(element, 'y') || '0'),
            width: parseFloat(getElementValue(element, 'width') || '100'),
            height: parseFloat(getElementValue(element, 'height') || '50'),
            cornerRadius: parseFloat(getElementValue(element, 'cornerRadius') || '0'),
            text: getElementValue(element, 'text') || '',
            mainText: getElementValue(element, 'mainText') || getElementValue(element, 'text') || '',
            idText: getElementValue(element, 'idText') || '',
            value: getElementValue(element, 'value') || '',
            fontFamily: getElementValue(element, 'fontFamily') || 'Arial',
            fontSize: parseFloat(getElementValue(element, 'fontSize') || '14'),
            fontWeight: getElementValue(element, 'fontWeight') || 'normal',
            fontStyle: getElementValue(element, 'fontStyle') || 'normal',
            align: getElementValue(element, 'align') || 'center',
            textDecoration: getElementValue(element, 'textDecoration') || 'none',
            interLine: getElementValue(element, 'interLine') || 'normal',
            description: getElementValue(element, 'description') || '',
            preview: null
          });
        } catch (err) {
          console.warn(`Warning: Skipping shape ${index + 1} due to parsing error:`, err);
        }
      });
      
      // Parse connections  
      const connectionElements = xmlDoc.querySelectorAll('diagram > connections > connection');
      connectionElements.forEach((element, index) => {
        try {
          // Parse points if they exist
          const points: number[] = [];
          const pointElements = element.querySelectorAll('points > point');
          pointElements.forEach(pointEl => {
            const x = parseFloat(pointEl.getAttribute('x') || '0');
            const y = parseFloat(pointEl.getAttribute('y') || '0');
            points.push(x, y);
          });
          
          connections.push({
            id: getElementValue(element, 'id') || generateId(),
            from: getElementValue(element, 'from'),
            to: getElementValue(element, 'to'),
            style: getElementValue(element, 'style') || 'arrow',
            points: points
          });
        } catch (err) {
          console.warn(`Warning: Skipping connection ${index + 1} due to parsing error:`, err);
        }
      });
      
      return { shapes, connections };
    } catch (error) {
      throw new Error(`Failed to parse XML file: ${error}`);
    }
  };

  // Process file with improved error handling
  const processFile = async (file: File, type: string) => {
    try {
      setImporting(true);
      setError(null);
      setImportProgress("Reading file...");
      
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const content = await file.text();
      
      if (!content.trim()) {
        throw new Error('File is empty');
      }
      
      setImportProgress("Processing data...");
      await new Promise(resolve => setTimeout(resolve, 300));
      
      let data;
      if (type === 'json') {
        setImportProgress("Parsing JSON...");
        data = parseJSON(content);
      } else {
        setImportProgress("Parsing XML...");
        data = parseXML(content);
      }
      
      if (!data.shapes || data.shapes.length === 0) {
        throw new Error('No valid shapes found in file');
      }
      
      await new Promise(resolve => setTimeout(resolve, 300));
      
      setImportProgress("Importing to diagram...");
      
      let successCount = 0;
      let skipCount = 0;
      
      // Add shapes with offset to avoid overlap
      data.shapes.forEach((shape: any) => {
        try {
          addShape({
            ...shape,
            id: generateId(), // Always generate new ID
            x: shape.x + 20, // Small offset
            y: shape.y + 20
          });
          successCount++;
        } catch (err) {
          console.warn('Failed to add shape:', err);
          skipCount++;
        }
      });

      // Add connections
      data.connections.forEach((connection: any) => {
        try {
          addConnection({
            ...connection,
            id: generateId() // Always generate new ID
          });
        } catch (err) {
          console.warn('Failed to add connection:', err);
        }
      });
      
      setImportProgress(`Import complete! Added ${successCount} shapes${skipCount > 0 ? ` (${skipCount} skipped)` : ''}`);
      
      // Close modal after a delay
      setTimeout(() => {
        onClose();
        setSelectedFile(null);
        setImportProgress("");
      }, 2000);
      
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

  // Handle single file with validation
  const handleFile = (file: File) => {
    setError(null);
    setSelectedFile(file);

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError("File too large. Maximum size is 10MB");
      return;
    }

    const fileName = file.name.toLowerCase();
    if (fileName.endsWith(".json")) {
      processFile(file, "json");
    } else if (fileName.endsWith(".xml")) {
      processFile(file, "xml");
    } else {
      setError("Unsupported file format. Please choose .json or .xml files");
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
            Choose a file to import diagram data:
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
                <p className="text-sm text-green-600">File selected: {selectedFile.name}</p>
              </div>
            ) : (
              <>
                <Upload className="mx-auto text-gray-400 mb-2" size={32} />
                <p className="text-sm text-gray-600 mb-1">
                  Drag and drop file here, or click to select
                </p>
                <p className="text-xs text-gray-500">
                  Supports: .json, .xml
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
            Or choose a file format directly:
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
            <h4 className="text-sm font-medium text-gray-800 mb-2">How to Import:</h4>
            <ul className="text-xs text-gray-600 space-y-1">
              <li>• Drag file from explorer to the drop zone</li>
              <li>• Or click format button to select file</li>
              <li>• File will be processed automatically</li>
              <li>• Import will add to existing diagram</li>
              <li>• Imported items will have slight offset</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImportModal;