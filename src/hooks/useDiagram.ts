import { useEffect } from 'react';
import { useDiagramContext } from '../context/DiagramContext';
import { Shape, ShapeOnCanvas } from '../types/shapes';

export const useDiagram = () => {
  const {
    shapes,
    selectedId,
    selectedShape,
    addShape,
    updateShapePosition,
    setSelectedId,
    updateSelectedShape,
  } = useDiagramContext();

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Handle delete/backspace to remove selected shape
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedId) {
        // This would need additional implementation in the context
        console.log('Delete shape', selectedId);
      }
      
      // Ctrl+Z for undo
      if (e.ctrlKey && e.key === 'z') {
        e.preventDefault();
        // Implemented in context
      }
      
      // Ctrl+Y for redo
      if (e.ctrlKey && e.key === 'y') {
        e.preventDefault();
        // Implemented in context
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedId]);

  const addShapeToCanvas = (shape: Shape) => {
    const newShape: ShapeOnCanvas = {
      ...shape,
      id: Date.now().toString(),
      x: 100,
      y: 100,
      width: 100,
      height: 50,
    };
    
    addShape(newShape);
    setSelectedId(newShape.id);
  };

  return {
    shapes,
    selectedShape,
    selectedId,
    addShapeToCanvas,
    updateShape: updateShapePosition,
    selectShape: setSelectedId,
    updateSelectedShape,
  };
};