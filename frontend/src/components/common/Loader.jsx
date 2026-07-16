import React from 'react';

const Loader = ({ size = 'md', fullScreen = false, message = '' }) => {
  const sizes = {
    sm: 'h-6 w-6',
    md: 'h-12 w-12',
    lg: 'h-16 w-16',
  };

  const loader = (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="relative">
        <div className={`${sizes[size]} border-4 border-orange-200 rounded-full`}></div>
        <div className={`${sizes[size]} border-4 border-orange-600 border-t-transparent rounded-full animate-spin absolute top-0 left-0`}></div>
      </div>
      {message && <p className="text-gray-600 text-sm font-medium">{message}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-90 flex items-center justify-center z-50">
        {loader}
      </div>
    );
  }

  return loader;
};

export default Loader;
