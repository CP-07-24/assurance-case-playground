"use client"; // Wajib karena menggunakan hooks dan interaktivitas
import React, { useState, useEffect } from 'react';
import { Menu, Type, FolderKanban, Edit, HelpCircle, Lightbulb } from 'lucide-react';
import { useDiagramContext } from '../../context/DiagramContext';
import MenuDropdown from '../ui/MenuDropdown';
import { FcGoogle } from 'react-icons/fc';
import { signInWithGoogle, firebaseSignOut, auth } from '../../lib/firebase/auth';
import { User } from 'firebase/auth';

const TopBar: React.FC = () => {
  const { toggleSidebar } = useDiagramContext();
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Pantau perubahan status autentikasi
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const projectMenuItems = [
    { label: 'New Project', onClick: () => console.log('New Project'), shortcut: '' },
    { label: 'Import', onClick: () => console.log('Import'), shortcut: '' },
    { label: 'Export', onClick: () => console.log('Export'), shortcut: '' }
  ];

  const editMenuItems = [
    { label: 'Undo', onClick: () => console.log('Undo'), shortcut: 'Ctrl+Z' },
    { label: 'Redo', onClick: () => console.log('Redo'), shortcut: 'Ctrl+Y' },
    { label: 'Cut', onClick: () => console.log('Cut'), shortcut: 'Ctrl+X' },
    { label: 'Copy', onClick: () => console.log('Copy'), shortcut: 'Ctrl+C' },
    { label: 'Paste', onClick: () => console.log('Paste'), shortcut: 'Ctrl+V' },
    { label: 'Duplicate', onClick: () => console.log('Duplicate'), shortcut: 'Ctrl+D' },
    { label: 'Select All', onClick: () => console.log('Select All'), shortcut: 'Ctrl+A' }
  ];

  const helpMenuItems = [
    { label: 'Report Bug', onClick: () => console.log('Report Bug'), shortcut: '' },
    { label: 'Contact Support', onClick: () => console.log('Contact Support'), shortcut: '' }
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
    <div className="flex items-center justify-between bg-white border-b border-gray-200 h-12 px-3">
      <div className="flex items-center">
        <button
          className="p-1.5 rounded-md text-gray-500 hover:bg-gray-100"
          onClick={toggleSidebar}
        >
          <Menu size={20} />
        </button>

        <div className="flex ml-2">
          <div className="relative">
            <button
              className={`px-3 py-1.5 text-sm font-medium ${activeMenu === 'typography' ? 'bg-gray-100' : 'hover:bg-gray-50'} rounded-md`}
              onClick={() => handleMenuClick('typography')}
            >
              <div className="flex items-center">
                <Type size={16} className="mr-1.5" />
                Typography
              </div>
            </button>
            {activeMenu === 'typography' && (
              <MenuDropdown items={[]} onClose={closeMenu} />
            )}
          </div>

          <div className="relative">
            <button
              className={`px-3 py-1.5 text-sm font-medium ${activeMenu === 'project' ? 'bg-gray-100' : 'hover:bg-gray-50'} rounded-md`}
              onClick={() => handleMenuClick('project')}
            >
              <div className="flex items-center">
                <FolderKanban size={16} className="mr-1.5" />
                PROJECT
              </div>
            </button>
            {activeMenu === 'project' && (
              <MenuDropdown items={projectMenuItems} onClose={closeMenu} />
            )}
          </div>

          <div className="relative">
            <button
              className={`px-3 py-1.5 text-sm font-medium ${activeMenu === 'edit' ? 'bg-gray-100' : 'hover:bg-gray-50'} rounded-md`}
              onClick={() => handleMenuClick('edit')}
            >
              <div className="flex items-center">
                <Edit size={16} className="mr-1.5" />
                EDIT
              </div>
            </button>
            {activeMenu === 'edit' && (
              <MenuDropdown items={editMenuItems} onClose={closeMenu} />
            )}
          </div>

          <div className="relative">
            <button
              className={`px-3 py-1.5 text-sm font-medium ${activeMenu === 'help' ? 'bg-gray-100' : 'hover:bg-gray-50'} rounded-md`}
              onClick={() => handleMenuClick('help')}
            >
              <div className="flex items-center">
                <HelpCircle size={16} className="mr-1.5" />
                HELP
              </div>
            </button>
            {activeMenu === 'help' && (
              <MenuDropdown items={helpMenuItems} onClose={closeMenu} />
            )}
          </div>

          <div className="relative">
            <button
              className={`px-3 py-1.5 text-sm font-medium ${activeMenu === 'guidance' ? 'bg-gray-100' : 'hover:bg-gray-50'} rounded-md`}
              onClick={() => handleMenuClick('guidance')}
            >
              <div className="flex items-center">
                <Lightbulb size={16} className="mr-1.5" />
                GUIDANCE
              </div>
            </button>
            {activeMenu === 'guidance' && (
              <MenuDropdown items={[]} onClose={closeMenu} />
            )}
          </div>
        </div>
      </div>

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
                  referrerPolicy="no-referrer" // Penting untuk foto profil Google
                />
              ) : (
                <div className="w-8 h-8 flex items-center justify-center bg-blue-500 text-white rounded-full">
                  {user.displayName?.charAt(0).toUpperCase() || 'U'}
                </div>
              )}
              <span className="text-sm font-medium hidden md:inline-block">
                {user.displayName || 'User'}
              </span>
            </div>

            <div className="absolute right-0 top-full mt-1 w-40 bg-white rounded-md shadow-lg py-1 z-10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
              <button
                onClick={handleSignOut}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Sign Out
              </button>
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
  );
};

export default TopBar;