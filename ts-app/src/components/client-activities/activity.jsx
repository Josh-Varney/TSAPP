import React from "react";
import ScedulerNav from "../teacher-activites/aspects/scheduler-nav";
import SchedulerCard from "./activity-card";

const events = [
    {
      title: 'Team Meeting',
      date: '2024-09-20',
      time: '10:00 AM',
      description: 'Discuss project updates and next steps.'
    },
    {
      title: 'Doctor Appointment',
      date: '2024-09-21',
      time: '2:00 PM',
      description: 'Regular check-up with Dr. Smith.'
    },
    {
      title: 'Coffee with Sarah',
      date: '2024-09-22',
      time: '3:30 PM',
      description: 'Catch up and discuss our vacation plans.'
    },
  ];


const ScheduleScreen = () => {
    return (
        <div className="">
            <div>
                <ScedulerNav />
            </div>
            <div className="App">
                <h1>Scheduler</h1>
                {events.map((event, index) => (
                    <SchedulerCard 
                    key={index}
                    title={event.title}
                    date={event.date}
                    time={event.time}
                    description={event.description}
                    />
                ))}
            </div>
        </div>
    );
};

export default ScheduleScreen;