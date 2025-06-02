import React, { useState } from "react";
import { Search } from "lucide-react";
import ShapeCategory from "../shapes/ShapeCategory";
import AiPanel from "../ai/AiPanel";
import {
  gsnElements,
  gsnExtensionElements,
  sacmElements,
  sacmExtensionElements,
} from "../../data/shapeData";

interface LeftSidebarProps {
  activeTab: "shapes" | "ai";
}

const LeftSidebar: React.FC<LeftSidebarProps> = ({ activeTab }) => {
  const [searchText, setSearchText] = useState("");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  if (activeTab === "ai") {
    return <AiPanel />;
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="p-3">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={16} className="text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Search Shapes"
            value={searchText}
            onChange={handleSearchChange}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-4">
        <ShapeCategory
          title="GSN Elements"
          shapes={gsnElements}
          filter={searchText}
        />

        <ShapeCategory
          title="GSN Extensions Elements"
          shapes={gsnExtensionElements}
          filter={searchText}
        />

        <ShapeCategory
          title="SACM Elements"
          shapes={sacmElements}
          filter={searchText}
        />

        <ShapeCategory
          title="SACM Extension Elements"
          shapes={sacmExtensionElements}
          filter={searchText}
        />
      </div>
    </div>
  );
};

export default LeftSidebar;
