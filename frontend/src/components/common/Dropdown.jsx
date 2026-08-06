import React, { useState, useRef, useEffect } from 'react';

const Dropdown = ({ trigger, children, align = 'right' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const dropdownRef = useRef(null);
  const itemsRef = useRef([]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setFocusedIndex(-1);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleKeyDown = (e) => {
    if (!isOpen) return;

    const itemCount = React.Children.count(children);

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setFocusedIndex((prev) => (prev + 1) % itemCount);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setFocusedIndex((prev) => (prev - 1 + itemCount) % itemCount);
        break;
      case 'Enter':
        e.preventDefault();
        if (focusedIndex >= 0 && itemsRef.current[focusedIndex]) {
          itemsRef.current[focusedIndex].click();
        }
        break;
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        setFocusedIndex(-1);
        break;
    }
  };

  useEffect(() => {
    if (isOpen && focusedIndex >= 0 && itemsRef.current[focusedIndex]) {
      itemsRef.current[focusedIndex].focus();
    }
  }, [focusedIndex, isOpen]);

  const alignmentClasses = {
    left: 'left-0',
    right: 'right-0',
    center: 'left-1/2 -translate-x-1/2',
  };

  return (
    <div className="relative inline-block" ref={dropdownRef} onKeyDown={handleKeyDown}>
      <div onClick={() => setIsOpen(!isOpen)} role="button" aria-expanded={isOpen} aria-haspopup="true">
        {trigger}
      </div>

      {isOpen && (
        <div 
          className={`absolute ${alignmentClasses[align]} mt-2 w-48 rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 z-50`}
          role="menu"
          aria-orientation="vertical"
        >
          <div className="py-1" onClick={() => { setIsOpen(false); setFocusedIndex(-1); }}>
            {React.Children.map(children, (child, index) => 
              React.cloneElement(child, {
                ref: (el) => (itemsRef.current[index] = el),
                isFocused: index === focusedIndex,
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export const DropdownItem = React.forwardRef(({ onClick, children, icon: Icon, danger = false, isFocused }, ref) => {
  return (
    <button
      ref={ref}
      onClick={onClick}
      role="menuitem"
      className={`w-full text-left px-4 py-2 text-sm flex items-center space-x-2 transition-colors focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500 ${
        danger 
          ? 'text-red-600 hover:bg-red-50' 
          : 'text-gray-700 hover:bg-gray-100'
      } ${isFocused ? 'bg-gray-100' : ''}`}
    >
      {Icon && <Icon className="h-4 w-4" />}
      <span>{children}</span>
    </button>
  );
});

DropdownItem.displayName = 'DropdownItem';

export default Dropdown;
