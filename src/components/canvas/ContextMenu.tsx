import React, { Component } from "react";

interface ContextMenuProps {
  visible: boolean;
  x: number;
  y: number;
  onClose: () => void;
  menuItems: {
    label: string;
    icon?: React.ReactNode;
    onClick: () => void;
    disabled?: boolean;
    divider?: boolean;
  }[];
}

interface ContextMenuState {
  adjustedX: number;
  adjustedY: number;
}

// Inject CSS style jika belum ada
if (
  typeof document !== "undefined" &&
  !document.getElementById("context-menu-animation")
) {
  const styleElement = document.createElement("style");
  styleElement.id = "context-menu-animation";
  styleElement.textContent = `
    @keyframes scale-in {
      from {
        opacity: 0;
        transform: scale(0.95);
      }
      to {
        opacity: 1;
        transform: scale(1);
      }
    }
  `;
  document.head.appendChild(styleElement);
}

class ContextMenu extends Component<ContextMenuProps, ContextMenuState> {
  constructor(props: ContextMenuProps) {
    super(props);
    this.state = {
      adjustedX: props.x,
      adjustedY: props.y,
    };
  }

  componentDidMount() {
    this.adjustPosition();
    this.addEventListeners();
  }

  componentDidUpdate(prevProps: ContextMenuProps) {
    if (
      prevProps.x !== this.props.x ||
      prevProps.y !== this.props.y ||
      prevProps.visible !== this.props.visible ||
      prevProps.menuItems !== this.props.menuItems
    ) {
      this.adjustPosition();
    }

    if (!prevProps.visible && this.props.visible) {
      this.addEventListeners();
    } else if (prevProps.visible && !this.props.visible) {
      this.removeEventListeners();
    }
  }

  componentWillUnmount() {
    this.removeEventListeners();
  }

  handleClickOutside = (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    if (!target.closest(".context-menu")) {
      this.props.onClose();
    }
  };

  handleEscape = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      this.props.onClose();
    }
  };

  addEventListeners() {
    document.addEventListener("click", this.handleClickOutside);
    document.addEventListener("keydown", this.handleEscape);
  }

  removeEventListeners() {
    document.removeEventListener("click", this.handleClickOutside);
    document.removeEventListener("keydown", this.handleEscape);
  }

  adjustPosition() {
    const { x, y, menuItems } = this.props;

    const menuWidth = 200;
    const menuHeight = menuItems.reduce((height, item) => {
      return height + (item.divider ? 9 : 36);
    }, 0);

    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    let adjustedX = x;
    if (x + menuWidth > windowWidth) {
      adjustedX = windowWidth - menuWidth - 10;
    }

    let adjustedY = y;
    if (y + menuHeight > windowHeight) {
      adjustedY = windowHeight - menuHeight - 10;
    }

    this.setState({ adjustedX, adjustedY });
  }

  render() {
    const { visible, menuItems, onClose } = this.props;
    const { adjustedX, adjustedY } = this.state;

    if (!visible) return null;

    return (
      <div
        className="context-menu fixed bg-white rounded-lg shadow-xl z-50 overflow-hidden border border-gray-200 min-w-[200px]"
        style={{
          top: `${adjustedY}px`,
          left: `${adjustedX}px`,
          animation: "scale-in 0.1s ease-out",
        }}
      >
        <div className="py-1">
          {menuItems.map((item, index) => (
            <React.Fragment key={index}>
              {item.divider ? (
                <div className="h-px bg-gray-200 my-1 mx-2"></div>
              ) : (
                <div
                  onClick={() => {
                    if (!item.disabled) {
                      item.onClick();
                      onClose();
                    }
                  }}
                  className={`px-4 py-2 flex items-center gap-3 text-sm ${
                    item.disabled
                      ? "opacity-50 cursor-default text-gray-500"
                      : "hover:bg-blue-50 cursor-pointer text-gray-700 hover:text-blue-600"
                  } transition-colors duration-150`}
                >
                  {item.icon && (
                    <span className="context-menu-icon w-5 flex justify-center text-gray-500">
                      {item.icon}
                    </span>
                  )}
                  <span className="font-medium">{item.label}</span>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    );
  }
}

export default ContextMenu;
