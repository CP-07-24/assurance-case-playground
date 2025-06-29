"use client";

import React, { useState, useEffect } from "react";
import { Edit, HelpCircle, Lightbulb, FolderKanban } from "lucide-react";
import { useDiagramContext } from "../../store/DiagramContext";
import MenuDropdown from "../ui/MenuDropdown";
import GuidanceDialog from "../dialogs/GuidanceDialog";
import DocumentationModal from "../documentation/DocumentationModal";
import { FcGoogle } from "react-icons/fc";
import {
  signInWithGoogle,
  firebaseSignOut,
  auth,
} from "../../lib/firebase/auth";
import { User } from "firebase/auth";
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

  // State management - mempertahankan semua state yang ada
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isGuidanceDialogOpen, setIsGuidanceDialogOpen] = useState(false);
  const [isDocumentationModalOpen, setIsDocumentationModalOpen] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null); // Enhanced: Add auth error state

  // Authentication monitoring - mempertahankan logic yang ada dengan error handling
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
      setAuthError(null); // Clear any auth errors on successful state change
    });
    return () => unsubscribe();
  }, []);

  // Mempertahankan function openNewProject yang sudah ada
  const openNewProject = () => {
    // Mendapatkan URL saat ini
    const currentUrl = window.location.href;
    // Mendapatkan URL dasar (tanpa parameter query jika ada)
    const baseUrl = currentUrl.split("?")[0].split("#")[0];
    // Membuka tab baru dengan URL yang sama
    window.open(baseUrl, "_blank", "noopener,noreferrer"); // Enhanced: Add security attributes
  };

  // Mempertahankan keyboard shortcuts yang sudah ada
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
  ]);

  // Mempertahankan menu items yang sudah ada
  const projectMenuItems = [
    {
      label: "New Project",
      onClick: openNewProject,
      shortcut: "Ctrl+N", // Enhanced: Add shortcut display
    },
  ];

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

  // Mempertahankan menu handlers yang sudah ada
  const handleMenuClick = (menuId: string) => {
    setActiveMenu(activeMenu === menuId ? null : menuId);
  };

  const closeMenu = () => {
    setActiveMenu(null);
  };

  // Mempertahankan guidance dialog handler
  const handleGuidanceClick = () => {
    closeMenu();
    setIsGuidanceDialogOpen(true);
  };

  // Mempertahankan documentation dialog handler
  const handleDocumentationClick = () => {
    closeMenu();
    setIsDocumentationModalOpen(true);
  };

  // Enhanced: Improved sign out with error handling
  const handleSignOut = async () => {
    try {
      setAuthError(null);
      await firebaseSignOut(auth);
    } catch (error) {
      console.error("Error signing out:", error);
      setAuthError("Gagal logout. Silakan coba lagi.");
    }
  };

  // Enhanced: Improved sign in with error handling
  const handleSignIn = async () => {
    try {
      setAuthError(null);
      await signInWithGoogle();
    } catch (error) {
      console.error("Error signing in:", error);
      setAuthError("Gagal login. Silakan coba lagi.");
    }
  };

  // Enhanced: Click outside handler untuk close menu
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
        role="banner" // Enhanced: Add ARIA role
      >
        <div className="flex items-center">
          {/* Logo and Sidebar Toggle - mempertahankan yang sudah ada */}
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
                // Enhanced: Handle logo load error
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>

          {/* Menu Navigation - mempertahankan struktur yang sudah ada */}
          <nav className="flex ml-6 space-x-1" role="navigation">
            {/* PROJECT Menu */}
            <div className="relative">
              <button
                className={`px-3 py-1.5 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded-md ${
                  activeMenu === "project" ? "bg-gray-100" : "hover:bg-gray-50"
                }`}
                onClick={() => handleMenuClick("project")}
                aria-expanded={activeMenu === "project"}
                aria-haspopup="true"
              >
                <div className="flex items-center">
                  <FolderKanban size={16} className="mr-1.5" />
                  PROJECT
                </div>
              </button>
              {activeMenu === "project" && (
                <MenuDropdown items={projectMenuItems} onClose={closeMenu} />
              )}
            </div>

            {/* EDIT Menu */}
            <div className="relative">
              <button
                className={`px-3 py-1.5 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded-md ${
                  activeMenu === "edit" ? "bg-gray-100" : "hover:bg-gray-50"
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

            {/* DOCUMENTATION Button - mempertahankan yang sudah ada */}
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

            {/* GUIDANCE Button - mempertahankan yang sudah ada */}
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

        {/* User Authentication Section - enhanced dengan error handling */}
        <div className="flex items-center">
          {authError && (
            <div className="mr-3 text-xs text-red-600 bg-red-50 px-2 py-1 rounded">
              {authError}
            </div>
          )}
          
          {loading ? (
            <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />
          ) : user ? (
            <div className="flex items-center gap-2 group relative">
              <div className="flex items-center gap-2">
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={`${user.displayName || 'User'} profile`}
                    className="w-8 h-8 rounded-full object-cover"
                    onError={(e) => {
                      // Enhanced: Fallback for broken profile images
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="w-8 h-8 flex items-center justify-center bg-blue-500 text-white rounded-full text-sm font-medium">
                    {user.displayName?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || "U"}
                  </div>
                )}
                <span className="text-sm font-medium hidden md:inline truncate max-w-24">
                  {user.displayName || user.email?.split('@')[0] || "User"}
                </span>
              </div>
              <button
                onClick={handleSignOut}
                className="ml-2 text-xs text-gray-500 hover:text-gray-700 transition-colors focus:outline-none focus:ring-1 focus:ring-blue-500 rounded px-1"
                aria-label="Sign out"
              >
                Logout
              </button>
            </div>
          ) : (
            <button
              onClick={handleSignIn}
              className="flex items-center gap-1 bg-white border border-gray-300 rounded-full px-3 py-1 text-sm hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              aria-label="Sign in with Google"
            >
              <FcGoogle className="text-lg" />
              <span>Login</span>
            </button>
          )}
        </div>
      </div>

      {/* Dialogs - mempertahankan yang sudah ada */}
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