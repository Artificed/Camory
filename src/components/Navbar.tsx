import hamburger from '../assets/hamburger.png';
import logo from '../assets/logo.png';
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { AiFillHome }  from 'react-icons/ai';
import { CgProfile } from "react-icons/cg";
import { IoIosLogOut } from "react-icons/io";

function Navbar() {
    const [sidebar, setSidebar] = useState(false);

    const navigate = useNavigate()

    const handleLogoClick = () => {
        navigate('/home');
    }

    const showSideBar = () => setSidebar(!sidebar);

    return (
        <div className="h-16 top-0 p-3 w-screen theme-brown-light flex items-center fixed">
            <img src={hamburger} className="h-6 w-6 hover:cursor-pointer hover:bg-slate-100" onClick={showSideBar}/>
            <div className={sidebar ? "" : "collapse absolute"}>
                <ul className="text-sm mt-6 hidden md:block hover:cursor-pointer" id="menu">
                    <li className="text-gray-700 font-bold py-1 hover:bg-slate-100">
                        <a className="block px-4 flex justify-end" onClick={() => navigate('/home')}>
                        <span>Home</span>
                        <AiFillHome className="w-5 ml-2 size-5"/>
                        </a>
                    </li>
                    <li className="py-1 hover:cursor-pointer hover:bg-slate-100">
                        <a className="block px-4 flex justify-end" onClick={() => navigate('/profile')}>
                        <span>Profile</span>
                        <CgProfile className="w-5 ml-2 size-5"/>
                        </a>
                    </li>
                    <li className="py-1 hover:cursor-pointer hover:bg-slate-100">
                        <a className="block px-4 flex justify-end" onClick={() => navigate('/')}>
                        <span>Logout</span>
                        <IoIosLogOut className="w-5 ml-2 size-5"/>
                        </a>
                    </li>
                </ul>
            </div>
            <div>
                <img src={logo} className="h-12 w-30 hover:cursor-pointer" onClick={handleLogoClick}/>
            </div>
        </div>
    );
}

export default Navbar;