import { ShapeOnCanvas, Connection } from '../../types/shapes';

interface DiagramData {
  shapes: ShapeOnCanvas[];
  connections: Connection[];
}

// Generate unique ID with better entropy
const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

// Helper function to get error message
const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  return String(error);
};

// Parse JSON file content with comprehensive validation
export const parseJSONDiagram = (content: string): DiagramData => {
  try {
    // Validate content is not empty
    if (!content || !content.trim()) {
      throw new Error('File is empty');
    }

    const data = JSON.parse(content);
    
    // Validate structure
    if (!data || typeof data !== 'object') {
      throw new Error('Invalid JSON format: File must contain a valid object');
    }
    
    if (!data.shapes || !Array.isArray(data.shapes)) {
      throw new Error('Invalid JSON format: "shapes" property is required and must be an array');
    }
    
    // Process shapes with validation
    const shapes: ShapeOnCanvas[] = data.shapes.map((shape: any, index: number) => {
      if (!shape || typeof shape !== 'object') {
        throw new Error(`Shape ${index + 1} is not a valid object`);
      }
      
      // Validate required fields
      if (typeof shape.x !== 'number' || typeof shape.y !== 'number') {
        console.warn(`Shape ${index + 1} has invalid coordinates, using defaults`);
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
        descFontSize: typeof shape.descFontSize === 'number' ? shape.descFontSize : 12,
        descFontWeight: shape.descFontWeight || 'normal',
        descInterLine: shape.descInterLine || 'normal',
        // Reset preview component as it can't be serialized
        preview: null
      } as ShapeOnCanvas;
    });
    
    // Process connections with validation
    const connections: Connection[] = (data.connections || []).map((connection: any, index: number) => {
      if (!connection || typeof connection !== 'object') {
        throw new Error(`Connection ${index + 1} is not a valid object`);
      }
      
      return {
        id: connection.id || generateId(),
        from: connection.from || '',
        to: connection.to || '',
        style: connection.style || 'arrow',
        points: Array.isArray(connection.points) ? connection.points : []
      } as Connection;
    });
    
    console.log(`Parsed ${shapes.length} shapes and ${connections.length} connections from JSON`);
    return { shapes, connections };
    
  } catch (error) {
    console.error('Error parsing JSON:', error);
    if (error instanceof SyntaxError) {
      throw new Error('Invalid JSON file: File contains syntax errors');
    }
    throw new Error(`Failed to parse JSON file: ${getErrorMessage(error)}`);
  }
};

// Parse XML file content with comprehensive validation
export const parseXMLDiagram = (content: string): DiagramData => {
  try {
    // Validate content is not empty
    if (!content || !content.trim()) {
      throw new Error('File is empty');
    }

    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(content, 'text/xml');
    
    // Check for parsing errors
    const parserError = xmlDoc.querySelector('parsererror');
    if (parserError) {
      throw new Error('Invalid XML file: File contains XML syntax errors');
    }
    
    const shapes: ShapeOnCanvas[] = [];
    const connections: Connection[] = [];
    
    // Helper function to get element value safely
    const getElementValue = (parent: Element, tagName: string): string => {
      const element = parent.querySelector(tagName);
      return element ? (element.textContent || '').trim() : '';
    };
    
    // Helper function to parse numeric values safely
    const parseNumericValue = (value: string, defaultValue: number): number => {
      const parsed = parseFloat(value);
      return isNaN(parsed) ? defaultValue : parsed;
    };
    
    // Parse shapes
    const shapeElements = xmlDoc.querySelectorAll('diagram > shapes > shape');
    shapeElements.forEach((element, index) => {
      try {
        const shape: ShapeOnCanvas = {
          id: getElementValue(element, 'id') || generateId(),
          type: getElementValue(element, 'type') || 'rectangle',
          title: getElementValue(element, 'title') || 'Untitled',
          x: parseNumericValue(getElementValue(element, 'x'), 0),
          y: parseNumericValue(getElementValue(element, 'y'), 0),
          width: parseNumericValue(getElementValue(element, 'width'), 100),
          height: parseNumericValue(getElementValue(element, 'height'), 50),
          cornerRadius: parseNumericValue(getElementValue(element, 'cornerRadius'), 0),
          text: getElementValue(element, 'text') || '',
          mainText: getElementValue(element, 'mainText') || getElementValue(element, 'text') || '',
          idText: getElementValue(element, 'idText') || '',
          value: getElementValue(element, 'value') || '',
          fontFamily: getElementValue(element, 'fontFamily') || 'Arial',
          fontSize: parseNumericValue(getElementValue(element, 'fontSize'), 14),
          fontWeight: getElementValue(element, 'fontWeight') || 'normal',
          fontStyle: getElementValue(element, 'fontStyle') || 'normal',
          align: getElementValue(element, 'align') as any || 'center',
          textDecoration: getElementValue(element, 'textDecoration') || 'none',
          interLine: getElementValue(element, 'interLine') || 'normal',
          description: getElementValue(element, 'description') || '',
          descFontSize: parseNumericValue(getElementValue(element, 'descFontSize'), 12),
          descFontWeight: getElementValue(element, 'descFontWeight') || 'normal',
          descInterLine: getElementValue(element, 'descInterLine') || 'normal',
          // Reset preview component
          preview: null
        };
        
        shapes.push(shape);
      } catch (error) {
        console.warn(`Warning: Skipping shape ${index + 1} due to parsing error:`, error);
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
          const x = parseNumericValue(pointEl.getAttribute('x') || '0', 0);
          const y = parseNumericValue(pointEl.getAttribute('y') || '0', 0);
          points.push(x, y);
        });
        
        const connection: Connection = {
          id: getElementValue(element, 'id') || generateId(),
          from: getElementValue(element, 'from'),
          to: getElementValue(element, 'to'),
          style: (getElementValue(element, 'style') as Connection['style']) || 'arrow',
          points: points.length > 0 ? points : []
        };
        
        connections.push(connection);
      } catch (error) {
        console.warn(`Warning: Skipping connection ${index + 1} due to parsing error:`, error);
      }
    });
    
    console.log(`Parsed ${shapes.length} shapes and ${connections.length} connections from XML`);
    return { shapes, connections };
    
  } catch (error) {
    console.error('Error parsing XML:', error);
    throw new Error(`Failed to parse XML file: ${getErrorMessage(error)}`);
  }
};

// Validate imported data thoroughly
export const validateDiagramData = (data: DiagramData): boolean => {
  if (!data || typeof data !== 'object') {
    throw new Error('Invalid diagram data: Must be an object');
  }
  
  if (!Array.isArray(data.shapes)) {
    throw new Error('Invalid diagram data: Shapes must be an array');
  }
  
  if (!Array.isArray(data.connections)) {
    throw new Error('Invalid diagram data: Connections must be an array');
  }
  
  // Validate each shape has required fields
  data.shapes.forEach((shape, index) => {
    if (!shape.id) {
      throw new Error(`Shape ${index + 1} is missing ID`);
    }
    if (typeof shape.x !== 'number' || typeof shape.y !== 'number') {
      throw new Error(`Shape ${index + 1} has invalid coordinates`);
    }
    if (typeof shape.width !== 'number' || typeof shape.height !== 'number') {
      console.warn(`Shape ${index + 1} has invalid dimensions, using defaults`);
    }
  });
  
  // Validate each connection has required fields
  data.connections.forEach((connection, index) => {
    if (!connection.id) {
      throw new Error(`Connection ${index + 1} is missing ID`);
    }
    if (!connection.from && !connection.to) {
      console.warn(`Connection ${index + 1} has no from/to references`);
    }
  });
  
  return true;
};

// Process file based on extension with improved error handling
export const processImportFile = async (file: File): Promise<DiagramData> => {
  // Validate file
  if (!file) {
    throw new Error('No file provided');
  }
  
  if (file.size === 0) {
    throw new Error('File is empty');
  }

  const extension = file.name.toLowerCase().split('.').pop();
  
  if (!extension || !['json', 'xml'].includes(extension)) {
    throw new Error('Unsupported file format. Use .json or .xml files');
  }
  
  try {
    const content = await file.text();
    
    let diagramData: DiagramData;
    
    if (extension === 'json') {
      diagramData = parseJSONDiagram(content);
    } else {
      diagramData = parseXMLDiagram(content);
    }
    
    // Validate data
    validateDiagramData(diagramData);
    
    return diagramData;
  } catch (error) {
    console.error('Error processing import file:', error);
    throw error; // Re-throw to maintain error context
  }
};

// Get file information for UI display
export const getFileInfo = (file: File) => {
  const extension = file.name.toLowerCase().split('.').pop();
  const size = file.size;
  const sizeText = size < 1024 ? `${size} B` : 
                  size < 1048576 ? `${(size / 1024).toFixed(1)} KB` :
                  `${(size / 1048576).toFixed(1)} MB`;
  
  return {
    name: file.name,
    extension,
    size,
    sizeText,
    type: file.type,
    isSupported: ['json', 'xml'].includes(extension || ''),
    isValidSize: size > 0 && size <= 10 * 1024 * 1024
  };
};

// Sanitize shape data for import (ensure no conflicts)
export const sanitizeShapeForImport = (shape: any): Partial<ShapeOnCanvas> => {
  return {
    ...shape,
    id: generateId(), // Always generate new ID to avoid conflicts
    preview: null, // Reset preview component
    // Add small offset to avoid exact overlap
    x: (shape.x || 0) + 10,
    y: (shape.y || 0) + 10
  };
};

// Sanitize connection data for import
export const sanitizeConnectionForImport = (connection: any): Partial<Connection> => {
  return {
    ...connection,
    id: generateId() // Always generate new ID to avoid conflicts
  };
};

// Main import function with format detection
export const importDiagram = (content: string, format: 'json' | 'xml'): DiagramData => {
  console.log(`Starting import with format: ${format}`);
  
  if (!content || !content.trim()) {
    throw new Error('Content is empty');
  }
  
  if (format === 'json') {
    return parseJSONDiagram(content);
  } else if (format === 'xml') {
    return parseXMLDiagram(content);
  } else {
    throw new Error(`Unsupported import format: ${format}`);
  }
};

// Auto-detect format from content
export const detectFileFormat = (content: string): 'json' | 'xml' | null => {
  if (!content || !content.trim()) {
    return null;
  }
  
  const trimmed = content.trim();
  
  // Check for XML
  if (trimmed.startsWith('<?xml') || trimmed.startsWith('<diagram')) {
    return 'xml';
  }
  
  // Check for JSON
  if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
    try {
      JSON.parse(trimmed);
      return 'json';
    } catch {
      return null;
    }
  }
  
  return null;
};