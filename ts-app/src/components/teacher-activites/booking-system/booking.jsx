import React from 'react';
import TeacherCard from '../aspects/teacher-card';
import Nav from '../aspects/filter-nav';

const BookingSystem = () => {
    return (
        <div>
            <div>
                <Nav />
            </div>
            <div className='flex flex-row justify-center justify-items-center'>
                <TeacherCard />
                <TeacherCard />
            </div>
            <div className='flex flex-row justify-items-center justify-center'>
                <TeacherCard />
                <TeacherCard />
            </div>
        </div>
    
    );
};

export default BookingSystem;
