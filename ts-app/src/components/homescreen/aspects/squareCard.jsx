import React from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

// Card component
const Card = ({ backgroundImage, headerImage, textArea, spanText, subImage }) => {
  return (
    <div className="p-20 w-1/3 rounded overflow-hidden justify-items-center shadow-lg">
      <img className="w-full" src={backgroundImage} alt="Background" />
      {headerImage && <img className="w-full mt-4" src={headerImage} alt="Header" />}
      <div className="flex items-center justify-center w-16 h-16 bg-gray-200 border border-gray-300 rounded mt-4">
        <MagnifyingGlassIcon className="w-8 h-8 text-gray-700" />
      </div>
      <div className="px-6 py-4">
        <div className="font-bold text-xl mb-2">Header Text</div>
        <p className="text-gray-700 text-base">
          {textArea}
        </p>
      </div>
      <div className="px-6 pt-4 pb-2">
        {spanText && (
          <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
            {spanText}
          </span>
        )}
        {subImage && <img className="w-full mt-4" src={subImage} alt="Sub" />}
      </div>
    </div>
  );
}

export default Card;
