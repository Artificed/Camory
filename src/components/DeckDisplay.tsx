import React from 'react';

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
    name: string;
    user_id: string;
    new_cards_per_day: number;
    cards: Card[];
}

interface DeckCardProps {
    deck: Deck;
}

const DeckCard: React.FC<DeckCardProps> = ({ deck }) => {

    const getNew = (deck: Deck) => {
        return deck.cards.filter(card => card.status === 'new').length;
    }

    const getLearn = (deck : Deck) => {
        return deck.cards.filter(card => card.status === 'learn' || card.status === 'relearn').length;
    }

    const getDue = (deck : Deck) => {
        return deck.cards.filter(card => card.status === 'due' && card.due_in === 0).length;
    }

    return (
        <div className="px-6 py-4 mb-4 rounded-lg theme-blue-light">
            <p>{deck.name}</p>
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