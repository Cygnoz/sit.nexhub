import React, { useState, useRef, useEffect, ReactNode } from "react";
import ReactDOM from "react-dom";

interface MenuItem {
  label: string;
  icon?: ReactNode;
  onClick: () => void;
}

interface MenuDropdownProps {
  menuItems: MenuItem[];
  backgroundColor?: string;
  trigger: ReactNode;
  position?: 'left' | 'right' | 'center';
  underline?: boolean;
  underlineColor?: string;
  labelColor?: string;  // New prop for label color
}

const MenuDropdown: React.FC<MenuDropdownProps> = ({
  menuItems,
  backgroundColor = "bg-white",
  trigger,
  position = 'right',
  underline = false,
  underlineColor = "text-white",
  labelColor = "#4B5C79"  // Default label color
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => {
    setIsOpen(prev => !prev);
  };

  const closeDropdown = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        closeDropdown();
      }
    };

    const handleEscapePress = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeDropdown();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscapePress);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapePress);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapePress);
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && triggerRef.current && dropdownRef.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const dropdownRect = dropdownRef.current.getBoundingClientRect();
      let leftPosition = triggerRect.left;
      let topPosition = triggerRect.bottom + window.scrollY + 8;

      switch (position) {
        case 'left':
          leftPosition = triggerRect.left + window.scrollX;
          break;
        case 'center':
          leftPosition =
            triggerRect.left +
            window.scrollX +
            triggerRect.width / 2 -
            dropdownRect.width / 2;
          break;
        case 'right':
        default:
          leftPosition =
            triggerRect.left +
            window.scrollX +
            triggerRect.width -
            dropdownRect.width;
          break;
      }

      setDropdownPosition({
        top: topPosition,
        left: leftPosition,
      });
    }
  }, [isOpen, position]);

  return (
    <>
      <div
        ref={triggerRef}
        onClick={toggleDropdown}
        className="cursor-pointer inline-block"
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && toggleDropdown()}
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        {trigger}
      </div>
      {isOpen &&
        ReactDOM.createPortal(
          <div
            ref={dropdownRef}
            style={{
              top: dropdownPosition.top,
              left: dropdownPosition.left,
            }}
            className={`absolute mt-2 rounded-md shadow-lg ${backgroundColor} z-50`}
            role="menu"
          >
            <div className="py-1">
              {menuItems.map((item, index) => (
                <button
                  key={index}
                  onClick={() => {
                    item.onClick();
                    closeDropdown();
                  }}
                  className={`flex items-center w-full text-left px-4 py-2 text-sm ${
                    underline && index !== menuItems.length - 1
                      ? 'relative after:content-[""] after:block after:w-[90%] after:border-b after:absolute after:bottom-0 after:left-[5%]'
                      : ''
                  } focus:outline-none`}
                  style={{
                    borderRadius:
                      index === 0
                        ? '8px 8px 0 0'
                        : index === menuItems.length - 1
                        ? '0 0 8px 8px'
                        : '0',
                    borderBottomColor: underlineColor,
                  }}
                  role="menuitem"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && item.onClick()}
                >
                  {item.icon && <span className="mr-2">{item.icon}</span>}
                  <span style={{ color: labelColor }}>{item.label}</span> {/* Apply label color */}
                </button>
              ))}
            </div>
          </div>,
          document.body
        )}
    </>
  );
};

export default MenuDropdown;
