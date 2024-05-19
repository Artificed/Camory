import home_bg from './assets/home_bg.png'
import Navbar from './components/Navbar';
import Button from './components/Button';
import { useNavigate } from "react-router-dom";

function LandingPage() {
    const navigate = useNavigate();

    const handleLoginButton = () => {
        navigate('/login');
    }

    const handleRegisterButton = () => {
        navigate('/register');
    }

    return (
        <div className="h-screen flex flex-col items-center justify-center" style={{backgroundImage: `url(${home_bg})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat'}}>
            <Navbar/>
            <div className="flex translate-y-24">
                <Button text='Login' className='m-4 bright-red w-32 h-10 text-base' onclick={handleLoginButton}/>
                <Button text='Sign Up' className='m-4 bright-red w-32 h-10 text-base' onclick={handleRegisterButton}/>
            </div>
        </div>
    );
}

export default LandingPage;