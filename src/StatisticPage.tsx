import { useEffect, useState } from 'react';
import { invoke } from '@tauri-apps/api';
import { useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Button from './components/Button';
import User from './models/User';

function ProfilePage() {
    const navigate = useNavigate();
    const [user, setUser] = useState<User | null>(null);

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

    // Generate 30 days, the value 30 can be changed later by passing a varibale
    const generateDayBox = () => {
        const boxes = [];
        for(let i=0; i < 35; i++){
            boxes.push(<div className="dayBox"></div>)
        }
        return boxes;
    }

    // Generate 5 months, the value 5 can be changed later by passing a variable
    const generateMonthBox = () => {
        const boxes = [];
        const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
        for(let i=0; i < months.length; i++){
            boxes.push(
            <div>
                <h3 className="mb-1">{months[i]}</h3>
                <div className="grid grid-flow-col grid-rows-7 gap-1 justify-start">
                    {generateDayBox()}
                </div>
            </div>
            )
        }
        return boxes;
    }

    const handleProfileClick = () => {
        navigate("/profile")
    }

    return (
        <div>
            <Navbar />
            <div className="content">
                <div className="flex justify-start mb-6 mt-4">
                    <h1 className="title">Statistic</h1>
                </div>
                <div className="grid grid-cols-3 mt-4 mb-4 gap-4">
                    <div className="col-span-2 p-6 pt-10 shadow-md border-2 border-slate-400 rounded-md flex flex-col justify-center">
                        <img src="./src/assets/graph_example.png" alt="Review Graph" className='h-48 object-fill border-b-2 border-slate-300'/>
                        <p className='text-center mt-2'>Review Interval</p>
                    </div>
                    <div className="p-6 text-sm">
                        <ul>
                            <h3 className="mb-2 font-semibold">Card Statistics</h3>
                            <li className="mb-1">
                                <div className="w-3 h-3 bg-[#FBC1B9] inline-block mr-2"></div>
                                <div className="inline-block">New: </div>
                            </li>
                            <li className="mb-1">
                                <div className="w-3 h-3 bg-[#FFE2B1] inline-block mr-2"></div>
                                <div className="inline-block">Learning: </div>
                            </li>
                            <li className="mb-1">
                                <div className="w-3 h-3 bg-[#CCF4B3] inline-block mr-2"></div>
                                <div className="inline-block">Young: </div>
                            </li>
                            <li className="mb-1">
                                <div className="w-3 h-3 bg-[#8BFF44] inline-block mr-2"></div>
                                <div className="inline-block">Mature: </div>
                            </li>
                            <li className="mb-1">
                                <div className="w-3 h-3 bg-[#49F7F7] inline-block mr-2"></div>
                                <div className="inline-block">Relearning: </div>
                            </li>
                            <li className="mb-1">
                                <div className="w-3 h-3 bg-[#BCBCBC] inline-block mr-2"></div>
                                <div className="inline-block">Total: </div>
                            </li>
                        </ul>
                    </div>
                </div>  


                <h2 className="text-lg mb-2 mt-6">Activity</h2>
                <div className="flex flex-row text-xs text-gray-500">
                    <div className="text-right">
                        <div className="text-xs mt-4 mr-1.5">Sun</div>
                        <div className="text-xs mt-5 mr-1.5">Tue</div>
                        <div className="text-xs mt-4 mr-1.5">Thur</div>
                        <div className="text-xs mt-5 mr-1.5">Sat</div>
                    </div>
                    <div className="grid grid-cols-12 grow">
                        {generateMonthBox()}
                    </div>
                </div>
                
                <Button text="Back" className="mt-8 bg-[#B9F1FF] hover:bg-[#a1e1f1]" onclick={handleProfileClick}></Button>
                
            </div>

        </div>
    );
}
 
export default ProfilePage;