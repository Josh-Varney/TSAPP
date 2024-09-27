import React, { useState } from 'react';
import { CarouselProvider, Slider, Slide } from 'pure-react-carousel';
import 'pure-react-carousel/dist/react-carousel.es.css';
import { getDateTimeString } from '../func-js/time-slot';

const TimeCarousel = ({ slideData }) => {
  const [currentSlide, setCurrentSlide] = useState(0); // State to manage current slide

  const handleSlideClick = (index) => {
    setCurrentSlide(index);
    console.log(slideData[index]); 

    const day = Number(slideData[index].month); 
    const monthAbbr = slideData[index].date;

    const dateSelected = getDateTimeString(day, monthAbbr);
  };

  return (
    <div className="flex flex-row justify-center items-center">
      <CarouselProvider
        totalSlides={slideData.length}
        visibleSlides={5}
        isIntrinsicHeight={true}
        currentSlide={currentSlide} // Controlled slide index
        style={{ width: '530px' }}
      >
        <Slider className="flex px-4">
          {slideData.map((slide, index) => (
            <Slide
              index={index}
              key={index}
              onClick={() => handleSlideClick(index)} // Handle click event
            >
              <div
                className={`rounded-lg h-full flex flex-col justify-center items-center cursor-pointer ${
                  currentSlide === index ? '' : ''
                }`}
              >
                <h1 className="font-semibold">{slide.day}</h1>
                <h1
                  className={`font-bold ${
                    currentSlide === index
                      ? 'rounded-full bg-black text-white px-1 py-1'
                      : ''
                  }`}
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
