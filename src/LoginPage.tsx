import { useState } from 'react'; // Import useState hook
import { invoke } from "@tauri-apps/api";
import { useNavigate } from "react-router-dom";
import Button from './components/Button';
import logo from './assets/logo.png';
import flag_idn from './assets/icon_Indonesia.png'
import flag_chn from './assets/icon_China.png'
import flag_gmn from './assets/icon_Germany.png'
import flag_kor from './assets/icon_Korea.png'
import flag_fra from './assets/icon_France.png'
import flag_usa from './assets/icon_UnitedStates.png'
import flag_uk from './assets/icon_UnitedKingdom.png'
import flag_jp from './assets/icon_Japan.png'

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
        <div className="h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#faf6ee] to-[#ffeabf]">
            <ul className="indonesia">
                <img src={flag_idn} alt=""/>
                <img src={flag_chn} alt=""/>
                <img src={flag_gmn} alt=""/>
                <img src={flag_kor} alt=""/>
                <img src={flag_jp} alt=""/>
                <img src={flag_fra} alt=""/>
                <img src={flag_usa} alt=""/>
                <img src={flag_uk} alt=""/>
                <img src={flag_idn} alt=""/>
                <img src={flag_uk} alt=""/>
            </ul>

            <img src={logo} className='mb-4 hover:cursor-pointer z-10' onClick={handleLogoClick}/>

            <form onSubmit={handleSubmit} 
                className='bg-white w-2/5 h-fit
                flex flex-col items-center rounded-2xl p-8 z-10'>

                <p className="text-3xl mt-4 ">Login</p>

                <input type="text" name="username" value={username} className="mt-8 px-4 py-2 w-5/6 rounded-lg border-b-2 transition ease-linear duration-300 hover:bg-[#faf5ea] active:bg-[#faf5ea]" 
                onChange={(e) => setUsername(e.target.value)} placeholder="Username"/>

                <input type="password" name="password" value={password} className="mt-8 w-5/6 px-4 py-2 rounded-lg border-b-2 transition ease-linear duration-300 hover:bg-[#faf5ea] active:bg-[#faf5ea]" 
                onChange={(e) => setPassword(e.target.value)} placeholder="Password"/>

                {errorMessage && <p className="text-red-500 absolute mt-56">{errorMessage}</p>}

                <Button text="Login" className="bright-red mt-12 mb-12 hover:bg-[#edaa92]" />
            </form>
        </div>
    );
}

export default LoginPage;