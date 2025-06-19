import { ShapeOnCanvas, Connection } from '../../types/shapes';

interface DiagramData {
  shapes: ShapeOnCanvas[];
  connections: Connection[];
}

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

// Export to PDF - IMPROVED with better canvas checking
export const exportToPDF = async (stageRef: React.RefObject<any>) => {
  console.log('PDF Export - Stage ref received:', stageRef);
  console.log('PDF Export - Stage ref current:', stageRef?.current);
  
  // Better canvas validation
  if (!stageRef) {
    throw new Error('Stage reference is null. Make sure the stageRef is passed correctly.');
  }
  
  if (!stageRef.current) {
    throw new Error('Stage reference is not attached to any element. Make sure your canvas/stage component uses ref={stageRef}.');
  }
  
  // Check if the stage has the required method
  if (typeof stageRef.current.toDataURL !== 'function') {
    console.log('Available methods on stage:', Object.getOwnPropertyNames(stageRef.current));
    throw new Error('Stage element does not have toDataURL method. Make sure you are using a canvas or Konva stage.');
  }
  
  try {
    console.log('Beginning PDF export');
    const { default: jsPDF } = await import('jspdf');
    
    console.log('Getting stage data URL');
    const dataUrl = stageRef.current.toDataURL({ pixelRatio: 2 });
    
    console.log('Creating PDF document');
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'px',
    });
    
    const imgProps = pdf.getImageProperties(dataUrl);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    
    console.log('Adding image to PDF');
    pdf.addImage(dataUrl, 'PNG', 0, 0, pdfWidth, pdfHeight);
    
    console.log('Saving PDF');
    pdf.save('diagram.pdf');
    console.log('PDF export complete');
  } catch (error) {
    console.error('Error exporting to PDF:', error);
    throw new Error(`Failed to export as PDF: ${error}`);
  }
};

// Export to PNG - IMPROVED with better canvas checking
export const exportToPNG = (stageRef: any) => {
  console.log('PNG Export - Stage ref received:', stageRef);
  console.log('PNG Export - Stage ref current:', stageRef?.current);
  
  if (!stageRef) {
    throw new Error('Stage reference is null. Make sure the stageRef is passed correctly.');
  }
  
  if (!stageRef.current) {
    throw new Error('Stage reference is not attached to any element. Make sure your canvas/stage component uses ref={stageRef}.');
  }
  
  if (typeof stageRef.current.toDataURL !== 'function') {
    console.log('Available methods on stage:', Object.getOwnPropertyNames(stageRef.current));
    throw new Error('Stage element does not have toDataURL method. Make sure you are using a canvas or Konva stage.');
  }
  
  try {
    console.log('Beginning PNG export');
    
    console.log('Getting stage data URL');
    const dataUrl = stageRef.current.toDataURL({ 
      pixelRatio: 2,
      mimeType: 'image/png'
    });
    
    console.log('Downloading PNG');
    downloadFile(dataUrl, 'diagram.png');
    console.log('PNG export complete');
  } catch (error) {
    console.error('Error exporting to PNG:', error);
    throw new Error(`Failed to export as PNG: ${error}`);
  }
};

// Export to JSON - No canvas needed
export const exportToJSON = (diagramData: DiagramData) => {
  try {
    console.log('Beginning JSON export');
    
    const simplifiedShapes = diagramData.shapes.map(shape => {
      const { preview, ...rest } = shape;
      return rest;
    });
    
    const exportData = {
      shapes: simplifiedShapes,
      connections: diagramData.connections
    };
    
    console.log('Exporting diagram data:', exportData);
    const jsonString = JSON.stringify(exportData, null, 2);
    downloadFile(jsonString, 'diagram.json');
    console.log('JSON export complete');
  } catch (error) {
    console.error('Error exporting to JSON:', error);
    throw new Error(`Failed to export as JSON: ${error}`);
  }
};

// Export to XML - No canvas needed
export const exportToXML = (diagramData: DiagramData) => {
  try {
    console.log('Beginning XML export');
    
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<diagram>\n';
    
    xml += '  <shapes>\n';
    diagramData.shapes.forEach(shape => {
      xml += '    <shape>\n';
      xml += `      <id>${shape.id}</id>\n`;
      xml += `      <type>${shape.type}</type>\n`;
      xml += `      <title>${escapeXML(shape.title)}</title>\n`;
      xml += `      <x>${shape.x}</x>\n`;
      xml += `      <y>${shape.y}</y>\n`;
      
      if (shape.width) xml += `      <width>${shape.width}</width>\n`;
      if (shape.height) xml += `      <height>${shape.height}</height>\n`;
      if (shape.cornerRadius) xml += `      <cornerRadius>${shape.cornerRadius}</cornerRadius>\n`;
      if (shape.text) xml += `      <text>${escapeXML(shape.text)}</text>\n`;
      if (shape.idText) xml += `      <idText>${escapeXML(shape.idText)}</idText>\n`;
      if (shape.value) xml += `      <value>${escapeXML(shape.value)}</value>\n`;
      if (shape.fontFamily) xml += `      <fontFamily>${shape.fontFamily}</fontFamily>\n`;
      if (shape.fontSize) xml += `      <fontSize>${shape.fontSize}</fontSize>\n`;
      if (shape.fontWeight) xml += `      <fontWeight>${shape.fontWeight}</fontWeight>\n`;
      if (shape.fontStyle) xml += `      <fontStyle>${shape.fontStyle}</fontStyle>\n`;
      if (shape.align) xml += `      <align>${shape.align}</align>\n`;
      if (shape.textDecoration) xml += `      <textDecoration>${shape.textDecoration}</textDecoration>\n`;
      if (shape.interLine) xml += `      <interLine>${shape.interLine}</interLine>\n`;
      if (shape.description) xml += `      <description>${escapeXML(shape.description)}</description>\n`;
      
      xml += '    </shape>\n';
    });
    xml += '  </shapes>\n';
    
    xml += '  <connections>\n';
    diagramData.connections.forEach(connection => {
      xml += '    <connection>\n';
      xml += `      <id>${connection.id}</id>\n`;
      xml += `      <from>${connection.from}</from>\n`;
      xml += `      <to>${connection.to}</to>\n`;
      xml += `      <style>${connection.style}</style>\n`;
      if (connection.points && connection.points.length > 0) {
        xml += '      <points>\n';
        for (let i = 0; i < connection.points.length; i += 2) {
          if (i + 1 < connection.points.length) {
            xml += `        <point x="${connection.points[i]}" y="${connection.points[i + 1]}" />\n`;
          }
        }
        xml += '      </points>\n';
      }
      xml += '    </connection>\n';
    });
    xml += '  </connections>\n';
    
    xml += '</diagram>';
    
    console.log('Downloading XML');
    downloadFile(xml, 'diagram.xml');
    console.log('XML export complete');
  } catch (error) {
    console.error('Error exporting to XML:', error);
    throw new Error(`Failed to export as XML: ${error}`);
  }
};

function escapeXML(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

// Main export function with better error handling
export const exportDiagram = async (format: string, stageRef: any, diagramData: DiagramData): Promise<void> => {
  console.log(`Starting export in ${format} format`);
  console.log('Stage ref:', stageRef);
  console.log('Diagram data:', diagramData);
  
  switch (format.toLowerCase()) {
    case 'pdf':
      await exportToPDF(stageRef);
      break;
    case 'png':
      exportToPNG(stageRef);
      break;
    case 'json':
      exportToJSON(diagramData);
      break;
    case 'xml':
      exportToXML(diagramData);
      break;
    default:
      console.error('Unsupported export format:', format);
      throw new Error('Unsupported export format. Please choose PDF, PNG, JSON, or XML.');
  }
};

export default exportDiagram;