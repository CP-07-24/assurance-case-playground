import { useState } from "react";
import MainLayout from "./components/layout/MainLayout";
import LandingPage from "./components/templates/LandingPage";
import TemplateSelection from "./components/templates/TemplateSelection";
import { DiagramProvider, useDiagramContext } from "./store/DiagramContext";
import { AuthProvider } from './context/AuthContext';


function App() {
  const [view, setView] = useState<"landing" | "template-selection" | "editor">(
    "landing"
  );

  const handleUseTemplate = () => {
    setView("template-selection");
  };

  const handleStartBlank = () => {
    setView("editor");
  };

  const handleTemplateSelect = (template: string) => {
    console.log("Selected template:", template);
    setView("editor");
  };

  if (view === "landing") {
    return (
      <LandingPage
        onUseTemplate={handleUseTemplate}
        onStartBlank={handleStartBlank}
      />
    );
  }

  if (view === "template-selection") {
    return (
      <AuthProvider>
        <DiagramProvider>
          <TemplateSelectionWrapper onSelect={handleTemplateSelect} />
        </DiagramProvider>
      </AuthProvider>
    );
  }

  return (
    <AuthProvider>
      <DiagramProvider>
        <MainLayout />
      </DiagramProvider>
    </AuthProvider>

  );
}

// Komponen wrapper untuk TemplateSelection yang menggunakan context
const TemplateSelectionWrapper = ({
  onSelect,
}: {
  onSelect: (template: string) => void;
}) => {
  // Gunakan context di dalam komponen yang dibungkus DiagramProvider
  const { addShape, addConnection } = useDiagramContext();

  return (
    <TemplateSelection
      onSelect={onSelect}
      addShape={addShape}
      addConnection={addConnection}
    />
  );
};

export default App;
