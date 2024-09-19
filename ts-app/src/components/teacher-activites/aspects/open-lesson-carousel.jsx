import React, { useState } from 'react';
import { CarouselProvider, Slider, Slide } from 'pure-react-carousel';
import { IoLogoClosedCaptioning } from "react-icons/io";
import 'pure-react-carousel/dist/react-carousel.es.css';
import { FaBookAtlas } from "react-icons/fa6";
import { MdGeneratingTokens } from "react-icons/md";
import { PiPersonBold } from "react-icons/pi";

const OpenLessonsCarousel = ({ lessonsData }) => {
  const [currentSlide, setCurrentSlide] = useState(0); // State to manage current slide

  const handleSlideClick = (index) => {
    setCurrentSlide(index); // Shift the carousel to the clicked slide
  };

  if (!lessonsData || lessonsData.length === 0) {
    return (
      <div className="flex items-center w-full mt-6 mb-4">
        <CarouselProvider
          totalSlides={1}
          visibleSlides={1}
          isIntrinsicHeight={true}
          currentSlide={currentSlide} // Controlled slide index
        >
          <Slider className="flex px-4">
            <Slide index={0}>
              <div className='shadow-lg rounded-lg h-full flex flex-col mx-4 border bg-white'>
                <div className='flex flex-row justify-items-start p-2'>
                  {/* Title */}
                  <p className="text-blue-600 font-semibold text-sm">
                    Tomorrow | 9:30
                  </p>
                </div>
                <div className='flex flex-row space-x-6 mb-2 justify-items-start p-2'>
                  {/* Description */}
                  <div className='flex flex-row space-x-2 items-center'>
                    <FaBookAtlas />
                    <p className="text-gray-700 text-sm text-center">
                      The first person sets the subject
                    </p>
                  </div>
                  <div className='flex flex-row space-x-1 items-center'>
                    {/* Additional info can be added here if needed */}
                  </div>
                </div>
                {/* Description */}
                <div className='relative'>
                    {/* Widget (placed in front of the existing content) */}
                    <div className='absolute top-3 left-1/2 transform -translate-x-1/2 bg-blue-200 shadow-md p-1 rounded-full z-10 justify-center justify-items-center'>
                        {/* Widget content */}
                        <p className='text-sm text-center'>Book the first place</p>
                    </div>

                    {/* Existing content */}
                    <div className='flex flex-row mb-4 text-center justify-center space-x-2'>
                        <div className='flex flex-row'>
                        <PiPersonBold className='p-2 border rounded-full w-14 h-14' />
                        <PiPersonBold className='p-2 border rounded-full w-14 h-14' />
                        </div>
                        <div className="border-r border-gray-300"></div>
                        <div className='flex flex-row'>
                        <PiPersonBold className='p-2 border rounded-full w-14 h-14' />
                        <PiPersonBold className='p-2 border rounded-full w-14 h-14' />
                        </div>
                    </div>
                </div>
                                    {/* Separator */}
                <div className="border-t w-full border-gray-300"></div>
                {/* Time */}
                <div className='flex flex-row justify-between'>
                  <div className='flex flex-row items-center space-x-2 p-2'>
                    <IoLogoClosedCaptioning />
                    <div className='flex flex-col'>
                        <p className='text-sm'>This is subtitle</p>
                        <p className='text-sm'>This is subtitle</p>
                    </div>
                  </div>
                  <div className='flex flex-col w-24 h-full items-center text-center justify-center justify-items-center rounded-br-lg bg-blue-500/40 text-grey'>
                    <p className='text-sm'>Price</p>
                    <p className='text-sm'>Time</p>
                  </div>
                </div>
              </div>
            </Slide>
          </Slider>
        </CarouselProvider>
      </div>
    );
  }

  return (
    <div className="flex flex-row justify-center items-center w-full mt-6 mb-4">
      <CarouselProvider
        totalSlides={lessonsData.length}
        visibleSlides={2} // Show two slides at a time
        isIntrinsicHeight={true}
        currentSlide={currentSlide} // Controlled slide index
      >
        <Slider className="flex px-4">
          {lessonsData.map((lesson, index) => (
            <Slide
              index={index}
              key={index}
              onClick={() => handleSlideClick(index)} // Handle click event
            >
              {/* Add margin between cards */}
              <div className='p-2 shadow-lg rounded-lg h-full flex flex-col mx-4 border border-yellow-400 bg-white'>
                <div className='flex flex-row justify-items-start mb-2'>
                  {/* Title */}
                  <h1 className="font-bold text-sm text-blue-900">
                    {lesson.title} | {lesson.time}
                  </h1>
                </div>

                <div className='flex flex-row space-x-6 mb-4 justify-items-start '>
                  {/* Description */}
                  <div className='flex flex-row space-x-2 items-center'>
                    <FaBookAtlas />
                    <p className="text-gray-700 text-sm text-center">
                      Biology
                    </p>
                  </div>
                  <div className='flex flex-row space-x-1 items-center'>
                    <p className="text-gray-700 text-sm text-center">
                      5
                    </p>
                    <MdGeneratingTokens />
                  </div>
                </div>

                {/* Description */}
                <p className="text-gray-700 text-center mb-4">
                  {lesson.description}
                </p>

                {/* Separator */}
                <div className="border-t w-full border-gray-300 h-2"></div>

                {/* Time */}
                <div className='flex flex-row justify-between items-center'>
                  <p className='text-sm'>This is subtitle</p>
                  <p className='text-sm'>This is payment</p>
                </div>
              </div>
            </Slide>
          ))}
        </Slider>
      </CarouselProvider>
    </div>
  );
};

// Default lessonsData if not provided as prop
OpenLessonsCarousel.defaultProps = {
  lessonsData: [
    { title: 'Tomorrow', description: 'Join this lesson to explore basic concepts.', time: '10:00 AM - 11:00 AM' },
    { title: 'Open Lesson 2', description: 'Deep dive into advanced topics.', time: '2:00 PM - 3:00 PM' },
    { title: 'Open Lesson 3', description: 'Interactive hands-on session.', time: '10:00 AM - 11:00 AM' },
    { title: 'Open Lesson 4', description: 'Practical workshop on key skills.', time: '2:00 PM - 3:00 PM' },
  ],
};

export default OpenLessonsCarousel;
