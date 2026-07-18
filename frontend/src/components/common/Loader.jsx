import React from 'react';

<<<<<<< HEAD
const Loader = ({ size = 'md', fullScreen = false }) => {
  const sizes = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-4',
    lg: 'w-12 h-12 border-4',
  };

  const loader = (
    <div className={`${sizes[size]} border-gray-200 border-t-primary-600 rounded-full animate-spin`}></div>
=======
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
>>>>>>> 904df03ac2580fd1be6930e493fe28083c48ac6c
  );

  if (fullScreen) {
    return (
<<<<<<< HEAD
      <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-80 z-50">
=======
      <div className="fixed inset-0 bg-white bg-opacity-90 flex items-center justify-center z-50">
>>>>>>> 904df03ac2580fd1be6930e493fe28083c48ac6c
        {loader}
      </div>
    );
  }

<<<<<<< HEAD
  return (
    <div className="flex items-center justify-center p-4">
      {loader}
    </div>
  );
};

export default Loader;
=======
  return loader;
};

export default Loader;
>>>>>>> 904df03ac2580fd1be6930e493fe28083c48ac6c
