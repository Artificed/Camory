import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "./components/Button";
import Loading from "./components/Loading"
import WarningMessage from "./components/WarningMessage";
import logo from './assets/logo.png';
import { invoke } from '@tauri-apps/api';
import BackgroundFlag from './components/BackgroundFlag';

function RegisterPage() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false); 

    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();

    const handleLogoClick = () => {
        navigate('/');
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);

        if (!email || !username || !password || !confirmPassword) {
            setErrorMessage("Please fill all the fields!");
            setIsLoading(false);
            return;
        }

        if (password !== confirmPassword) {
            setErrorMessage("Passwords do not match!");
            setIsLoading(false);
            return;
        }

        try {
            await invoke('register', { email, password, username });
            setIsLoading(false);
            navigate("/");
        } catch (error) {
            setErrorMessage("Registration Failed!");
        }

        setIsLoading(false);
    };

    return (
        <div className="h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#faf6ee] to-[#ffeabf]">
            <BackgroundFlag />
            
            <img src={logo} onClick={handleLogoClick} className="hover:cursor-pointer z-10" />

            <form onSubmit={handleSubmit} 
                className='bg-white w-2/5
                    flex flex-col items-center rounded-2xl translate-y-5 h-fit'>

                <p className="text-3xl mt-10">Sign Up</p>

                <input
                    type="text"
                    name="username"
                    value={username}
                    className="mt-6 px-4 py-2 w-5/6 rounded-lg border-b-2 transition ease-linear duration-300 hover:bg-[#faf5ea] active:bg-[#faf5ea]"
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Username"
                />

                <input
                    type="email"
                    name="email"
                    value={email}
                    className="mt-6 px-4 py-2 w-5/6 rounded-lg border-b-2 transition ease-linear duration-300 hover:bg-[#faf5ea] active:bg-[#faf5ea]"
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                />

                <input
                    type="password"
                    name="password"
                    value={password}
                    className="mt-6 w-5/6 px-4 py-2 rounded-lg border-b-2 transition ease-linear duration-300 hover:bg-[#faf5ea] active:bg-[#faf5ea]"
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                />

                <input
                    type="password"
                    name="confirm_password"
                    value={confirmPassword}
                    className="mt-6 w-5/6 px-4 py-2 rounded-lg border-b-2 transition ease-linear duration-300 hover:bg-[#faf5ea] active:bg-[#faf5ea]"
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your password"
                />

                {errorMessage && <WarningMessage className="mt-4" errorMessage={errorMessage}></WarningMessage>}

                {!isLoading && <Button text="Register" className="bright-red mt-12 mb-14 text-red-800 hover:bg-[#edaa92]"/>}

                {isLoading && 
                <Loading className="mt-12 mb-14 text-red-800"></Loading>}
            </form>
        </div>
    );
}

export default RegisterPage;