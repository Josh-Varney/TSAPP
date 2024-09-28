import React from "react";
import ScedulerNav from "../aspects/scheduler-nav";
import FullScreenCard from "../aspects/full-screen-card";

const ScheduleLesson = () => {
    return (
        <div>
            <div>
                <ScedulerNav />
            </div>
            <div>
                <FullScreenCard />
            </div>
        </div>
    );
};

export default ScheduleLesson;