import React, { useState, useRef, useEffect, ReactNode } from "react";
import ReactDOM from "react-dom";

interface MenuItem {
  label: string;
  icon?: ReactNode;
  onClick: (params: any) => void;
}

interface TriggerParam {
  label: string;
  parameters: { [key: string]: any };
}

interface MenuDropdownProps {
  menuItems: MenuItem[];
  backgroundColor?: string;
  trigger: ReactNode;
  position?: 'left' | 'right' | 'center';
  triggerParam?: TriggerParam[];
  hoverColor?: string;
}

const MenuDropdown: React.FC<MenuDropdownProps> = ({
  menuItems,
  backgroundColor = "bg-white",
  trigger,
  position = 'right',
  triggerParam,
  hoverColor = 'bg-gray-100',
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

  const getParametersForLabel = (label: string): any => {
    const matchingParam = triggerParam?.find(param => param.label === label);
    return matchingParam ? matchingParam.parameters : {};
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
      let topPosition = triggerRect.bottom + window.scrollY + 8; // 8px offset for spacing

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
      <div ref={triggerRef} onClick={toggleDropdown} className="cursor-pointer inline-block">
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
          >
            <div className="py-1">
              {menuItems.map((item, index) => {
                const params = getParametersForLabel(item.label);
                return (
                  <button
                    key={index}
                    onClick={() => {
                      item.onClick(params);
                      closeDropdown();
                    }}
                    className={`flex items-center w-full text-left px-4 py-2 text-sm rounded hover:${hoverColor} focus:outline-none`}
                  >
                    {item.icon && <span className="mr-2">{item.icon}</span>}
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>,
          document.body
        )}
    </>
  );
};

export default MenuDropdown;
