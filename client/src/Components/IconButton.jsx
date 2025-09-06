import React from 'react';

const IconButton = ({ icon, label, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="
        flex flex-col items-center justify-center
        px-2 py-1 lg:px-2 lg:py-2
        hover:bg-blue-600 rounded-lg transition
      "
    >
      {/* Icon size changes for mobile */}
      <span className="text-lg lg:text-3xl text-white">{icon}</span>
      {/* Hide labels on mobile */}
      <span className="hidden lg:inline text-sm text-white mt-1">{label}</span>
    </button>
  );
};

export default IconButton;
