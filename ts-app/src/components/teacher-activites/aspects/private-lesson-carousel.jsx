import React, { useState } from 'react';
import { CarouselProvider, Slider, Slide } from 'pure-react-carousel';
import 'pure-react-carousel/dist/react-carousel.es.css';
import { FaBookAtlas } from "react-icons/fa6";
import { MdGeneratingTokens } from "react-icons/md";

const PrivateLessonCarousel = ({ lessonsData }) => {
  const [currentSlide, setCurrentSlide] = useState(0); // State to manage current slide

  const handleSlideClick = (index) => {
    setCurrentSlide(index); // Shift the carousel to the clicked slide
  };

  return (
    <div className="flex flex-row justify-center items-center w-full mt-2 mb-4">
      <CarouselProvider
        totalSlides={lessonsData.length}
        visibleSlides={3} // Adjust this based on the desired width
        isIntrinsicHeight={true}
        currentSlide={currentSlide} // Controlled slide index
        infinite={false}
        naturalSlideWidth={300} // Adjust to make slides wider
        naturalSlideHeight={200}
      >
        <Slider className="w-full">
          {lessonsData.map((lesson, index) => (
            <Slide
              index={index}
              key={index}
              onClick={() => handleSlideClick(index)} // Handle click event
              className="flex justify-center" // Center the card in the slide
            >
              <div className='shadow-lg rounded-lg w-[150px] h-[80px] flex flex-col text-center justify-center bg-blue-500/40 mx-2 p-2'>
                <p className='font-bold text-lg'>{lesson.title}</p>
                <p className='mt-2'>{lesson.description}</p>
              </div>
            </Slide>
          ))}
        </Slider>
      </CarouselProvider>
    </div>
  );
};

// Default lessonsData if not provided as prop
PrivateLessonCarousel.defaultProps = {
  lessonsData: [
    { title: '£15', description: '30 min'},
    { title: '£30', description: '60 min'},
    { title: '£45', description: '90 min'},
  ],
};

export default PrivateLessonCarousel;
