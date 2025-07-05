"use client";

import React, { useState, useEffect } from "react";
import { Edit, HelpCircle, Lightbulb, FolderKanban } from "lucide-react";
import { useDiagramContext } from "../../store/DiagramContext";
import MenuDropdown from "../ui/MenuDropdown";
import GuidanceDialog from "../dialogs/GuidanceDialog";
import DocumentationModal from "../documentation/DocumentationModal";
import Logo from "../../assets/logoeditor.png";

const TopBar: React.FC = () => {
  const {
    toggleSidebar,
    undo,
    redo,
    copyShape,
    pasteShape,
    selectAllShapes,
    canUndo,
    canRedo,
    clipboard,
    duplicateSelectedShapes,
    deleteSelectedShapes,
    shapes,
    selectedIds,
  } = useDiagramContext();

  // State management
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [isGuidanceDialogOpen, setIsGuidanceDialogOpen] = useState(false);
  const [isDocumentationModalOpen, setIsDocumentationModalOpen] = useState(false);

  // MODIFIKASI: Function openNewProject - GANTI HANYA BAGIAN INI
  const openNewProject = () => {
    // Perbaikan untuk Vercel routing - gunakan origin URL
    const baseUrl = window.location.origin;
    window.open(baseUrl, "_blank", "noopener,noreferrer");
  };

  // SISANYA TETAP SAMA - keyboard shortcuts yang sudah ada
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Close any open menus on Escape
      if (e.key === "Escape") {
        setActiveMenu(null);
        return;
      }

      if (e.ctrlKey || e.metaKey) {
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
            copyShape();
            break;
          case "v":
            e.preventDefault();
            pasteShape();
            break;
          case "a":
            e.preventDefault();
            selectAllShapes();
            break;
          case "d":
            e.preventDefault();
            duplicateSelectedShapes();
            break;
          case "n":
            e.preventDefault();
            openNewProject();
            break;
        }
      } else {
        if (
          e.key === "Delete" &&
          !(
            e.target instanceof HTMLInputElement ||
            e.target instanceof HTMLTextAreaElement ||
            (e.target as Element)?.getAttribute('contenteditable') === 'true'
          )
        ) {
          e.preventDefault();
          deleteSelectedShapes();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    undo,
    redo,
    copyShape,
    pasteShape,
    selectAllShapes,
    deleteSelectedShapes,
    duplicateSelectedShapes,
    openNewProject,
  ]);

  // Menu items untuk EDIT dropdown
  const editMenuItems = [
    {
      label: "Undo",
      onClick: () => undo(),
      shortcut: "Ctrl+Z",
      disabled: !canUndo,
    },
    {
      label: "Redo",
      onClick: () => redo(),
      shortcut: "Ctrl+Y",
      disabled: !canRedo,
    },
    {
      label: "Cut",
      onClick: () => {
        copyShape();
        deleteSelectedShapes();
      },
      shortcut: "Ctrl+X",
      disabled: selectedIds.length === 0,
    },
    {
      label: "Copy",
      onClick: () => copyShape(),
      shortcut: "Ctrl+C",
      disabled: selectedIds.length === 0,
    },
    {
      label: "Paste",
      onClick: () => pasteShape(),
      shortcut: "Ctrl+V",
      disabled: !clipboard,
    },
    {
      label: "Duplicate",
      onClick: () => {
        duplicateSelectedShapes();
      },
      shortcut: "Ctrl+D",
      disabled: selectedIds.length === 0,
    },
    {
      label: "Select All",
      onClick: () => selectAllShapes(),
      shortcut: "Ctrl+A",
      disabled: shapes.length === 0,
    },
    {
      label: "Delete",
      onClick: () => deleteSelectedShapes(),
      shortcut: "Del",
      disabled: selectedIds.length === 0,
    },
  ];

  // Menu handlers yang sudah ada
  const handleMenuClick = (menuId: string) => {
    setActiveMenu(activeMenu === menuId ? null : menuId);
  };

  const closeMenu = () => {
    setActiveMenu(null);
  };

  // Guidance dialog handler
  const handleGuidanceClick = () => {
    closeMenu();
    setIsGuidanceDialogOpen(true);
  };

  // Documentation dialog handler
  const handleDocumentationClick = () => {
    closeMenu();
    setIsDocumentationModalOpen(true);
  };

  // Click outside handler untuk close menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (activeMenu && !(event.target as Element)?.closest('.relative')) {
        setActiveMenu(null);
      }
    };

    if (activeMenu) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [activeMenu]);

  return (
    <>
      <div
        className="flex items-center justify-between bg-white border-b border-gray-200 h-12 px-3"
        data-preserve-selection="true"
        role="banner"
      >
        <div className="flex items-center">
          {/* Logo and Sidebar Toggle */}
          <div
            className="flex items-center cursor-pointer hover:opacity-80 transition-opacity"
            onClick={toggleSidebar}
            role="button"
            tabIndex={0}
            aria-label="Toggle sidebar"
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleSidebar();
              }
            }}
          >
            <img 
              src={Logo} 
              alt="Editor Logo" 
              className="h-8 w-auto"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>

          {/* Menu Navigation */}
          <nav className="flex ml-6 space-x-1" role="navigation">
            {/* PROJECT Menu */}
            <button
              className="px-3 py-1.5 text-sm font-medium hover:bg-gray-50 rounded-md"
              onClick={openNewProject}
            >
              <div className="flex items-center">
                <FolderKanban size={16} className="mr-1.5" />
                NEW PROJECT
              </div>
            </button>

            {/* EDIT Menu */}
            <div className="relative">
              <button
                className={`px-3 py-1.5 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded-md ${
                  activeMenu === "edit" ?
                "bg-gray-100" : "hover:bg-gray-50"
                }`}
                onClick={() => handleMenuClick("edit")}
                aria-expanded={activeMenu === "edit"}
                aria-haspopup="true"
              >
                <div className="flex items-center">
                  <Edit size={16} className="mr-1.5" />
                  EDIT
                </div>
              </button>
              {activeMenu === "edit" && (
                <MenuDropdown items={editMenuItems} onClose={closeMenu} />
              )}
            </div>

            {/* DOCUMENTATION Button */}
            <div className="relative">
              <button
                className="px-3 py-1.5 text-sm font-medium hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded-md"
                onClick={handleDocumentationClick}
                aria-label="Open notation guide"
              >
                <div className="flex items-center">
                  <HelpCircle size={16} className="mr-1.5" />
                  NOTATION GUIDE
                </div>
              </button>
            </div>

            {/* GUIDANCE Button */}
            <div className="relative">
              <button
                className="px-3 py-1.5 text-sm font-medium hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded-md"
                onClick={handleGuidanceClick}
                aria-label="Open app guide"
              >
                <div className="flex items-center">
                  <Lightbulb size={16} className="mr-1.5" />
                  APP GUIDE
                </div>
              </button>
            </div>
          </nav>
        </div>
      </div>

      {/* Dialogs */}
      <GuidanceDialog
        isOpen={isGuidanceDialogOpen}
        onClose={() => setIsGuidanceDialogOpen(false)}
      />

      <DocumentationModal
        isOpen={isDocumentationModalOpen}
        onClose={() => setIsDocumentationModalOpen(false)}
      />
    </>
  );
};

export default TopBar;