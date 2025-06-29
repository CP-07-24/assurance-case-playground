"use client";

import React, { useState, useEffect } from "react";
import { Edit, HelpCircle, Lightbulb, FolderKanban } from "lucide-react";
import { useDiagramContext } from "../../store/DiagramContext";
import MenuDropdown from "../ui/MenuDropdown";
import GuidanceDialog from "../dialogs/GuidanceDialog";
import DocumentationModal from "../documentation/DocumentationModal"; // ← TAMBAHAN BARU
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

  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isGuidanceDialogOpen, setIsGuidanceDialogOpen] = useState(false);
  const [isDocumentationModalOpen, setIsDocumentationModalOpen] = useState(false); // ← TAMBAHAN BARU

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
    // Mendapatkan URL saat ini
    const currentUrl = window.location.href;
    // Mendapatkan URL dasar (tanpa parameter query jika ada)
    const baseUrl = currentUrl.split("?")[0].split("#")[0];
    // Membuka tab baru dengan URL yang sama
    window.open(baseUrl, "_blank");
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
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

  // ✅ SESUAI INTERFACE EXISTING: Tetap gunakan onClick bukan action
  const projectMenuItems = [
    {
      label: "New Project",
      onClick: openNewProject,
      shortcut: "",
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

  const handleMenuClick = (menuId: string) => {
    setActiveMenu(activeMenu === menuId ? null : menuId);
  };

  const closeMenu = () => {
    setActiveMenu(null);
  };

  // Function untuk handle guidance click
  const handleGuidanceClick = () => {
    closeMenu(); // Tutup dropdown yang terbuka
    setIsGuidanceDialogOpen(true);
  };

  // ← TAMBAHAN BARU: Function untuk handle documentation click
  const handleDocumentationClick = () => {
    closeMenu(); // Tutup dropdown yang terbuka
    setIsDocumentationModalOpen(true);
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

            {/* DOCUMENTATION Button - ← DIMODIFIKASI */}
            <div className="relative">
              <button
                className="px-3 py-1.5 text-sm font-medium hover:bg-gray-50 rounded-md"
                onClick={handleDocumentationClick} // ← GANTI dari handleMenuClick ke handleDocumentationClick
              >
                <div className="flex items-center">
                  <HelpCircle size={16} className="mr-1.5" />
                  NOTATION GUIDE
                </div>
              </button>
              {/* ← HAPUS MenuDropdown untuk documentation */}
            </div>

            {/* GUIDANCE Button */}
            <div className="relative">
              <button
                className="px-3 py-1.5 text-sm font-medium hover:bg-gray-50 rounded-md"
                onClick={handleGuidanceClick}
              >
                <div className="flex items-center">
                  <Lightbulb size={16} className="mr-1.5" />
                  APP GUIDE
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
                    alt="Profile"
                    className="w-8 h-8 rounded-full"
                  />
                ) : (
                  <div className="w-8 h-8 flex items-center justify-center bg-blue-500 text-white rounded-full text-sm">
                    {user.displayName?.charAt(0).toUpperCase() || "U"}
                  </div>
                )}
                <span className="text-sm font-medium hidden md:inline">
                  {user.displayName || "User"}
                </span>
              </div>
              <button
                onClick={handleSignOut}
                className="ml-2 text-xs text-gray-500 hover:text-gray-700"
              >
                Logout
              </button>
            </div>
          ) : (
            <button
              onClick={() => signInWithGoogle()}
              className="flex items-center gap-1 bg-white border border-gray-300 rounded-full px-3 py-1 text-sm hover:bg-gray-50"
            >
              <FcGoogle className="text-lg" />
              <span>Login</span>
            </button>
          )}
        </div>
      </div>

      {/* Guidance Dialog */}
      <GuidanceDialog
        isOpen={isGuidanceDialogOpen}
        onClose={() => setIsGuidanceDialogOpen(false)}
      />

      {/* ← TAMBAHAN BARU: Documentation Modal */}
      <DocumentationModal
        isOpen={isDocumentationModalOpen}
        onClose={() => setIsDocumentationModalOpen(false)}
      />
    </>
  );
};

export default TopBar;