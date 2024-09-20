// src/SchedulerCard.js
import React from 'react';
import './activity-card.css'; // Import CSS for styling

const SchedulerCard = ({ title, date, time, description }) => {
  return (
    <div className="scheduler-card">
      <h2>{title}</h2>
      <p><strong>Date:</strong> {date}</p>
      <p><strong>Time:</strong> {time}</p>
      <p>{description}</p>
    </div>
  );
};

export default SchedulerCard;
