import { useState } from 'react'; // Import useState hook
import { invoke } from "@tauri-apps/api";
import { useNavigate } from "react-router-dom";
import Button from './components/Button';
import Loading from './components/Loading';
import WarningMessage from './components/WarningMessage';
import logo from './assets/logo.png';
import BackgroundFlag from './components/BackgroundFlag';
import BackButton from './components/BackButton';

function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState(""); 
    const [isLoading, setIsLoading] = useState(false); 
    const navigate = useNavigate();

    const navigateToLanding = () => {
        navigate('/');
    }

    const navigateToRegister = () => {
        navigate('/register')
    }
    
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        if (!username || !password) {
            setErrorMessage("Please fill all the fields!");
            setIsLoading(false);
            return;
        }

        let isLoginSuccessful = false;

        isLoginSuccessful = await invoke('login', { username, password });

        if (isLoginSuccessful) {
            navigate("/home");
        } else {
            setErrorMessage("Invalid username or password.");
        }

        setIsLoading(false);
    };

    return (
        <div className="h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#faf6ee] to-[#ffeabf]">
            <BackgroundFlag />

            <img src={logo} className='mb-4 hover:cursor-pointer z-10' onClick={navigateToLanding}/>

            <form onSubmit={handleSubmit} 
                className='bg-white w-2/5 h-auto mb-4
                flex flex-col items-center rounded-2xl p-8 pb-2 z-10'>

                <p className="text-3xl mt-4 ">Login</p>

                <input type="text" name="username" value={username} className="mt-8 px-4 py-2 w-5/6 rounded-lg border-b-2 transition ease-linear duration-300 hover:bg-[#faf5ea] active:bg-[#faf5ea]" 
                onChange={(e) => setUsername(e.target.value)} placeholder="Username"/>

                <input type="password" name="password" value={password} className="mt-8 w-5/6 px-4 py-2 rounded-lg border-b-2 transition ease-linear duration-300 hover:bg-[#faf5ea] active:bg-[#faf5ea]" 
                onChange={(e) => setPassword(e.target.value)} placeholder="Password"/>

                {errorMessage && <WarningMessage className="mt-4" errorMessage={errorMessage}></WarningMessage>}

                {!isLoading && <Button text="Login" className="bright-red mt-8 mb-4 text-red-800 hover:bg-[#edaa92]"/>}

                {isLoading && 
                <Loading className="mt-12 mb-4 text-red-800"></Loading>}

                <div className="flex flex-row gap-x-1 mb-8 text-sm">
                    Doesn't have an account yet?
                    <a 
                    className="text-blue-500 hover:text-blue-700 underline hover:no-underline font-medium cursor-pointer" 
                    onClick={navigateToRegister}>
                        Register here
                    </a>
                </div>

            </form>

            <BackButton 
            className='z-50 flex mt-0 items-start justify-left w-1/2 px-5 py-2 text-sm text-gray-700 transition-colors duration-200 bg-white border rounded-lg gap-x-2 sm:w-auto dark:hover:bg-gray-800 dark:bg-gray-900 hover:bg-gray-100 dark:text-gray-200 dark:border-gray-700'
            onclick={navigateToLanding} />
        </div>
    );
}

export default LoginPage;