import { useEffect, useState } from 'react';
import { invoke } from '@tauri-apps/api';
import { useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Button from './components/Button';

interface User {
    id: string;
    email: string;
    password: string;
    username: string;
}

function ProfilePage() {
    const navigate = useNavigate();
    const [user, setUser] = useState<User | null>(null);

    const handleStatisticClick = () => {
        navigate('/statistic')
    }

    useEffect(() => {
        const fetchCurrentUser = async () => {
            try {
                const result = await invoke<User | null>("get_current_user");
                if (result) {
                    console.log(result);
                    setUser(result);
                } else {
                    navigate('/login');
                }
            } catch (error) {
                console.error("Error retrieving current user:", error);
                navigate('/login');
            }
        };
        fetchCurrentUser();
    }, [navigate]);

    return (
        <div>
            <Navbar />
            <div className="content">
                <div className="flex justify-start mb-6">
                    <h1 className="title">My Account</h1>
                </div>

                <div className="flex flex-col justify-center items-center">
                <div>
                    <img src="./src/assets/profile_picture.jpg" alt="" className='w-60 relative z-10 rounded-full object-cover'/>
                </div>
                <div className='rounded-xl border-2 border-gray-500 text-base p-8 pt-24 absolute top-72 w-80 z-0'>
                    <ul className="mb-8">
                        <li className="font-bold">Username</li>
                        {user && <li className="mb-4">{user.username}</li>}

                        <li className="font-bold">Email</li>
                        {user && <li className="mb-4">{user.email}</li>}
                    </ul>
                    <div className="flex justify-center">
                        <Button text="View Statistic" className="w-fit m-4 pl-5 pr-5 theme-blue text-xs" onclick={handleStatisticClick}></Button>
                    </div>
                </div>
            </div>
            </div>
            
        </div>
    );
}
 
export default ProfilePage;