import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./components/navbar";
import Button from "./components/button";
import { invoke } from '@tauri-apps/api';

function RegisterPage() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!email || !username || !password || !confirmPassword) {
            setErrorMessage("Please fill all the fields!");
            return;
        }

        if (password !== confirmPassword) {
            setErrorMessage("Passwords do not match!");
            return;
        }

        try {
            await invoke('register', { email, password, username });
            navigate("/");
        } catch (error) {
            setErrorMessage("Registration Failed!");
        }
    };

    return (
        <div className="h-screen flex flex-col items-center justify-center">
            <Navbar />
            <form onSubmit={handleSubmit} className='theme-brown-light w-2/5 h-2/3 border border-gray-400 flex flex-col items-center rounded-2xl translate-y-5'>
                <p className="text-2xl mt-4">Register</p>

                <input
                    type="text"
                    name="username"
                    value={username}
                    className="mt-5 p-2 w-5/6 rounded-lg border-b-2"
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Username"
                />

                <input
                    type="email"
                    name="email"
                    value={email}
                    className="mt-5 p-2 w-5/6 rounded-lg border-b-2"
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                />

                <input
                    type="password"
                    name="password"
                    value={password}
                    className="mt-5 w-5/6 p-2 rounded-lg border-b-2"
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                />

                <input
                    type="password"
                    name="confirm_password"
                    value={confirmPassword}
                    className="mt-5 w-5/6 p-2 rounded-lg border-b-2"
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm Your Password"
                />

                {errorMessage && <p className="text-red-500 mt-2">{errorMessage}</p>}
                <Button text="Register" className="theme-brown-dark mt-5 h-9 lg:mt-16" />
            </form>
        </div>
    );
}

export default RegisterPage;