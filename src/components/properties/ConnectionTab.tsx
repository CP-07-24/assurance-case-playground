import React from "react";
import { useDiagramContext } from "../../store/DiagramContext";
import { Connection as ConnectionType } from "../../types/shapes";
import PropertySection from "./PropertySection";
import SelectField from "../ui/SelectField";

const ConnectionTab: React.FC = () => {
  const { selectedConnection, updateConnection } = useDiagramContext();

  if (!selectedConnection) {
    return (
      <div className="p-6 text-center text-gray-500">
        <p>Select a connection to edit its properties</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <PropertySection title="Connection Style">
        <SelectField
          label="Line Style"
          value={selectedConnection.style}
          options={[
            { value: "line", label: "Line" },
            { value: "arrow", label: "Arrow" },
            { value: "doubleArrow", label: "Double Arrow" },
            { value: "dashed", label: "Dashed" },
            { value: "dotted", label: "Dotted" },
          ]}
          onChange={(value) =>
            updateConnection(
              selectedConnection.id,
              selectedConnection.points,
              value as ConnectionType["style"]
            )
          }
        />
      </PropertySection>
    </div>
  );
};

export default ConnectionTab;
