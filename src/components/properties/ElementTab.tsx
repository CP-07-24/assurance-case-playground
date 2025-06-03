import React from "react";
import { useDiagramContext } from "../../store/DiagramContext";
import PropertySection from "./PropertySection";
import SelectField from "../ui/SelectField";
import TextField from "../ui/TextField";

const ElementTab: React.FC = () => {
  const {
    selectedShape,
    selectedConnection,
    updateSelectedShape,
    updateConnection,
  } = useDiagramContext();

  if (!selectedShape && !selectedConnection) {
    return (
      <div className="p-6 text-center text-gray-500">
        <p>Select an element to view its properties</p>
      </div>
    );
  }

  if (selectedConnection) {
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
                value as any
              )
            }
          />
        </PropertySection>
      </div>
    );
  }

  if (!selectedShape) {
    return null;
  }

  return (
    <div className="p-4">
      <PropertySection title="Labeling">
        <TextField
          label="ID Text"
          value={selectedShape.idText || ""}
          onChange={(value) => updateSelectedShape({ idText: value })}
        />

        <SelectField
          label="Inter"
          value={selectedShape.interLine || "normal"}
          options={[
            { value: "normal", label: "Normal" },
            { value: "loose", label: "Loose" },
            { value: "tight", label: "Tight" },
          ]}
          onChange={(value) => updateSelectedShape({ interLine: value })}
        />

        <div className="flex space-x-3">
          <div className="flex-1">
            <SelectField
              label="Bold"
              value={selectedShape.fontWeight || "normal"}
              options={[
                { value: "normal", label: "Normal" },
                { value: "bold", label: "Bold" },
              ]}
              onChange={(value) => updateSelectedShape({ fontWeight: value })}
            />
          </div>
          <div className="flex-1">
            <SelectField
              label="Font Size"
              value={String(selectedShape.fontSize || 14)}
              options={[
                { value: "10", label: "10px" },
                { value: "12", label: "12px" },
                { value: "14", label: "14px" },
                { value: "16", label: "16px" },
                { value: "18", label: "18px" },
                { value: "20", label: "20px" },
              ]}
              onChange={(value) =>
                updateSelectedShape({ fontSize: parseInt(value, 10) })
              }
            />
          </div>
        </div>
      </PropertySection>

      <PropertySection title="Description">
        <TextField
          label="Value"
          value={selectedShape.value || ""}
          onChange={(value) => updateSelectedShape({ value: value })}
        />

        <SelectField
          label="Inter"
          value={selectedShape.descInterLine || "normal"}
          options={[
            { value: "normal", label: "Normal" },
            { value: "loose", label: "Loose" },
            { value: "tight", label: "Tight" },
          ]}
          onChange={(value) => updateSelectedShape({ descInterLine: value })}
        />

        <div className="flex space-x-3">
          <div className="flex-1">
            <SelectField
              label="Bold"
              value={selectedShape.descFontWeight || "normal"}
              options={[
                { value: "normal", label: "Normal" },
                { value: "bold", label: "Bold" },
              ]}
              onChange={(value) =>
                updateSelectedShape({ descFontWeight: value })
              }
            />
          </div>
          <div className="flex-1">
            <SelectField
              label="Font Size"
              value={String(selectedShape.descFontSize || 14)}
              options={[
                { value: "10", label: "10px" },
                { value: "12", label: "12px" },
                { value: "14", label: "14px" },
                { value: "16", label: "16px" },
                { value: "18", label: "18px" },
                { value: "20", label: "20px" },
              ]}
              onChange={(value) =>
                updateSelectedShape({ descFontSize: parseInt(value, 10) })
              }
            />
          </div>
        </div>
      </PropertySection>
    </div>
  );
};

export default ElementTab;
