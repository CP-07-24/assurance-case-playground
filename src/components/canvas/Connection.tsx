import React from 'react';
import { Line } from 'react-konva';
import { Connection as ConnectionType } from '../../types/shapes';
import { useDiagramContext } from '../../context/DiagramContext';

interface ConnectionProps {
  connection: ConnectionType;
}

const Connection: React.FC<ConnectionProps> = ({ connection }) => {
  const { shapes, updateConnection } = useDiagramContext();
  
  const fromShape = shapes.find(s => s.id === connection.from);
  const toShape = shapes.find(s => s.id === connection.to);
  
  if (!fromShape || !toShape) return null;
  
  const points = [
    fromShape.x + (fromShape.width || 100),
    fromShape.y + (fromShape.height || 50) / 2,
    toShape.x,
    toShape.y + (toShape.height || 50) / 2,
  ];
  
  React.useEffect(() => {
    updateConnection(connection.id, points);
  }, [fromShape.x, fromShape.y, toShape.x, toShape.y]);

  return (
    <Line
      points={points}
      stroke="#000"
      strokeWidth={2}
      tension={0.5}
    />
  );
};

export default Connection;