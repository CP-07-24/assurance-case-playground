import React, { useMemo } from "react";
import { Rect, Line } from "react-konva";

interface GridBackgroundProps {
  width: number;
  height: number;
  spacing: number;
}

const GridBackground: React.FC<GridBackgroundProps> = ({
  width,
  height,
  spacing,
}) => {
  // Menggunakan useMemo untuk menghindari re-rendering grid lines yang tidak perlu
  const gridLines = useMemo(() => {
    const lines = [];
    const horizontalLinesCount = Math.ceil(height / spacing);
    const verticalLinesCount = Math.ceil(width / spacing);

    // Buat horizontal lines
    for (let i = 0; i <= horizontalLinesCount; i++) {
      const y = i * spacing;
      lines.push(
        <Line
          key={`h-${i}`}
          points={[0, y, width, y]}
          stroke="#e0e0e0"
          strokeWidth={0.5}
          listening={false}
          perfectDrawEnabled={false} // Meningkatkan performa rendering
          shadowForStrokeEnabled={false} // Meningkatkan performa rendering
        />
      );
    }

    // Buat vertical lines
    for (let i = 0; i <= verticalLinesCount; i++) {
      const x = i * spacing;
      lines.push(
        <Line
          key={`v-${i}`}
          points={[x, 0, x, height]}
          stroke="#e0e0e0"
          strokeWidth={0.5}
          listening={false}
          perfectDrawEnabled={false} // Meningkatkan performa rendering
          shadowForStrokeEnabled={false} // Meningkatkan performa rendering
        />
      );
    }

    return lines;
  }, [width, height, spacing]);

  return (
    <>
      <Rect
        x={0}
        y={0}
        width={width}
        height={height}
        fill="#f9fafb"
        listening={false}
        perfectDrawEnabled={false}
      />
      {gridLines}
    </>
  );
};

export default React.memo(GridBackground);
