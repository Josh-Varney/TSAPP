import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './auth';


const ProtectedRoute = ({ children }) => {
    const { currentUser, loading, logout } = useAuth();
    const location = useLocation();
    
    useEffect(() => {
        // Check if the user is not logged in and if the current path is a public route
        if (currentUser && (location.pathname == '/' || location.pathname == "/register" || location.pathname == "/forget")) {
            logout(); // Log out the user
        }
    }, [currentUser, location.pathname, logout]);

    if (loading) return <div>Loading...</div>; // Optionally handle loading state

    return currentUser ? children : <Navigate to="/" />;
};

export default ProtectedRoute;
