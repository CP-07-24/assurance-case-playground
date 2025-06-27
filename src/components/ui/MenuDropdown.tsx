import React, { useEffect, useRef } from "react";

interface MenuItem {
  label: string;
  action: () => void;
  shortcut: string;
  disabled?: boolean;
  separator?: boolean;
}

interface MenuDropdownProps {
  items: MenuItem[];
  onClose: () => void;
}

const MenuDropdown: React.FC<MenuDropdownProps> = ({ items, onClose }) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [onClose]);

  return (
    <div
      ref={menuRef}
      className="absolute top-full left-0 mt-1 z-50 bg-white border border-gray-200 rounded-md shadow-lg py-1 min-w-52"
      data-preserve-selection="true"
    >
      {items.length === 0 ? (
        <div className="px-4 py-2 text-sm text-gray-500">
          No items available
        </div>
      ) : (
        items.map((item, index) => (
          <React.Fragment key={index}>
            {item.separator && (
              <div className="border-t border-gray-100 my-1" />
            )}
            <button
              className={`flex justify-between items-center w-full px-4 py-2 text-left text-sm ${
                item.disabled
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-700 hover:bg-gray-100'
              } transition-colors duration-150`}
              onClick={() => {
                if (!item.disabled) {
                  item.action();
                  onClose();
                }
              }}
              disabled={item.disabled}
            >
              <span>{item.label}</span>
              {item.shortcut && (
                <span className={`ml-4 text-xs ${
                  item.disabled ? 'text-gray-300' : 'text-gray-500'
                }`}>
                  {item.shortcut}
                </span>
              )}
            </button>
          </React.Fragment>
        ))
      )}
    </div>
  );
};

export default MenuDropdown;