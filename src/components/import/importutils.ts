import { ShapeOnCanvas, Connection } from '../../types/shapes';

interface DiagramData {
  shapes: ShapeOnCanvas[];
  connections: Connection[];
}

// Parse JSON file content
export const parseJSONDiagram = (content: string): DiagramData => {
  try {
    const parsed = JSON.parse(content);
    
    // Basic validation
    if (!parsed.shapes || !Array.isArray(parsed.shapes)) {
      throw new Error('Invalid JSON format: shapes array not found');
    }
    
    if (!parsed.connections || !Array.isArray(parsed.connections)) {
      throw new Error('Invalid JSON format: connections array not found');
    }
    
    // Further validation of shapes
    const shapes = parsed.shapes.map((shape: any) => {
      if (!shape.id || !shape.type || !shape.title) {
        throw new Error('Invalid shape data: missing required properties');
      }
      
      // Create a proper ShapeOnCanvas object
      return {
        id: shape.id,
        type: shape.type,
        title: shape.title,
        x: shape.x !== undefined ? Number(shape.x) : 0,
        y: shape.y !== undefined ? Number(shape.y) : 0,
        width: shape.width !== undefined ? Number(shape.width) : 100,
        height: shape.height !== undefined ? Number(shape.height) : 50,
        cornerRadius: shape.cornerRadius !== undefined ? Number(shape.cornerRadius) : 0,
        text: shape.text || '',
        idText: shape.idText || '',
        value: shape.value || '',
        fontFamily: shape.fontFamily || 'Arial',
        fontSize: shape.fontSize !== undefined ? Number(shape.fontSize) : 14,
        fontWeight: shape.fontWeight || 'normal',
        fontStyle: shape.fontStyle || 'normal',
        align: shape.align || 'center',
        textDecoration: shape.textDecoration || 'none',
        interLine: shape.interLine || 'normal',
        description: shape.description || '',
        descFontSize: shape.descFontSize !== undefined ? Number(shape.descFontSize) : 12,
        descFontWeight: shape.descFontWeight || 'normal',
        descInterLine: shape.descInterLine || 'normal',
        // We don't import the preview since it's a React component
        preview: null
      } as ShapeOnCanvas;
    });
    
    // Validate connections
    const connections = parsed.connections.map((connection: any) => {
      if (!connection.id || !connection.from || !connection.to) {
        throw new Error('Invalid connection data: missing required properties');
      }
      
      return {
        id: connection.id,
        from: connection.from,
        to: connection.to,
        points: Array.isArray(connection.points) ? connection.points : []
      } as Connection;
    });
    
    return { shapes, connections };
  } catch (error) {
    console.error('Error parsing JSON:', error);
    throw new Error(`Failed to parse JSON file: ${error}`);
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
      throw new Error('XML parsing error');
    }
    
    const shapes: ShapeOnCanvas[] = [];
    const connections: Connection[] = [];
    
    // Parse shapes
    const shapeElements = xmlDoc.querySelectorAll('diagram > shapes > shape');
    shapeElements.forEach((element) => {
      const shape: Partial<ShapeOnCanvas> = {
        id: getElementValue(element, 'id') || generateId(),
        type: getElementValue(element, 'type') || 'unknown',
        title: getElementValue(element, 'title') || 'Untitled',
        x: parseFloat(getElementValue(element, 'x') || '0'),
        y: parseFloat(getElementValue(element, 'y') || '0'),
        width: parseFloat(getElementValue(element, 'width') || '100'),
        height: parseFloat(getElementValue(element, 'height') || '50'),
        cornerRadius: parseFloat(getElementValue(element, 'cornerRadius') || '0'),
        text: getElementValue(element, 'text') || '',
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
        // We don't import the preview since it's a React component
        preview: null
      };
      
      shapes.push(shape as ShapeOnCanvas);
    });
    
      // Parse connections
    const connectionElements = xmlDoc.querySelectorAll('diagram > connections > connection');
    connectionElements.forEach((element) => {
      const connection: Connection = {
        id: getElementValue(element, 'id') || generateId(),
        from: getElementValue(element, 'from') || '',
        to: getElementValue(element, 'to') || '',
        points: [],
        style: (getElementValue(element, 'style') as Connection["style"]) || 'line' // Tambahkan default style
      };
      
      // Parse points
      const pointElements = element.querySelectorAll('points > point');
      pointElements.forEach((point) => {
        const x = parseFloat(point.getAttribute('x') || '0');
        const y = parseFloat(point.getAttribute('y') || '0');
        connection.points.push(x, y);
      });
      
      connections.push(connection);
    });
    
    // Validate imported data
    if (shapes.length === 0) {
      throw new Error('No valid shapes found in the XML');
    }
    
    return { shapes, connections };
  } catch (error) {
    console.error('Error parsing XML:', error);
    throw new Error(`Failed to parse XML file: ${error}`);
  }
};

// Helper function to get text content of an XML element
function getElementValue(parent: Element, tagName: string): string | null {
  const element = parent.querySelector(tagName);
  return element ? element.textContent : null;
}

// Helper function to generate a unique ID
function generateId(): string {
  return `id-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}

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