import React from 'react';
import { Rect, Text, Group, Transformer, Circle } from 'react-konva';
import { useDiagramContext } from '../../context/DiagramContext';
import { ShapeOnCanvas } from '../../types/shapes';

interface DiagramShapeProps {
  shape: ShapeOnCanvas;
  isSelected: boolean;
  onSelect: () => void;
  onChange: (newAttrs: Partial<ShapeOnCanvas>) => void;
}

const DiagramShape: React.FC<DiagramShapeProps> = ({
  shape,
  isSelected,
  onSelect,
  onChange,
}) => {
  const transformerRef = React.useRef<any>(null);
  const shapeRef = React.useRef<any>(null);
  const { startConnection, completeConnection, isConnecting, connectingFromId } = useDiagramContext();
  
  React.useEffect(() => {
    if (isSelected) {
      transformerRef.current.nodes([shapeRef.current]);
      transformerRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  const handleConnectorClick = (e: any) => {
    e.cancelBubble = true;
    
    if (isConnecting) {
      completeConnection(shape.id);
    } else {
      startConnection(shape.id);
    }
  };

  return (
    <>
      <Group
        ref={shapeRef}
        x={shape.x}
        y={shape.y}
        width={shape.width || 100}
        height={shape.height || 100}
        draggable
        onClick={onSelect}
        onTap={onSelect}
        onDragEnd={(e) => {
          onChange({
            x: e.target.x(),
            y: e.target.y(),
          });
        }}
        onTransformEnd={() => {
          const node = shapeRef.current;
          const scaleX = node.scaleX();
          const scaleY = node.scaleY();
          
          node.scaleX(1);
          node.scaleY(1);
          
          onChange({
            x: node.x(),
            y: node.y(),
            width: Math.max(5, node.width() * scaleX),
            height: Math.max(5, node.height() * scaleY),
          });
        }}
      >
        <Rect
          width={shape.width || 100}
          height={shape.height || 50}
          fill="white"
          stroke="black"
          strokeWidth={1}
          cornerRadius={shape.cornerRadius}
        />
        
        {/* ID Text */}
        <Text
          text={shape.idText || ''}
          width={shape.width || 100}
          height={20}
          y={5}
          align="center"
          fontSize={12}
          fill="#666"
        />
        
        {/* Value Text */}
        <Text
          text={shape.value || shape.text || 'Goals'}
          width={shape.width || 100}
          height={(shape.height || 50) - 25}
          y={25}
          align="center"
          verticalAlign="middle"
          fontSize={14}
          padding={5}
        />
        
        {/* Connection points */}
        <Circle
          x={0}
          y={(shape.height || 50) / 2}
          radius={5}
          fill={isConnecting && connectingFromId === shape.id ? "#3B82F6" : "#fff"}
          stroke="#000"
          strokeWidth={1}
          onClick={handleConnectorClick}
          onTap={handleConnectorClick}
        />
        
        <Circle
          x={shape.width || 100}
          y={(shape.height || 50) / 2}
          radius={5}
          fill={isConnecting && connectingFromId === shape.id ? "#3B82F6" : "#fff"}
          stroke="#000"
          strokeWidth={1}
          onClick={handleConnectorClick}
          onTap={handleConnectorClick}
        />
      </Group>
      
      {isSelected && (
        <Transformer
          ref={transformerRef}
          boundBoxFunc={(oldBox, newBox) => {
            if (newBox.width < 10 || newBox.height < 10) {
              return oldBox;
            }
            return newBox;
          }}
        />
      )}
    </>
  );
};

export default DiagramShape;