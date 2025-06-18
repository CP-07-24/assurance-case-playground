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

// Interface untuk clipboard yang menyimpan shapes dan connections
interface ClipboardData {
  shapes: ShapeOnCanvas[];
  connections: Connection[];
}

// Perbaikan: DiagramState hanya berisi properti data, bukan fungsi
interface DiagramState {
  shapes: ShapeOnCanvas[];
  connections: Connection[];
  selectedId: string | null;
  selectedConnectionId: string | null;
  selectedIds: string[];
  clipboard: ClipboardData | null; // Update clipboard untuk menyimpan shapes dan connections
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
  // Properti untuk menggambar koneksi
  isDrawingConnection: boolean;
  connectionDrawingStyle: Connection["style"] | null;
  connectionStartPoint: { x: number; y: number } | null;
}

// DiagramContextType menyediakan semua fungsi untuk berinteraksi dengan diagram
interface DiagramContextType extends DiagramState {
  addShape: (shape: ShapeOnCanvas) => void;
  updateShapePosition: (id: string, newAttrs: Partial<ShapeOnCanvas>) => void;
  updateShape: (
    id: string,
    x: number,
    y: number,
    width?: number,
    height?: number
  ) => void;
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
  copySelectedShapes: () => void;
  pasteShape: (offsetX?: number, offsetY?: number) => void;
  cutSelectedShapes: () => void;
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
  // Fungsi untuk drawing connection
  startDrawingConnection: (style: Connection["style"]) => void;
  completeDrawingConnection: (point: { x: number; y: number }) => void;
  cancelDrawingConnection: () => void;
  // Tambahkan fungsi untuk mengonversi endpoint koneksi
  convertConnectionEndpoint: (
    connectionId: string,
    endpoint: "from" | "to",
    shapeId: string,
    point: string
  ) => void;
}

// initialState hanya berisi properti data yang sesuai dengan DiagramState
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
  isDrawingConnection: false,
  connectionDrawingStyle: null,
  connectionStartPoint: null,
};

type DiagramAction =
  | { type: "ADD_SHAPE"; payload: ShapeOnCanvas }
  | { type: "ADD_SHAPES"; payload: ShapeOnCanvas[] }
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
      payload: {
        id: string;
        points: number[];
        style: Connection["style"];
        from?: string;
        to?: string;
        fromPoint?: string;
        toPoint?: string;
      };
    }
  | { type: "DELETE_CONNECTION"; payload: string }
  | { type: "COPY_SHAPE"; payload: string }
  | { type: "COPY_SHAPES"; payload: string[] }
  | {
      type: "PASTE_SHAPES_AND_CONNECTIONS";
      payload: { offsetX: number; offsetY: number };
    }
  | { type: "SELECT_ALL" }
  | { type: "CLEAR_SELECTION" }
  | { type: "TOGGLE_SHAPE_SELECTION"; payload: string }
  | { type: "SET_MULTIPLE_SELECTION"; payload: string[] }
  | { type: "SET_EDITING_SHAPE"; payload: string | null }
  | { type: "SET_CONNECTING_FROM_POINT"; payload: string | null }
  | { type: "START_DRAWING_CONNECTION"; payload: Connection["style"] }
  | { type: "SET_CONNECTION_START_POINT"; payload: { x: number; y: number } }
  | { type: "COMPLETE_DRAWING_CONNECTION" }
  | { type: "CANCEL_DRAWING_CONNECTION" }
  | {
      type: "CONVERT_CONNECTION_ENDPOINT";
      payload: {
        connectionId: string;
        endpoint: "from" | "to";
        shapeId: string;
        point: string;
      };
    };

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
    case "ADD_SHAPES": {
      // Untuk memperbarui beberapa shape sekaligus (drag selection)
      if (
        action.payload.every((shape) =>
          state.shapes.some((s) => s.id === shape.id)
        )
      ) {
        // Ini adalah pembaruan untuk shape yang sudah ada
        const newShapes = state.shapes.map((shape) => {
          const updatedShape = action.payload.find((s) => s.id === shape.id);
          return updatedShape || shape;
        });

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
      } else {
        // Implementasi asli untuk menambahkan shape baru
        const newShapes = [...state.shapes, ...action.payload];
        const newHistory = state.history.slice(0, state.historyIndex + 1);
        newHistory.push({ shapes: newShapes, connections: state.connections });

        return {
          ...state,
          shapes: newShapes,
          history: newHistory,
          historyIndex: state.historyIndex + 1,
          canUndo: true,
          canRedo: false,
          selectedIds: action.payload.map((shape) => shape.id),
          selectedId: action.payload.length === 1 ? action.payload[0].id : null,
        };
      }
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
      // Untuk koneksi mandiri, tambahkan tanpa pemeriksaan
      if (!action.payload.from || !action.payload.to) {
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

      // Untuk koneksi antar shape, periksa duplikat
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
      const { id, points, style, from, to, fromPoint, toPoint } =
        action.payload;
      const newConnections = state.connections.map((conn) =>
        conn.id === id
          ? {
              ...conn,
              points,
              style,
              ...(from !== undefined ? { from } : {}),
              ...(to !== undefined ? { to } : {}),
              ...(fromPoint !== undefined ? { fromPoint } : {}),
              ...(toPoint !== undefined ? { toPoint } : {}),
            }
          : conn
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
    case "CONVERT_CONNECTION_ENDPOINT": {
      const { connectionId, endpoint, shapeId, point } = action.payload;
      const connection = state.connections.find(
        (conn) => conn.id === connectionId
      );
      if (!connection) return state;

      const newConnections = state.connections.map((conn) => {
        if (conn.id !== connectionId) return conn;

        const updatedConn = { ...conn } as ConnectionWithPoints;
        if (endpoint === "from") {
          updatedConn.from = shapeId;
          updatedConn.fromPoint = point;
        } else {
          updatedConn.to = shapeId;
          updatedConn.toPoint = point;
        }

        return updatedConn;
      });

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

      // Get connections for this single shape
      const connectionsToCopy = state.connections.filter(
        (conn) => conn.from === action.payload || conn.to === action.payload
      );

      return {
        ...state,
        clipboard: shapeToCopy
          ? {
              shapes: [shapeToCopy],
              connections: connectionsToCopy,
            }
          : null,
      };
    }
    case "COPY_SHAPES": {
      const shapesToCopy = state.shapes.filter((shape) =>
        action.payload.includes(shape.id)
      );

      // Get connections between the selected shapes
      const connectionsToCopy = state.connections.filter(
        (conn) =>
          action.payload.includes(conn.from) && action.payload.includes(conn.to)
      );

      return {
        ...state,
        clipboard:
          shapesToCopy.length > 0
            ? {
                shapes: shapesToCopy,
                connections: connectionsToCopy,
              }
            : null,
      };
    }
    case "PASTE_SHAPES_AND_CONNECTIONS": {
      if (!state.clipboard || state.clipboard.shapes.length === 0) return state;

      const { offsetX, offsetY } = action.payload;

      // Calculate the bounding box of clipboard shapes to maintain relative positions
      const minX = Math.min(...state.clipboard.shapes.map((shape) => shape.x));
      const minY = Math.min(...state.clipboard.shapes.map((shape) => shape.y));

      // Create mapping from old IDs to new IDs
      const idMapping: { [oldId: string]: string } = {};

      // Create new shapes with new IDs
      const newShapes = state.clipboard.shapes.map((shape, index) => {
        const newId = `${shape.type}-${Date.now()}-${Math.random()
          .toString(36)
          .substring(2, 9)}-${index}`;
        idMapping[shape.id] = newId;

        return {
          ...shape,
          id: newId,
          x: shape.x - minX + offsetX,
          y: shape.y - minY + offsetY,
        };
      });

      // Create new connections with updated IDs
      const newConnections = state.clipboard.connections.map((conn, index) => ({
        ...conn,
        id: `conn-${Date.now()}-${Math.random()
          .toString(36)
          .substring(2, 9)}-${index}`,
        from: idMapping[conn.from] || conn.from,
        to: idMapping[conn.to] || conn.to,
      }));

      const allShapes = [...state.shapes, ...newShapes];
      const allConnections = [...state.connections, ...newConnections];

      const newHistory = state.history.slice(0, state.historyIndex + 1);
      newHistory.push({ shapes: allShapes, connections: allConnections });

      return {
        ...state,
        shapes: allShapes,
        connections: allConnections,
        selectedIds: newShapes.map((shape) => shape.id),
        selectedId: newShapes.length === 1 ? newShapes[0].id : null,
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
    case "START_DRAWING_CONNECTION":
      return {
        ...state,
        isDrawingConnection: true,
        connectionDrawingStyle: action.payload,
        connectionStartPoint: null,
      };
    case "SET_CONNECTION_START_POINT":
      return {
        ...state,
        connectionStartPoint: action.payload,
      };
    case "COMPLETE_DRAWING_CONNECTION":
      return {
        ...state,
        isDrawingConnection: false,
        connectionDrawingStyle: null,
        connectionStartPoint: null,
      };
    case "CANCEL_DRAWING_CONNECTION":
      return {
        ...state,
        isDrawingConnection: false,
        connectionDrawingStyle: null,
        connectionStartPoint: null,
      };
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
    // Jika kita sedang men-drag shape yang merupakan bagian dari multi-selection
    if (state.selectedIds.length > 1 && state.selectedIds.includes(id)) {
      // Temukan shape yang sedang di-drag
      const selectedShape = state.shapes.find((shape) => shape.id === id);
      if (!selectedShape) return;

      // Hitung perubahan posisi (delta)
      const deltaX =
        newAttrs.x !== undefined ? newAttrs.x - selectedShape.x : 0;
      const deltaY =
        newAttrs.y !== undefined ? newAttrs.y - selectedShape.y : 0;

      // Terapkan delta yang sama ke semua shape yang dipilih
      const updatedShapes = state.shapes.map((shape) => {
        if (state.selectedIds.includes(shape.id)) {
          return {
            ...shape,
            x: shape.x + deltaX,
            y: shape.y + deltaY,
            // Sertakan atribut lain jika diberikan
            ...(newAttrs.width !== undefined ? { width: newAttrs.width } : {}),
            ...(newAttrs.height !== undefined
              ? { height: newAttrs.height }
              : {}),
            // Salin atribut lain dari newAttrs yang mungkin relevan
            ...Object.keys(newAttrs)
              .filter((key) => !["x", "y", "width", "height"].includes(key))
              .reduce(
                (obj, key) => ({
                  ...obj,
                  [key]: newAttrs[key as keyof typeof newAttrs],
                }),
                {}
              ),
          };
        }
        return shape;
      });

      // Perbarui semua shape yang dipilih sekaligus dengan satu tindakan
      const newHistory = state.history.slice(0, state.historyIndex + 1);
      newHistory.push({
        shapes: updatedShapes,
        connections: state.connections,
      });

      dispatch({
        type: "ADD_SHAPES",
        payload: updatedShapes.filter((shape) =>
          state.selectedIds.includes(shape.id)
        ),
      });
    } else {
      // Jika hanya satu shape yang dipilih, gunakan implementasi asli
      dispatch({ type: "UPDATE_SHAPE", payload: { id, attrs: newAttrs } });
    }
  };

  // Tambahkan fungsi updateShape untuk Connection component
  const updateShape = (
    id: string,
    x: number,
    y: number,
    width?: number,
    height?: number
  ) => {
    const attrs: Partial<ShapeOnCanvas> = { x, y };
    if (width !== undefined) attrs.width = width;
    if (height !== undefined) attrs.height = height;
    updateShapePosition(id, attrs);
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

  const convertConnectionEndpoint = (
    connectionId: string,
    endpoint: "from" | "to",
    shapeId: string,
    point: string
  ) => {
    dispatch({
      type: "CONVERT_CONNECTION_ENDPOINT",
      payload: { connectionId, endpoint, shapeId, point },
    });
  };

  const deleteConnection = (id: string) => {
    dispatch({ type: "DELETE_CONNECTION", payload: id });
  };

  // Copy single shape (backward compatibility)
  const copyShape = (id?: string) => {
    let shapeId: string | undefined;
    if (id) {
      shapeId = id;
    } else if (state.selectedId) {
      shapeId = state.selectedId;
    } else if (state.selectedIds.length === 1) {
      shapeId = state.selectedIds[0];
    } else if (state.selectedIds.length > 1) {
      // If multiple shapes selected, copy all of them
      copySelectedShapes();
      return;
    }
    if (shapeId) {
      dispatch({ type: "COPY_SHAPE", payload: shapeId });
    }
  };

  // Copy all selected shapes and their connections
  const copySelectedShapes = () => {
    const shapesToCopy =
      state.selectedIds.length > 0
        ? state.selectedIds
        : state.selectedId
        ? [state.selectedId]
        : [];

    if (shapesToCopy.length > 0) {
      dispatch({ type: "COPY_SHAPES", payload: shapesToCopy });
    }
  };

  // Cut selected shapes and connections (copy + delete)
  const cutSelectedShapes = () => {
    const shapesToCut =
      state.selectedIds.length > 0
        ? state.selectedIds
        : state.selectedId
        ? [state.selectedId]
        : [];

    if (shapesToCut.length > 0) {
      // First copy the shapes and their connections
      dispatch({ type: "COPY_SHAPES", payload: shapesToCut });

      // Then delete them (but not if any are being edited)
      const shapesToDelete = shapesToCut.filter(
        (id) => id !== state.editingShapeId
      );
      if (shapesToDelete.length > 0) {
        dispatch({ type: "DELETE_SHAPES", payload: shapesToDelete });
      }
    }
  };

  const pasteShape = (offsetX: number = 20, offsetY: number = 20) => {
    if (state.clipboard && state.clipboard.shapes.length > 0) {
      dispatch({
        type: "PASTE_SHAPES_AND_CONNECTIONS",
        payload: { offsetX, offsetY },
      });
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
    const shapesToDuplicate =
      state.selectedIds.length > 0
        ? state.selectedIds
        : state.selectedId
        ? [state.selectedId]
        : [];

    if (shapesToDuplicate.length > 0) {
      // Copy the selected shapes and their connections
      dispatch({ type: "COPY_SHAPES", payload: shapesToDuplicate });

      // Immediately paste them with offset
      dispatch({
        type: "PASTE_SHAPES_AND_CONNECTIONS",
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
        id: `text-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
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

  // Fungsi untuk drawing connection
  const startDrawingConnection = (style: Connection["style"]) => {
    dispatch({ type: "START_DRAWING_CONNECTION", payload: style });
  };

  const completeDrawingConnection = (endPoint: { x: number; y: number }) => {
    if (state.connectionStartPoint) {
      // Create a standalone connection between two points
      const connection: Connection = {
        id: `conn-${Date.now()}`,
        points: [
          state.connectionStartPoint.x,
          state.connectionStartPoint.y,
          endPoint.x,
          endPoint.y,
        ],
        style: state.connectionDrawingStyle || "line",
        // These properties would be empty string since it's not connecting shapes
        from: "",
        to: "",
      };
      dispatch({ type: "ADD_CONNECTION", payload: connection });
    }
    dispatch({ type: "COMPLETE_DRAWING_CONNECTION" });
  };

  const cancelDrawingConnection = () => {
    dispatch({ type: "CANCEL_DRAWING_CONNECTION" });
  };

  // Perbaikan: Tambahkan convertConnectionEndpoint ke contextValue
  const contextValue: DiagramContextType = {
    ...state,
    addShape,
    updateShapePosition,
    updateShape,
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
    copySelectedShapes,
    pasteShape,
    cutSelectedShapes,
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
    startDrawingConnection,
    completeDrawingConnection,
    cancelDrawingConnection,
    convertConnectionEndpoint,
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
