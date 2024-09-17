import React from 'react';
import Nav from '../aspects/filter-nav';
import FlipCard from '../aspects/flip-card';

const BookingSystem = () => {
    return (
        <div>
            <div>
                <Nav />
            </div>
            <div className='flex flex-row justify-center justify-items-center'>

                <FlipCard 
                    professionalStatus="Visual Merchandiser" 
                    fullName="Madeleine Eldridge"
                    bio="Specialised in Biology, Psychology and Computer Science subjects "
                    lessonsTaught="20"
                    teacherRating="4.8"
                    teacherAvailability="Busy"
                    teachesALevel={true}
                    teachesGCSE={true}
                />
        
            </div>
            <div className='flex flex-row justify-items-center justify-center'>
            <FlipCard 
                    professionalStatus="Visual Merchandiser" 
                    fullName="Madeleine Eldridge"
                    bio="Specialised in Biology, Psychology and Computer Science subjects "
                    lessonsTaught="20"
                    teacherRating="4.8"
                    teacherAvailability="Busy"
                />
                <FlipCard 
                    professionalStatus="Visual Merchandiser" 
                    fullName="Madeleine Eldridge"
                    bio="Specialised in Biology, Psychology and Computer Science subjects "
                    lessonsTaught="20"
                    teacherRating="4.8"
                    teacherAvailability="Busy"
                />
            </div>
        </div>
    
    );
};

export default BookingSystem;
