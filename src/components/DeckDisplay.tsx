import React from 'react';

interface Card {
    id: string;
    deck_id: string;
    status: string;
    ease: number;
    interval: number;
    fails: number;
}

interface Deck {
    name: string;
    user_id: string;
    cards: Card[];
}

interface DeckCardProps {
    deck: Deck;
}

const DeckCard: React.FC<DeckCardProps> = ({ deck }) => {
    return (
        <div className="w-3/4 p-4 m-2 border border-gray-300 rounded-lg">
            <h2 className="text-xl font-bold">{deck.name}</h2>
            <p className="text-gray-600">Number of cards: {deck.cards.length}</p>
        </div>
    );
};

export default DeckCard;