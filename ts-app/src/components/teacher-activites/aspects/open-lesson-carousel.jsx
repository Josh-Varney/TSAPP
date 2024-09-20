import React, { useState, useCallback } from 'react';
import { CarouselProvider, Slider, Slide } from 'pure-react-carousel';
import { IoLogoClosedCaptioning } from 'react-icons/io';
import { FaBook, FaPlus } from 'react-icons/fa6';
import { MdGeneratingTokens } from 'react-icons/md';
import { PiPersonBold } from 'react-icons/pi';
import { LuDot } from 'react-icons/lu';
import 'pure-react-carousel/dist/react-carousel.es.css';

const LessonCard = ({ lesson, index, onClick }) => (
  <Slide index={index} onClick={() => onClick(index)}>
    <div className="shadow-lg rounded-lg h-full flex flex-col w-full max-w-xs border border-yellow-400 bg-white">
      <div className="p-3">
        <div className="flex flex-row justify-between items-center mb-2">
          <h1 className="text-blue-600 font-semibold text-sm">
            {lesson.title} | {lesson.time}
          </h1>
        </div>
        <div className="flex flex-row items-center mb-3">
          <div className="flex flex-row items-center space-x-2">
            <FaBook className="text-gray-700" />
            <p className="text-gray-700 text-xs">Biology</p>
          </div>
          <div className="ml-auto flex flex-row items-center space-x-1">
            <p className="text-gray-700 text-xs">5</p>
            <MdGeneratingTokens className="text-gray-700" />
          </div>
        </div>
      </div>

      <div className="flex justify-center mb-10 space-x-2">
        {[...Array(4)].map((_, i) => (
          <PiPersonBold key={i} className="p-2 border rounded-full w-10 h-10" />
        ))}
      </div>

      <div className="border-t border-gray-300"></div>

      <div className="flex flex-row justify-between items-center">
        <div className="flex flex-row items-center space-x-2 mx-3">
          <IoLogoClosedCaptioning className="text-gray-600" />
          <div className="flex flex-col">
            <p className="text-sm">Joshua Varney</p>
            <div className="flex flex-row items-center space-x-1">
              <p className="text-xs">Biology</p>
              <LuDot className="text-xs" />
              <p className="text-xs">Paper 1</p>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center text-blue-500 bg-blue-600/10 h-full p-4">
          <p className="font-semibold text-sm">£15.50</p>
          <p className="text-xs">60min</p>
        </div>
      </div>
    </div>
  </Slide>
);

const EmptyLessonCard = () => (
  <Slide index={0}>
    <div className="shadow-lg rounded-lg h-full flex flex-col w-full max-w-xs border bg-white justify-start">
      <div className="flex flex-row justify-start p-3">
        <p className="text-blue-600 font-semibold text-sm">Tomorrow | 9:30</p>
      </div>
      <div className="flex flex-row space-x-6 mb-2 justify-start p-3">
        <div className="flex flex-row space-x-2 items-center">
          <FaBook />
          <p className="text-gray-700 text-xs text-left">
            The first person sets the subject
          </p>
        </div>
      </div>
      <div className="relative">
        <div className="flex flex-row absolute top-4 left-1/2 transform -translate-x-1/2 bg-blue-500 shadow-lg p-2 rounded-full z-10 justify-center items-center text-center space-x-2 hover:bg-blue-600 transition duration-300">
          <FaPlus className="text-white text-xs" />
          <p className="text-xs text-white font-medium whitespace-nowrap">
            Book the first place
          </p>
        </div>
        <div className="flex flex-row mb-4 text-center justify-center space-x-2 p-3">
          {[...Array(4)].map((_, i) => (
            <PiPersonBold
              key={i}
              className="p-2 border rounded-full w-10 h-10"
            />
          ))}
        </div>
      </div>
      <div className="border-t w-full border-gray-300"></div>
      <div className="flex flex-row justify-between space-x-12">
        <div className="flex flex-row items-center p-3 space-x-2">
          <IoLogoClosedCaptioning />
          <div className="flex flex-col">
            <p className="text-sm">Joshua Varney</p>
            <div className="flex flex-row justify-start">
              <p className="text-xs">Biology</p>
              <LuDot className="text-center" />
              <p className="text-xs">Paper 1</p>
            </div>
          </div>
        </div>
        <div className="flex flex-col w-24 h-full items-center text-center justify-center rounded-br-lg bg-blue-600/10 text-grey">
          <p className="text-sm font-semibold text-blue-500">£15.50</p>
          <p className="text-sm text-blue-500">60min</p>
        </div>
      </div>
    </div>
  </Slide>
);

const OpenLessonsCarousel = ({ lessonsData }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleSlideClick = useCallback((index) => {
    setCurrentSlide(index);
  }, []);

  const totalSlides = lessonsData?.length || 1; 
  const visibleSlides = lessonsData?.length ? 2 : 1; 

  return (
    <div className="w-full max-w-full mt-6 mb-4">
      <CarouselProvider
        totalSlides={totalSlides}
        visibleSlides={visibleSlides} 
        isIntrinsicHeight={true}
        currentSlide={currentSlide}
      >
        <Slider className="flex px-6">
          {lessonsData?.length ? (
            lessonsData.map((lesson, index) => (
              <LessonCard
                key={index}
                lesson={lesson}
                index={index}
                onClick={handleSlideClick}
              />
            ))
          ) : (
            <EmptyLessonCard />
          )}
        </Slider>
      </CarouselProvider>
    </div>
  );
};

// Default lessonsData if not provided as prop
OpenLessonsCarousel.defaultProps = {
  lessonsData: [
    { title: 'Tomorrow', description: 'Join this lesson to explore basic concepts.', time: '10:00 AM' },
    { title: 'Open Lesson 2', description: 'Deep dive into advanced topics.', time: '2:00 PM' },
    { title: 'Open Lesson 3', description: 'Interactive hands-on session.', time: '10:00 AM' },
    { title: 'Open Lesson 4', description: 'Practical workshop on key skills.', time: '2:00 PM' },
  ],
};

export default OpenLessonsCarousel;
