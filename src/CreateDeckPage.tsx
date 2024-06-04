import React, { useEffect, useState } from 'react';
import { invoke } from '@tauri-apps/api';
import { useNavigate } from 'react-router-dom';
import logo from './assets/logo_big.png';
import Button from './components/Button';
import create_deck from './assets/create_deck.png';

interface User {
    id: string;
    email: string;
    password: string;
    username: string;
}

function CreateDeckPage() {

    const navigate = useNavigate();
    const [deckName, setDeckName] = useState("");
    const [user, setUser] = useState<User | null>(null);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        const fetchCurrentUser = async () => {
            try {
                const result = await invoke<User | null>("get_current_user");
                if (result) {
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

    const handleLogoClick = () => {
        navigate('/home');
    }

    const handleCancel = () => {
        navigate('/home');
    }
    
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!deckName) {
            setErrorMessage("Deck Name cannot be empty!");
            return;
        }
        try {
            await invoke('create_deck', { deckName });
        } catch (error) {
            setErrorMessage("Create Deck Failed!");
            console.error("Create Deck Error:", error);
        }
        navigate('/home');
    };    

    return (
        <div className="theme-brown-light h-screen flex flex-col items-center justify-center">
            <div className="flex items-center">
                <img src={logo} className="h-36 mr-3 hover:cursor-pointer" onClick={handleLogoClick}/>
                <form onSubmit={handleSubmit} className="flex flex-col items-center justify-center ml-3">
                    <input type="text" value={deckName} className="p-4 w-72 text-lg text-blue-950 rounded-xl border transition-colors hover:bg-slate-100 active:bg-slate-100" 
                    onChange={(e) => setDeckName(e.target.value)} placeholder="Your deck name"/>
                    <div className="flex justify-start w-72 translate-x-1">
                        {errorMessage && <p className="text-red-500 mt-2 text-sm">{errorMessage}</p>}
                    </div>
                    <img src={create_deck} className="w-96 my-8"/>
                    <div className="flex flex-row">
                        <Button text="Publish" className="theme-blue mx-2 transition-colors hover:bg-[#9adff0] hover:shadow-md"/>
                        <Button text="Cancel" className="bright-red mx-2 transition-colors hover:bg-[#edaa92] hover:shadow-md" onclick={handleCancel}/>
                    </div>
                </form>
            </div>
        </div>
    );

}

export default CreateDeckPage;