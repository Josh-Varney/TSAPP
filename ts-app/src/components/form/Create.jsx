import React, { useState } from "react";
import { FaUser, FaLock } from "react-icons/fa";
import backgroundImage from '../assets/mountain.jpg'; 
import { doSignUpWithEmailAndPassword } from "../../firebase/auth"; // Update import

const CreateAccountScreen = () => {
    const [email, setEmail] = useState(""); // Use email instead of username
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState(""); // Confirmation password field

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            console.error("Passwords do not match");
            // Optionally, display an error message to the user
            return;
        }
        try {
            console.log("Attempting to create an account with:", { email, password });
            await doSignUpWithEmailAndPassword(email, password); // Use sign-up function
            console.log("Account created successfully");
            navigate('/dashboard'); // Redirect to the desired route
        } catch (error) {
            console.error("Sign-up error:", error);
            // Optionally, display an error message to the user
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

                    <div className="text-center mt-6">
                        <p>
                            Already have an account? <a href="/login" className="text-blue-500 hover:underline">Login</a>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateAccountScreen;
