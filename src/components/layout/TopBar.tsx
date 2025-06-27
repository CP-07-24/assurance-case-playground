"use client";

import React, { useState, useEffect } from "react";
import { Edit, HelpCircle, Lightbulb, FolderKanban } from "lucide-react";
import { useDiagramContext } from "../../store/DiagramContext";
import MenuDropdown from "../ui/MenuDropdown";
import { FcGoogle } from "react-icons/fc";
import {
  signInWithGoogle,
  firebaseSignOut,
  auth,
} from "../../lib/firebase/auth";
import { User } from "firebase/auth";
import Logo from "../../assets/logoeditor.png";

// IMPORT DOCUMENTATION MODAL
import { GuidanceModal } from "../documentation";

// IMPORT GUIDANCE DIALOG
import GuidanceDialog from "../dialogs/GuidanceDialog";

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

  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
  // STATE UNTUK DOCUMENTATION MODAL
  const [showDocumentationModal, setShowDocumentationModal] = useState(false);
  const [documentationSection, setDocumentationSection] = useState<string>('introduction');

  // STATE UNTUK GUIDANCE DIALOG
  const [isGuidanceDialogOpen, setIsGuidanceDialogOpen] = useState(false);

  // Pantau perubahan status autentikasi
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Fungsi untuk membuka project baru di tab baru
  const openNewProject = () => {
    const currentUrl = window.location.href;
    const baseUrl = currentUrl.split("?")[0].split("#")[0];
    window.open(baseUrl, "_blank");
  };

  // FUNGSI UNTUK MEMBUKA DOCUMENTATION MODAL
  const openDocumentationModal = (section: string = 'introduction') => {
    setDocumentationSection(section);
    setShowDocumentationModal(true);
    setActiveMenu(null);
  };

  // FUNGSI UNTUK MEMBUKA GUIDANCE DIALOG
  const handleGuidanceClick = () => {
    setActiveMenu(null);
    setIsGuidanceDialogOpen(true);
  };

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
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
            copyShape();
            setTimeout(() => pasteShape(30, 30), 10);
            break;
          case "x":
            e.preventDefault();
            copyShape();
            deleteSelectedShapes();
            break;
        }
      }
      if (e.key === "Delete" || e.key === "Backspace") {
        if (
          !(
            e.target instanceof HTMLInputElement ||
            e.target instanceof HTMLTextAreaElement
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

  const projectMenuItems = [
    {
      label: "New Project",
      action: openNewProject,
      shortcut: "",
    },
  ];

  const editMenuItems = [
    {
      label: "Undo",
      action: () => undo(),
      shortcut: "Ctrl+Z",
      disabled: !canUndo,
    },
    {
      label: "Redo",
      action: () => redo(),
      shortcut: "Ctrl+Y",
      disabled: !canRedo,
    },
    {
      label: "Cut",
      action: () => {
        copyShape();
        deleteSelectedShapes();
      },
      shortcut: "Ctrl+X",
      disabled: selectedIds.length === 0,
    },
    {
      label: "Copy",
      action: () => copyShape(),
      shortcut: "Ctrl+C",
      disabled: selectedIds.length === 0,
    },
    {
      label: "Paste",
      action: () => pasteShape(),
      shortcut: "Ctrl+V",
      disabled: !clipboard,
    },
    {
      label: "Duplicate",
      action: () => {
        duplicateSelectedShapes();
      },
      shortcut: "Ctrl+D",
      disabled: selectedIds.length === 0,
    },
    {
      label: "Select All",
      action: () => selectAllShapes(),
      shortcut: "Ctrl+A",
      disabled: shapes.length === 0,
    },
    {
      label: "Delete",
      action: () => deleteSelectedShapes(),
      shortcut: "Del",
      disabled: selectedIds.length === 0,
    },
  ];

  // HELP/DOCUMENTATION MENU ITEMS
  const helpMenuItems = [
    {
      label: "Introduction of GSN",
      action: () => openDocumentationModal('introduction'),
      shortcut: "",
    },
    {
      label: "Getting Started",
      action: () => openDocumentationModal('getting-started'),
      shortcut: "",
    },
    {
      label: "GSN Elements",
      action: () => openDocumentationModal('gsn-elements'),
      shortcut: "",
    },
    {
      label: "Best Practices",
      action: () => openDocumentationModal('best-practices'),
      shortcut: "",
    },
    {
      label: "Tips & Tricks",
      action: () => openDocumentationModal('tips-tricks'),
      shortcut: "",
    },
  ];

  const handleMenuClick = (menuId: string) => {
    setActiveMenu(activeMenu === menuId ? null : menuId);
  };

  const closeMenu = () => {
    setActiveMenu(null);
  };

  const handleSignOut = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <>
      <div
        className="flex items-center justify-between bg-white border-b border-gray-200 h-12 px-3"
        data-preserve-selection="true"
      >
        <div className="flex items-center">
          <div
            className="flex items-center cursor-pointer"
            onClick={toggleSidebar}
          >
            <img src={Logo} alt="Editor Logo" className="h-8 w-auto" />
          </div>

          <div className="flex ml-6 space-x-1">
            {/* PROJECT Menu */}
            <div className="relative">
              <button
                className={`px-3 py-1.5 text-sm font-medium ${
                  activeMenu === "project" ? "bg-gray-100" : "hover:bg-gray-50"
                } rounded-md`}
                onClick={() => handleMenuClick("project")}
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
                className={`px-3 py-1.5 text-sm font-medium ${
                  activeMenu === "edit" ? "bg-gray-100" : "hover:bg-gray-50"
                } rounded-md`}
                onClick={() => handleMenuClick("edit")}
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

            {/* HELP/DOCUMENTATION Menu */}
            <div className="relative">
              <button
                className={`px-3 py-1.5 text-sm font-medium ${
                  activeMenu === "help" ? "bg-gray-100" : "hover:bg-gray-50"
                } rounded-md`}
                onClick={() => handleMenuClick("help")}
              >
                <div className="flex items-center">
                  <HelpCircle size={16} className="mr-1.5" />
                  Notation Guide
                </div>
              </button>
              {activeMenu === "help" && (
                <MenuDropdown items={helpMenuItems} onClose={closeMenu} />
              )}
            </div>

            {/* GUIDANCE Button */}
            <div className="relative">
              <button
                className="px-3 py-1.5 text-sm font-medium hover:bg-gray-50 rounded-md"
                onClick={handleGuidanceClick}
              >
                <div className="flex items-center">
                  <Lightbulb size={16} className="mr-1.5" />
                  App Guide
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* User Authentication Section */}
        <div className="flex items-center">
          {loading ? (
            <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />
          ) : user ? (
            <div className="flex items-center gap-2 group relative">
              <div className="flex items-center gap-2 cursor-pointer">
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt="User Profile"
                    width={32}
                    height={32}
                    className="rounded-full"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-8 h-8 flex items-center justify-center bg-blue-500 text-white rounded-full">
                    {user.displayName?.charAt(0).toUpperCase() || "U"}
                  </div>
                )}
                <span className="text-sm font-medium hidden md:inline-block">
                  {user.displayName || "User"}
                </span>
              </div>

              {/* User Dropdown Menu */}
              <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-md shadow-lg py-1 z-10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                <div className="px-4 py-2 text-sm text-gray-500 border-b border-gray-100">
                  {user.email}
                </div>
                <button
                  onClick={() => console.log("Profile Settings")}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Profile Settings
                </button>
                <button
                  onClick={() => console.log("Account Preferences")}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Preferences
                </button>
                <div className="border-t border-gray-100 mt-1 pt-1">
                  <button
                    onClick={handleSignOut}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <button
              onClick={signInWithGoogle}
              className="flex items-center gap-2 bg-white border border-gray-300 rounded-full px-3 py-1 text-sm hover:bg-gray-50 transition-colors"
            >
              <FcGoogle size={18} />
              <span>Sign In</span>
            </button>
          )}
        </div>
      </div>

      {/* DOCUMENTATION MODAL */}
      <GuidanceModal 
        isOpen={showDocumentationModal} 
        onClose={() => setShowDocumentationModal(false)}
        initialSection={documentationSection}
      />

      {/* GUIDANCE DIALOG */}
      <GuidanceDialog
        isOpen={isGuidanceDialogOpen}
        onClose={() => setIsGuidanceDialogOpen(false)}
      />
    </>
  );
};

export default TopBar;