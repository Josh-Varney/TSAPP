import React from "react";
import { FaUser, FaLock } from "react-icons/fa";

const LoginForm = () => {
    return (
        <div className="" id="wrapper">
            <form action="">
                <div className="text-3xl"> LoginForm </div>
                <div id="input-box">
                    <input type="text" placeholder="Username" required/> 
                    <FaUser className="icon"/>
                </div>
                <div id="input-box">
                    <input type="text" placeholder="Password" required/> 
                    <FaLock className="icon" />
                </div>
                <div id="remember-forget">
                    <label><input type="checkbox" />Remember Me</label>
                    <a href="#">Forgot Password?</a>
                </div>

                <button type="submit">Login</button>

                <div className="register-link>">
                    <p>Don't Have An Account?<a href="#">Register</a></p>
                </div>
                </form>
        </div>
    );
};

export default LoginForm;