import { Navigate } from 'react-router-dom';
import { useAuth } from './auth';


const ProtectedRoute = ({ children }) => {
    const { currentUser, loading } = useAuth();

    if (loading) return <div>Loading...</div>; // Optionally handle loading state

    return currentUser ? children : <Navigate to="/" />;
};

export default ProtectedRoute;
