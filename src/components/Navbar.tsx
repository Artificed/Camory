import hamburger from '../assets/hamburger.png';
import logo from '../assets/logo.png';
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { CgProfile } from "react-icons/cg";
import { IoIosLogOut } from "react-icons/io";

function Navbar() {
    const [burger_class, setBurgerClass] = useState("unclicked");
    const [menu_class, setMenuClass] = useState("-left-[22vw]");
    const [invisible_wrapper, setWrapperClass] = useState("hidden");
    const [isMenuClicked, setIsMenuClicked] = useState(false);

    const navigate = useNavigate();

    const handleLogoClick = () => {
        navigate('/home');
    };

    const updateMenu = () => {
        if (!isMenuClicked) {
            setBurgerClass("clicked");
            setMenuClass("left-0");
            setWrapperClass("block");
        } else {
            setBurgerClass("unclicked");
            setMenuClass("-left-[22vw]");
            setWrapperClass("hidden");
        }
        setIsMenuClicked(!isMenuClicked);
    };

    const handleHomeClick = () => {
        navigate("/home");
    };

    const handleProfileClick = () => {
        navigate("/profile");
    };

    const handleLogoutClick = () => {
        navigate("/home");
    };

    return (
        <div className="h-16 top-0 p-3 w-screen bg-[#FAF6EE] flex items-center fixed">
            <div className="burgerMenu flex flex-col items-center justify-evenly h-9 w-9 m-1.5 cursor-pointer z-50" onClick={updateMenu}>
                <div className={`burgerBar w-6 h-0.5 bg-black rounded transition-transform duration-500 ease-out ${burger_class === 'clicked' ? 'translate-y-2.5' : ''}`}></div>
                <div className="burgerBar w-6 h-0.5 bg-black rounded transition-transform duration-500 ease-out"></div>
                <div className={`burgerBar w-6 h-0.5 bg-black rounded transition-transform duration-500 ease-out ${burger_class === 'clicked' ? '-translate-y-2.5' : ''}`}></div>
            </div>
            <nav className={`menu fixed top-0 ${menu_class} w-[20vw] h-screen bg-gray-100 shadow-lg z-40 transition-all duration-700 ease-in-out`}>
                <ul className="text-left pt-16">
                <li className="flex items-center text-base p-4 my-2 mx-3.5 w-[86%] rounded-lg hover:bg-gray-200 transition-colors duration-2 cursor-pointer" onClick={handleHomeClick}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="h-5 w-5">
                            <path stroke-linecap="round" stroke-linejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                        </svg>
                        <span className="ml-3">Home</span>
                    </li>
                    <li className="flex items-center text-base p-4 my-2 mx-3.5 w-[86%] rounded-lg hover:bg-gray-200 transition-colors duration-300 cursor-pointer" onClick={handleProfileClick}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="h-5 w-5">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                        </svg>
                        <span className="ml-3">Profile</span>
                    </li>
                    <li className="flex items-center text-base p-4 my-2 mx-3.5 w-[86%] rounded-lg hover:bg-gray-200 transition-colors duration-300 cursor-pointer" onClick={handleLogoutClick}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="h-5 w-5">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15" />
                        </svg>
                        <span className="ml-3">Logout</span>
                    </li>
                </ul>
            </nav>
            <div className={`invisibleWrapper absolute w-[80vw] h-[100vw] top-0 right-0 ${invisible_wrapper}`} onClick={updateMenu}>
            </div>
            <div>
                <img src={logo} className="h-12 w-30 hover:cursor-pointer" onClick={handleLogoClick} />
            </div>
        </div>
    );
}

export default Navbar;