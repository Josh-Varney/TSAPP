import React from 'react';

const Card = ({ backgroundImage, headerText, textArea, spanText, icon: Icon, link }) => {
  return (
    <a href={link} target="_blank" rel="noopener noreferrer" className="p-20 w-1/3 rounded overflow-hidden justify-items-center shadow-lg hover:shadow-2xl">
      <div className="relative w-full">
        <img className="w-full h-auto" src={backgroundImage} alt="Background" />
        <div className="absolute bottom-4 left-0 flex items-center justify-center w-20 h-20 bg-gray-200 border border-gray-300 rounded ml-10">
          {Icon && <Icon className="w-10 h-10"/>}
        </div>
      </div>
      <div className="px-6 py-4">
        <div className="font-bold text-xl mb-2">{headerText}</div>
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
      </div>
    </a>
  );
}

export default Card;
