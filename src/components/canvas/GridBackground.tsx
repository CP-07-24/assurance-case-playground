import React, { useRef, useEffect } from 'react';
import { Rect, Line } from 'react-konva';

interface GridBackgroundProps {
  width: number;
  height: number;
  spacing: number;
}

const GridBackground: React.FC<GridBackgroundProps> = ({ width, height, spacing }) => {
  // Pre-create grid lines for better performance
  const horizontalLines = [];
  const verticalLines = [];
  
  for (let i = 0; i <= height; i += spacing) {
    horizontalLines.push(
      <Line
        key={`h-${i}`}
        points={[0, i, width, i]}
        stroke="#e0e0e0"
        strokeWidth={0.5}
      />
    );
  }
  
  for (let i = 0; i <= width; i += spacing) {
    verticalLines.push(
      <Line
        key={`v-${i}`}
        points={[i, 0, i, height]}
        stroke="#e0e0e0"
        strokeWidth={0.5}
      />
    );
  }

  return (
    <>
      <Rect
        x={0}
        y={0}
        width={width}
        height={height}
        fill="#f9fafb"
      />
      {horizontalLines}
      {verticalLines}
    </>
  );
};

export default GridBackground;