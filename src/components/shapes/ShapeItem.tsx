import React from "react";
import { useDiagram } from "../../hooks/useDiagram";
import { Shape } from "../../types/shapes";

interface ShapeItemProps {
  shape: Shape;
}

const ShapeItem: React.FC<ShapeItemProps> = ({ shape }) => {
  const { addShapeToCanvas } = useDiagram();

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData("shape", JSON.stringify(shape));
    e.dataTransfer.effectAllowed = "copy";
  };

  const handleClick = () => {
    addShapeToCanvas(shape, 0);
  };

  return (
    <div
      className="flex flex-col items-center p-2 cursor-grab hover:bg-gray-50 rounded-sm border border-gray-200"
      draggable
      onDragStart={handleDragStart}
      onClick={handleClick}
    >
      <div className="w-full h-16 flex items-center justify-center">
        {shape.preview}
      </div>
      <div className="mt-1 text-xs text-center truncate w-full">
        {shape.title}
      </div>
    </div>
  );
};

export default ShapeItem;
