import React from 'react';

const Avatar = ({ src, alt, size = 'md', className = '' }) => {
  const sizes = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-lg',
  };

  if (src) {
    return (
      <img 
        src={src} 
        alt={alt} 
        className={`${sizes[size]} rounded-full object-cover border-2 border-white shadow-sm ${className}`} 
      />
    );
  }

  // Fallback with initials
  const initials = alt ? alt.charAt(0).toUpperCase() : '?';
  return (
    <div className={`${sizes[size]} rounded-full bg-primary-500 text-white flex items-center justify-center font-bold border-2 border-white shadow-sm ${className}`}>
      {initials}
    </div>
  );
};

export default Avatar;