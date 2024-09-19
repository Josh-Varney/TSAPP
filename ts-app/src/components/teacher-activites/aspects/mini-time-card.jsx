import React from 'react';

const MiniCard = ({ id, isSelected, onCardClick }) => {
  return (
    <div 
      className={`flex items-center justify-center rounded-lg transition-all duration-300 ease-in-out ${isSelected ? 'bg-gray-800' : 'bg-gray-200'}`}
      onClick={() => onCardClick(id)}
    >
      <div 
        className={`shadow-lg p-3 flex flex-col items-center justify-between rounded-xl transition-all duration-300 ease-in-out ${isSelected ? 'bg-gray-700 text-white' : 'bg-white text-gray-600'}`}
      >
        <p className="text-center text-sm font-semibold">
          12:00
        </p>
      </div>
    </div>
  );
};

export default MiniCard;
