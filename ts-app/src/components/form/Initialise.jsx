import React, { useEffect, useState } from "react";
import { FaUser, FaLock } from "react-icons/fa";
import backgroundImage from '../assets/mountain.jpg'; 
import { doSendEmailVerification, doSignInWithEmailAndPassword } from "../../firebase/auth";
import { useNavigate } from 'react-router-dom';
import { getAuth, signOut } from "firebase/auth";
import GoogleProvider from "../provider/google/googleProvider";
import FacebookProvider from "../provider/google/facebookProvider";

const InitialiseScreen = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(""); // Error state
    const [success, setSuccess] = useState(""); // Success message state
    const [showResendLink, setShowResendLink] = useState(false); // State to control resend link visibility

    // Initialize navigate hook
    const navigate = useNavigate();

    useEffect(() => {
        const checkAuthStatus = async () => {
            const auth = getAuth();
            const user = auth.currentUser;
            if (user) {
                // If user is logged in, log them out
                try {
                    await signOut(auth);
                } catch (error) {
                    console.error("Error signing out: ", error);
                    setError("Error signing out. Please try again.");
                }
            }
        };

        checkAuthStatus();
    }, [navigate]);

    const resendVerification = async () => {
        const auth = getAuth();
        const user = auth.currentUser; // Get the current user
        if (!user) {
            setError("No user is currently signed in.");
            return;
        }

        try {
            setError(""); setShowResendLink(false);
            await doSendEmailVerification(); // Send verification email
            setSuccess("Verification email sent. Please check your inbox.");
        } catch (error) {
            console.log("Error sending email verification " + error.message);
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const auth = getAuth();

        try {
            setError(""); // Clear previous errors
            setSuccess(""); // Clear previous success message

            await new Promise((resolve) => setTimeout(resolve, 700));

            // Attempt to sign in with email and password
            const userCredentials = await doSignInWithEmailAndPassword(auth, username, password);

            if (userCredentials.emailVerified) {
                console.log("Verified");
                setTimeout(() => {
                    navigate('/home'); // Redirect after a delay
                }, 2000); // Delay in milliseconds    
            } else {
                setError("Please verify your email. ");
                setShowResendLink(true); // Show the resend link
            }
        } catch (error) {
            let errorMessage = "Sign-in error: An unexpected error occurred.";
        
            if (error.code === 'auth/invalid-credential') {
                errorMessage = "Invalid credentials. Please check your email and password.";
            } else if (error.code === 'auth/invalid-email') {
                errorMessage = "Invalid email. Please enter a correct email and password";
            } else {
                errorMessage = "Unknown Error";
            }

            setError(errorMessage);
        }
    };

    return (
        <div
            className="flex items-center justify-center min-h-screen p-4 bg-cover bg-center"
            style={{ backgroundImage: `url(${backgroundImage})` }}
        >
            <div className="w-full max-w-sm p-6 rounded-lg shadow-md bg-white bg-opacity-90">
                <form onSubmit={handleSubmit}>
                    <h2 className="text-2xl font-semibold text-center mb-6">Login Form</h2>

                    <div className="flex flex-wrap justify-center">
                        {error && (
                            <div className="flex flex-row mb-4 text-red-500 text-sm justify-center">
                                {error}
                                {showResendLink && (
                                    <span
                                        onClick={resendVerification}
                                        className="ml-2 text-blue-500 cursor-pointer hover:underline"
                                    >
                                        Resend
                                    </span>
                                )}
                            </div>
                        )} {/* Display error message with resend link */}
                    </div>
                    
                    {success && <div className="flex flex-row mb-4 text-green-500 text-sm justify-center">{success}</div>} {/* Display success message */}

                    <div className="flex items-center font-medium text-sm mb-4 border rounded-full p-2 border-gray-300">
                        <FaUser className="text-gray-600 mr-3" />
                        <input
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            className="flex-1 p-2 outline-none bg-transparent"
                        />
                    </div>

                    <div className="flex items-center font-medium text-sm mb-6 border rounded-full p-2 border-gray-300">
                        <FaLock className="text-gray-600 mr-3" />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="flex-1 p-2 outline-none bg-transparent"
                        />
                    </div>

                    <div className="flex items-center font-medium text-xs text-gray-500 justify-between mb-6">
                        <label className="flex items-center">
                            <input type="checkbox" className="mr-2" />
                            Remember Me
                        </label>
                        <a href="/forgot" className="text-blue-500 font-medium text-xs hover:underline">Forgot Password?</a>
                    </div>

                    <div>
                        <h3 className="flex items-center text-xs mb-4 font-medium text-gray-600">
                            <span className="flex-1 border-t border-gray-300"></span>
                            <span className="mx-4 text-gray-500">Or Sign In With</span>
                            <span className="flex-1 border-t border-gray-300"></span>
                        </h3>
                    </div>

                    <div className="flex flex-row justify-center space-x-10">
                        <GoogleProvider />
                        <FacebookProvider />
                    </div>

                    <button
                        type="submit"
                        className="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                    >
                        Login
                    </button>

                    <div className="text-center text-xs font-medium text-gray-500 mt-6">
                        <p>
                            Don't Have An Account? <a href="/register" className="text-blue-500 hover:underline">Register</a>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default InitialiseScreen;
