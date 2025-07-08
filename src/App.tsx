// src/App.tsx (Fixed - Proper State Sync)
import { useState, useEffect, useRef } from "react";
import MainLayout from "./components/layout/MainLayout";
import LandingPage from "./components/templates/LandingPage";
import TemplateSelection from "./components/templates/TemplateSelection";
import { DiagramProvider, useDiagramContext } from "./store/DiagramContext";
import { RouterProvider, useRouter } from "./router/RouterContext";
import RouteIndicator from "./components/common/RouteIndicator";
// TAMBAH: Import untuk handle direct URL access
import { normalizeUrl } from "./router/utils";
import { AuthProvider } from "./context/AuthContext";

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

  // TAMBAH: Handle direct URL access untuk fix Vercel routing
  useEffect(() => {
    const currentPath = window.location.pathname;
    const normalizedPath = normalizeUrl(currentPath);

    let expectedView: "landing" | "template-selection" | "editor" = "landing";
    switch (normalizedPath) {
      case '/templates':
        expectedView = "template-selection";
        break;
      case '/canvas':
        expectedView = "editor";
        break;
      default:
        expectedView = "landing";
    }

    if (currentView !== expectedView && !isUpdatingRef.current) {
      isUpdatingRef.current = true;
      navigate(expectedView);
      setTimeout(() => {
        isUpdatingRef.current = false;
      }, 0);
    }
  }, []); // Run sekali saat mount

  // Sync router currentView ke local view state (one way) - EXISTING CODE
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
        <AuthProvider>
          <DiagramProvider>
            <TemplateSelectionWrapper onSelect={handleTemplateSelect} />
          </DiagramProvider>
        </AuthProvider>
      </div>
    );
  }

  return (
    <div>
      {/* Route Indicator hanya untuk development */}
      {process.env.NODE_ENV === 'development' && <RouteIndicator />}
      <AuthProvider>
        <DiagramProvider>
          <MainLayout />
        </DiagramProvider>
      </AuthProvider>
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