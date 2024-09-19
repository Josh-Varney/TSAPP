import React, { useState } from 'react';
import { CarouselProvider, Slider, Slide } from 'pure-react-carousel';
import 'pure-react-carousel/dist/react-carousel.es.css';

const Carousel = ({ slideData }) => {
  const [currentSlide, setCurrentSlide] = useState(0); // State to manage current slide

  const handleSlideClick = (index) => {
    setCurrentSlide(index); // Shift the carousel to the clicked slide
  };

  return (
    <div className="flex flex-row justify-center items-center w-full">
      <CarouselProvider
        naturalSlideWidth={150}
        naturalSlideHeight={150}
        totalSlides={slideData.length}
        visibleSlides={5}
        isIntrinsicHeight={true}
        currentSlide={currentSlide} // Controlled slide index
      >
        <Slider className="flex px-4">
          {slideData.map((slide, index) => (
            <Slide
              index={index}
              key={index}
              onClick={() => handleSlideClick(index)} // Handle click event
            >
              <div
                className={`p-5 rounded-lg h-full flex flex-col justify-center items-center cursor-pointer ${
                  currentSlide === index ? '' : ''
                }`}
              >
                <h1>{slide.day}</h1>
                <h1
                  className={`${
                    currentSlide === index
                      ? 'rounded-full bg-black text-white px-2 py-1'
                      : ''
                  }`}
                >
                  {slide.date}
                </h1>
                <h1>{slide.month}</h1>
              </div>
            </Slide>
          ))}
        </Slider>
      </CarouselProvider>
    </div>
  );
};

// Default slideData if not provided as prop
Carousel.defaultProps = {
  slideData: [
    { day: 'FRI', date: '19', month: 'Sep' },
    { day: 'SAT', date: '20', month: 'Sep' },
    { day: 'SUN', date: '21', month: 'Sep' },
    { day: 'MON', date: '22', month: 'Sep' },
    { day: 'TUE', date: '23', month: 'Sep' },
    { day: 'WED', date: '24', month: 'Sep' },
  ],
};

export default Carousel;
