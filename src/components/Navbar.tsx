import hamburger from '../assets/hamburger.png'
import logo from '../assets/logo.png'
import { useNavigate } from "react-router-dom";

function Navbar() {

    const navigate = useNavigate()

    const handleLogoClick = () => {
        navigate('/');
    }

    return (
        <div className="h-16 top-0 p-3 w-screen theme-brown-light flex items-center fixed">
            <img src={hamburger} className="h-6 w-6" />
            <img src={logo} className="h-12 w-30" onClick={handleLogoClick}/>
        </div>
    );
}

export default Navbar;