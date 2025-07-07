import React from 'react';

const Loading = () => {
  return (
    <div className="h-screen w-screen flex justify-center items-center  z-50 ">
      <div className="animate-spin rounded-full h-16 w-16 border-4 border-t-gray-800 border-gray-200"></div>
    </div>
  );
};

export default Loading;
