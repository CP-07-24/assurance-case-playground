import React from 'react';

interface ZoomSliderProps {
  value: number;
  onChange: (newValue: number) => void;
}

const ZoomSlider: React.FC<ZoomSliderProps> = ({ value, onChange }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(e.target.value);
    onChange(newValue);
  };

  return (
    <div className="flex items-center">
      <div className="text-xs text-gray-500 w-4">0</div>
      <input
        type="range"
        min="0.1"
        max="2"
        step="0.1"
        value={value}
        onChange={handleChange}
        className="h-1 w-32 mx-2 accent-blue-500 cursor-pointer"
      />
      <div className="text-xs text-gray-500 w-4">100</div>
    </div>
  );
};

export default ZoomSlider;