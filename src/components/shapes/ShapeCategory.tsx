import React, { useState } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import ShapeItem from './ShapeItem';
import { Shape } from '../../types/shapes';

interface ShapeCategoryProps {
  title: string;
  shapes: Shape[];
  filter: string;
}

const ShapeCategory: React.FC<ShapeCategoryProps> = ({ title, shapes, filter }) => {
  const [isOpen, setIsOpen] = useState(true);
  
  const filteredShapes = filter 
    ? shapes.filter(shape => shape.title.toLowerCase().includes(filter.toLowerCase()))
    : shapes;
    
  if (filter && filteredShapes.length === 0) {
    return null;
  }

  return (
    <div className="border-b border-gray-200">
      <button
        className="flex items-center justify-between w-full px-4 py-3 text-left text-sm font-medium text-gray-700 hover:bg-gray-50"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{title}</span>
        {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>
      
      {isOpen && (
        <div className="grid grid-cols-3 gap-2 px-3 pb-3">
          {filteredShapes.map((shape) => (
            <ShapeItem key={shape.id} shape={shape} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ShapeCategory;