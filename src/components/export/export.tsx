import React, { useState } from "react";
import { X, FileText, Image, Code, FileJson, Loader2 } from "lucide-react";
import { useDiagramContext } from "../../store/DiagramContext";

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  stageRef?: React.RefObject<any>;
}

const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose, stageRef }) => {
  const { shapes, connections } = useDiagramContext();
  const [error, setError] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState<string>("");

  if (!isOpen) return null;

  const diagramData = {
    shapes: shapes,
    connections: connections
  };

  // Helper to download a file
  const downloadFile = (content: string | Blob, filename: string) => {
    const a = document.createElement('a');
    const url = content instanceof Blob 
      ? URL.createObjectURL(content) 
      : `data:text/plain;charset=utf-8,${encodeURIComponent(content)}`;
    
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    if (content instanceof Blob) {
      URL.revokeObjectURL(url);
    }
  };

  // Enhanced stage detection with better validation
  const getKonvaStage = () => {
    // Method 1: Use provided stageRef if available
    if (stageRef?.current && typeof stageRef.current.toDataURL === 'function') {
      console.log('Using provided stageRef');
      return stageRef.current;
    }

    // Method 2: Find Konva stage through global Konva object
    try {
      // @ts-ignore
      if (typeof window !== 'undefined' && window.Konva && window.Konva.stages) {
        // @ts-ignore
        const stages = window.Konva.stages;
        console.log('Konva stages found:', stages.length);
        
        if (stages.length > 0) {
          // Get the largest stage (most likely to be our main diagram)
          let largestStage = stages[0];
          let maxArea = 0;
          
          for (let stage of stages) {
            const area = stage.width() * stage.height();
            if (area > maxArea) {
              maxArea = area;
              largestStage = stage;
            }
          }
          
          console.log('Using largest Konva stage:', largestStage.width() + 'x' + largestStage.height());
          return largestStage;
        }
      }
    } catch (e) {
      console.log('Konva global access failed:', e);
    }

    // Method 3: Find stage through DOM traversal
    const konvaContainers = document.querySelectorAll('.konvajs-content');
    console.log('Konva containers found:', konvaContainers.length);
    
    for (let container of konvaContainers) {
      const canvas = container.querySelector('canvas');
      if (canvas && canvas.width > 100 && canvas.height > 100) {
        console.log('Using DOM canvas:', canvas.width + 'x' + canvas.height);
        
        // Try to find the Konva stage associated with this canvas
        try {
          // @ts-ignore
          if (window.Konva) {
            // @ts-ignore
            for (let stage of window.Konva.stages || []) {
              if (stage.content && stage.content.contains(canvas)) {
                console.log('Found matching Konva stage for canvas');
                return stage;
              }
            }
          }
        } catch (e) {
          console.log('Could not match canvas to Konva stage');
        }
        
        // Fallback: create a wrapper object for the canvas
        return {
          toDataURL: (options: any = {}) => {
            console.log('Using canvas fallback toDataURL with options:', options);
            // Use options if available, fallback to PNG
            const mimeType = options.mimeType || 'image/png';
            const quality = options.quality || 1;
            return canvas.toDataURL(mimeType, quality);
          },
          width: () => canvas.width,
          height: () => canvas.height
        };
      }
    }

    return null;
  };

  // Validate that canvas has content
  const validateCanvasContent = (stage: any): boolean => {
    try {
      // Check if stage has dimensions
      if (typeof stage.width === 'function' && typeof stage.height === 'function') {
        const width = stage.width();
        const height = stage.height();
        console.log('Canvas dimensions:', width + 'x' + height);
        
        if (width < 100 || height < 100) {
          console.log('Canvas too small');
          return false;
        }
      }

      // Check if we have shapes to export
      if (diagramData.shapes.length === 0) {
        console.log('No shapes to export');
        return false;
      }

      // Try to get a small dataURL to test if canvas works
      const testDataUrl = stage.toDataURL({ 
        pixelRatio: 0.1,
        width: 100,
        height: 100
      });
      
      // Check if dataURL is not just a blank canvas
      const isBlank = testDataUrl === 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';
      
      if (isBlank) {
        console.log('Canvas appears to be blank');
        return false;
      }

      console.log('Canvas validation passed');
      return true;
    } catch (error) {
      console.error('Canvas validation failed:', error);
      return false;
    }
  };

  // Export to PDF with enhanced validation and bounding box
  const exportToPDF = async () => {
    const stage = getKonvaStage();
    
    if (!stage) {
      throw new Error('Canvas not found. Make sure there are shapes in the diagram.');
    }

    if (!validateCanvasContent(stage)) {
      throw new Error('Canvas is empty or invalid. Make sure there are visible shapes in the diagram.');
    }
    
    try {
      setExportProgress('Starting PDF export...');
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setExportProgress('Importing PDF library...');
      const { default: jsPDF } = await import('jspdf');
      
      setExportProgress('Calculating diagram area...');
      
      // Get bounding box of shapes
      const boundingBox = getShapesBoundingBox();
      
      if (!boundingBox) {
        throw new Error('Unable to calculate diagram area');
      }

      console.log('PDF Bounding box:', boundingBox);
      
      setExportProgress('Capturing canvas data...');
      
      // Export only the area containing shapes
      const dataUrl = stage.toDataURL({ 
        pixelRatio: 2,
        mimeType: 'image/png',
        quality: 1,
        x: boundingBox.x,
        y: boundingBox.y,
        width: boundingBox.width,
        height: boundingBox.height
      });
      
      console.log('PDF DataURL length:', dataUrl.length);
      
      await new Promise(resolve => setTimeout(resolve, 300));
      
      setExportProgress('Creating PDF document...');
      
      // Determine orientation based on aspect ratio
      const aspectRatio = boundingBox.width / boundingBox.height;
      const orientation = aspectRatio > 1.2 ? 'landscape' : 'portrait';
      
      const pdf = new jsPDF({
        orientation: orientation,
        unit: 'px',
      });
      
      setExportProgress('Processing image...');
      const imgProps = pdf.getImageProperties(dataUrl);
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      
      // Calculate size to fit the page while maintaining aspect ratio
      let imgWidth = pageWidth;
      let imgHeight = (imgProps.height * pageWidth) / imgProps.width;
      
      // If height is too large, scale down
      if (imgHeight > pageHeight) {
        imgHeight = pageHeight;
        imgWidth = (imgProps.width * pageHeight) / imgProps.height;
      }
      
      // Center the image on the page
      const x = (pageWidth - imgWidth) / 2;
      const y = (pageHeight - imgHeight) / 2;
      
      setExportProgress('Adding image to PDF...');
      pdf.addImage(dataUrl, 'PNG', x, y, imgWidth, imgHeight);
      await new Promise(resolve => setTimeout(resolve, 300));
      
      setExportProgress('Saving file...');
      pdf.save('diagram.pdf');
      
      setExportProgress('Export complete!');
    } catch (error) {
      console.error('Error exporting to PDF:', error);
      throw new Error(`Failed to export PDF: ${error}`);
    }
  };

  // Calculate bounding box of all shapes
  const getShapesBoundingBox = () => {
    if (diagramData.shapes.length === 0) {
      return null;
    }

    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;

    diagramData.shapes.forEach(shape => {
      const x1 = shape.x;
      const y1 = shape.y;
      const x2 = shape.x + (shape.width || 100);
      const y2 = shape.y + (shape.height || 50);

      minX = Math.min(minX, x1);
      minY = Math.min(minY, y1);
      maxX = Math.max(maxX, x2);
      maxY = Math.max(maxY, y2);
    });

    // Add padding around the shapes
    const padding = 50;
    return {
      x: Math.max(0, minX - padding),
      y: Math.max(0, minY - padding),
      width: maxX - minX + (2 * padding),
      height: maxY - minY + (2 * padding)
    };
  };

  // Export to PNG with enhanced validation and bounding box
  const exportToPNG = async () => {
    const stage = getKonvaStage();
    
    if (!stage) {
      throw new Error('Canvas not found. Make sure there are shapes in the diagram.');
    }

    if (!validateCanvasContent(stage)) {
      throw new Error('Canvas is empty or invalid. Make sure there are visible shapes in the diagram.');
    }
    
    try {
      setExportProgress('Starting PNG export...');
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setExportProgress('Calculating diagram area...');
      
      // Get bounding box of shapes
      const boundingBox = getShapesBoundingBox();
      
      if (!boundingBox) {
        throw new Error('Unable to calculate diagram area');
      }

      console.log('Bounding box:', boundingBox);
      
      setExportProgress('Capturing canvas data...');
      
      // Export only the area containing shapes
      const dataUrl = stage.toDataURL({ 
        pixelRatio: 2, // Good quality without being too large
        mimeType: 'image/png',
        quality: 1,
        x: boundingBox.x,
        y: boundingBox.y,
        width: boundingBox.width,
        height: boundingBox.height
      });
      
      console.log('PNG DataURL length:', dataUrl.length);
      console.log('Exported area:', `${boundingBox.width}x${boundingBox.height}`);
      
      // Validate that we got actual image data
      if (dataUrl.length < 1000) {
        throw new Error('Generated image too small - canvas might be empty');
      }
      
      await new Promise(resolve => setTimeout(resolve, 300));
      
      setExportProgress('Saving file...');
      
      // Convert dataURL to blob for better file handling
      const response = await fetch(dataUrl);
      const blob = await response.blob();
      
      console.log('PNG Blob size:', blob.size);
      
      if (blob.size < 1000) {
        throw new Error('Generated file too small - export might have failed');
      }
      
      downloadFile(blob, 'diagram.png');
      
      setExportProgress('Export complete!');
    } catch (error) {
      console.error('Error exporting to PNG:', error);
      throw new Error(`Failed to export PNG: ${error}`);
    }
  };

  // Export to JSON
  const exportToJSON = async () => {
    try {
      setExportProgress('Starting JSON export...');
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setExportProgress('Processing diagram data...');
      const simplifiedShapes = diagramData.shapes.map(shape => {
        const { preview, ...rest } = shape;
        return rest;
      });
      
      const exportData = {
        shapes: simplifiedShapes,
        connections: diagramData.connections,
        metadata: {
          exportDate: new Date().toISOString(),
          version: '1.0'
        }
      };
      
      setExportProgress('Creating JSON file...');
      const jsonString = JSON.stringify(exportData, null, 2);
      await new Promise(resolve => setTimeout(resolve, 300));
      
      setExportProgress('Saving file...');
      downloadFile(jsonString, 'diagram.json');
      
      setExportProgress('Export complete!');
    } catch (error) {
      console.error('Error exporting to JSON:', error);
      throw new Error(`Failed to export JSON: ${error}`);
    }
  };

  // Export to XML
  const exportToXML = async () => {
    try {
      setExportProgress('Starting XML export...');
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setExportProgress('Creating XML structure...');
      let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
      xml += '<diagram>\n';
      xml += '  <metadata>\n';
      xml += `    <exportDate>${new Date().toISOString()}</exportDate>\n`;
      xml += '    <version>1.0</version>\n';
      xml += '  </metadata>\n';
      
      xml += '  <shapes>\n';
      diagramData.shapes.forEach(shape => {
        xml += '    <shape>\n';
        xml += `      <id>${shape.id}</id>\n`;
        xml += `      <type>${shape.type}</type>\n`;
        xml += `      <title>${escapeXML(shape.title || '')}</title>\n`;
        xml += `      <x>${shape.x}</x>\n`;
        xml += `      <y>${shape.y}</y>\n`;
        if (shape.width) xml += `      <width>${shape.width}</width>\n`;
        if (shape.height) xml += `      <height>${shape.height}</height>\n`;
        if (shape.text) xml += `      <text>${escapeXML(shape.text)}</text>\n`;
        xml += '    </shape>\n';
      });
      xml += '  </shapes>\n';
      
      setExportProgress('Adding connections...');
      await new Promise(resolve => setTimeout(resolve, 300));
      
      xml += '  <connections>\n';
      diagramData.connections.forEach(connection => {
        xml += '    <connection>\n';
        xml += `      <id>${connection.id}</id>\n`;
        xml += `      <from>${connection.from}</from>\n`;
        xml += `      <to>${connection.to}</to>\n`;
        xml += '    </connection>\n';
      });
      xml += '  </connections>\n';
      xml += '</diagram>';
      
      setExportProgress('Saving file...');
      downloadFile(xml, 'diagram.xml');
      
      setExportProgress('Export complete!');
    } catch (error) {
      console.error('Error exporting to XML:', error);
      throw new Error(`Failed to export XML: ${error}`);
    }
  };

  const escapeXML = (text: string): string => {
    if (!text) return '';
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  };

  const handleExport = async (format: string) => {
    try {
      setExporting(true);
      setError(null);
      setExportProgress("");

      switch (format.toLowerCase()) {
        case 'pdf':
          await exportToPDF();
          break;
        case 'png':
          await exportToPNG();
          break;
        case 'json':
          await exportToJSON();
          break;
        case 'xml':
          await exportToXML();
          break;
        default:
          throw new Error('Export format not supported');
      }

      setTimeout(() => {
        onClose();
        setExportProgress("");
      }, 1000);

    } catch (err) {
      console.error("Export error:", err);
      setError(`${err}`);
      setExportProgress("");
    } finally {
      setTimeout(() => {
        setExporting(false);
      }, 1000);
    }
  };

  // Status check for visual feedback
  const getCanvasStatus = () => {
    const stage = getKonvaStage();
    if (!stage) return { available: false, message: 'Canvas not found' };
    
    if (diagramData.shapes.length === 0) {
      return { available: false, message: 'No shapes in diagram yet' };
    }
    
    if (!validateCanvasContent(stage)) {
      return { available: false, message: 'Canvas is empty or invalid' };
    }
    
    return { available: true, message: 'Ready to export' };
  };

  const canvasStatus = getCanvasStatus();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-96 shadow-lg overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-medium">Export Diagram</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
            disabled={exporting}
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-4">
          <p className="text-sm text-gray-600 mb-4">
            Choose format to export diagram. Export will focus on the area containing shapes.
          </p>

          {/* Canvas Status */}
          <div className={`mb-4 p-3 text-sm rounded-md flex items-center ${
            canvasStatus.available 
              ? 'bg-green-50 text-green-600' 
              : 'bg-yellow-50 text-yellow-600'
          }`}>
            <span className="mr-2">
              {canvasStatus.available ? '✅' : '⚠️'}
            </span>
            {canvasStatus.message}
          </div>

          {error && (
            <div className="mb-4 p-3 text-sm bg-red-50 text-red-600 rounded-md">
              {error}
            </div>
          )}

          {exporting && (
            <div className="mb-4 p-3 text-sm bg-blue-50 text-blue-600 rounded-md flex items-center">
              <Loader2 className="animate-spin mr-2" size={16} />
              <span>{exportProgress}</span>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => handleExport("pdf")}
              disabled={exporting || !canvasStatus.available}
              data-testid="export-pdf"
              className="flex items-center justify-center p-3 border rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FileText className="mr-2 text-red-500" size={20} />
              <span>PDF</span>
            </button>

            <button
              onClick={() => handleExport("png")}
              disabled={exporting || !canvasStatus.available}
              data-testid="export-png"
              className="flex items-center justify-center p-3 border rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Image className="mr-2 text-green-500" size={20} />
              <span>PNG</span>
            </button>

            <button
              onClick={() => handleExport("json")}
              disabled={exporting}
              data-testid="export-json"
              className="flex items-center justify-center p-3 border rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FileJson className="mr-2 text-blue-500" size={20} />
              <span>JSON</span>
            </button>

            <button
              onClick={() => handleExport("xml")}
              disabled={exporting}
              data-testid="export-xml"
              className="flex items-center justify-center p-3 border rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Code className="mr-2 text-purple-500" size={20} />
              <span>XML</span>
            </button>
          </div>

          {/* Debug info */}
          {process.env.NODE_ENV === 'development' && (
            <div className="mt-4 p-2 text-xs bg-gray-50 rounded">
              <div>Shapes: {diagramData.shapes.length}</div>
              <div>Connections: {diagramData.connections.length}</div>
              <div>Konva stages: {(() => {
                try {
                  // @ts-ignore
                  return window.Konva?.stages?.length || 0;
                } catch {
                  return 'N/A';
                }
              })()}</div>
              {(() => {
                const bbox = getShapesBoundingBox();
                if (bbox) {
                  return (
                    <div>Export area: {Math.round(bbox.width)}x{Math.round(bbox.height)} at ({Math.round(bbox.x)}, {Math.round(bbox.y)})</div>
                  );
                }
                return <div>Export area: Not calculated</div>;
              })()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExportModal;