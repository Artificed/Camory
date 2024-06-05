import React from 'react';

interface NavItemProps {
    icon: React.ReactNode;
    label: string;
    onClick: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, onClick }) => {
    return (
        <li className="flex items-center text-base p-4 my-2 mx-3.5 w-[86%] rounded-lg hover:bg-gray-200 transition-colors duration-200 cursor-pointer" onClick={onClick}>
            {icon}
            <span className="ml-3">{label}</span>
        </li>
    );
};

export default NavItem;