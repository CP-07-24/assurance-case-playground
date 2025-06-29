import { ShapeOnCanvas, Connection } from '../../types/shapes';

interface DiagramData {
  shapes: ShapeOnCanvas[];
  connections: Connection[];
}

// Generate unique ID
const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

// Helper function to get error message
const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  return String(error);
};

// Parse JSON file content
export const parseJSONDiagram = (content: string): DiagramData => {
  try {
    const data = JSON.parse(content);
    
    // Validate structure
    if (!data || typeof data !== 'object') {
      throw new Error('Format JSON tidak valid');
    }
    
    if (!data.shapes || !Array.isArray(data.shapes)) {
      throw new Error('Format JSON tidak valid: properti "shapes" diperlukan dan harus berupa array');
    }
    
    // Process shapes
    const shapes: ShapeOnCanvas[] = data.shapes.map((shape: any, index: number) => {
      if (!shape || typeof shape !== 'object') {
        throw new Error(`Shape ke-${index + 1} tidak valid`);
      }
      
      return {
        id: shape.id || generateId(),
        type: shape.type || 'unknown',
        title: shape.title || 'Untitled',
        x: typeof shape.x === 'number' ? shape.x : 0,
        y: typeof shape.y === 'number' ? shape.y : 0,
        width: typeof shape.width === 'number' ? shape.width : 100,
        height: typeof shape.height === 'number' ? shape.height : 50,
        cornerRadius: typeof shape.cornerRadius === 'number' ? shape.cornerRadius : 0,
        text: shape.text || '',
        mainText: shape.mainText || shape.text || '', // Add mainText property
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
        // Reset preview component
        preview: null
      } as ShapeOnCanvas;
    });
    
    // Process connections
    const connections: Connection[] = (data.connections || []).map((connection: any, index: number) => {
      if (!connection || typeof connection !== 'object') {
        throw new Error(`Connection ke-${index + 1} tidak valid`);
      }
      
      return {
        id: connection.id || generateId(),
        from: connection.from || '',
        to: connection.to || '',
        style: connection.style || 'arrow',
        points: Array.isArray(connection.points) ? connection.points : []
      } as Connection;
    });
    
    return { shapes, connections };
  } catch (error) {
    console.error('Error parsing JSON:', error);
    if (error instanceof SyntaxError) {
      throw new Error('File JSON tidak valid: Format JSON rusak');
    }
    throw new Error(`Gagal parsing file JSON: ${getErrorMessage(error)}`);
  }
};

// Parse XML file content
export const parseXMLDiagram = (content: string): DiagramData => {
  try {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(content, 'text/xml');
    
    // Check for parsing errors
    const parserError = xmlDoc.querySelector('parsererror');
    if (parserError) {
      throw new Error('File XML tidak valid: Format XML rusak');
    }
    
    const shapes: ShapeOnCanvas[] = [];
    const connections: Connection[] = [];
    
    // Helper function to get element value
    const getElementValue = (parent: Element, tagName: string): string => {
      const element = parent.querySelector(tagName);
      return element ? (element.textContent || '').trim() : '';
    };
    
    // Parse shapes
    const shapeElements = xmlDoc.querySelectorAll('diagram > shapes > shape');
    shapeElements.forEach((element, index) => {
      try {
        const shape: ShapeOnCanvas = {
          id: getElementValue(element, 'id') || generateId(),
          type: getElementValue(element, 'type') || 'unknown',
          title: getElementValue(element, 'title') || 'Untitled',
          x: parseFloat(getElementValue(element, 'x') || '0'),
          y: parseFloat(getElementValue(element, 'y') || '0'),
          width: parseFloat(getElementValue(element, 'width') || '100'),
          height: parseFloat(getElementValue(element, 'height') || '50'),
          cornerRadius: parseFloat(getElementValue(element, 'cornerRadius') || '0'),
          text: getElementValue(element, 'text') || '',
          mainText: getElementValue(element, 'mainText') || getElementValue(element, 'text') || '', // Add mainText property
          idText: getElementValue(element, 'idText') || '',
          value: getElementValue(element, 'value') || '',
          fontFamily: getElementValue(element, 'fontFamily') || 'Arial',
          fontSize: parseFloat(getElementValue(element, 'fontSize') || '14'),
          fontWeight: getElementValue(element, 'fontWeight') || 'normal',
          fontStyle: getElementValue(element, 'fontStyle') || 'normal',
          align: getElementValue(element, 'align') as any || 'center',
          textDecoration: getElementValue(element, 'textDecoration') || 'none',
          interLine: getElementValue(element, 'interLine') || 'normal',
          description: getElementValue(element, 'description') || '',
          descFontSize: parseFloat(getElementValue(element, 'descFontSize') || '12'),
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
          const x = parseFloat(pointEl.getAttribute('x') || '0');
          const y = parseFloat(pointEl.getAttribute('y') || '0');
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
    
    return { shapes, connections };
  } catch (error) {
    console.error('Error parsing XML:', error);
    throw new Error(`Gagal parsing file XML: ${getErrorMessage(error)}`);
  }
};

// Validate imported data
export const validateDiagramData = (data: DiagramData): boolean => {
  if (!data || typeof data !== 'object') {
    throw new Error('Data diagram tidak valid');
  }
  
  if (!Array.isArray(data.shapes)) {
    throw new Error('Shapes harus berupa array');
  }
  
  if (!Array.isArray(data.connections)) {
    throw new Error('Connections harus berupa array');
  }
  
  // Validate each shape has required fields
  data.shapes.forEach((shape, index) => {
    if (!shape.id) {
      throw new Error(`Shape ke-${index + 1} tidak memiliki ID`);
    }
    if (typeof shape.x !== 'number' || typeof shape.y !== 'number') {
      throw new Error(`Shape ke-${index + 1} tidak memiliki koordinat yang valid`);
    }
  });
  
  // Validate each connection has required fields
  data.connections.forEach((connection, index) => {
    if (!connection.id) {
      throw new Error(`Connection ke-${index + 1} tidak memiliki ID`);
    }
    if (!connection.from || !connection.to) {
      throw new Error(`Connection ke-${index + 1} tidak memiliki from/to yang valid`);
    }
  });
  
  return true;
};

// Process file berdasarkan extension
export const processImportFile = async (file: File): Promise<DiagramData> => {
  const extension = file.name.toLowerCase().split('.').pop();
  
  if (!extension || !['json', 'xml'].includes(extension)) {
    throw new Error('Format file tidak didukung. Gunakan file .json atau .xml');
  }
  
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
};

// Get file information
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
    isSupported: ['json', 'xml'].includes(extension || '')
  };
};

// Main import function
export const importDiagram = (content: string, format: 'json' | 'xml'): DiagramData => {
  if (format === 'json') {
    return parseJSONDiagram(content);
  } else if (format === 'xml') {
    return parseXMLDiagram(content);
  } else {
    throw new Error(`Unsupported import format: ${format}`);
  }
};