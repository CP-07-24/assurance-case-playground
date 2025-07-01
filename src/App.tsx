// src/App.tsx (Fixed - Proper State Sync)
import { useState, useEffect, useRef } from "react";
import MainLayout from "./components/layout/MainLayout";
import LandingPage from "./components/templates/LandingPage";
import TemplateSelection from "./components/templates/TemplateSelection";
import { DiagramProvider, useDiagramContext } from "./store/DiagramContext";
import { RouterProvider, useRouter } from "./router/RouterContext";
import RouteIndicator from "./components/common/RouteIndicator";

// Komponen wrapper untuk TemplateSelection yang menggunakan context
const TemplateSelectionWrapper = ({
  onSelect,
}: {
  onSelect: (template: string) => void;
}) => {
  const { addShape, addConnection } = useDiagramContext();

  return (
    <TemplateSelection
      onSelect={onSelect}
      addShape={addShape}
      addConnection={addConnection}
    />
  );
};

// Main App Content dengan Fixed Router Integration
function AppContent() {
  // Router state
  const { currentView, navigate } = useRouter();
  
  // Original state management - TETAP DIPERTAHANKAN
  const [view, setView] = useState<"landing" | "template-selection" | "editor">(currentView);
  
  // Ref untuk mencegah infinite loops
  const isUpdatingRef = useRef(false);

  // Sync router currentView ke local view state (one way)
  useEffect(() => {
    if (isUpdatingRef.current) return;
    
    if (currentView !== view) {
      isUpdatingRef.current = true;
      setView(currentView);
      // Reset flag setelah state update
      setTimeout(() => {
        isUpdatingRef.current = false;
      }, 0);
    }
  }, [currentView]);

  // Original function handlers - TETAP DIPERTAHANKAN SEMUA
  const handleUseTemplate = () => {
    if (isUpdatingRef.current) return;
    
    isUpdatingRef.current = true;
    setView("template-selection");
    navigate("template-selection");
    
    setTimeout(() => {
      isUpdatingRef.current = false;
    }, 0);
  };

  const handleStartBlank = () => {
    if (isUpdatingRef.current) return;
    
    isUpdatingRef.current = true;
    setView("editor");
    navigate("editor");
    
    setTimeout(() => {
      isUpdatingRef.current = false;
    }, 0);
  };

  const handleTemplateSelect = (template: string) => {
    console.log("Selected template:", template);
    
    if (isUpdatingRef.current) return;
    
    isUpdatingRef.current = true;
    setView("editor");
    navigate("editor");
    
    setTimeout(() => {
      isUpdatingRef.current = false;
    }, 0);
  };

  // Original conditional rendering logic - TETAP DIPERTAHANKAN
  if (view === "landing") {
    return (
      <div>
        {/* Route Indicator hanya untuk development - bisa dihapus di production */}
        {process.env.NODE_ENV === 'development' && <RouteIndicator />}
        <LandingPage
          onUseTemplate={handleUseTemplate}
          onStartBlank={handleStartBlank}
        />
      </div>
    );
  }

  if (view === "template-selection") {
    return (
      <div>
        {/* Route Indicator hanya untuk development */}
        {process.env.NODE_ENV === 'development' && <RouteIndicator />}
        <DiagramProvider>
          <TemplateSelectionWrapper onSelect={handleTemplateSelect} />
        </DiagramProvider>
      </div>
    );
  }

  return (
    <div>
      {/* Route Indicator hanya untuk development */}
      {process.env.NODE_ENV === 'development' && <RouteIndicator />}
      <DiagramProvider>
        <MainLayout />
      </DiagramProvider>
    </div>
  );
}

// Main App function - STRUKTUR ASLI DIPERTAHANKAN
function App() {
  return (
    <RouterProvider>
      <AppContent />
    </RouterProvider>
  );
}

export default App;