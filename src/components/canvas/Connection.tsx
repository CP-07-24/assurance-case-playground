import React from "react";
import { Line, Arrow } from "react-konva";
import { Connection as ConnectionType } from "../../types/shapes";
import { useDiagramContext } from "../../store/DiagramContext";

interface ConnectionProps {
  connection: ConnectionType;
}

const Connection: React.FC<ConnectionProps> = ({ connection }) => {
  const {
    shapes,
    updateConnection,
    setSelectedConnection,
    selectedConnectionId,
  } = useDiagramContext();

  const fromShape = shapes.find((s) => s.id === connection.from);
  const toShape = shapes.find((s) => s.id === connection.to);

  if (!fromShape || !toShape) return null;

  // Get connection points from connection object or custom properties
  const fromPoint = (connection as any).fromPoint || "right";
  const toPoint = (connection as any).toPoint || "left";

  // Calculate connection points based on specified points
  const calculatePoints = () => {
    let fromX, fromY, toX, toY;

    // Determine "from" coordinates based on fromPoint
    switch (fromPoint) {
      case "top":
        fromX = fromShape.x + (fromShape.width || 100) / 2;
        fromY = fromShape.y;
        break;
      case "right":
        fromX = fromShape.x + (fromShape.width || 100);
        fromY = fromShape.y + (fromShape.height || 50) / 2;
        break;
      case "bottom":
        fromX = fromShape.x + (fromShape.width || 100) / 2;
        fromY = fromShape.y + (fromShape.height || 50);
        break;
      case "left":
        fromX = fromShape.x;
        fromY = fromShape.y + (fromShape.height || 50) / 2;
        break;
      default:
        fromX = fromShape.x + (fromShape.width || 100);
        fromY = fromShape.y + (fromShape.height || 50) / 2;
    }

    // Determine "to" coordinates based on toPoint
    switch (toPoint) {
      case "top":
        toX = toShape.x + (toShape.width || 100) / 2;
        toY = toShape.y;
        break;
      case "right":
        toX = toShape.x + (toShape.width || 100);
        toY = toShape.y + (toShape.height || 50) / 2;
        break;
      case "bottom":
        toX = toShape.x + (toShape.width || 100) / 2;
        toY = toShape.y + (toShape.height || 50);
        break;
      case "left":
        toX = toShape.x;
        toY = toShape.y + (toShape.height || 50) / 2;
        break;
      default:
        toX = toShape.x;
        toY = toShape.y + (toShape.height || 50) / 2;
    }

    return [fromX, fromY, toX, toY];
  };

  const points = connection.points?.length
    ? connection.points
    : calculatePoints();

  React.useEffect(() => {
    // Recalculate points when shapes move
    const newPoints = calculatePoints();
    updateConnection(connection.id, newPoints, connection.style);
  }, [fromShape.x, fromShape.y, toShape.x, toShape.y]);

  const getLineProps = () => {
    const isSelected = selectedConnectionId === connection.id;
    const baseProps = {
      points,
      onClick: () => setSelectedConnection(connection.id),
      onTap: () => setSelectedConnection(connection.id),
      stroke: isSelected ? "#3B82F6" : "#000",
      strokeWidth: isSelected ? 3 : 2,
    };

    switch (connection.style) {
      case "arrow":
        return {
          ...baseProps,
          pointerLength: 10,
          pointerWidth: 10,
        };
      case "doubleArrow":
        return {
          ...baseProps,
          pointerLength: 10,
          pointerWidth: 10,
          pointerAtBeginning: true,
        };
      case "dashed":
        return {
          ...baseProps,
          dash: [5, 5],
        };
      case "dotted":
        return {
          ...baseProps,
          dash: [2, 2],
        };
      default:
        return baseProps;
    }
  };

  return connection.style === "arrow" || connection.style === "doubleArrow" ? (
    <Arrow {...getLineProps()} />
  ) : (
    <Line {...getLineProps()} />
  );
};

export default Connection;
