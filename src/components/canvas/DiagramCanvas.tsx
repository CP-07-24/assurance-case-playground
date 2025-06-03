import React, { useCallback, useEffect, useRef } from 'react';
import { Stage, Layer } from 'react-konva';
import { useDiagramContext } from '../../context/DiagramContext';
import GridBackground from './GridBackground';
import DiagramShape from './DiagramShape';
import Connection from './Connection';
import { KonvaEventObject } from 'konva/lib/Node';

const DiagramCanvas: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  const {
    shapes,
    connections,
    selectedId,
    setSelectedId,
    addShape,
    updateShapePosition,
    zoomLevel,
    setStageSize,
    cancelConnection,
    isConnecting,
    stageRef
  } = useDiagramContext();

  const updateSize = useCallback(() => {
    if (!containerRef.current) return;

    const { width, height } = containerRef.current.getBoundingClientRect();

    // Only update if size actually changed
    setStageSize(prev => {
      const roundedWidth = Math.round(width);
      const roundedHeight = Math.round(height);
      return (prev.width === roundedWidth && prev.height === roundedHeight)
        ? prev
        : { width: roundedWidth, height: roundedHeight };
    });
  }, [setStageSize]); // setStageSize is now stable

  useEffect(() => {
    updateSize();

    // Add debounce to resize handler
    const handleResize = debounce(updateSize, 100);
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [updateSize]); // Now depends on memoized callback

  function debounce<T extends (...args: any[]) => void>(fn: T, delay: number) {
    let timeoutId: number;
    return (...args: Parameters<T>) => {
      clearTimeout(timeoutId);
      timeoutId = window.setTimeout(() => fn(...args), delay);
    };
  }

  useEffect(() => {
    updateSize();

    // Add debounce to resize handler
    const handleResize = debounce(updateSize, 100);
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [updateSize]); // Now depends on memoized callback

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();

    const shapeData = e.dataTransfer.getData('shape');
    if (!shapeData) return;

    const shape = JSON.parse(shapeData);

    const stageContainer = stageRef.current.container();
    const stagePos = stageContainer.getBoundingClientRect();

    const x = (e.clientX - stagePos.left) / zoomLevel;
    const y = (e.clientY - stagePos.top) / zoomLevel;

    addShape({
      ...shape,
      x,
      y,
      id: Date.now().toString()
    });
  };

  const handleStageClick = (e: KonvaEventObject<MouseEvent>) => {
    if (e.target === e.currentTarget) {
      setSelectedId(null);
      if (isConnecting) {
        cancelConnection();
      }
    }
  };

  return (
    <div
      ref={containerRef}
      className="w-full h-full bg-gray-50 overflow-hidden"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <Stage
        ref={stageRef} // Connect the ref to the Stage component
        width={containerRef.current?.clientWidth || window.innerWidth}
        height={containerRef.current?.clientHeight || window.innerHeight}
        scaleX={zoomLevel}
        scaleY={zoomLevel}
        onClick={handleStageClick}
      >
        <Layer>
          <GridBackground
            width={5000}
            height={5000}
            spacing={20}
          />
        </Layer>

        <Layer>
          {connections.map((connection) => (
            <Connection key={connection.id} connection={connection} />
          ))}

          {shapes.map((shape) => (
            <DiagramShape
              key={shape.id}
              shape={shape}
              isSelected={shape.id === selectedId}
              onSelect={() => setSelectedId(shape.id)}
              onChange={(newAttrs) => updateShapePosition(shape.id, newAttrs)}
            />
          ))}
        </Layer>
      </Stage>
    </div>
  );
};

export default DiagramCanvas;