import React, { useEffect, useState } from 'react';
import { invoke } from '@tauri-apps/api';
import { useNavigate } from 'react-router-dom';
import Navbar from './components/navbar';
import Button from './components/button';

interface Deck {
    id: string;
    name: string;
    user_id: string;
    cards: Card[];
}

interface Card {
    id: string;
    deck_id: string;
    status: string;
    ease: number;
    interval: number;
    fails: number;
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

    return (
        <div>
            <Navbar />
            <div className="mt-16">
                <form action="flex">
                    <input type="text" name="" id="" className="theme-brown-light w-20 h-10"/>
                    <Button text="Add Filter"/>
                </form>
                {user ? (
                    <div>
                        {decks.map((deck) => (
                            <li key={deck.id}>
                                <h2>{deck.name}</h2>
                                <h4>{deck.cards.length}</h4>
                            </li>
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