// src/components/canvas/DiagramCanvas.tsx
import React, { useRef, useEffect } from "react";
import { Stage, Layer } from "react-konva";
import { useDiagramContext } from "../../store/DiagramContext";
import GridBackground from "./GridBackground";
import DiagramShape from "./DiagramShape";
import Connection from "./Connection";
import { KonvaEventObject } from "konva/lib/Node";

const DiagramCanvas: React.FC = () => {
  // Remove the local stageRef, use the one from context instead
  const containerRef = useRef<HTMLDivElement>(null);
  // Gunakan ref untuk menyimpan dimensi, hindari useState karena menyebabkan re-render
  const dimensionsRef = useRef({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const {
    shapes,
    connections,
    selectedIds, // Tambahkan selectedIds dari context
    setSelectedId,
    addShape,
    updateShapePosition,
    zoomLevel,
    setStageSize, // Hati-hati dengan penggunaan ini
    cancelConnection,
    isConnecting,
    stageSize, // Gunakan nilai dari context langsung
    clearSelection, // Tambahkan clearSelection untuk membersihkan seleksi
    toggleShapeSelection, // Tambahkan untuk shift+click selection
    stageRef, // ← ADD THIS: Get stageRef from context
  } = useDiagramContext();

  // Effect khusus untuk resize listener
  useEffect(() => {
    const updateSize = () => {
      if (!containerRef.current) return;
      const { width, height } = containerRef.current.getBoundingClientRect();
      // Hindari pembaruan state yang tidak perlu
      if (
        Math.abs(width - dimensionsRef.current.width) > 2 ||
        Math.abs(height - dimensionsRef.current.height) > 2
      ) {
        // Update ref dulu
        dimensionsRef.current = { width, height };
        // Lalu update context hanya jika ukuran berubah signifikan
        setStageSize({ width, height });
      }
    };
    // Jalankan sekali setelah mount
    // Gunakan setTimeout untuk memastikan DOM telah di-render sepenuhnya
    const initialTimer = setTimeout(updateSize, 0);
    // Setup resize listener
    window.addEventListener("resize", updateSize);
    // Cleanup
    return () => {
      clearTimeout(initialTimer);
      window.removeEventListener("resize", updateSize);
    };
  }, []); // Empty dependency array - hanya jalankan sekali

  // Tambahkan effect untuk keyboard listener (Escape untuk clear selection)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        console.log("Escape key pressed, clearing selection");
        clearSelection();
        if (isConnecting) {
          cancelConnection();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [clearSelection, cancelConnection, isConnecting]);

  // Tambahkan effect untuk click di luar canvas
  useEffect(() => {
    const handleDocumentClick = (e: MouseEvent) => {
      // Periksa apakah target memiliki data-preserve-selection atau berada di dalamnya
      const targetElement = e.target as HTMLElement;
      const preserveSelectionElement = targetElement.closest(
        '[data-preserve-selection="true"]'
      );

      if (preserveSelectionElement) {
        return; // Keluar dari handler tanpa membersihkan seleksi
      }

      // Periksa apakah klik terjadi di luar canvas
      if (
        containerRef.current &&
        !containerRef.current.contains(targetElement)
      ) {
        clearSelection();
      }
    };

    // Gunakan capture phase untuk menangkap event sebelum event lainnya
    document.addEventListener("mousedown", handleDocumentClick, true);
    return () => {
      document.removeEventListener("mousedown", handleDocumentClick, true);
    };
  }, [clearSelection]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const shapeData = e.dataTransfer.getData("shape");
    if (!shapeData) return;
    const shape = JSON.parse(shapeData);
    const stageContainer = stageRef.current?.container(); // ← Use context stageRef
    if (!stageContainer) return;
    const stagePos = stageContainer.getBoundingClientRect();
    const x = (e.clientX - stagePos.left) / zoomLevel;
    const y = (e.clientY - stagePos.top) / zoomLevel;
    addShape({
      ...shape,
      x,
      y,
      id: Date.now().toString(),
    });
  };

  const handleStageClick = (e: KonvaEventObject<MouseEvent>) => {
    // Periksa apakah klik terjadi pada stage itu sendiri, bukan pada shape
    if (e.target === e.currentTarget) {
      clearSelection();
      if (isConnecting) {
        cancelConnection();
      }
    }
  };

  // Tambahkan handler untuk click pada container
  const handleContainerClick = (e: React.MouseEvent) => {
    // Pastikan klik terjadi langsung pada container, bukan pada anak-anaknya
    if (e.target === e.currentTarget) {
      console.log("Clicked on container, clearing selection");
      clearSelection();
    }
  };

  // Custom handler untuk shape selection dengan shift support

  // Gunakan nilai stageSize dari context
  const stageWidth = stageSize.width || window.innerWidth;
  const stageHeight = stageSize.height || window.innerHeight;

  return (
    <div
      ref={containerRef}
      className="w-full h-full bg-gray-50 overflow-hidden"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onClick={handleContainerClick} // Tambahkan handler untuk container click
    >
      <Stage
        ref={stageRef} // ← Use context stageRef instead of local one
        width={stageWidth}
        height={stageHeight}
        scaleX={zoomLevel}
        scaleY={zoomLevel}
        onClick={handleStageClick}
      >
        <Layer>
          <GridBackground width={5000} height={5000} spacing={20} />
        </Layer>
        <Layer>
          {connections.map((connection) => (
            <Connection key={connection.id} connection={connection} />
          ))}
          {shapes.map((shape) => (
            <DiagramShape
              key={shape.id}
              shape={shape}
              isSelected={selectedIds.includes(shape.id)}
              onSelect={() => setSelectedId(shape.id)}
              onShiftSelect={() => toggleShapeSelection(shape.id)}
              onChange={(newAttrs) => updateShapePosition(shape.id, newAttrs)}
            />
          ))}
        </Layer>
      </Stage>
    </div>
  );
};

export default DiagramCanvas;