import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Import Routes as well
import './App.css';
import InitialiseScreen from './components/form/Initialise';
import CreateAccountScreen from './components/form/Create';
import HomeScreen from './components/homescreen/home';
import ForgotPasswordScreen from './components/form/Forgot';
import ProtectedRoute from './contexts/authContext/route_context'; // Adjust path if needed

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
        <Route path="/forgot" element={<ForgotPasswordScreen />} />
      </Routes>
    </Router>
  );
}

export default App;
