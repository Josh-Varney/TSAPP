import React, { useState, useEffect } from 'react';
import MiniCard from './mini-time-card';
import TeacherSwapCard from './small-teacher-swap-card';
import ToggleSwitch from './toggle';
import GetNotifiedCard from './alert-card';
import TimeCarousel from './time-carousel';
import OpenLessonsCarousel from './open-lesson-carousel';
import DropdownList from './list-dropdown';
import { getNextThreeWeeks } from '../func-js/time-slot';

const FullScreenCard = () => {
  const [selectedCard, setSelectedCard] = useState(null);
  const [slotsAvailable, setSlotsAvailable] = useState(false);
  const [notificationEnabled, setNotificationsEnabled] = useState(false);
  const [openLessonEnabled, setOpenLessonEnabled] = useState(true);
  const [bookLessonEnabled, setBookLessonEnabled] = useState(false);
  const [slideData, setSlideData] = useState([]);

  const timeSlots = Array.from({ length: 13 }, (_, index) => {
    const hour = 8 + index;
    return `${hour.toString().padStart(2, '0')}:00`;
  });

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

  useEffect(() => {
    const fetchSlideData = async () => {
      const data = await getNextThreeWeeks();
      setSlideData(data);
    };

    fetchSlideData();
  }, []);

  return (
    <div className="flex items-center justify-center bg-gray-50">
      <div className="bg-white shadow-md rounded-xl border border-gray-200 w-[700px] items-center mt-8 overflow-auto">  
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-800">Logo</h1>
          <h2 className="text-sm font-semibold text-gray-600">Let's cause an impact</h2>
        </div>

        <div className="bg-[#f3f4f6] p-4 rounded-lg shadow-lg">
          <div className="flex flex-row items-center space-x-4">
            <TeacherSwapCard />
            <TimeCarousel slideData={slideData} />
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
                <OpenLessonsCarousel />
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
