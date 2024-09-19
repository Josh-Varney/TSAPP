import React from 'react';
import { MdOutlineKeyboardArrowDown } from "react-icons/md";

const DropdownList = () => {
  // Sample list of items to display
  const items = [
    { name: 'Joshua Varney', subtitle: 'Subtitle Tags' },
    { name: 'Joshua Varney', subtitle: 'Subtitle Tags' },
    { name: 'Joshua Varney', subtitle: 'Subtitle Tags' }
  ];

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
              <MdOutlineKeyboardArrowDown />
            </div>
          </ul>
          {/* Separator */}
          <div className="border-t w-full h-2"></div>
        </div>
      ))}
    </div>
  );
};

export default DropdownList;
