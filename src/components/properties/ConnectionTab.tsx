import React from "react";
import { useDiagramContext } from "../../store/DiagramContext";
import { Connection as ConnectionType } from "../../types/shapes";
import PropertySection from "./PropertySection";
// import SelectField from "../ui/SelectField";
import {
  Minus as MinusIcon,
  ArrowRight,
  ArrowLeftRight,
  MoreHorizontal,
} from "lucide-react";

const ConnectionTab: React.FC = () => {
  const { selectedConnection, updateConnection } = useDiagramContext();

  if (!selectedConnection) {
    return (
      <div className="p-6 text-center text-gray-500">
        <p>Select a connection to edit its properties</p>
      </div>
    );
  }

  // Define connection options with icons
  const connectionOptions = [
    {
      value: "line",
      label: "Line",
      icon: <MinusIcon size={16} />,
    },
    {
      value: "arrow",
      label: "InContextOf",
      icon: <ArrowRight size={16} />,
    },
    {
      value: "solidArrow",
      label: "SupportedBy",
      icon: <ArrowRight size={16} style={{ fill: "currentColor" }} />,
    },
    {
      value: "doubleArrow",
      label: "Double Arrow",
      icon: <ArrowLeftRight size={16} />,
    },
    {
      value: "dashed",
      label: "Dashed",
      icon: <MinusIcon size={16} style={{ strokeDasharray: "4,4" }} />,
    },
    {
      value: "dotted",
      label: "Dotted",
      icon: <MoreHorizontal size={16} />,
    },
  ];

  return (
    <div className="p-4">
      <PropertySection title="Connection Style">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Line Style
          </label>
          <div className="space-y-1">
            {connectionOptions.map((option) => (
              <button
                key={option.value}
                className={`w-full text-left px-3 py-2 text-sm rounded-md flex items-center transition-colors ${
                  selectedConnection.style === option.value
                    ? "bg-blue-100 text-blue-700 border border-blue-300"
                    : "text-gray-700 hover:bg-gray-100 border border-gray-200"
                }`}
                onClick={() =>
                  updateConnection(
                    selectedConnection.id,
                    selectedConnection.points,
                    option.value as ConnectionType["style"]
                  )
                }
              >
                <span className="mr-3 flex-shrink-0">{option.icon}</span>
                <span>{option.label}</span>
              </button>
            ))}
          </div>
        </div>
      </PropertySection>
    </div>
  );
};

export default ConnectionTab;
