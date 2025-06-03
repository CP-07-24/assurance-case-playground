import React from "react";
import { useDiagramContext } from "../../store/DiagramContext";
import ElementTab from "../properties/ElementTab";
import TextTab from "../properties/TextTab";
import ConnectionTab from "../properties/ConnectionTab";

const RightPanel: React.FC = () => {
  const { selectedConnection, selectedShape } = useDiagramContext();

  // Determine which content to show based on what's selected
  let activeContent = null;

  if (selectedConnection) {
    activeContent = <ConnectionTab />;
  } else if (selectedShape) {
    if (selectedShape.type === "text") {
      activeContent = <TextTab />;
    } else {
      activeContent = <ElementTab />;
    }
  }

  return (
    <div className="h-full flex flex-col">
      {/* Panel Content - tanpa tombol tab */}
      <div className="flex-1 overflow-y-auto">
        {activeContent || (
          <div className="h-full flex items-center justify-center">
            <div className="text-center text-gray-500">
              <div className="mb-2">
                <svg
                  className="w-12 h-12 mx-auto text-gray-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.122 2.122"
                  />
                </svg>
              </div>
              <p className="text-sm">Select a shape to edit properties</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RightPanel;
