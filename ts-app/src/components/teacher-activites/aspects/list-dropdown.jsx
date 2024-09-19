import React, { useState } from 'react';
import { MdOutlineKeyboardArrowDown, MdOutlineKeyboardArrowUp } from "react-icons/md";

const DropdownList = () => {
  // Sample list of items to display
  const items = [
    { name: 'Joshua Varney', subtitle: 'Subtitle Tags' },
    { name: 'Joshua Varney', subtitle: 'Subtitle Tags' },
    { name: 'Joshua Varney', subtitle: 'Subtitle Tags' }
  ];

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

  return (
    <div>
      {items.map((item, index) => (
        <div key={index}>
          {/* List item */}
          <ul className='mt-4 p-3'>
            <div className='flex flex-row justify-between items-center'>
              <div className='flex flex-col'>
                <p className='text-sm'>{item.name}</p>
                <p className='text-sm'>{item.subtitle}</p>
              </div>
              <div onClick={() => toggleExpand(index)} className="cursor-pointer">
                {expandedIndex === index ? <MdOutlineKeyboardArrowUp /> : <MdOutlineKeyboardArrowDown />}
              </div>
            </div>
          </ul>

          {/* Expanded content */}
          {expandedIndex === index && (
            <div className="mt-2 p-2 bg-gray-100">
              <p>Additional content for {item.name}</p>
            </div>
          )}

          {/* Separator */}
          <div className="border-t w-full h-2"></div>
        </div>
      ))}
    </div>
  );
};

export default DropdownList;
