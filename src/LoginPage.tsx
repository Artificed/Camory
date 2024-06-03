import { useState } from 'react'; // Import useState hook
import { invoke } from "@tauri-apps/api";
import { useNavigate } from "react-router-dom";
import Button from './components/Button';
import logo from './assets/logo.png';

function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState(""); 
    const navigate = useNavigate();

    const handleLogoClick = () => {
        navigate('/');
    }

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
        <div className="h-screen flex flex-col items-center justify-center -translate-y-5">

            <img src={logo} className='mb-5 hover:cursor-pointer' onClick={handleLogoClick}/>

            <form onSubmit={handleSubmit} 
                className='theme-brown-light w-2/5 h-1/2 border border-[#E3DAC7ff]
                flex flex-col items-center rounded-2xl p-8'>

                <p className="text-2xl mt-4">Login</p>

                <input type="text" name="username" value={username} className="mt-8 px-3 py-2 w-5/6 rounded-lg border-b-2 hover:bg-[#f3ecdf] active:bg-[#f3ecdf]" 
                onChange={(e) => setUsername(e.target.value)} placeholder="Username"/>

                <input type="password" name="password" value={password} className="mt-8 w-5/6 px-3 py-2 rounded-lg border-b-2 transition-colors hover:bg-[#f3ecdf] active:bg-[#f3ecdf]" 
                onChange={(e) => setPassword(e.target.value)} placeholder="Password"/>

                {errorMessage && <p className="text-red-500 absolute mt-56">{errorMessage}</p>}

                <Button text="Login" className="theme-brown-dark mt-16 hover:bg-[#deceac]" />
            </form>
        </div>
    );
}

export default LoginPage;