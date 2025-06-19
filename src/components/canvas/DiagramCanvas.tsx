import React, { useRef, useEffect, useState } from "react";
import { Stage, Layer, Line, Arrow } from "react-konva"; // Tambahkan import Line dan Arrow
import { useDiagramContext } from "../../store/DiagramContext";
import GridBackground from "./GridBackground";
import DiagramShape from "./DiagramShape";
import Connection from "./Connection";
import { Trash2 } from "lucide-react";
import { KonvaEventObject } from "konva/lib/Node";
import ContextMenu from "./ContextMenu";
import { Connection as ConnectionType } from "../../types/shapes";

const DiagramCanvas: React.FC = () => {
  
  const stageRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  // Gunakan ref untuk menyimpan dimensi, hindari useState karena menyebabkan re-render
  const dimensionsRef = useRef({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  // State untuk temporary connection saat menggambar
  const [tempConnectionStart, setTempConnectionStart] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [tempConnectionPoints, setTempConnectionPoints] = useState<
    number[] | null
  >(null);

  // State untuk context menu
  const [contextMenu, setContextMenu] = useState({
    visible: false,
    x: 0,
    y: 0,
    menuItems: [] as {
      label: string;
      icon?: React.ReactNode;
      onClick: () => void;
      disabled?: boolean;
      divider?: boolean;
    }[],
  });

  const {
    shapes,
    connections,
    selectedIds,
    setSelectedId,
    addShape,
    updateShapePosition,
    zoomLevel,
    setStageSize,
    cancelConnection,
    isConnecting,
    stageSize,
    clearSelection,
    toggleShapeSelection,
    deleteShape,
    deleteConnection,
    selectedConnection,
    // Tambahkan import untuk fitur menggambar koneksi
    isDrawingConnection,
    connectionDrawingStyle,
    cancelDrawingConnection,
    addConnection,
    stageRef: contextStageRef,
    setStageRef,
  } = useDiagramContext();

  useEffect(() => {
    if (setStageRef) {
      setStageRef(stageRef);
    }
  }, [stageRef, setStageRef]);

  // Buat fungsi pembuat menu di luar useEffect
  const createShapeContextMenu = (shapeId: string) => {
    return [
      {
        label: "Hapus Shape",
        icon: <Trash2 size={16} />,
        onClick: () => deleteShape(shapeId),
      },
    ];
  };

  const createConnectionContextMenu = (connectionId: string) => {
    return [
      {
        label: "Hapus Koneksi",
        icon: <Trash2 size={16} />,
        onClick: () => deleteConnection(connectionId),
      },
    ];
  };

  // Function untuk menutup context menu
  const closeContextMenu = () => {
    setContextMenu({
      ...contextMenu,
      visible: false,
    });
  };

  // Function untuk menghapus shape yang dipilih
  const handleDeleteSelectedShapes = () => {
    selectedIds.forEach((id) => {
      deleteShape(id);
    });
  };

  // Function untuk menghapus connection yang dipilih
  const handleDeleteConnection = () => {
    if (selectedConnection) {
      deleteConnection(selectedConnection.id);
    }
  };

  // Function untuk menghandle context menu
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();

    // Jangan tampilkan context menu pada canvas kosong
    if (!selectedIds.length && !selectedConnection) {
      return;
    }

    // Tentukan posisi untuk menu
    const x = e.clientX;
    const y = e.clientY;

    // Buat menu items berdasarkan konteks
    const menuItems = [];

    // Jika ada shape yang dipilih
    if (selectedIds.length > 0) {
      menuItems.push({
        label:
          selectedIds.length > 1
            ? `Hapus (${selectedIds.length} shapes)`
            : "Hapus Shape",
        icon: <Trash2 size={16} />,
        onClick: handleDeleteSelectedShapes,
      });
    }

    // Jika ada connection yang dipilih
    if (selectedConnection) {
      menuItems.push({
        label: "Hapus Koneksi",
        icon: <Trash2 size={16} />,
        onClick: handleDeleteConnection,
      });
    }

    // Hanya tampilkan menu jika ada item
    if (menuItems.length > 0) {
      setContextMenu({
        visible: true,
        x,
        y,
        menuItems,
      });
    }
  };

  // Handler untuk mouse events saat menggambar koneksi
  const handleMouseDown = (e: KonvaEventObject<MouseEvent>) => {
    if (!isDrawingConnection) return;

    // Cek apakah klik dilakukan pada stage, bukan pada shape
    const clickedOnEmpty = e.target === e.target.getStage();
    if (!clickedOnEmpty) return;

    const stage = e.target.getStage();
    if (!stage) return;

    const pointerPos = stage.getPointerPosition();
    if (!pointerPos) return;

    // Konversi ke koordinat yang mempertimbangkan zoom
    const x = pointerPos.x / zoomLevel;
    const y = pointerPos.y / zoomLevel;

    // Simpan titik awal
    setTempConnectionStart({ x, y });
    setTempConnectionPoints([x, y, x, y]); // Titik awal dan akhir sama untuk memulai
  };

  const handleMouseMove = (e: KonvaEventObject<MouseEvent>) => {
    if (!isDrawingConnection || !tempConnectionStart) return;

    const stage = e.target.getStage();
    if (!stage) return;

    const pointerPos = stage.getPointerPosition();
    if (!pointerPos) return;

    // Konversi ke koordinat yang mempertimbangkan zoom
    const x = pointerPos.x / zoomLevel;
    const y = pointerPos.y / zoomLevel;

    // Perbarui titik akhir, pertahankan titik awal
    setTempConnectionPoints([
      tempConnectionStart.x,
      tempConnectionStart.y,
      x,
      y,
    ]);
  };

  const handleMouseUp = (e: KonvaEventObject<MouseEvent>) => {
    if (!isDrawingConnection || !tempConnectionStart || !tempConnectionPoints)
      return;

    const stage = e.target.getStage();
    if (!stage) return;

    const pointerPos = stage.getPointerPosition();
    if (!pointerPos) return;

    // Konversi ke koordinat yang mempertimbangkan zoom
    const x = pointerPos.x / zoomLevel;
    const y = pointerPos.y / zoomLevel;

    // Pastikan ini bukan hanya klik (tidak ada gerakan)
    const isClick =
      Math.abs(tempConnectionStart.x - x) < 5 &&
      Math.abs(tempConnectionStart.y - y) < 5;

    if (!isClick) {
      // Buat koneksi baru
      const newConnection = {
        id: `conn-${Date.now()}`,
        from: "", // Kosong karena bukan antar shape
        to: "", // Kosong karena bukan antar shape
        points: [tempConnectionStart.x, tempConnectionStart.y, x, y],
        style: connectionDrawingStyle || "line",
      };

      addConnection(newConnection);
    }

    // Reset state
    setTempConnectionStart(null);
    setTempConnectionPoints(null);
    cancelDrawingConnection();
  };

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

  // Handler untuk shape context menu
  useEffect(() => {
    if (!containerRef.current) return;

    const handleShapeContextMenu = (e: any) => {
      const { x, y, shapeId } = e.detail;

      setContextMenu({
        visible: true,
        x,
        y,
        menuItems: createShapeContextMenu(shapeId),
      });
    };

    containerRef.current.addEventListener(
      "shapeContextMenu",
      handleShapeContextMenu
    );

    return () => {
      containerRef.current?.removeEventListener(
        "shapeContextMenu",
        handleShapeContextMenu
      );
    };
  }, [deleteShape]);

  // Handler untuk connection context menu
  useEffect(() => {
    if (!containerRef.current) return;

    const handleConnectionContextMenu = (e: any) => {
      const { x, y, connectionId } = e.detail;

      setContextMenu({
        visible: true,
        x,
        y,
        menuItems: createConnectionContextMenu(connectionId),
      });
    };

    containerRef.current.addEventListener(
      "connectionContextMenu",
      handleConnectionContextMenu
    );

    return () => {
      containerRef.current?.removeEventListener(
        "connectionContextMenu",
        handleConnectionContextMenu
      );
    };
  }, [deleteConnection]);

  // Tambahkan effect untuk keyboard listener (Escape untuk clear selection)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        console.log("Escape key pressed, clearing selection");
        clearSelection();
        closeContextMenu(); // Tutup context menu jika ada

        if (isConnecting) {
          cancelConnection();
        }

        // Tambahkan untuk membatalkan drawing connection
        if (isDrawingConnection) {
          setTempConnectionStart(null);
          setTempConnectionPoints(null);
          cancelDrawingConnection();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [
    clearSelection,
    cancelConnection,
    isConnecting,
    isDrawingConnection,
    cancelDrawingConnection,
  ]);

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
    const stageContainer = stageRef.current?.container();
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
      closeContextMenu(); // Tutup context menu saat klik di stage
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
      closeContextMenu(); // Tutup context menu saat klik di container
    }
  };

  // Gunakan nilai stageSize dari context
  const stageWidth = stageSize.width || window.innerWidth;
  const stageHeight = stageSize.height || window.innerHeight;

  // Tentukan style cursor berdasarkan mode
  const cursorStyle = isDrawingConnection ? "crosshair" : "default";

  // Perbaikan: Fungsi untuk mengatur dashing berdasarkan style
  const getDashArray = (style: ConnectionType["style"] | null) => {
    if (style === "dashed") return [5, 5];
    if (style === "dotted") return [2, 2];
    return undefined;
  };

  return (
    <div
      ref={containerRef}
      className="w-full h-full bg-gray-50 overflow-hidden"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onClick={handleContainerClick}
      onContextMenu={handleContextMenu}
      style={{ cursor: cursorStyle }} // Tambahkan style cursor
    >
      <Stage
        ref={stageRef}
        width={stageWidth}
        height={stageHeight}
        scaleX={zoomLevel}
        scaleY={zoomLevel}
        onClick={handleStageClick}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        <Layer>
          <GridBackground width={5000} height={5000} spacing={20} />
        </Layer>
        <Layer>
          {connections.map((connection) => (
            <Connection key={connection.id} connection={connection} />
          ))}

          {/* Render temporary connection line saat menggambar */}
          {isDrawingConnection &&
            tempConnectionPoints &&
            (() => {
              // Perbaikan: Gunakan IIFE untuk menghindari comparison type error
              if (
                connectionDrawingStyle === "arrow" ||
                connectionDrawingStyle === "doubleArrow"
              ) {
                return (
                  <Arrow
                    points={tempConnectionPoints}
                    stroke="#3B82F6"
                    strokeWidth={2}
                    dash={getDashArray(connectionDrawingStyle)}
                    pointerLength={10}
                    pointerWidth={10}
                    pointerAtBeginning={
                      connectionDrawingStyle === "doubleArrow"
                    }
                  />
                );
              } else {
                return (
                  <Line
                    points={tempConnectionPoints}
                    stroke="#3B82F6"
                    strokeWidth={2}
                    dash={getDashArray(connectionDrawingStyle)}
                  />
                );
              }
            })()}

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

      {/* Render Context Menu */}
      <ContextMenu
        visible={contextMenu.visible}
        x={contextMenu.x}
        y={contextMenu.y}
        onClose={closeContextMenu}
        menuItems={contextMenu.menuItems}
      />
    </div>
  );
};

export default DiagramCanvas;