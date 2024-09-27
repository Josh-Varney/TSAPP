import React, { useState } from 'react';
import { CarouselProvider, Slider, Slide } from 'pure-react-carousel';
import 'pure-react-carousel/dist/react-carousel.es.css';
import { getDateTimeString } from '../func-js/time-slot';
import { fetchAvailableTimes } from '../../../middleware/server-middle';

const TimeCarousel = ({ slideData, onAvailableTimesChange, onCurrentSlideDataChange }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleSlideClick = async (index) => {
    setCurrentSlide(index);
    const day = Number(slideData[index].month); // Assuming month is a number
    const monthAbbr = slideData[index].date;

    const selectedSlide = slideData[index];
    onCurrentSlideDataChange(selectedSlide);

    const dateSelected = getDateTimeString(day, monthAbbr);
    
    // Fetch available times based on the selected date
    const availableTimes = await fetchAvailableTimes(dateSelected);
    
    // Call the function to pass available times back to FullScreenCard
    onAvailableTimesChange(availableTimes);
  };

  return (
    <div className="flex flex-row justify-center items-center">
      <CarouselProvider
        totalSlides={slideData.length}
        visibleSlides={5}
        isIntrinsicHeight={true}
        currentSlide={currentSlide}
        style={{ width: '530px' }}
      >
        <Slider className="flex px-4">
          {slideData.map((slide, index) => (
            <Slide
              index={index}
              key={index}
              onClick={() => handleSlideClick(index)}
            >
              <div
                className={`rounded-lg h-full flex flex-col justify-center items-center cursor-pointer`}
              >
                <h1 className="font-semibold">{slide.day}</h1>
                <h1
                  className={`font-bold ${currentSlide === index ? 'rounded-full bg-black text-white px-1 py-1' : ''}`}
                >
                  {slide.date}
                </h1>
                <h1 className="font-semibold">{slide.month}</h1>
              </div>
            </Slide>
          ))}
        </Slider>
      </CarouselProvider>
    </div>
  );
};

export default TimeCarousel;
