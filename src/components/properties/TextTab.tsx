import React from "react";
import { useDiagramContext } from "../../store/DiagramContext";
import PropertySection from "./PropertySection";
import SelectField from "../ui/SelectField";
import TextField from "../ui/TextField";

const TextTab: React.FC = () => {
  const { selectedShape, updateSelectedShape } = useDiagramContext();

  if (!selectedShape) {
    return (
      <div className="p-6 text-center text-gray-500">
        <p>Select an element to edit its text</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <PropertySection title="Text Content">
        <TextField
          label="Text"
          value={selectedShape.text || ""}
          onChange={(value) => updateSelectedShape({ text: value })}
          multiline
        />
      </PropertySection>

      <PropertySection title="Text Style">
        <div className="flex space-x-3">
          <div className="flex-1">
            <SelectField
              label="Font"
              value={selectedShape.fontFamily || "Arial"}
              options={[
                { value: "Arial", label: "Arial" },
                { value: "Helvetica", label: "Helvetica" },
                { value: "Times New Roman", label: "Times New Roman" },
                { value: "Courier New", label: "Courier New" },
              ]}
              onChange={(value) => updateSelectedShape({ fontFamily: value })}
            />
          </div>
          <div className="flex-1">
            <SelectField
              label="Size"
              value={selectedShape.fontSize?.toString() || "14"}
              options={[
                { value: "10", label: "10" },
                { value: "12", label: "12" },
                { value: "14", label: "14" },
                { value: "16", label: "16" },
                { value: "18", label: "18" },
                { value: "20", label: "20" },
                { value: "24", label: "24" },
              ]}
              onChange={(value) =>
                updateSelectedShape({ fontSize: parseInt(value) })
              }
            />
          </div>
        </div>

        <div className="flex space-x-3 mt-3">
          <button
            className={`flex-1 py-2 border ${
              selectedShape.fontWeight === "bold"
                ? "bg-gray-100 border-gray-400"
                : "border-gray-300"
            } rounded-md text-sm`}
            onClick={() =>
              updateSelectedShape({
                fontWeight:
                  selectedShape.fontWeight === "bold" ? "normal" : "bold",
              })
            }
          >
            Bold
          </button>

          <button
            className={`flex-1 py-2 border ${
              selectedShape.fontStyle === "italic"
                ? "bg-gray-100 border-gray-400"
                : "border-gray-300"
            } rounded-md text-sm`}
            onClick={() =>
              updateSelectedShape({
                fontStyle:
                  selectedShape.fontStyle === "italic" ? "normal" : "italic",
              })
            }
          >
            Italic
          </button>

          <button
            className={`flex-1 py-2 border ${
              selectedShape.textDecoration === "underline"
                ? "bg-gray-100 border-gray-400"
                : "border-gray-300"
            } rounded-md text-sm`}
            onClick={() =>
              updateSelectedShape({
                textDecoration:
                  selectedShape.textDecoration === "underline"
                    ? "none"
                    : "underline",
              })
            }
          >
            Underline
          </button>
        </div>
      </PropertySection>

      <PropertySection title="Alignment">
        <div className="flex space-x-3">
          <button
            className={`flex-1 py-2 border ${
              selectedShape.align === "left"
                ? "bg-gray-100 border-gray-400"
                : "border-gray-300"
            } rounded-md text-sm`}
            onClick={() => updateSelectedShape({ align: "left" })}
          >
            Left
          </button>

          <button
            className={`flex-1 py-2 border ${
              selectedShape.align === "center"
                ? "bg-gray-100 border-gray-400"
                : "border-gray-300"
            } rounded-md text-sm`}
            onClick={() => updateSelectedShape({ align: "center" })}
          >
            Center
          </button>

          <button
            className={`flex-1 py-2 border ${
              selectedShape.align === "right"
                ? "bg-gray-100 border-gray-400"
                : "border-gray-300"
            } rounded-md text-sm`}
            onClick={() => updateSelectedShape({ align: "right" })}
          >
            Right
          </button>
        </div>
      </PropertySection>
    </div>
  );
};

export default TextTab;
