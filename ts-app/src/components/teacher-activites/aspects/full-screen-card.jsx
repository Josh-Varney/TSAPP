import React, { useState } from 'react';
import MiniCard from './mini-time-card';
import TeacherSwapCard from './small-teacher-swap-card';
import ToggleSwitch from './toggle';
import GetNotifiedCard from './alert-card';
import Carousel from './time-carousel';

const FullScreenCard = () => {
  const [selectedCard, setSelectedCard] = useState(null);
  const [slotsAvailable, setSlotsAvailable] = useState(false);
  const [notificationEnabled, setNotificationsEnabled] = useState(false);
  const [openLessonEnabled, setOpenLessonEnabled] = useState(false);
  const [bookLessonEnabled, setBookLessonEnabled] = useState(true);
  
  const miniCards = Array.from({ length: 10 }, (_, index) => index);

  // Function to render rows of MiniCards
  const renderMiniCardRows = (cards) => {
    return cards.reduce((rows, _, index) => {
      if (index % 5 === 0) {
        rows.push([]);
      }
      rows[rows.length - 1].push(
        <MiniCard
          key={index}
          id={index}
          isSelected={selectedCard === index}
          onCardClick={setSelectedCard}
        />
      );
      return rows;
    }, []).map((row, rowIndex) => (
      <div key={rowIndex} className="flex flex-row justify-center space-x-5 mt-4 flex-wrap">
        {row}
      </div>
    ));
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <div className="bg-white shadow-md rounded-xl space-y-4 border border-gray-200">
        <div className="text-center p-4">
          <h1 className="text-2xl font-bold text-gray-800">Joshua Varney</h1>
          <h2 className="text-sm font-bold text-gray-800">Small Underneath Text</h2>
        </div>

        <div className="bg-[#f3f4f6] p-4 rounded-lg shadow-lg">
          <div className="flex flex-row space-x-4">
            <TeacherSwapCard />
            <Carousel className='flex flex-row'/>
          </div>

          <div className="flex flex-row justify-between mt-4">
            <p className="mb-0 text-gray-600 text-sm text-center">Show available slots only</p>
            <ToggleSwitch />
          </div>

          {renderMiniCardRows(miniCards)}

          <div className="mt-4">
            {!notificationEnabled && <GetNotifiedCard />}
          </div>

          <div className="flex flex-col mt-4">
            {!openLessonEnabled ? (
              <div>
                <p className="text-gray-600 font-semibold">Book a place in an Open lesson</p>
                <p className="text-gray-600">There aren't any Open Lessons available at this time. Try another time. ⏰</p>
              </div>
            ) : (
              <div>
                <p className="text-gray-800 font-semibold">Book a place in an Open lesson</p>
                <p className="text-gray-600">There aren't any Open Lessons available at this time. Try another time. ⏰</p>
              </div>
            )}
          </div>

          <div className="mt-4">
            {!bookLessonEnabled ? (
              <div>
                <p className="text-gray-800 font-semibold">Book a lesson</p>
                <p className="text-gray-600">There aren't any Lessons available at this time. Try another time. ⏰</p>

                <div className="flex flex-row justify-between mt-4">
                  <p className="mb-0 text-gray-600 text-sm text-center">Show available teachers only</p>
                  <ToggleSwitch />
                </div>    
              </div>
            ) : (
              <div>
                <p className="text-gray-800 font-semibold">Book a lesson</p>
                <p className="text-gray-600">Create a private lesson for yourself or for others.</p>

                <div className="flex flex-row justify-between mt-4">
                  <p className="mb-0 text-gray-600 text-sm text-center">Show available teachers only</p>
                  <ToggleSwitch />
                </div>                
              </div>

            )}
            {/* Display of available teachers at the time that the user has selected */}
            {/* This could be a dropdown list with teacher options */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FullScreenCard;
