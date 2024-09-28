import React, { useState } from 'react';
import { MdOutlineKeyboardArrowUp, MdOutlineKeyboardArrowDown } from 'react-icons/md';
import PrivateLessonCarousel from './private-lesson-carousel';
const DropdownList = ({ items }) => {
  // State to track which item is expanded
  const [expandedIndex, setExpandedIndex] = useState(null);

  // Function to toggle the expanded state
  const toggleExpand = (index) => {
    if (expandedIndex === index) {
      setExpandedIndex(null); // Collapse if already expanded
    } else {
      setExpandedIndex(index); // Expand clicked item
    }
  };

  // If there are no teachers, display a message
  if (items.length === 0) {
    return <p className='mt-4 mb-0 text-gray-600 text-sm text-center'>Please Select a time</p>;
  }

  return (
    <div>
      {items.map((item, index) => (
        <div key={index}>
          {/* List item */}
          <ul className='mt-3 p-2'>
            <div className='flex flex-row justify-between items-center'>
              <div className='flex flex-col'>
                <p className='text-sm font-semibold'>{item.name}</p>
                <p className='text-gray-600 text-xs'>{item.subtitle}</p>
              </div>
              <div onClick={() => toggleExpand(index)} className="cursor-pointer">
                {expandedIndex === index ? <MdOutlineKeyboardArrowUp /> : <MdOutlineKeyboardArrowDown />}
              </div>
            </div>
          </ul>

          {/* Expanded content */}
          {expandedIndex === index && (
            <div className="bg-gray-100">
              <PrivateLessonCarousel />
            </div>
          )}

          {/* Separator */}
          <div className="border-t w-full h-4"></div>
        </div>
      ))}
    </div>
  );
};

export default DropdownList;
