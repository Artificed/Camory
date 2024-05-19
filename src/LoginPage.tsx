import { useState } from 'react'; // Import useState hook
import { invoke } from "@tauri-apps/api";
import { useNavigate } from "react-router-dom";
import Navbar from './components/navbar'
import Button from './components/button';

function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState(""); 
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!username || !password) {
            setErrorMessage("Please fill all the fields!");
            return;
        }

        let isLoginSuccessful = false;

        isLoginSuccessful = await invoke('login', { username, password });

        if (isLoginSuccessful) {
            navigate("/home");
        } else {
            setErrorMessage("Invalid username or password.");
        }
    };

    return (
        <div className="h-screen flex flex-col items-center justify-center">
            <Navbar />
            <form onSubmit={handleSubmit} className='theme-brown-light w-2/5 h-3/5 border border-gray-400 flex flex-col items-center rounded-2xl p-8'>
                <p className="text-2xl mt-4">Login</p>
                <input type="text" name="username" value={username} className="mt-8 p-2 w-5/6 rounded-lg border-b-2" onChange={(e) => setUsername(e.target.value)} placeholder="Username"/>
                <input type="password" name="password" value={password} className="mt-8 w-5/6 p-2 rounded-lg border-b-2" onChange={(e) => setPassword(e.target.value)} placeholder="Password"/>
                {errorMessage && <p className="text-red-500 mt-2">{errorMessage}</p>}
                <Button text="Login" className="theme-brown-dark mt-10 lg:mt-24" />
            </form>
        </div>
    );
}

export default LoginPage;