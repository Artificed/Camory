import home_bg from './assets/home_bg.png'
import Button from './components/Button';
import { useNavigate } from "react-router-dom";
import logo from './assets/logo_big.png';
import flag_idn from './assets/icon_Indonesia.png'
import flag_chn from './assets/icon_China.png'
import flag_gmn from './assets/icon_Germany.png'
import flag_kor from './assets/icon_Korea.png'
import flag_fra from './assets/icon_France.png'
import flag_usa from './assets/icon_UnitedStates.png'
import flag_uk from './assets/icon_UnitedKingdom.png'
import flag_jp from './assets/icon_Japan.png'

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
            <img src={logo} className="w-2/5 z-10" alt="" />
            <span className="text-lg -translate-y-7">Flash Cards for Language Learning</span>
            <div className="flex z-10">
                <Button text='Login' className='mx-4 my-4 bright-red w-32 h-10 text-base hover:bg-[#edaa92]' onclick={handleLoginButton}/>
                <Button text='Sign Up' className='mx-4 my-4 bright-red w-32 h-10 text-base hover:bg-[#edaa92]' onclick={handleRegisterButton}/>
            </div>
        </div>
    );
}

export default LandingPage;