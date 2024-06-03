import { useEffect, useState } from 'react';
import { invoke } from '@tauri-apps/api';
import { useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Button from './components/Button';
import DeckDisplay from './components/DeckDisplay';

interface Deck {
    id: string;
    name: string;
    user_id: string;
    new_cards_per_day: number;
    cards: Card[];
}

interface Card {
    id: string;
    deck_id: string;
    status: string;
    ease: number;
    fails: number;
    streak: number;
    review_time: Date;
    due: Date;
    content?: CardContent;
}

interface CardContent {
    card_id: string;
    vocabulary: string;
    clue: string;
    asset: string;
    definition: string;
    description: string;
}

interface User {
    id: string;
    email: string;
    password: string;
    username: string;
}

function HomePage() {
    const navigate = useNavigate();
    const [user, setUser] = useState<User | null>(null);
    const [decks, setDecks] = useState<Deck[]>([]);

    useEffect(() => {
        const fetchCurrentUser = async () => {
            try {
                const result = await invoke<User | null>("get_current_user");
                if (result) {
                    setUser(result);
                    fetchDecks(result.id);
                } else {
                    navigate('/login');
                }
            } catch (error) {
                console.error("Error retrieving current user:", error);
                navigate('/login');
            }
        };

        const fetchDecks = async (userId: string) => {
            try {
                const result = await invoke<Deck[]>("get_decks", { userId });
                setDecks(result);
            } catch (error) {
                console.error("Error retrieving decks:", error);
            }
        };

        fetchCurrentUser();
    }, [navigate]);

    const handleCreateDeckClick = () => {
        navigate("/create-deck")
    }

    return (
        <div>
            <Navbar />
            <div className="mt-16 flex flex-col items-center hide-scrollbar">
                <form action="" className="flex justify-center w-5/6">
                    <input type="text" name="" id="" className="theme-brown-medium rounded-lg w-2/3 h-12 mt-10 mr-3 p-3" placeholder="Enter Deck Name"/>
                    <Button text="Search" className="p-3 bright-red w-24 mt-10 ml-3 text-sm border-none"/>
                </form>
                <div className="flex justify-start w-5/6 my-5">
                    <Button text="+ Create Deck" className="w-36 h-8 text-xs theme-green" onclick={handleCreateDeckClick}/>
                </div>
                {user ? (
                    <div className="w-5/6">
                        {decks.map((deck) => (
                            <div key={deck.id}>
                                <DeckDisplay deck={deck}/>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div>Error</div>
                )}
            </div>
        </div>
    );
}

export default HomePage;