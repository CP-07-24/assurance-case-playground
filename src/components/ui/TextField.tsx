import React from "react";

interface TextFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  multiline?: boolean;
}

const TextField: React.FC<TextFieldProps> = ({
  label,
  value,
  onChange,
  multiline = false,
}) => {
  return (
    <div>
      <label className="block text-sm text-gray-600 mb-1">{label}</label>

      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md text-sm resize-none h-24 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      )}
    </div>
  );
};

export default TextField;
