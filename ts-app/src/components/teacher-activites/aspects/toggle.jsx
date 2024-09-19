import React, { useState } from 'react';

const ToggleSwitch = () => {
  const [isChecked, setIsChecked] = useState(false);

  const handleToggle = () => {
    setIsChecked(!isChecked);
  };

  return (
    <label className="inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        checked={isChecked}
        onChange={handleToggle}
        className="sr-only peer"
      />
      {/* Switch background */}
      <div
        className={`relative w-11 h-6 rounded-full transition-colors 
          ${isChecked ? 'bg-blue-600' : 'bg-slate-300'}`}
      >
        {/* Toggle button */}
        <div
          className={`absolute top-[2px] left-[2px] h-5 w-5 bg-white border border-gray-300 rounded-full transition-transform 
            ${isChecked ? 'translate-x-full' : ''}`}
        ></div>
      </div>
    </label>
  );
};

export default ToggleSwitch;
