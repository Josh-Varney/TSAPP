import React from 'react';
import { PiBellRingingFill } from 'react-icons/pi'; 
import ToggleSwitch from './toggle';

const GetNotifiedCard = ({ onToggle, isVisible }) => {
    // Only render if isVisible is true
    if (!isVisible) return null;

    return (
        <div className="flex flex-col w-full p-4 bg-white shadow-lg rounded-lg mx-auto">
            <div className="flex items-center space-x-3">
                <PiBellRingingFill className="text-xl text-blue-500" />
                <h1 className="text-md font-semibold">Priority Alerts</h1>
            </div>
            <div className="flex items-center justify-between mt-2">
                <p className="text-sm text-gray-700">
                    Configure your alert in one click with your predefined filters
                </p>
                <ToggleSwitch onToggle={onToggle} />
            </div>
            <div className="mt-4">
                <a href="#" className="text-blue-500 font-semibold text-md">Manage Alerts</a>
            </div>
        </div>
    );
};

export default GetNotifiedCard;
