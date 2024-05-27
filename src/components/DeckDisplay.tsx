import React, { useState } from 'react';
import settings_img from '../assets/settings.png'
import plus_img from '../assets/plus.png'
import { useNavigate } from 'react-router-dom';

interface Card {
    id: string;
    deck_id: string;
    status: string;
    ease: number;
    interval: number;
    due_in: number;
    fails: number;
}

interface Deck {
    id: string;
    name: string;
    user_id: string;
    new_cards_per_day: number;
    cards: Card[];
}

interface DeckCardProps {
    deck: Deck;
}

const DeckCard: React.FC<DeckCardProps> = ({ deck }) => {

    const navigate = useNavigate();

    const getNew = (deck: Deck) => {
        return deck.cards.filter(card => card.status === 'new').length;
    }

    const getLearn = (deck : Deck) => {
        return deck.cards.filter(card => card.status === 'learn' || card.status === 'relearn').length;
    }

    const getDue = (deck : Deck) => {
        return deck.cards.filter(card => card.status === 'due' && card.due_in === 0).length;
    }

    const handlePlusButtonClick = () => {
        navigate(`/add-card/${deck.id}`);
    };

    return (
        <div className="px-6 py-4 mb-4 rounded-lg theme-blue-light">
            <div className="grid grid-cols-2">
                <p>{deck.name}</p>
                <div className="flex justify-end translate-y-1">
                    <img src={plus_img} className="h-5 w-5 opacity-50 hover:cursor-pointer" onClick={handlePlusButtonClick}/>
                    <img src={settings_img} className="h-5 w-5 ml-2 opacity-60 hover:cursor-pointer" />
                </div>
            </div>
            <div className="grid grid-cols-2 mt-1">
                <div className="flex">
                    <p className="text-gray-600 text-xs mr-8">New: {getNew(deck)}</p>
                    <p className="text-gray-600 text-xs mr-8">Learn: {getLearn(deck)}</p>
                    <p className="text-gray-600 text-xs">Due: {getDue(deck)}</p>
                </div>
                <div className="flex justify-end">
                    <p className="text-gray-600 text-xs">Total cards: {deck.cards.length}</p>
                </div>
            </div>
        </div>
    );
};

export default DeckCard;