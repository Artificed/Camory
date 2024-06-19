import Button from './components/Button';
import { useNavigate } from "react-router-dom";
import logo from './assets/logo_big.png';
import BackgroundFlag from './components/BackgroundFlag';

function LandingPage() {
    const navigate = useNavigate();

    const handleLoginButton = () => {
        navigate('/login');
    }

    const handleRegisterButton = () => {
        navigate('/register');
    }

    return (
        <div className="h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#faf6ee] to-[#ffeabf]">
            <BackgroundFlag />
            <img src={logo} className="w-2/5 z-10" alt="" />
            <span className="text-lg -translate-y-7">Flash Cards for Language Learning</span>
            <div className="flex z-10">
                <Button text='Login' className='mx-4 my-4 bright-red w-32 h-10 text-base text-red-800 hover:bg-[#edaa92]' onclick={handleLoginButton}/>
                <Button text='Sign Up' className='mx-4 my-4 bright-red w-32 h-10 text-base text-red-800 hover:bg-[#edaa92]' onclick={handleRegisterButton}/>
            </div>
        </div>
    );
}

export default LandingPage;