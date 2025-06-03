import React, { createContext, useContext, useReducer, useState } from "react";
import { ShapeOnCanvas, Connection } from "../types/shapes";

// Tambahkan interface TextElementProps
export interface TextElementProps {
  x: number;
  y: number;
  text: string;
  width: number;
  height: number;
  editable?: boolean;
}

// Perpanjang tipe Connection dengan interface tambahan untuk titik koneksi
export interface ConnectionWithPoints extends Connection {
  fromPoint?: string;
  toPoint?: string;
}

interface DiagramState {
  shapes: ShapeOnCanvas[];
  connections: Connection[];
  selectedId: string | null;
  selectedConnectionId: string | null;
  selectedIds: string[];
  clipboard: ShapeOnCanvas | null;
  history: { shapes: ShapeOnCanvas[]; connections: Connection[] }[];
  historyIndex: number;
  canUndo: boolean;
  canRedo: boolean;
  zoomLevel: number;
  stageSize: { width: number; height: number };
  isSidebarCollapsed: boolean;
  isConnecting: boolean;
  connectingFromId: string | null;
  editingShapeId: string | null;
  connectingFromPoint: string | null;
}

interface DiagramContextType extends DiagramState {
  addShape: (shape: ShapeOnCanvas) => void;
  updateShapePosition: (id: string, newAttrs: Partial<ShapeOnCanvas>) => void;
  setSelectedId: (id: string | null) => void;
  setSelectedConnection: (id: string | null) => void;
  updateSelectedShape: (attrs: Partial<ShapeOnCanvas>) => void;
  selectedShape: ShapeOnCanvas | null;
  selectedConnection: Connection | null;
  deleteShape: (id: string) => void;
  deleteSelectedShapes: () => void;
  startConnection: (fromId: string) => void;
  startConnectionFromPoint: (fromId: string, fromPoint: string) => void;
  completeConnection: (toId: string, toPoint?: string) => void;
  cancelConnection: () => void;
  addConnection: (connection: Connection | ConnectionWithPoints) => void;
  updateConnection: (
    id: string,
    points: number[],
    style: Connection["style"]
  ) => void;
  deleteConnection: (id: string) => void;
  copyShape: (id?: string) => void;
  pasteShape: (offsetX?: number, offsetY?: number) => void;
  selectAllShapes: () => void;
  clearSelection: () => void;
  toggleShapeSelection: (id: string) => void;
  undo: () => void;
  redo: () => void;
  setZoomLevel: (level: number) => void;
  setStageSize: (size: { width: number; height: number }) => void;
  toggleSidebar: () => void;
  duplicateSelectedShapes: () => void;
  addTextElement: (textElement: TextElementProps) => void;
  setEditingShape: (id: string | null) => void;
}

const initialState: DiagramState = {
  shapes: [],
  connections: [],
  selectedId: null,
  selectedConnectionId: null,
  selectedIds: [],
  clipboard: null,
  history: [{ shapes: [], connections: [] }],
  historyIndex: 0,
  canUndo: false,
  canRedo: false,
  zoomLevel: 1,
  stageSize: { width: 0, height: 0 },
  isSidebarCollapsed: false,
  isConnecting: false,
  connectingFromId: null,
  editingShapeId: null,
  connectingFromPoint: null,
};

type DiagramAction =
  | { type: "ADD_SHAPE"; payload: ShapeOnCanvas }
  | {
      type: "UPDATE_SHAPE";
      payload: { id: string; attrs: Partial<ShapeOnCanvas> };
    }
  | { type: "SET_SELECTED"; payload: string | null }
  | { type: "SET_SELECTED_CONNECTION"; payload: string | null }
  | { type: "DELETE_SHAPE"; payload: string }
  | { type: "DELETE_SHAPES"; payload: string[] }
  | { type: "UNDO" }
  | { type: "REDO" }
  | { type: "SET_ZOOM"; payload: number }
  | { type: "SET_STAGE_SIZE"; payload: { width: number; height: number } }
  | { type: "TOGGLE_SIDEBAR" }
  | { type: "START_CONNECTION"; payload: string }
  | { type: "COMPLETE_CONNECTION" }
  | { type: "CANCEL_CONNECTION" }
  | { type: "ADD_CONNECTION"; payload: Connection | ConnectionWithPoints }
  | {
      type: "UPDATE_CONNECTION";
      payload: { id: string; points: number[]; style: Connection["style"] };
    }
  | { type: "DELETE_CONNECTION"; payload: string }
  | { type: "COPY_SHAPE"; payload: string }
  | { type: "PASTE_SHAPE"; payload: { offsetX: number; offsetY: number } }
  | { type: "SELECT_ALL" }
  | { type: "CLEAR_SELECTION" }
  | { type: "TOGGLE_SHAPE_SELECTION"; payload: string }
  | { type: "SET_MULTIPLE_SELECTION"; payload: string[] }
  | { type: "SET_EDITING_SHAPE"; payload: string | null }
  | { type: "SET_CONNECTING_FROM_POINT"; payload: string | null };

const diagramReducer = (
  state: DiagramState,
  action: DiagramAction
): DiagramState => {
  switch (action.type) {
    case "ADD_SHAPE": {
      const newShapes = [...state.shapes, action.payload];
      const newHistory = state.history.slice(0, state.historyIndex + 1);
      newHistory.push({ shapes: newShapes, connections: state.connections });
      return {
        ...state,
        shapes: newShapes,
        history: newHistory,
        historyIndex: state.historyIndex + 1,
        canUndo: true,
        canRedo: false,
      };
    }
    case "UPDATE_SHAPE": {
      const { id, attrs } = action.payload;
      const newShapes = state.shapes.map((shape) =>
        shape.id === id ? { ...shape, ...attrs } : shape
      );
      const newHistory = state.history.slice(0, state.historyIndex + 1);
      newHistory.push({ shapes: newShapes, connections: state.connections });
      return {
        ...state,
        shapes: newShapes,
        history: newHistory,
        historyIndex: state.historyIndex + 1,
        canUndo: true,
        canRedo: false,
      };
    }
    case "SET_SELECTED": {
      return {
        ...state,
        selectedId: action.payload,
        selectedIds: action.payload ? [action.payload] : [],
        selectedConnectionId: null,
        isConnecting: false,
        connectingFromId: null,
      };
    }
    case "SET_SELECTED_CONNECTION": {
      return {
        ...state,
        selectedId: null,
        selectedIds: [],
        selectedConnectionId: action.payload,
        isConnecting: false,
        connectingFromId: null,
      };
    }
    case "DELETE_SHAPE": {
      // Don't delete shape if it's currently being edited
      if (state.editingShapeId === action.payload) {
        return state;
      }
      const newShapes = state.shapes.filter(
        (shape) => shape.id !== action.payload
      );
      const newConnections = state.connections.filter(
        (conn) => conn.from !== action.payload && conn.to !== action.payload
      );
      const newHistory = state.history.slice(0, state.historyIndex + 1);
      newHistory.push({ shapes: newShapes, connections: newConnections });
      return {
        ...state,
        shapes: newShapes,
        connections: newConnections,
        selectedId: null,
        selectedIds: [],
        history: newHistory,
        historyIndex: state.historyIndex + 1,
        canUndo: true,
        canRedo: false,
      };
    }
    case "DELETE_SHAPES": {
      // Filter out shapes that are being edited
      const idsToDelete = action.payload.filter(
        (id) => id !== state.editingShapeId
      );
      if (idsToDelete.length === 0) {
        return state;
      }
      const newShapes = state.shapes.filter(
        (shape) => !idsToDelete.includes(shape.id)
      );
      const newConnections = state.connections.filter(
        (conn) =>
          !idsToDelete.includes(conn.from) && !idsToDelete.includes(conn.to)
      );
      const newHistory = state.history.slice(0, state.historyIndex + 1);
      newHistory.push({ shapes: newShapes, connections: newConnections });
      return {
        ...state,
        shapes: newShapes,
        connections: newConnections,
        selectedId: null,
        selectedIds: [],
        history: newHistory,
        historyIndex: state.historyIndex + 1,
        canUndo: true,
        canRedo: false,
      };
    }
    case "START_CONNECTION": {
      return {
        ...state,
        isConnecting: true,
        connectingFromId: action.payload,
      };
    }
    case "COMPLETE_CONNECTION": {
      return {
        ...state,
        isConnecting: false,
        connectingFromId: null,
        connectingFromPoint: null,
      };
    }
    case "CANCEL_CONNECTION": {
      return {
        ...state,
        isConnecting: false,
        connectingFromId: null,
        connectingFromPoint: null,
      };
    }
    case "ADD_CONNECTION": {
      // Check if a connection already exists between these shapes in either direction
      const connectionExists = state.connections.some(
        (conn) =>
          (conn.from === action.payload.from &&
            conn.to === action.payload.to) ||
          (conn.from === action.payload.to && conn.to === action.payload.from)
      );
      // If a connection already exists, return the current state without changes
      if (connectionExists) {
        return state;
      }
      const newConnections = [...state.connections, action.payload];
      const newHistory = state.history.slice(0, state.historyIndex + 1);
      newHistory.push({ shapes: state.shapes, connections: newConnections });
      return {
        ...state,
        connections: newConnections,
        history: newHistory,
        historyIndex: state.historyIndex + 1,
        canUndo: true,
        canRedo: false,
      };
    }
    case "UPDATE_CONNECTION": {
      const { id, points, style } = action.payload;
      const newConnections = state.connections.map((conn) =>
        conn.id === id ? { ...conn, points, style } : conn
      );
      const newHistory = state.history.slice(0, state.historyIndex + 1);
      newHistory.push({ shapes: state.shapes, connections: newConnections });
      return {
        ...state,
        connections: newConnections,
        history: newHistory,
        historyIndex: state.historyIndex + 1,
        canUndo: true,
        canRedo: false,
      };
    }
    case "DELETE_CONNECTION": {
      const newConnections = state.connections.filter(
        (conn) => conn.id !== action.payload
      );
      const newHistory = state.history.slice(0, state.historyIndex + 1);
      newHistory.push({ shapes: state.shapes, connections: newConnections });
      return {
        ...state,
        connections: newConnections,
        selectedConnectionId: null,
        history: newHistory,
        historyIndex: state.historyIndex + 1,
        canUndo: true,
        canRedo: false,
      };
    }
    case "COPY_SHAPE": {
      const shapeToCopy = state.shapes.find(
        (shape) => shape.id === action.payload
      );
      return {
        ...state,
        clipboard: shapeToCopy || null,
      };
    }
    case "PASTE_SHAPE": {
      if (!state.clipboard) return state;
      const { offsetX, offsetY } = action.payload;
      const newShape: ShapeOnCanvas = {
        ...state.clipboard,
        id: `${state.clipboard.type}-${Date.now()}-${Math.random()
          .toString(36)
          .substr(2, 9)}`,
        x: state.clipboard.x + offsetX,
        y: state.clipboard.y + offsetY,
      };
      const newShapes = [...state.shapes, newShape];
      const newHistory = state.history.slice(0, state.historyIndex + 1);
      newHistory.push({ shapes: newShapes, connections: state.connections });
      return {
        ...state,
        shapes: newShapes,
        selectedId: newShape.id,
        selectedIds: [newShape.id],
        history: newHistory,
        historyIndex: state.historyIndex + 1,
        canUndo: true,
        canRedo: false,
      };
    }
    case "SELECT_ALL": {
      const allShapeIds = state.shapes.map((shape) => shape.id);
      return {
        ...state,
        selectedId: allShapeIds.length === 1 ? allShapeIds[0] : null,
        selectedIds: allShapeIds,
        selectedConnectionId: null,
        isConnecting: false,
        connectingFromId: null,
      };
    }
    case "CLEAR_SELECTION": {
      return {
        ...state,
        selectedId: null,
        selectedIds: [],
        selectedConnectionId: null,
      };
    }
    case "TOGGLE_SHAPE_SELECTION": {
      const shapeId = action.payload;
      const isCurrentlySelected = state.selectedIds.includes(shapeId);
      let newSelectedIds: string[];
      if (isCurrentlySelected) {
        newSelectedIds = state.selectedIds.filter((id) => id !== shapeId);
      } else {
        newSelectedIds = [...state.selectedIds, shapeId];
      }
      return {
        ...state,
        selectedIds: newSelectedIds,
        selectedId: newSelectedIds.length === 1 ? newSelectedIds[0] : null,
      };
    }
    case "SET_MULTIPLE_SELECTION": {
      // Pastikan payload adalah array yang valid
      if (!Array.isArray(action.payload)) {
        console.error(
          "SET_MULTIPLE_SELECTION received invalid payload:",
          action.payload
        );
        return state;
      }

      const newState = {
        ...state,
        selectedIds: [...action.payload], // Gunakan spread operator untuk array baru
        selectedId: action.payload.length === 1 ? action.payload[0] : null,
        selectedConnectionId: null,
      };
      return newState;
    }
    case "UNDO": {
      if (state.historyIndex <= 0) return state;
      const newIndex = state.historyIndex - 1;
      const { shapes, connections } = state.history[newIndex];
      return {
        ...state,
        shapes,
        connections,
        historyIndex: newIndex,
        canUndo: newIndex > 0,
        canRedo: true,
      };
    }
    case "REDO": {
      if (state.historyIndex >= state.history.length - 1) return state;
      const newIndex = state.historyIndex + 1;
      const { shapes, connections } = state.history[newIndex];
      return {
        ...state,
        shapes,
        connections,
        historyIndex: newIndex,
        canUndo: true,
        canRedo: newIndex < state.history.length - 1,
      };
    }
    case "SET_ZOOM": {
      return {
        ...state,
        zoomLevel: action.payload,
      };
    }
    case "SET_STAGE_SIZE": {
      return {
        ...state,
        stageSize: action.payload,
      };
    }
    case "TOGGLE_SIDEBAR": {
      return {
        ...state,
        isSidebarCollapsed: !state.isSidebarCollapsed,
      };
    }
    case "SET_EDITING_SHAPE": {
      return {
        ...state,
        editingShapeId: action.payload,
      };
    }
    case "SET_CONNECTING_FROM_POINT": {
      return {
        ...state,
        connectingFromPoint: action.payload,
      };
    }
    default:
      return state;
  }
};

const DiagramContext = createContext<DiagramContextType | undefined>(undefined);

export const DiagramProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(diagramReducer, initialState);
  const [selectedShapeIds, setSelectedShapeIds] = useState<string[]>([]);

  const addShape = (shape: ShapeOnCanvas) => {
    dispatch({ type: "ADD_SHAPE", payload: shape });
  };

  const updateShapePosition = (
    id: string,
    newAttrs: Partial<ShapeOnCanvas>
  ) => {
    dispatch({ type: "UPDATE_SHAPE", payload: { id, attrs: newAttrs } });
  };

  const setSelectedId = (id: string | null) => {
    dispatch({ type: "SET_SELECTED", payload: id });
  };

  const setEditingShape = (id: string | null) => {
    dispatch({ type: "SET_EDITING_SHAPE", payload: id });
  };

  const setSelectedConnection = (id: string | null) => {
    dispatch({ type: "SET_SELECTED_CONNECTION", payload: id });
  };

  const updateSelectedShape = (attrs: Partial<ShapeOnCanvas>) => {
    if (state.selectedId) {
      updateShapePosition(state.selectedId, attrs);
    }
  };

  const deleteShape = (id: string) => {
    // Only delete if not currently editing
    if (state.editingShapeId !== id) {
      dispatch({ type: "DELETE_SHAPE", payload: id });
    } else {
      console.log("Cannot delete shape while editing:", id);
    }
  };

  const deleteSelectedShapes = () => {
    // Don't delete any shapes that are being edited
    if (state.selectedIds.length > 0) {
      // Filter out the editing shape if it's in the selection
      const shapesToDelete = state.selectedIds.filter(
        (id) => id !== state.editingShapeId
      );
      if (shapesToDelete.length > 0) {
        dispatch({ type: "DELETE_SHAPES", payload: shapesToDelete });
      }
    } else if (state.selectedId && state.selectedId !== state.editingShapeId) {
      dispatch({ type: "DELETE_SHAPE", payload: state.selectedId });
    }
  };

  const selectedShape =
    state.shapes.find((shape) => shape.id === state.selectedId) || null;

  const selectedConnection =
    state.connections.find((conn) => conn.id === state.selectedConnectionId) ||
    null;

  const startConnection = (fromId: string) => {
    dispatch({ type: "START_CONNECTION", payload: fromId });
  };

  const startConnectionFromPoint = (fromId: string, fromPoint: string) => {
    dispatch({ type: "START_CONNECTION", payload: fromId });
    dispatch({ type: "SET_CONNECTING_FROM_POINT", payload: fromPoint });
  };

  const completeConnection = (toId: string, toPoint: string = "left") => {
    if (state.connectingFromId && state.connectingFromId !== toId) {
      // Create connection object with fromPoint and toPoint
      const connection: ConnectionWithPoints = {
        id: `conn-${Date.now()}`,
        from: state.connectingFromId,
        to: toId,
        points: [],
        style: "line",
        fromPoint: state.connectingFromPoint || "right",
        toPoint: toPoint,
      };

      dispatch({ type: "ADD_CONNECTION", payload: connection });
    }

    // Reset connection state
    dispatch({ type: "COMPLETE_CONNECTION" });
  };

  const cancelConnection = () => {
    dispatch({ type: "CANCEL_CONNECTION" });
    dispatch({ type: "SET_CONNECTING_FROM_POINT", payload: null });
  };

  const addConnection = (connection: Connection | ConnectionWithPoints) => {
    dispatch({ type: "ADD_CONNECTION", payload: connection });
  };

  const updateConnection = (
    id: string,
    points: number[],
    style: Connection["style"]
  ) => {
    dispatch({ type: "UPDATE_CONNECTION", payload: { id, points, style } });
  };

  const deleteConnection = (id: string) => {
    dispatch({ type: "DELETE_CONNECTION", payload: id });
  };

  const copyShape = (id?: string) => {
    let shapeId: string | undefined;
    if (id) {
      shapeId = id;
    } else if (state.selectedId) {
      shapeId = state.selectedId;
    } else if (state.selectedIds.length === 1) {
      shapeId = state.selectedIds[0];
    } else if (state.selectedIds.length > 1) {
      shapeId = state.selectedIds[0];
    }
    if (shapeId) {
      dispatch({ type: "COPY_SHAPE", payload: shapeId });
    }
  };

  const pasteShape = (offsetX: number = 20, offsetY: number = 20) => {
    if (state.clipboard) {
      dispatch({ type: "PASTE_SHAPE", payload: { offsetX, offsetY } });
    }
  };

  // src/store/DiagramContext.tsx
  const selectAllShapes = () => {
    const allShapeIds = state.shapes.map((shape) => shape.id);

    // Update state terpisah
    setSelectedShapeIds(allShapeIds);

    // Juga dispatch untuk konsistensi state
    dispatch({
      type: "SET_MULTIPLE_SELECTION",
      payload: allShapeIds,
    });
  };

  const clearSelection = () => {
    setSelectedShapeIds([]);
    dispatch({ type: "CLEAR_SELECTION" });
  };

  const toggleShapeSelection = (id: string) => {
    dispatch({ type: "TOGGLE_SHAPE_SELECTION", payload: id });
  };

  const duplicateSelectedShapes = () => {
    if (state.selectedIds.length > 0) {
      state.selectedIds.forEach((id) => {
        const shape = state.shapes.find((s) => s.id === id);
        if (shape) {
          dispatch({ type: "COPY_SHAPE", payload: id });
          dispatch({
            type: "PASTE_SHAPE",
            payload: {
              offsetX: 20,
              offsetY: 20,
            },
          });
        }
      });
    } else if (state.selectedId) {
      dispatch({ type: "COPY_SHAPE", payload: state.selectedId });
      dispatch({
        type: "PASTE_SHAPE",
        payload: {
          offsetX: 20,
          offsetY: 20,
        },
      });
    }
  };

  const undo = () => {
    if (state.canUndo) {
      dispatch({ type: "UNDO" });
    }
  };

  const redo = () => {
    if (state.canRedo) {
      dispatch({ type: "REDO" });
    }
  };

  const setZoomLevel = (level: number) => {
    dispatch({ type: "SET_ZOOM", payload: level });
  };

  const setStageSize = (size: { width: number; height: number }) => {
    dispatch({ type: "SET_STAGE_SIZE", payload: size });
  };

  const toggleSidebar = () => {
    dispatch({ type: "TOGGLE_SIDEBAR" });
  };

  // Tambahkan fungsi addTextElement yang sudah diperbaiki
  const addTextElement = (textElement: TextElementProps) => {
    console.log("addTextElement called with:", textElement);

    try {
      // Buat shape baru untuk teks sesuai dengan tipe ShapeOnCanvas
      const textShape: ShapeOnCanvas = {
        id: `text-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type: "text",
        title: "Text", // Properti wajib dari Shape
        preview: <div>Text</div>, // Properti wajib dari Shape
        x: textElement.x,
        y: textElement.y,
        width: textElement.width,
        height: textElement.height,
        text: textElement.text,
        // Default styling untuk text
        fontFamily: "Arial",
        fontSize: 14,
        fontWeight: "normal",
        fontStyle: "normal",
        align: "left",
        textDecoration: "none",
        interLine: "normal",
      };

      console.log("Created text shape:", textShape);

      // Tambahkan shape ke diagram
      dispatch({ type: "ADD_SHAPE", payload: textShape });

      // Jika editable, set shape ini sebagai selected
      if (textElement.editable) {
        dispatch({ type: "SET_SELECTED", payload: textShape.id });

        setEditingShape(textShape.id);
      }
    } catch (error) {
      console.error("Error adding text element:", error);
    }
  };

  const contextValue: DiagramContextType = {
    ...state,
    addShape,
    updateShapePosition,
    setSelectedId,
    setSelectedConnection,
    updateSelectedShape,
    selectedShape,
    selectedConnection,
    deleteShape,
    deleteSelectedShapes,
    startConnection,
    startConnectionFromPoint,
    completeConnection,
    cancelConnection,
    addConnection,
    updateConnection,
    deleteConnection,
    copyShape,
    pasteShape,
    selectAllShapes,
    clearSelection,
    toggleShapeSelection,
    duplicateSelectedShapes,
    undo,
    redo,
    setZoomLevel,
    setStageSize,
    toggleSidebar,
    addTextElement,
    setEditingShape,
    selectedIds:
      selectedShapeIds.length > 0 ? selectedShapeIds : state.selectedIds,
  };

  return (
    <DiagramContext.Provider value={contextValue}>
      {children}
    </DiagramContext.Provider>
  );
};

export const useDiagramContext = () => {
  const context = useContext(DiagramContext);
  if (!context) {
    throw new Error("useDiagramContext must be used within a DiagramProvider");
  }
  return context;
};
