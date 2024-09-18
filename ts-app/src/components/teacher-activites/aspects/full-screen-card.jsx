import React from 'react';
import MiniCard from './mini-time-card';


const FullScreenCard = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md">
        <h1 className="text-2xl font-bold mb-4">Joshua Varney</h1>
        <div className='bg-slate-500 w-full h-full'>
            <div>
                <div>
                    {/* Teacher Card to Swap  */}
                </div>
                <div>
                    {/* Swipeable Timeline which updates the available slots below */}
                </div>
            </div>
            <div className='flex flex-row justify-between'>
                <div>
                    {/* This is going to be a button to not hide the available times */}
                </div>
                <div>
                    <p className="text-gray-700 mb-6">
                    Show available slots only
                    </p>
                </div>
            </div>
            <div>
                {/* This will require some computation to formate the cards correctly in a row that wraps around */}
                <MiniCard />
            </div>
            <div>
                {/* Alerts Card which will notify the user whenever a slot becomes available */}
            </div>
            <div>
                {/* Book a place in a open lesson */}
                {/* This will produce a slideable card whenever a lesson is open at a particular time that the person selects */}
            </div>
            <div>
                {/* Book a lesson */}
                {/* Display of available teachers at the time that the user has selected */}
                {/* Almost like a list dropdown with the pricing of booking the lesson */}
            </div>

        </div>
      </div>
    </div>
  );
};

export default FullScreenCard;
