import React, { useState } from 'react';

const Tooltip = ({ children, text, position = 'top' }) => {
  const [isVisible, setIsVisible] = useState(false);

  const positions = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  return (
    <div 
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && text && (
        <div className={`absolute ${positions[position]} z-50 px-3 py-1 text-xs font-medium text-white bg-gray-900 rounded-lg shadow-lg whitespace-nowrap`}>
          {text}
        </div>
      )}
    </div>
  );
};

export default Tooltip;
