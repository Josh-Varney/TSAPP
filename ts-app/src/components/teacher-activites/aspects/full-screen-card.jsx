import React, { useState, useEffect } from 'react';
import MiniCard from './mini-time-card';
import TeacherSwapCard from './small-teacher-swap-card';
import ToggleSwitch from './toggle';
import GetNotifiedCard from './alert-card';
import TimeCarousel from './time-carousel';
import OpenLessonsCarousel from './open-lesson-carousel';
import DropdownList from './list-dropdown';
import { getNextThreeWeeks, getDateTimeString } from '../../../utils/time-functions/getDate';
import { fetchAvailableTimes, fetchAvailableTeachers, fetchTeacherProfile, fetchFullyBookedTimes } from '../../../middleware/server-middle';
import { generateRemainingTimes } from '../../../firebase/firestore-scheduler';

const FullScreenCard = () => {
  const [selectedCard, setSelectedCard] = useState(null);
  const [notificationEnabled, setNotificationsEnabled] = useState(false);
  const [openLessonEnabled, setOpenLessonEnabled] = useState(true);
  const [slideData, setSlideData] = useState([]);
  const [availableTimes, setAvailableTimes] = useState([]);
  const [currentSlideData, setCurrentSlideData] = useState(null);
  const [currentAvailableTeacherData, setCurrentAvailableTeacherData] = useState([]);
  const [isCardVisible, setCardVisible] = useState(true);

  const handleNotificationToggle = () => {
    setCardVisible(false); // Hide the card when toggle is activated
  };

  const handleAvailableTimesChange = (times) => {
    setAvailableTimes(times);
    console.log(times);
  };

  const fetchInitialTimes = async (date) => {
    const availableTimes = await fetchAvailableTimes(date);
    setAvailableTimes(availableTimes);
  };

  const handleCurrentSlideDataChange = (slideData) => {
    setCurrentSlideData(slideData);
  };

  const handleMiniCardClick = async (time) => {
    const dateSelectedString = getDateTimeString(currentSlideData.month, currentSlideData.date);

    const availableTeachers = await fetchAvailableTeachers(dateSelectedString, time);
    console.log(availableTeachers);
    if (availableTeachers) {
      const profiles = await Promise.all(
        availableTeachers.map(teacher => fetchTeacherProfile(teacher))
      );

      const transformed_profiles = profiles.map(teacher => ({
        name: `${teacher.firstName} ${teacher.lastName}`,
        subtitle: `${teacher.teacherEmail}`,
      }));

      setCurrentAvailableTeacherData(transformed_profiles);
    }

    setSelectedCard(time);
  };

  const renderMiniCardRows = (cards) => {
    const rows = cards.reduce((acc, time, index) => {
      if (index % 5 === 0) {
        acc.push([]); // Create a new row every 5 cards
      }

      acc[acc.length - 1].push(
        <MiniCard
          key={time} // Use time as a unique key
          id={time} // Use time as the id
          time={time}
          isSelected={selectedCard === time}
          onCardClick={() => handleMiniCardClick(time)} // Pass the time to the click handler
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
      setCurrentSlideData(data[0]);

      // Fetch initial available times based on the first slide's date
      if (data.length > 0) {
        const initialDay = Number(data[0].month);
        const initialMonthAbbr = data[0].date;
        const initialDate = getDateTimeString(initialDay, initialMonthAbbr);
        await fetchInitialTimes(initialDate);
      }
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
            <TimeCarousel slideData={slideData} onAvailableTimesChange={handleAvailableTimesChange} onCurrentSlideDataChange={handleCurrentSlideDataChange} />
          </div>

          <div className="flex flex-row justify-between mt-5 items-center">
            <p className="mb-0 text-gray-600 text-xs">Show available slots only</p>
            {/* <ToggleSwitch initialChecked={false}/> */}
          </div>

          <div className='flex flex-col items-center mt-4'>
            {availableTimes.length > 0 ? (
              renderMiniCardRows(availableTimes) // Render available times
            ) : (
              <p className="text-gray-600">No available times at this moment.</p> // Message when no times are available
            )}
          </div>

          <div className="mt-10">
            {!notificationEnabled && <GetNotifiedCard onToggle={handleNotificationToggle} isVisible={isCardVisible}/>}
          </div>

          <div className="flex flex-col mt-10">
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
            <div>
              <p className="text-gray-800 font-semibold">Book a lesson</p>
              <p className="text-gray-600 text-sm">Create a private lesson for yourself or others.</p>

              <div className="flex flex-row justify-between mt-4 items-center">
                <p className="mb-0 text-gray-600 text-sm">Show available teachers only</p>
                {/* <ToggleSwitch /> */}
              </div>
            </div>
            <div>
              <DropdownList items={currentAvailableTeacherData}/>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FullScreenCard;
