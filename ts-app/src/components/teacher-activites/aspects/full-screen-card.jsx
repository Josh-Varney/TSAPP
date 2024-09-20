import React, { useState } from 'react';
import MiniCard from './mini-time-card';
import TeacherSwapCard from './small-teacher-swap-card';
import ToggleSwitch from './toggle';
import GetNotifiedCard from './alert-card';
import TimeCarousel from './time-carousel';
import OpenLessonsCarousel from './open-lesson-carousel';
import DropdownList from './list-dropdown';

const FullScreenCard = () => {
  const [selectedCard, setSelectedCard] = useState(null);
  const [slotsAvailable, setSlotsAvailable] = useState(false);
  const [notificationEnabled, setNotificationsEnabled] = useState(false);
  const [openLessonEnabled, setOpenLessonEnabled] = useState(true);
  const [bookLessonEnabled, setBookLessonEnabled] = useState(false);
  
  // Generate time slots from 08:00 to 20:00 (24-hour format)
  const timeSlots = Array.from({ length: 13 }, (_, index) => {
    const hour = 8 + index;
    return `${hour.toString().padStart(2, '0')}:00`;
  });

  // Function to render rows of MiniCards
  const renderMiniCardRows = (cards) => {
    const rows = cards.reduce((acc, time, index) => {
      if (index % 5 === 0) {
        acc.push([]);
      }
      acc[acc.length - 1].push(
        <MiniCard
          key={index}
          id={index}
          time={time}
          isSelected={selectedCard === index}
          onCardClick={setSelectedCard}
        />
      );
      return acc;
    }, []);
    
    return rows.map((row, rowIndex) => (
      <div key={rowIndex} className="flex flex-row justify-center space-x-5 mt-4">
        {row}
      </div>
    ));
  };

  return (
    <div className="flex items-center justify-center bg-gray-50">
      {/* Controls the height and width of the screen */}
      <div className="bg-white shadow-md rounded-xl border border-gray-200 w-[700px] items-center mt-8 overflow-auto">  
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-800">Logo</h1>
          <h2 className="text-sm font-semibold text-gray-600">Let's cause an impact</h2>
        </div>

        <div className="bg-[#f3f4f6] p-4 rounded-lg shadow-lg">
          <div className="flex flex-row items-center space-x-4">
            <TeacherSwapCard />
            <TimeCarousel slideData={[
              { day: 'FRI', date: '19', month: 'Sep' },
              { day: 'SAT', date: '20', month: 'Sep' },
              { day: 'SUN', date: '21', month: 'Sep' },
              { day: 'MON', date: '22', month: 'Sep' },
              { day: 'TUE', date: '23', month: 'Sep' },
              { day: 'WED', date: '24', month: 'Sep' },
            ]} />
          </div>

          <div className="flex flex-row justify-between mt-4 items-center">
            <p className="mb-0 text-gray-600 text-xs">Show available slots only</p>
            <ToggleSwitch />
          </div>

          <div className='flex flex-col items-center mt-4'>
            {renderMiniCardRows(timeSlots)}
          </div>

          <div className="mt-4">
            {!notificationEnabled && <GetNotifiedCard />}
          </div>

          <div className="flex flex-col mt-4">
            {!openLessonEnabled ? (
              <div>
                <p className="text-gray-600 font-semibold">Book a place in an Open lesson</p>
                <p className="text-gray-600 text-xs">Sign up for an Open Lesson, learn with others, and meet new people. <a className='text-blue-500 font-bold' href='#'>See all lessons.</a></p>
              </div>
            ) : (
              <div>
                <p className="text-gray-800 font-semibold">Book a place in an Open lesson</p>
                <p className="text-gray-600 text-xs">Sign up for an Open Lesson, learn with others, and meet new people. <a className='text-blue-500 font-bold' href='#'>See all lessons.</a></p>
                <OpenLessonsCarousel lessonsData={""}/>
              </div>
            )}
          </div>

          <div className="mt-4">
            {!bookLessonEnabled ? (
              <div>
                <p className="text-gray-800 font-semibold">Book a lesson</p>
                <p className="text-gray-600 text-xs">There aren't any Lessons available at this time. Try another time. ⏰</p>

                <div className="flex flex-row justify-between mt-4 items-center">
                  <p className="mb-0 text-gray-600 text-xs">Show available teachers only</p>
                  <ToggleSwitch />
                </div>    
              </div>
            ) : (
              <div>
                <p className="text-gray-800 font-semibold">Book a lesson</p>
                <p className="text-gray-600 text-sm">Create a private lesson for yourself or others.</p>

                <div className="flex flex-row justify-between mt-4 items-center">
                  <p className="mb-0 text-gray-600 text-sm">Show available teachers only</p>
                  <ToggleSwitch />
                </div>                
              </div>
            )}
            {/* Display of available teachers at the time that the user has selected */}
            {/* This could be a dropdown list with teacher options */}

            <div>
              <DropdownList />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FullScreenCard;
