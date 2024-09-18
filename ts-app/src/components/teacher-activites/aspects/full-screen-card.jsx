import React from 'react';
import MiniCard from './mini-time-card';
import TeacherSwapCard from './small-teacher-swap-card';
import TimeLineCard from './time-line-card';
import ToggleSwitch from './toggle';
import GetNotifiedCard from './alert-card';

const FullScreenCard = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 space-y-6">
        <h1 className="text-xl font-bold">Joshua Varney</h1>
        
        <div className="bg-slate-500 p-4 rounded-lg">
          <div className="flex flex-row space-x-4">
            {/* Teacher Card to Swap  */}
            <TeacherSwapCard />

            <div>
                <TimeLineCard />
            </div>
          </div>
          
          <div className="flex flex-row justify-center justify-items-center space-x-4 text-center items-center mt-4">
            <div>
              <p className="text-gray-700 mb-0">Show available slots only</p>
            </div>
            <div>
              <ToggleSwitch />
            </div>
          </div>
          <div className=''>
            <div className="flex flex-row justify-center space-x-5 mt-4">
                {/* This will require some computation to format the cards correctly in a row that wraps around */}
                <MiniCard />
                <MiniCard />
                <MiniCard />
                <MiniCard />
                <MiniCard />
            </div>
            <div className="flex flex-row justify-center space-x-5 mt-4">
                {/* This will require some computation to format the cards correctly in a row that wraps around */}
                <MiniCard />
                <MiniCard />
                <MiniCard />
                <MiniCard />
                <MiniCard />
            </div>
          </div>

          <div className="mt-4">
            {/* Alerts Card which will notify the user whenever a slot becomes available */}
            <GetNotifiedCard />
          </div>

          <div className="mt-4">
            {/* Book a place in an open lesson */}
            <div>
              <p className="text-gray-700 mb-0">Book a place in an Open lesson</p>
            </div>
            <div>
              <p className="text-gray-700 mb-0">There aren't any Open Lessons available at this time. Try another time</p>
            </div>
            {/* This will produce a slideable card whenever a lesson is open at a particular time that the person selects */}
          </div>

          <div className="mt-4">
            {/* Book a lesson */}
            <div>
              <p className="text-gray-700 mb-0">Book a lesson</p>
            </div>
            <div>
              <p className="text-gray-700 mb-0">Create a private lesson for yourself or for others</p>
            </div>
            {/* Display of available teachers at the time that the user has selected */}
            {/* Almost like a list dropdown with the pricing of booking the lesson */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FullScreenCard;
