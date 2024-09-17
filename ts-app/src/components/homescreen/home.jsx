import React from 'react';
import HomeNavbar from './aspects/nav';
import Card from './aspects/squareCard';
import { HiMiniMagnifyingGlass, HiUserGroup } from "react-icons/hi2";
import { MdEmojiEvents } from "react-icons/md";
import { PiCalendarBold } from "react-icons/pi";

const HomeScreen = () => {
    return (
        <div>
            <div>
                <HomeNavbar />
            </div>
            <div className='flex flex-row justify-items-center justify-center mt-10 space-x-10'>
                <Card 
                    backgroundImage="https://via.placeholder.com/600x400"
                    headerText="Book a Professional"
                    textArea="Let's find an experienced teacher that meet's your requirements"
                    spanText="1-to-1 Lessons"
                    icon={HiMiniMagnifyingGlass}
                />
                <Card 
                    backgroundImage="https://via.placeholder.com/600x400"
                    headerText="Join a Group Session"
                    textArea="Share an experienced professional amongst multiple students"
                    spanText="Up to 2-to-8 Lessons"
                    icon={HiUserGroup}
                />
            </div>
            <div className='flex flex-row justify-items-center justify-center mt-10 space-x-10'>
                <Card 
                    backgroundImage="https://via.placeholder.com/600x400"
                    headerText="Check out our Events"
                    textArea="Stay up-to-date with continuous large group events throughout the year"
                    spanText="Examination Events or Meet Our Team?"
                    icon={MdEmojiEvents}
                />
                <Card 
                    backgroundImage="https://via.placeholder.com/600x400"
                    headerText="Check your Timetable"
                    textArea="The busier the schedule the more there is to learn here!"
                    spanText="Let's set and maintain our schedule"
                    icon={PiCalendarBold}
                />
            </div>
        </div>
    );
};

export default HomeScreen;
