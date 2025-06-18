import React, { useRef, useState, useEffect } from "react";
import { Line, Arrow, Circle, Group } from "react-konva";
import { Connection as ConnectionType } from "../../types/shapes";
import { useDiagramContext } from "../../store/DiagramContext";
import { KonvaEventObject } from "konva/lib/Node";

interface ConnectionProps {
  connection: ConnectionType;
}

// Radius untuk endpoint handles
const ENDPOINT_RADIUS = 6;

const Connection: React.FC<ConnectionProps> = ({ connection }) => {
  const {
    shapes,
    updateConnection,
    setSelectedConnection,
    selectedConnectionId,
    convertConnectionEndpoint,
  } = useDiagramContext();

  // Refs untuk endpoint handles dan line/arrow
  const startPointRef = useRef<any>(null);
  const endPointRef = useRef<any>(null);
  const lineRef = useRef<any>(null);
  const groupRef = useRef<any>(null);

  // State untuk tracking drag
  const [tempPoints, setTempPoints] = useState<number[] | null>(null);
  const [isDraggingEndpoint, setIsDraggingEndpoint] = useState<
    "start" | "end" | null
  >(null);
  const [isDraggingGroup, setIsDraggingGroup] = useState(false);

  // State untuk visual feedback
  const [nearbyShapeInfo, setNearbyShapeInfo] = useState<{
    endpoint: "start" | "end";
    shapeId: string;
    point: string;
  } | null>(null);

  // State untuk drag group
  const [groupDragStart, setGroupDragStart] = useState<{
    pointerX: number;
    pointerY: number;
    originalPoints: number[];
  } | null>(null);

  // State untuk snap ke shape saat drag
  const [isSnappingToShape, setIsSnappingToShape] = useState(false);
  const [snapTarget, setSnapTarget] = useState<{
    shapeId: string;
    point: string;
    position: [number, number];
  } | null>(null);

  // Get shapes yang terhubung
  const fromShape = shapes.find((s) => s.id === connection.from);
  const toShape = shapes.find((s) => s.id === connection.to);

  // Get connection points
  const fromPoint = (connection as any).fromPoint || "right";
  const toPoint = (connection as any).toPoint || "left";

  // Calculate connection points untuk koneksi antar shape
  const calculateShapeConnectionPoint = (
    shape: any,
    connectionPoint: string
  ) => {
    if (!shape) return [0, 0];

    const shapeWidth = shape.width || 100;
    const shapeHeight = shape.height || 50;

    // Hitung titik koneksi yang tepat pada tepi bentuk
    switch (connectionPoint) {
      case "top":
        return [shape.x + shapeWidth / 2, shape.y];
      case "right":
        return [shape.x + shapeWidth, shape.y + shapeHeight / 2];
      case "bottom":
        return [shape.x + shapeWidth / 2, shape.y + shapeHeight];
      case "left":
        return [shape.x, shape.y + shapeHeight / 2];
      default:
        return [shape.x + shapeWidth / 2, shape.y + shapeHeight / 2];
    }
  };

  // Calculate final points untuk render
  const calculateFinalPoints = () => {
    let startX, startY, endX, endY;
    // Hitung start point
    if (connection.from && fromShape) {
      [startX, startY] = calculateShapeConnectionPoint(fromShape, fromPoint);
    } else if (connection.points && connection.points.length >= 2) {
      [startX, startY] = [connection.points[0], connection.points[1]];
    } else {
      [startX, startY] = [0, 0];
    }
    // Hitung end point
    if (connection.to && toShape) {
      [endX, endY] = calculateShapeConnectionPoint(toShape, toPoint);
    } else if (connection.points && connection.points.length >= 4) {
      [endX, endY] = [connection.points[2], connection.points[3]];
    } else {
      [endX, endY] = [100, 100];
    }
    return [startX, startY, endX, endY];
  };

  // Points yang akan digunakan untuk render
  const finalPoints = tempPoints || calculateFinalPoints();

  // Update koneksi saat shapes bergerak (hanya jika tidak sedang drag)
  useEffect(() => {
    if (
      !isDraggingEndpoint &&
      !tempPoints &&
      !isDraggingGroup &&
      (fromShape || toShape)
    ) {
      const newPoints = calculateFinalPoints();
      // Hanya update jika points benar-benar berubah
      const currentPoints = connection.points || [];
      const pointsChanged =
        currentPoints.length !== 4 ||
        Math.abs(currentPoints[0] - newPoints[0]) > 0.1 ||
        Math.abs(currentPoints[1] - newPoints[1]) > 0.1 ||
        Math.abs(currentPoints[2] - newPoints[2]) > 0.1 ||
        Math.abs(currentPoints[3] - newPoints[3]) > 0.1;
      if (pointsChanged) {
        updateConnection(connection.id, newPoints, connection.style);
      }
    }
  }, [
    fromShape?.x,
    fromShape?.y,
    toShape?.x,
    toShape?.y,
    isDraggingEndpoint,
    tempPoints,
    isDraggingGroup,
  ]);

  // Reset state saat koneksi berubah
  useEffect(() => {
    setNearbyShapeInfo(null);
    setTempPoints(null);
    setIsSnappingToShape(false);
    setSnapTarget(null);
  }, [connection.id, connection.from, connection.to]);

  // Cek jika titik berada dekat dengan shape
  const findNearbyShape = (x: number, y: number) => {
    const tolerance = 15; // Ditingkatkan untuk toleransi yang lebih baik

    const nearbyShapes = shapes.filter((shape) => {
      // Skip shapes yang sudah terhubung dengan koneksi ini
      if (shape.id === connection.from || shape.id === connection.to) {
        return false;
      }

      const shapeLeft = shape.x;
      const shapeRight = shape.x + (shape.width || 100);
      const shapeTop = shape.y;
      const shapeBottom = shape.y + (shape.height || 50);

      // Perhitungan jarak yang lebih akurat - jarak ke titik terdekat pada shape
      const closestX = Math.max(shapeLeft, Math.min(x, shapeRight));
      const closestY = Math.max(shapeTop, Math.min(y, shapeBottom));
      const distanceSquared =
        Math.pow(x - closestX, 2) + Math.pow(y - closestY, 2);

      // Gunakan perhitungan jarak Euclidean yang lebih tepat
      return Math.sqrt(distanceSquared) < tolerance;
    });

    if (nearbyShapes.length === 0) return null;

    // Jika ada beberapa shape dekat, pilih yang terdekat
    let nearestShape = nearbyShapes[0];
    let minDistance = Number.MAX_VALUE;

    for (const shape of nearbyShapes) {
      const shapeLeft = shape.x;
      const shapeRight = shape.x + (shape.width || 100);
      const shapeTop = shape.y;
      const shapeBottom = shape.y + (shape.height || 50);

      const closestX = Math.max(shapeLeft, Math.min(x, shapeRight));
      const closestY = Math.max(shapeTop, Math.min(y, shapeBottom));
      const distance = Math.sqrt(
        Math.pow(x - closestX, 2) + Math.pow(y - closestY, 2)
      );

      if (distance < minDistance) {
        minDistance = distance;
        nearestShape = shape;
      }
    }

    // Tentukan titik koneksi terbaik pada shape
    const shapeLeft = nearestShape.x;
    const shapeRight = nearestShape.x + (nearestShape.width || 100);
    const shapeTop = nearestShape.y;
    const shapeBottom = nearestShape.y + (nearestShape.height || 50);

    // Cari titik tengah masing-masing sisi
    const midTop = [shapeLeft + (nearestShape.width || 100) / 2, shapeTop];
    const midRight = [shapeRight, shapeTop + (nearestShape.height || 50) / 2];
    const midBottom = [
      shapeLeft + (nearestShape.width || 100) / 2,
      shapeBottom,
    ];
    const midLeft = [shapeLeft, shapeTop + (nearestShape.height || 50) / 2];

    // Hitung jarak ke masing-masing titik tengah
    const distToTop = Math.sqrt(
      Math.pow(x - midTop[0], 2) + Math.pow(y - midTop[1], 2)
    );
    const distToRight = Math.sqrt(
      Math.pow(x - midRight[0], 2) + Math.pow(y - midRight[1], 2)
    );
    const distToBottom = Math.sqrt(
      Math.pow(x - midBottom[0], 2) + Math.pow(y - midBottom[1], 2)
    );
    const distToLeft = Math.sqrt(
      Math.pow(x - midLeft[0], 2) + Math.pow(y - midLeft[1], 2)
    );

    // Hitung jarak ke setiap titik koneksi
    const distances = [
      { point: "top", dist: distToTop },
      { point: "right", dist: distToRight },
      { point: "bottom", dist: distToBottom },
      { point: "left", dist: distToLeft },
    ];

    // Temukan titik terdekat
    let connectionPoint = "left";
    let minDist = Number.MAX_VALUE;

    for (const d of distances) {
      if (d.dist < minDist) {
        minDist = d.dist;
        connectionPoint = d.point;
      }
    }

    // Tambahkan logika tambahan untuk lebih memilih sisi yang berlawanan untuk perutean yang lebih baik
    // Misalnya, jika datang dari kiri, lebih baik terhubung ke sisi kanan target
    if (isDraggingEndpoint === "start" && finalPoints[2] < x) {
      // Jika endpoint berada di sebelah kiri titik saat ini, lebih memilih koneksi kanan
      const rightDist =
        distances.find((d) => d.point === "right")?.dist || Number.MAX_VALUE;
      if (rightDist / minDist < 1.5) {
        // Gunakan kanan jika cukup dekat dengan minimum
        connectionPoint = "right";
      }
    } else if (isDraggingEndpoint === "end" && finalPoints[0] < x) {
      // Logika serupa untuk titik akhir
      const leftDist =
        distances.find((d) => d.point === "left")?.dist || Number.MAX_VALUE;
      if (leftDist / minDist < 1.5) {
        connectionPoint = "left";
      }
    }

    return {
      shape: nearestShape,
      point: connectionPoint,
    };
  };

  // Handlers untuk drag seluruh group (koneksi + endpoints)
  const handleGroupDragStart = (e: KonvaEventObject<DragEvent>) => {
    // Cegah drag jika klik di endpoint handle
    if (
      e.target === startPointRef.current ||
      e.target === endPointRef.current
    ) {
      return;
    }
    e.cancelBubble = true;
    setSelectedConnection(connection.id);
    setIsDraggingGroup(true);
    const stage = e.target.getStage();
    if (!stage) return;
    const pointerPos = stage.getPointerPosition();
    if (!pointerPos) return;
    // Store drag start info
    const currentPoints = calculateFinalPoints();
    setGroupDragStart({
      pointerX: pointerPos.x / stage.scaleX(),
      pointerY: pointerPos.y / stage.scaleY(),
      originalPoints: [...currentPoints],
    });
  };

  const handleGroupDragMove = (e: KonvaEventObject<DragEvent>) => {
    if (!isDraggingGroup || !groupDragStart) return;
    e.cancelBubble = true;
    const stage = e.target.getStage();
    if (!stage) return;
    const pointerPos = stage.getPointerPosition();
    if (!pointerPos) return;
    const currentPointer = {
      x: pointerPos.x / stage.scaleX(),
      y: pointerPos.y / stage.scaleY(),
    };
    const dx = currentPointer.x - groupDragStart.pointerX;
    const dy = currentPointer.y - groupDragStart.pointerY;
    // Apply offset to all points
    const newPoints = [
      groupDragStart.originalPoints[0] + dx,
      groupDragStart.originalPoints[1] + dy,
      groupDragStart.originalPoints[2] + dx,
      groupDragStart.originalPoints[3] + dy,
    ];
    setTempPoints(newPoints);
  };

  const handleGroupDragEnd = (e: KonvaEventObject<DragEvent>) => {
    if (!isDraggingGroup || !tempPoints) return;
    e.cancelBubble = true;
    setIsDraggingGroup(false);

    // Disconnect from shapes if was connected
    if (connection.from && convertConnectionEndpoint) {
      convertConnectionEndpoint(connection.id, "from", "", "");
    }
    if (connection.to && convertConnectionEndpoint) {
      convertConnectionEndpoint(connection.id, "to", "", "");
    }

    // Update connection with new points
    updateConnection(connection.id, tempPoints, connection.style);

    // Penting: Perbarui posisi referensi endpoint handles
    if (startPointRef.current) {
      startPointRef.current.position({
        x: tempPoints[0],
        y: tempPoints[1],
      });
    }

    if (endPointRef.current) {
      endPointRef.current.position({
        x: tempPoints[2],
        y: tempPoints[3],
      });
    }

    // Reset states
    setTempPoints(null);
    setGroupDragStart(null);
  };

  // Handlers untuk drag endpoint
  const handleEndpointDragStart = (
    e: KonvaEventObject<DragEvent>,
    endpoint: "start" | "end"
  ) => {
    e.cancelBubble = true;
    setSelectedConnection(connection.id);
    setIsDraggingEndpoint(endpoint);

    // Mulai dengan perhitungan points yang fresh
    const currentPoints = calculateFinalPoints();
    setTempPoints([...currentPoints]);

    // Pastikan posisi handle endpoint sudah benar
    const pointRef = endpoint === "start" ? startPointRef : endPointRef;
    if (pointRef.current) {
      pointRef.current.position({
        x: endpoint === "start" ? currentPoints[0] : currentPoints[2],
        y: endpoint === "start" ? currentPoints[1] : currentPoints[3],
      });
    }

    // Reset snapping state
    setIsSnappingToShape(false);
    setSnapTarget(null);
  };

  const handleEndpointDragMove = (
    e: KonvaEventObject<DragEvent>,
    endpoint: "start" | "end"
  ) => {
    e.cancelBubble = true;
    if (!tempPoints) return;

    const newPoints = [...tempPoints];
    // Get actual position from the dragged circle
    const pos = e.target.position();

    // Check for nearby shapes during drag
    const nearbyShape = findNearbyShape(pos.x, pos.y);

    // KUNCI PERBAIKAN: Jika dekat dengan shape, snap visual endpoint ke posisi koneksi shape
    if (nearbyShape) {
      // Hitung posisi koneksi pada shape
      const [shapeX, shapeY] = calculateShapeConnectionPoint(
        nearbyShape.shape,
        nearbyShape.point
      );

      // Tambahkan visual feedback yang lebih jelas
      setNearbyShapeInfo({
        endpoint,
        shapeId: nearbyShape.shape.id,
        point: nearbyShape.point,
      });

      // Set state snapping dan target
      setIsSnappingToShape(true);
      setSnapTarget({
        shapeId: nearbyShape.shape.id,
        point: nearbyShape.point,
        position: [shapeX, shapeY],
      });

      // Visual feedback tambahan - buat endpoint menjadi lebih besar saat dekat dengan shape
      const pointRef = endpoint === "start" ? startPointRef : endPointRef;
      if (pointRef.current) {
        pointRef.current.radius(ENDPOINT_RADIUS * 1.5);
        pointRef.current.shadowEnabled(true);
        pointRef.current.shadowColor("#3B82F6");
        pointRef.current.shadowBlur(8);
        pointRef.current.shadowOpacity(0.7);
      }

      // Update tempPoints dengan posisi snap
      if (endpoint === "start") {
        newPoints[0] = shapeX;
        newPoints[1] = shapeY;

        // Pindahkan posisi visual circle endpoint
        if (startPointRef.current) {
          startPointRef.current.position({ x: shapeX, y: shapeY });
        }
      } else {
        newPoints[2] = shapeX;
        newPoints[3] = shapeY;

        // Pindahkan posisi visual circle endpoint
        if (endPointRef.current) {
          endPointRef.current.position({ x: shapeX, y: shapeY });
        }
      }
    } else {
      // Reset snapping state
      setIsSnappingToShape(false);
      setSnapTarget(null);
      setNearbyShapeInfo(null);

      // Reset ukuran endpoint
      const pointRef = endpoint === "start" ? startPointRef : endPointRef;
      if (pointRef.current) {
        pointRef.current.radius(ENDPOINT_RADIUS);
        pointRef.current.shadowEnabled(false);
      }

      // Gunakan posisi drag normal
      if (endpoint === "start") {
        newPoints[0] = pos.x;
        newPoints[1] = pos.y;
      } else {
        newPoints[2] = pos.x;
        newPoints[3] = pos.y;
      }
    }

    setTempPoints(newPoints);
  };

  const handleEndpointDragEnd = (
    e: KonvaEventObject<DragEvent>,
    endpoint: "start" | "end"
  ) => {
    e.cancelBubble = true;
    if (!tempPoints) return;
    setIsDraggingEndpoint(null);

    const connEndpoint = endpoint === "start" ? "from" : "to";
    const currentConnectionId =
      endpoint === "start" ? connection.from : connection.to;

    // Jika sedang snapping ke shape
    if (isSnappingToShape && snapTarget) {
      // Update koneksi dengan posisi snap terakhir
      updateConnection(connection.id, tempPoints, connection.style);

      // Konversi ke koneksi shape
      if (convertConnectionEndpoint) {
        // Beri sedikit waktu untuk render visual
        setTimeout(() => {
          convertConnectionEndpoint(
            connection.id,
            connEndpoint,
            snapTarget.shapeId,
            snapTarget.point
          );
        }, 50);
      }
    } else {
      // Dapatkan posisi akhir drag
      const pos = e.target.position();

      // Update dengan posisi drag akhir
      const draggedPoints = [...tempPoints];
      if (endpoint === "start") {
        draggedPoints[0] = pos.x;
        draggedPoints[1] = pos.y;
      } else {
        draggedPoints[2] = pos.x;
        draggedPoints[3] = pos.y;
      }

      // Update koneksi dengan posisi drag akhir
      updateConnection(connection.id, draggedPoints, connection.style);

      // Putuskan koneksi jika sebelumnya terhubung
      if (currentConnectionId && convertConnectionEndpoint) {
        convertConnectionEndpoint(connection.id, connEndpoint, "", "");
      }
    }

    // Reset states
    setNearbyShapeInfo(null);
    setTempPoints(null);
    setIsSnappingToShape(false);
    setSnapTarget(null);
  };

  // Function to handle connection context menu
  const handleContextMenu = (e: KonvaEventObject<PointerEvent>) => {
    e.evt.preventDefault();
    setSelectedConnection(connection.id);

    const stage = e.target.getStage();
    if (!stage) return;

    const container = stage.container();
    if (!container) return;

    const pos = stage.getPointerPosition();
    if (!pos) return;

    const containerRect = container.getBoundingClientRect();
    const event = new CustomEvent("connectionContextMenu", {
      bubbles: true,
      detail: {
        x: containerRect.left + pos.x,
        y: containerRect.top + pos.y,
        connectionId: connection.id,
      },
    });

    container.dispatchEvent(event);
  };

  // Base props for connection
  const getLineProps = () => {
    const isSelected = selectedConnectionId === connection.id;

    // Props dasar
    const baseProps = {
      ref: lineRef,
      points: finalPoints,
      onClick: () => setSelectedConnection(connection.id),
      onTap: () => setSelectedConnection(connection.id),
      onContextMenu: handleContextMenu,
      stroke: isSelected ? "#3B82F6" : "#000",
      strokeWidth: isSelected ? 3 : 2,
      shadowEnabled: isSelected,
      shadowColor: "#3B82F6",
      shadowBlur: 4,
      shadowOpacity: 0.3,
    };

    // Props tambahan berdasarkan tipe koneksi
    if (connection.style === "dashed") {
      return {
        ...baseProps,
        dash: [5, 5],
      };
    } else if (connection.style === "dotted") {
      return {
        ...baseProps,
        dash: [2, 2],
      };
    } else if (connection.style === "arrow") {
      return {
        ...baseProps,
        pointerLength: 10,
        pointerWidth: 10,
        fill: "transparent",
        fillEnabled: true, // Pastikan fill diaktifkan
        pointerAtEnding: true,
        pointerAtBeginning: false,
      };
    } else if (connection.style === "solidArrow") {
      return {
        ...baseProps,
        pointerLength: 10,
        pointerWidth: 10,
        fill: "#000", // Warna hitam untuk isi panah
        fillEnabled: true, // Pastikan fill diaktifkan
        pointerAtEnding: true,
        pointerAtBeginning: false,
      };
    } else if (connection.style === "doubleArrow") {
      return {
        ...baseProps,
        pointerLength: 10,
        pointerWidth: 10,
        fill: "transparent",
        fillEnabled: true, // Pastikan fill diaktifkan
        pointerAtEnding: true,
        pointerAtBeginning: true,
      };
    } else {
      // Default untuk "line" atau tipe lainnya
      return baseProps;
    }
  };

  // Connection group selalu bisa di-drag ketika dipilih
  const isGroupDraggable = selectedConnectionId === connection.id;

  // Render endpoint handles dengan posisi yang tepat
  const renderEndpointHandles = () => {
    if (selectedConnectionId !== connection.id) return null;

    const [x1, y1, x2, y2] = finalPoints;

    const handleStrokeWidth = 2;
    const handleStrokeColor = "#666"; // Abu-abu gelap seperti di draw.io

    return (
      <>
        <Circle
          ref={startPointRef}
          x={x1}
          y={y1}
          radius={ENDPOINT_RADIUS}
          fill={
            nearbyShapeInfo?.endpoint === "start"
              ? "#bbdefb" // Biru muda untuk umpan balik snap
              : connection.from
              ? "#f5f5f5" // Abu-abu muda untuk endpoint yang terhubung
              : "#ffffff" // Putih untuk endpoint bebas
          }
          stroke={
            nearbyShapeInfo?.endpoint === "start"
              ? "#1976d2" // Biru lebih gelap saat menempel
              : handleStrokeColor
          }
          strokeWidth={handleStrokeWidth}
          shadowEnabled={nearbyShapeInfo?.endpoint === "start"}
          shadowColor="#1976d2"
          shadowBlur={5}
          shadowOpacity={0.5}
          draggable={true}
          onDragStart={(e) => handleEndpointDragStart(e, "start")}
          onDragMove={(e) => handleEndpointDragMove(e, "start")}
          onDragEnd={(e) => handleEndpointDragEnd(e, "start")}
          onMouseEnter={() => (document.body.style.cursor = "grab")}
          onMouseLeave={() => (document.body.style.cursor = "default")}
          dragBoundFunc={(pos) => pos}
        />
        <Circle
          ref={endPointRef}
          x={x2}
          y={y2}
          radius={ENDPOINT_RADIUS}
          fill={
            nearbyShapeInfo?.endpoint === "end"
              ? "#bbdefb" // Biru muda untuk umpan balik snap
              : connection.to
              ? "#f5f5f5" // Abu-abu muda untuk endpoint yang terhubung
              : "#ffffff" // Putih untuk endpoint bebas
          }
          stroke={
            nearbyShapeInfo?.endpoint === "end"
              ? "#1976d2" // Biru lebih gelap saat menempel
              : handleStrokeColor
          }
          strokeWidth={handleStrokeWidth}
          shadowEnabled={nearbyShapeInfo?.endpoint === "end"}
          shadowColor="#1976d2"
          shadowBlur={5}
          shadowOpacity={0.5}
          draggable={true}
          onDragStart={(e) => handleEndpointDragStart(e, "end")}
          onDragMove={(e) => handleEndpointDragMove(e, "end")}
          onDragEnd={(e) => handleEndpointDragEnd(e, "end")}
          onMouseEnter={() => (document.body.style.cursor = "grab")}
          onMouseLeave={() => (document.body.style.cursor = "default")}
          dragBoundFunc={(pos) => pos}
        />
      </>
    );
  };

  // Render line/arrow sesuai dengan style
  const renderConnection = () => {
    const props = getLineProps();

    if (
      connection.style === "arrow" ||
      connection.style === "solidArrow" ||
      connection.style === "doubleArrow"
    ) {
      return <Arrow {...props} />;
    } else {
      return <Line {...props} />;
    }
  };

  return (
    <Group
      ref={groupRef}
      draggable={isGroupDraggable}
      onDragStart={handleGroupDragStart}
      onDragMove={handleGroupDragMove}
      onDragEnd={handleGroupDragEnd}
    >
      {renderConnection()}
      {renderEndpointHandles()}
    </Group>
  );
};

export default Connection;
