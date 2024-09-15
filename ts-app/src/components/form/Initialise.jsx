import React, { useState } from "react";
import { FaUser, FaLock } from "react-icons/fa";
import backgroundImage from '../assets/mountain.jpg'; 
import { useAuth } from "../../contexts/authContext/auth";
import { doSignInWithEmailAndPassword } from "../../firebase/auth";

const InitialiseScreen = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            console.log("Attempting to sign in with:", { username, password });
            await doSignInWithEmailAndPassword(username, password);
            console.log("Logged")
        } catch (error) {
            console.log("Sign-in error:", error);
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

                    <div className="flex items-center mb-4 border rounded-full p-2 border-gray-300">
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

                    <div className="flex items-center mb-6 border rounded-full p-2 border-gray-300">
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

                    <div className="flex items-center justify-between mb-6">
                        <label className="flex items-center">
                            <input type="checkbox" className="mr-2" />
                            Remember Me
                        </label>
                        <a href="#" className="text-blue-500 hover:underline">Forgot Password?</a>
                    </div>

                    <button
                        type="submit"
                        className="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                    >
                        Login
                    </button>

                    <div className="text-center mt-6">
                        <p>
                            Don't Have An Account? <a href="#" className="text-blue-500 hover:underline">Register</a>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default InitialiseScreen;
