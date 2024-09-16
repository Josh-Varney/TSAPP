import React, { useState } from "react";
import { FaUser, FaLock } from "react-icons/fa";
import backgroundImage from '../assets/mountain.jpg'; 
import { doCreateUserWithEmailAndPassword, doSendEmailVerification } from "../../firebase/auth";
import { getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const CreateAccountScreen = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState(""); // Error state
    const [success, setSuccess] = useState(""); // Success message state

    // Initialize navigate hook
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const auth = getAuth();
    
        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }
    
        try {
            setError(""); // Clear previous errors
            setSuccess(""); // Clear previous success message
            // console.log("Attempting to create an account with:", { email, password });
            const userCredentials = await doCreateUserWithEmailAndPassword(auth, email, password);
            const user = userCredentials.user;

            await doSendEmailVerification();

            console.log(user.emailVerified);

            await new Promise((resolve) => setTimeout(resolve, 1000));
            setSuccess("Account created successfully");

            setTimeout(() => {
                navigate('/'); // Redirect after a delay
            }, 2000); // Delay in milliseconds

        } catch (error) {
            // console.error("Sign-up error:", error);
            setError("Sign-up error: " + error.message); // Set error message for UI
        }
    };
    
    return (
        <div
            className="flex items-center justify-center min-h-screen p-4 bg-cover bg-center"
            style={{ backgroundImage: `url(${backgroundImage})` }}
        >
            <div className="w-full max-w-sm p-6 rounded-lg shadow-md bg-white bg-opacity-90">
                <form onSubmit={handleSubmit}>
                    <h2 className="text-2xl font-semibold text-center mb-6">Create an Account</h2>

                    {error && <div className="mb-4 text-red-500">{error}</div>} {/* Display error message */}
                    {success && <div className="mb-4 text-green-500">{success}</div>} {/* Display success message */}

                    <div className="flex items-center mb-4 border rounded-full p-2 border-gray-300">
                        <FaUser className="text-gray-600 mr-3" />
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="flex-1 p-2 outline-none bg-transparent"
                        />
                    </div>

                    <div className="flex items-center mb-4 border rounded-full p-2 border-gray-300">
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

                    <div className="flex items-center mb-6 border rounded-full p-2 border-gray-300">
                        <FaLock className="text-gray-600 mr-3" />
                        <input
                            type="password"
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            className="flex-1 p-2 outline-none bg-transparent"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                    >
                        Create Account
                    </button>

                    <div className="font-medium text-sm text-gray-500 text-center mt-6">
                        <p>
                            Already have an account? <a href="/" className="text-blue-500 hover:underline">Login</a>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateAccountScreen;
