import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Import Routes as well
import './App.css';
import InitialiseScreen from './components/form/Initialise.jsx';
import CreateAccountScreen from './components/form/Create.jsx';
import HomeScreen from './components/homescreen/home.jsx';
import ForgotPasswordScreen from './components/form/Forgot.jsx';
import ProtectedRoute from './contexts/authContext/route_context.jsx'; // Adjust path if needed
import BookingSystem from './components/teacher-activites/booking-system/booking.jsx';
import CalendarSystem from './components/client-calendar/timetable.jsx';
import EventSystem from './components/large-events/events.jsx';
import ScheduleScreen from './components/calender-activities/activity.jsx';
import ScheduleLesson from './components/teacher-activites/booking-system/schedule-booking.jsx';
import MessagingScreen from './components/client-messaging/messaging-screen.jsx';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<InitialiseScreen />} />
        <Route path="/register" element={<CreateAccountScreen />} />
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <HomeScreen />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher-sessions"
          element={
            <ProtectedRoute>
              <BookingSystem />
            </ProtectedRoute>
          }
        />
        <Route 
        path="/booking-activity"
        element={
          <ProtectedRoute>
            <ScheduleScreen />
          </ProtectedRoute>
        }
      />
        <Route
          path="/messaging"
          element={
            <ProtectedRoute>
              <MessagingScreen />
            </ProtectedRoute>
          }
        />
        <Route
          path="/live-events"
          element={
            <ProtectedRoute>
              <EventSystem />
            </ProtectedRoute>
          }
        />
        <Route 
        path="/teacher-sessions/booking"
        element={
          <ProtectedRoute>
            <ScheduleLesson />
          </ProtectedRoute>
        }
      />
        <Route path="/forgot" element={<ForgotPasswordScreen />} />
      </Routes>
    </Router>
  );
}

export default App;
