import React, { useEffect, useRef } from "react";

interface MenuItem {
  label: string;
  onClick: () => void;
  shortcut: string;
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

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
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
          <button
            key={index}
            className="flex justify-between items-center w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
            onClick={() => {
              item.onClick();
              onClose();
            }}
          >
            <span>{item.label}</span>
            {item.shortcut && (
              <span className="ml-4 text-xs text-gray-500">
                {item.shortcut}
              </span>
            )}
          </button>
        ))
      )}
    </div>
  );
};

export default MenuDropdown;
