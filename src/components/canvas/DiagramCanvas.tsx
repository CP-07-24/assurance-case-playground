import React, { useRef, useEffect, useState } from "react";
import { Stage, Layer, Line, Arrow } from "react-konva";
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
  const dimensionsRef = useRef({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  // State untuk temporary connection saat menggambar
  const [tempConnectionStart, setTempConnectionStart] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [tempConnectionPoints, setTempConnectionPoints] = useState<number[] | null>(null);

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
    deleteSelectedShapes,
    selectedConnection,
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

  const createShapeContextMenu = (shapeId: string) => {
    const shape = shapes.find((s) => s.id === shapeId);
    const isText = shape && shape.type === "text";
    return [
      {
        label: isText ? "Delete Text" : "Delete Shape",
        icon: <Trash2 size={16} />,
        onClick: () => deleteShape(shapeId),
      },
    ];
  };

  const createConnectionContextMenu = (connectionId: string) => {
    return [
      {
        label: "Delete Connection",
        icon: <Trash2 size={16} />,
        onClick: () => deleteConnection(connectionId),
      },
    ];
  };

  const closeContextMenu = () => {
    setContextMenu({
      ...contextMenu,
      visible: false,
    });
  };

  const handleDeleteSelectedShapes = () => {
    deleteSelectedShapes();
  };

  const handleDeleteConnection = () => {
    if (selectedConnection) {
      deleteConnection(selectedConnection.id);
    }
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();

    if (!selectedIds.length && !selectedConnection) {
      return;
    }

    const x = e.clientX;
    const y = e.clientY;

    const menuItems = [];

    if (selectedIds.length === 1) {
      menuItems.push(...createShapeContextMenu(selectedIds[0]));
    } else if (selectedIds.length > 1) {
      menuItems.push({
        label: `Delete (${selectedIds.length} shapes)`,
        icon: <Trash2 size={16} />,
        onClick: handleDeleteSelectedShapes,
      });
    }

    if (selectedConnection) {
      menuItems.push({
        label: "Delete Connection",
        icon: <Trash2 size={16} />,
        onClick: handleDeleteConnection,
      });
    }

    if (menuItems.length > 0) {
      setContextMenu({
        visible: true,
        x,
        y,
        menuItems,
      });
    }
  };

  // Connection drawing handlers
  const handleMouseDown = (e: KonvaEventObject<MouseEvent>) => {
    if (!isDrawingConnection) return;
    const clickedOnEmpty = e.target === e.target.getStage();
    if (!clickedOnEmpty) return;

    const stage = e.target.getStage();
    if (!stage) return;

    const pointerPos = stage.getPointerPosition();
    if (!pointerPos) return;

    const x = pointerPos.x / zoomLevel;
    const y = pointerPos.y / zoomLevel;

    setTempConnectionStart({ x, y });
    setTempConnectionPoints([x, y, x, y]);
  };

  const handleMouseMove = (e: KonvaEventObject<MouseEvent>) => {
    if (!isDrawingConnection || !tempConnectionStart) return;

    const stage = e.target.getStage();
    if (!stage) return;

    const pointerPos = stage.getPointerPosition();
    if (!pointerPos) return;

    const x = pointerPos.x / zoomLevel;
    const y = pointerPos.y / zoomLevel;

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

    const x = pointerPos.x / zoomLevel;
    const y = pointerPos.y / zoomLevel;

    const isClick =
      Math.abs(tempConnectionStart.x - x) < 5 &&
      Math.abs(tempConnectionStart.y - y) < 5;

    if (!isClick) {
      const newConnection = {
        id: `conn-${Date.now()}`,
        from: "",
        to: "",
        points: [tempConnectionStart.x, tempConnectionStart.y, x, y],
        style: connectionDrawingStyle || "solidArrow",
      };

      addConnection(newConnection);
    }

    setTempConnectionStart(null);
    setTempConnectionPoints(null);
    cancelDrawingConnection();
  };

  // Resize handler
  useEffect(() => {
    const updateSize = () => {
      if (!containerRef.current) return;
      const { width, height } = containerRef.current.getBoundingClientRect();
      if (
        Math.abs(width - dimensionsRef.current.width) > 2 ||
        Math.abs(height - dimensionsRef.current.height) > 2
      ) {
        dimensionsRef.current = { width, height };
        setStageSize({ width, height });
      }
    };

    const initialTimer = setTimeout(updateSize, 0);
    window.addEventListener("resize", updateSize);
    return () => {
      clearTimeout(initialTimer);
      window.removeEventListener("resize", updateSize);
    };
  }, []);

  // Context menu handlers
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

    containerRef.current.addEventListener("shapeContextMenu", handleShapeContextMenu);
    return () => {
      containerRef.current?.removeEventListener("shapeContextMenu", handleShapeContextMenu);
    };
  }, [deleteShape, shapes]);

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

    containerRef.current.addEventListener("connectionContextMenu", handleConnectionContextMenu);
    return () => {
      containerRef.current?.removeEventListener("connectionContextMenu", handleConnectionContextMenu);
    };
  }, [deleteConnection]);

  // Keyboard handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isInputField =
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.contentEditable === "true" ||
        target.closest('[contenteditable="true"]');

      if (isInputField) {
        return;
      }

      if (e.key === "Escape") {
        clearSelection();
        closeContextMenu();

        if (isConnecting) {
          cancelConnection();
        }

        if (isDrawingConnection) {
          setTempConnectionStart(null);
          setTempConnectionPoints(null);
          cancelDrawingConnection();
        }
      }

      if (e.key === "Delete" || e.key === "Backspace") {
        e.preventDefault();

        if (selectedConnection) {
          deleteConnection(selectedConnection.id);
          return;
        }

        if (selectedIds.length > 0) {
          deleteSelectedShapes();
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
    selectedIds,
    selectedConnection,
    deleteSelectedShapes,
    deleteConnection,
  ]);

  // Click outside handler
  useEffect(() => {
    const handleDocumentClick = (e: MouseEvent) => {
      const targetElement = e.target as HTMLElement;
      const preserveSelectionElement = targetElement.closest(
        '[data-preserve-selection="true"]'
      );

      if (preserveSelectionElement) {
        return;
      }

      if (containerRef.current && !containerRef.current.contains(targetElement)) {
        clearSelection();
      }
    };

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
    if (e.target === e.currentTarget) {
      clearSelection();
      closeContextMenu();
      if (isConnecting) {
        cancelConnection();
      }
    }
  };

  const handleContainerClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      clearSelection();
      closeContextMenu();
    }
  };

  const cursorStyle = isDrawingConnection ? "crosshair" : "default";

  const getDashArray = (style: ConnectionType["style"] | null) => {
    if (style === "dashed") return [5, 5];
    if (style === "dotted") return [2, 2];
    return undefined;
  };

  // Use stageSize from context with fallback to large dimensions
  const stageWidth = stageSize.width || 3000;
  const stageHeight = stageSize.height || 2000;

  return (
    <div
      ref={containerRef}
      className="w-full h-full bg-gray-50 overflow-hidden"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onClick={handleContainerClick}
      onContextMenu={handleContextMenu}
      style={{ cursor: cursorStyle }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          overflow: "auto",
          position: "relative",
        }}
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
            <GridBackground width={stageWidth} height={stageHeight} spacing={20} />
          </Layer>
          <Layer>
            {connections.map((connection) => (
              <Connection key={connection.id} connection={connection} />
            ))}

            {isDrawingConnection && tempConnectionPoints && (
              connectionDrawingStyle === "arrow" || connectionDrawingStyle === "doubleArrow" ? (
                <Arrow
                  points={tempConnectionPoints}
                  stroke="#3B82F6"
                  strokeWidth={2}
                  dash={getDashArray(connectionDrawingStyle)}
                  pointerLength={10}
                  pointerWidth={10}
                  pointerAtBeginning={connectionDrawingStyle === "doubleArrow"}
                />
              ) : (
                <Line
                  points={tempConnectionPoints}
                  stroke="#3B82F6"
                  strokeWidth={2}
                  dash={getDashArray(connectionDrawingStyle)}
                />
              )
            )}

            {shapes.map((shape) => (
              <DiagramShape
                key={shape.id}
                shape={shape}
                isSelected={selectedIds.includes(shape.id)}
                onSelect={() => setSelectedId(shape.id)}
                onShiftSelect={() => toggleShapeSelection(shape.id)}
                onChange={(newAttrs, batchHistory) => {
                  updateShapePosition(shape.id, newAttrs, batchHistory);
                }}
              />
            ))}
          </Layer>
        </Stage>
      </div>

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