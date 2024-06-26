import React from 'react';
import settings_img from '../assets/settings.png'
import plus_img from '../assets/plus.png'
import { useNavigate } from 'react-router-dom';
import Deck from '../models/Deck';

interface DeckCardProps {
    deck: Deck;
}

const DeckCard: React.FC<DeckCardProps> = ({ deck }) => {

    const navigate = useNavigate();

    const getNewCount = (deck: Deck) => {
        return deck.cards.filter(card => card.status === 'new').length;
    }

    const getLearnCount = (deck : Deck) => {
        return deck.cards.filter(card => card.status === 'learning').length;
    }

    const getRelearningCount = (deck : Deck) => {
        return deck.cards.filter(card => card.status === 'relearning').length;
    }

    const getDueCount = (deck : Deck) => {
        return deck.cards.filter(card => card.status === 'due' && new Date(card.due) < new Date()).length;
    }

    const getSuspendedCount = (deck : Deck) => {
        return deck.cards.filter(card => card.status === 'suspended').length;
    }

    const handlePlusButtonClick = (event: React.MouseEvent<HTMLImageElement>) => {
        event.stopPropagation();
        navigate(`/add-card/${deck.id}`);
    };
    
    const handleDeckClick = () => {
        navigate(`/learn/${deck.id}`);
    };
    
    return (
        <div className="px-6 py-4 mb-4 rounded-lg theme-blue-light transition-transform hover:scale-[1.005] hover:shadow-md" onClick={handleDeckClick}>
            <div className="grid grid-cols-2">
                <p>{deck.name}</p>
                <div className="flex justify-end translate-y-1">
                    <img src={plus_img} className="h-5 w-5 opacity-50 hover:cursor-pointer" onClick={handlePlusButtonClick}/>
                    <img src={settings_img} className="h-5 w-5 ml-2 opacity-60 hover:cursor-pointer" onClick={(event) => event.stopPropagation()} />
                </div>
            </div>
            <div className="grid grid-cols-2 mt-1">
                <div className="flex">
                    <p className="text-gray-600 text-xs mr-8">New: {getNewCount(deck)}</p>
                    <p className="text-gray-600 text-xs mr-8">Learning: {getLearnCount(deck)}</p>
                    <p className="text-gray-600 text-xs mr-8">Relearning: {getRelearningCount(deck)}</p>
                    <p className="text-gray-600 text-xs mr-8">Due: {getDueCount(deck)}</p>
                    <p className="text-gray-600 text-xs">Suspended: {getSuspendedCount(deck)}</p>
                </div>
                <div className="flex justify-end">
                    <p className="text-gray-600 text-xs">Total cards: {deck.cards.length}</p>
                </div>
            </div>
        </div>
    );
};

export default DeckCard;