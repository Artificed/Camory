import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from './components/Navbar';
import { invoke } from '@tauri-apps/api';
import CardDisplay from './components/CardDisplay';

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

function LearningPage() {
    
    const params = useParams();
    const [showFront, setShowFront] = useState(true);

    const [newCards, setNewCards] = useState<Card[]>([]);
    const [dueCards, setDueCards] = useState<Card[]>([]);
    const [redCards, setRedCards] = useState<Card[]>([]); // Learning + Relearning Cards

    const fetchDeck = async () => {
        try {
            const result = await invoke<Deck>("get_deck_by_id", { deckId: params.deck_id });
            const newCards = result.cards.filter(card => card.status === 'new');
            const learningCards = result.cards.filter(card => card.status === 'learning');
            const relearningCards = result.cards.filter(card => card.status === 'relearning');
            const dueCards = result.cards.filter(card => card.status === 'due' && new Date(card.due) < new Date());
            const redCards = learningCards.concat(relearningCards).sort((a, b) => new Date(a.due).getTime() - new Date(b.due).getTime());

            setNewCards(newCards);
            setDueCards(dueCards);
            setRedCards(redCards);
        } catch (error) {
            console.error("Error retrieving deck:", error);
        }
    };

    const handleShowAnswer = () => {
        setShowFront(false);
    };

    const nextCard = () => {
        setShowFront(true);
    };

    const handleFail = async (card: Card) => {
        try {
            if (card.status === 'new' || card.status === 'learning') {
                await invoke('fail_learning_card', { cardId: card.id });
            } else if (card.status === 'due' || card.status === 'relearning') {
                await invoke('fail_due_card', { cardId: card.id });
            }
            await fetchDeck(); // Wait for deck to be fetched
        } catch (error) {
            console.error("Error updating card:", error);
        }
        nextCard();
    };

    const handlePass = async (card: Card) => {
        try {
            if (card.status === 'new') {
                await invoke('pass_new_card', { cardId: card.id });
            } else if (card.status === 'learning') {
                await invoke('pass_learning_card', { cardId: card.id });
            } else if (card.status === 'due') {
                await invoke('pass_due_card', { cardId: card.id });
            } else if (card.status === 'relearning') {
                await invoke('pass_relearning_card', { cardId: card.id });
            }
            await fetchDeck(); // Wait for deck to be fetched
        } catch (error) {
            console.error("Error updating card:", error);
        }
        nextCard();
    };

    const getCurrentCardSet = (): Card[] => {
        if (dueCards.length > 0) {
            return dueCards;
        } else if (newCards.length > 0) {
            return newCards;
        } else if (redCards.length > 0) {
            return redCards;
        }
        return [];
    };

    const currentCardSet = getCurrentCardSet();
    const currentCard = currentCardSet[0];

    useEffect(() => {
        fetchDeck();
    }, [params.deck_id]);

    return (
        <div>
            <Navbar />
            <div>
                {currentCard ? (
                    <CardDisplay 
                        card={currentCard} 
                        onShowAnswer={handleShowAnswer} 
                        showFront={showFront}
                        onPass={() => handlePass(currentCard)} 
                        onFail={() => handleFail(currentCard)} 
                    />
                ) : (
                    <div className="flex flex-col items-center justify-center h-screen">
                        <p className="text-4xl">No Cards To Learn!</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default LearningPage;
