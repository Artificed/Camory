import logo from '../assets/logo.png';
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import NavItem from './NavItem';

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
            setWrapperClass("block bg-black bg-opacity-50");
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
        navigate("/");
    };

    const handleGameMenuClick = () => {
        navigate("/gamemenu");
    }

    return (
        <div className="h-16 top-0 p-3 w-screen bg-[#FAF6EE] flex items-center fixed">
            <div className="burgerMenu flex flex-col items-center justify-evenly h-9 w-9 m-1.5 cursor-pointer z-50" onClick={updateMenu}>
                <div className={`burgerBar w-6 h-0.5 bg-black rounded transition-transform duration-500 ease-out ${burger_class === 'clicked' ? 'translate-y-2.5' : ''}`}></div>
                <div className="burgerBar w-6 h-0.5 bg-black rounded transition-transform duration-500 ease-out"></div>
                <div className={`burgerBar w-6 h-0.5 bg-black rounded transition-transform duration-500 ease-out ${burger_class === 'clicked' ? '-translate-y-2.5' : ''}`}></div>
            </div>
            <nav className={`menu fixed top-0 ${menu_class} w-[20vw] h-screen bg-gray-100 shadow-lg z-40 transition-all duration-700 ease-in-out`}>
                <ul className="text-left pt-16">
                    <NavItem 
                        icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-5 w-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" /></svg>}
                        label="Home" onClick={handleHomeClick}/>
                    <NavItem 
                        icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-5 w-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" /></svg>}
                        label="Profile" onClick={handleProfileClick}/>
                    <NavItem 
                        icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="h-5 w-5">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M14.25 6.087c0-.355.186-.676.401-.959.221-.29.349-.634.349-1.003 0-1.036-1.007-1.875-2.25-1.875s-2.25.84-2.25 1.875c0 .369.128.713.349 1.003.215.283.401.604.401.959v0a.64.64 0 0 1-.657.643 48.39 48.39 0 0 1-4.163-.3c.186 1.613.293 3.25.315 4.907a.656.656 0 0 1-.658.663v0c-.355 0-.676-.186-.959-.401a1.647 1.647 0 0 0-1.003-.349c-1.036 0-1.875 1.007-1.875 2.25s.84 2.25 1.875 2.25c.369 0 .713-.128 1.003-.349.283-.215.604-.401.959-.401v0c.31 0 .555.26.532.57a48.039 48.039 0 0 1-.642 5.056c1.518.19 3.058.309 4.616.354a.64.64 0 0 0 .657-.643v0c0-.355-.186-.676-.401-.959a1.647 1.647 0 0 1-.349-1.003c0-1.035 1.008-1.875 2.25-1.875 1.243 0 2.25.84 2.25 1.875 0 .369-.128.713-.349 1.003-.215.283-.4.604-.4.959v0c0 .333.277.599.61.58a48.1 48.1 0 0 0 5.427-.63 48.05 48.05 0 0 0 .582-4.717.532.532 0 0 0-.533-.57v0c-.355 0-.676.186-.959.401-.29.221-.634.349-1.003.349-1.035 0-1.875-1.007-1.875-2.25s.84-2.25 1.875-2.25c.37 0 .713.128 1.003.349.283.215.604.401.96.401v0a.656.656 0 0 0 .658-.663 48.422 48.422 0 0 0-.37-5.36c-1.886.342-3.81.574-5.766.689a.578.578 0 0 1-.61-.58v0Z" /></svg>}
                        label="Game" onClick={handleGameMenuClick}/>
                    <NavItem 
                        icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-5 w-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15" /></svg>}
                        label="Logout" onClick={handleLogoutClick}/>
                </ul>
            </nav>
            <div className={`invisibleWrapper absolute w-screen h-screen top-0 right-0 ${invisible_wrapper}`} onClick={updateMenu}>
            </div>
            <div>
                <img src={logo} className="h-12 w-30 hover:cursor-pointer" onClick={handleLogoClick} />
            </div>
        </div>
    );
}

export default Navbar;