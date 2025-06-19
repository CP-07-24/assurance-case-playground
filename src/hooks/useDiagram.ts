import { useEffect, useState } from "react";
import { useDiagramContext } from "../store/DiagramContext";
import { Shape, ShapeOnCanvas } from "../types/shapes";

export const useDiagram = () => {
  const {
    shapes,
    selectedId,
    selectedShape,
    addShape,
    updateShapePosition,
    setSelectedId,
    updateSelectedShape,
    undo,
    redo,
    deleteShape,
    deleteConnection,
    selectedConnection,
    editingShapeId,
    setEditingShape,
  } = useDiagramContext();

  // Tambahkan state untuk melacak apakah text sedang kosong
  const [isTextEmpty, setIsTextEmpty] = useState(false);

  useEffect(() => {
    // Helper untuk memeriksa apakah elemen teks kosong
    const checkIfTextEmpty = () => {
      const editingElement = document.activeElement;
      if (!editingElement) return false;

      // Jika element adalah input atau textarea
      if (
        editingElement instanceof HTMLInputElement ||
        editingElement instanceof HTMLTextAreaElement
      ) {
        return editingElement.value === "";
      }

      // Jika element adalah contenteditable
      if (editingElement.getAttribute("contenteditable") === "true") {
        return (
          !editingElement.textContent ||
          editingElement.textContent.trim() === ""
        );
      }

      // Jika element adalah Konva textarea (digunakan saat editing text di Konva)
      if (
        editingElement.tagName === "TEXTAREA" &&
        editingElement.parentElement?.classList.contains("konvajs-content")
      ) {
        return (editingElement as HTMLTextAreaElement).value === "";
      }

      return false;
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // Cek apakah user sedang mengedit text
      const isEditingInput =
        document.activeElement instanceof HTMLInputElement ||
        document.activeElement instanceof HTMLTextAreaElement ||
        (document.activeElement &&
          document.activeElement.getAttribute("contenteditable") === "true") ||
        (document.activeElement?.tagName === "TEXTAREA" &&
          document.activeElement?.parentElement?.classList.contains(
            "konvajs-content"
          ));

      const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;
      const cmdKey = isMac ? e.metaKey : e.ctrlKey;

      // Khusus untuk tombol Delete/Backspace
      if (e.key === "Delete" || e.key === "Backspace") {
        // Jika sedang dalam mode edit dan tombol Shift atau Cmd/Ctrl ditekan, hapus shape
        if (editingShapeId && (e.shiftKey || cmdKey)) {
          e.preventDefault();
          setEditingShape(null);
          deleteShape(editingShapeId);
          return;
        }

        // Jika sedang dalam mode edit
        if (editingShapeId && isEditingInput) {
          // Periksa apakah teks kosong
          const isEmpty = checkIfTextEmpty();

          // Jika teks sudah kosong dan user menekan Backspace/Delete lagi
          if (isEmpty && isTextEmpty) {
            e.preventDefault();
            // Tidak perlu menghapus shape
            return;
          }

          // Update state isTextEmpty untuk keypress selanjutnya
          setTimeout(() => {
            setIsTextEmpty(checkIfTextEmpty());
          }, 0);

          return; // Biarkan default behavior untuk menghapus karakter
        }

        // Tambahkan kondisi untuk mencegah penghapusan shape setelah editing field
        // Jika activeElement adalah field input/text, jangan hapus shape
        const isTextInput =
          document.activeElement instanceof HTMLInputElement ||
          document.activeElement instanceof HTMLTextAreaElement ||
          (document.activeElement &&
            document.activeElement.getAttribute("contenteditable") ===
              "true") ||
          (document.activeElement?.tagName === "TEXTAREA" &&
            document.activeElement?.parentElement?.classList.contains(
              "konvajs-content"
            ));

        if (isTextInput) {
          // Jika kita masih di dalam field input, jangan hapus shape
          return;
        }

        // Behavior normal jika tidak sedang edit (hapus shape/connection)
        if (selectedId) {
          e.preventDefault();
          deleteShape(selectedId);
        } else if (selectedConnection) {
          e.preventDefault();
          deleteConnection(selectedConnection.id);
        }

        return;
      }

      // Reset isTextEmpty state jika user mengetik karakter lain
      if (editingShapeId && isEditingInput && isTextEmpty) {
        setIsTextEmpty(false);
      }

      // Jika ada shape yang sedang dalam mode edit, jangan handle shortcut lain
      if (editingShapeId || isEditingInput) {
        return;
      }

      // Shortcut lainnya
      if (cmdKey) {
        switch (e.key.toLowerCase()) {
          case "z":
            e.preventDefault();
            if (e.shiftKey) {
              redo();
            } else {
              undo();
            }
            break;
          case "y":
            e.preventDefault();
            redo();
            break;
          case "c":
            e.preventDefault();
            // Copy implementation
            break;
          case "v":
            e.preventDefault();
            // Paste implementation
            break;
          case "x":
            e.preventDefault();
            // Cut implementation
            break;
          case "d":
            e.preventDefault();
            // Duplicate implementation
            break;
          case "a":
            e.preventDefault();
            console.log("Select All from useDiagram");
            // Gunakan selectAllShapes dari context
            const { selectAllShapes } = useDiagramContext();
            selectAllShapes();
            break;
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [
    selectedId,
    selectedConnection,
    editingShapeId,
    setEditingShape,
    deleteShape,
    deleteConnection,
    undo,
    redo,
    isTextEmpty,
  ]);

  const addShapeToCanvas = (shape: Shape) => {
    const newShape: ShapeOnCanvas = {
      ...shape,
      id: Date.now().toString(),
      x: 100,
      y: 100,
      width: 100,
      height: 50,
    };
    addShape(newShape);
    setSelectedId(newShape.id);
  };

  return {
    shapes,
    selectedShape,
    selectedId,
    addShapeToCanvas,
    updateShape: updateShapePosition,
    selectShape: setSelectedId,
    updateSelectedShape,
  };
};
