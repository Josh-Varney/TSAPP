import React from 'react';
import MiniCard from './mini-time-card';
import TeacherSwapCard from './small-teacher-swap-card';
import ToggleSwitch from './toggle';
import GetNotifiedCard from './alert-card';
import Carousel from './time-carousel';

const FullScreenCard = () => {
  const miniCards = Array.from({ length: 10 });

  // Function to render rows of MiniCards
  const renderMiniCardRows = (cards) => {
    const rows = [];
    for (let i = 0; i < cards.length; i += 5) {
      rows.push(
        <div key={i} className="flex flex-row justify-center space-x-5 mt-4 flex-wrap">
          {cards.slice(i, i + 5).map((_, index) => (
            <MiniCard key={index} />
          ))}
        </div>
      );
    }
    return rows;
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <div className="bg-white shadow-md rounded-lg p-8 space-y-6 border border-gray-200">
        <h1 className="text-2xl font-bold text-gray-800">Joshua Varney</h1>
        
        <div className="bg-blue-500 p-6 rounded-lg shadow-lg space-x-5">
          <div className="flex flex-row space-x-4">
            {/* Teacher Card to Swap  */}
            <TeacherSwapCard />
            
            <Carousel />
            
          </div>
          
          <div className="flex flex-row justify-center space-x-4 text-center items-center mt-4">
            <p className="text-gray-200 mb-0">Show available slots only</p>
            <ToggleSwitch />
          </div>

          {/* Render MiniCard rows */}
          {renderMiniCardRows(miniCards)}

          <div className="mt-4">
            {/* Alerts Card which will notify the user whenever a slot becomes available */}
            <GetNotifiedCard />
          </div>

          <div className="mt-4">
            {/* Book a place in an open lesson */}
            <div>
              <p className="text-gray-800 font-semibold">Book a place in an Open lesson</p>
              <p className="text-gray-600">There aren't any Open Lessons available at this time. Try another time.</p>
            </div>
          </div>

          <div className="mt-4">
            {/* Book a lesson */}
            <div>
              <p className="text-gray-800 font-semibold">Book a lesson</p>
              <p className="text-gray-600">Create a private lesson for yourself or for others.</p>
              {/* Display of available teachers at the time that the user has selected */}
              {/* This could be a dropdown list with teacher options */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FullScreenCard;
