import React from "react";
import ScedulerNav from "../aspects/scheduler-nav";
import FullScreenCard from "../aspects/full-screen-card";
import { getNextThreeWeeks } from "../func-js/time-slot";

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