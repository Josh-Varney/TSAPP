import React from "react";
import "./flip-card.css"; // Ensure this file has your CSS

const FlipCard = ({
  bgPicture,
  profilePicture,
  professionalStatus,
  bio,
  gsceStatus,
  aLevelStatus,
  fullName,
  lessonsTaught,
  teacherRating,
  teacherAvailability,
}) => {
  return (
    <div className="flip-card">
      <div className="flip-card-inner">
        {/* Front Side */}
        <div className="flip-card-front">
          <div className="flex flex-col items-center text-center w-full h-full p-6">
       
            <img
                className="h-24 w-24 rounded-full border-4 border-white bg-pink-400 shadow-md"
                src="data:image/jpeg;base64,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"
                alt="Profile"
            />
          
            {/* Name and Status */}
            <h4 className="mt-8 text-xl font-bold">{fullName || "Hello"}</h4>
            <h5 className="text-base font-normal mt-1">{professionalStatus || "Status"}</h5>
            {/* Bio Section */}
            <div className="mt-6 p-4 bg-white dark:bg-gray-700 rounded-lg">
              <p className="text-base">{bio || "This is an example bio."}</p>
            </div>
            {/* Stats Section */}
            <div className="flex flex-col gap-6 md:flex-row md:gap-14 h-full items-center">
              <div className="flex flex-col items-center">
                <h4 className="text-xl font-bold">{lessonsTaught || "0"}</h4>
                <p className="text-sm">Lessons Taught</p>
              </div>
              <div className="flex flex-col items-center">
                <h4 className="text-xl font-bold">{teacherRating || "0"}</h4>
                <p className="text-sm">Rating</p>
              </div>
              <div className="flex flex-col items-center">
                <h4 className="text-xl font-bold">{teacherAvailability || "0"}</h4>
                <p className="text-sm">Availability</p>
              </div>
            </div>
          </div>
        </div>

        {/* Back Side */}
        <div className="flip-card-back flex items-center justify-center">
          <div className="text-center">
            <p className="text-xl font-bold">BACK</p>
             {/* This is where the booking system is attached*/}
            <p>Leave Me</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlipCard;
