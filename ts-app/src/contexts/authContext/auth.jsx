import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '../../firebase/firebase'; 
import { onAuthStateChanged, signOut } from 'firebase/auth';

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, user => {
            setCurrentUser(user);
            setLoading(false);
        });

        return () => unsubscribe(); // Clean up subscription on unmount
    }, []);

    const logout = async () => {
        try {
            await signOut(auth);
        } catch (error) {
            console.error("Logout Error:", error);
        }
    };

    const value = {
        currentUser,
        userLoggedIn: !!currentUser, // userLoggedIn is derived from currentUser
        loading,
        logout, // Provide logout function
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}
