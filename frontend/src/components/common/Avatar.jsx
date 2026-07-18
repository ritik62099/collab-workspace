import React from 'react';

<<<<<<< HEAD
const Avatar = ({ src, alt, size = 'md', className = '' }) => {
  const sizes = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-lg',
=======
const Avatar = ({ 
  src, 
  alt = 'User', 
  size = 'md', 
  className = '' 
}) => {
  const sizes = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-12 w-12 text-base',
    xl: 'h-16 w-16 text-lg',
  };

  const getInitials = (name) => {
    if (!name) return '?';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
>>>>>>> 904df03ac2580fd1be6930e493fe28083c48ac6c
  };

  if (src) {
    return (
<<<<<<< HEAD
      <img 
        src={src} 
        alt={alt} 
        className={`${sizes[size]} rounded-full object-cover border-2 border-white shadow-sm ${className}`} 
=======
      <img
        src={src}
        alt={alt}
        className={`${sizes[size]} rounded-full object-cover ${className}`}
>>>>>>> 904df03ac2580fd1be6930e493fe28083c48ac6c
      />
    );
  }

<<<<<<< HEAD
  // Fallback with initials
  const initials = alt ? alt.charAt(0).toUpperCase() : '?';
  return (
    <div className={`${sizes[size]} rounded-full bg-primary-500 text-white flex items-center justify-center font-bold border-2 border-white shadow-sm ${className}`}>
      {initials}
=======
  return (
    <div className={`${sizes[size]} rounded-full bg-gradient-to-br from-orange-500 to-green-600 flex items-center justify-center text-white font-semibold ${className}`}>
      {getInitials(alt)}
>>>>>>> 904df03ac2580fd1be6930e493fe28083c48ac6c
    </div>
  );
};

<<<<<<< HEAD
export default Avatar;
=======
export default Avatar;
>>>>>>> 904df03ac2580fd1be6930e493fe28083c48ac6c
