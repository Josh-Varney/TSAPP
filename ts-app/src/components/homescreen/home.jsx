import React from 'react';
import HomeNavbar from './aspects/nav';
import Card from './aspects/squareCard';



const HomeScreen = () => {
    return (
        <div>
            <div>
                <HomeNavbar />
            </div>
            <div className='flex flex-row justify-items-center justify-center mt-10 space-x-10'>
                <Card />
                <Card />
            </div>
            <div className='flex flex-row justify-items-center justify-center mt-10 space-x-10'>
                <Card />
                <Card />
            </div>
        </div>
    );
};

export default HomeScreen;
