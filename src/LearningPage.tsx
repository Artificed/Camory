import { useNavigate, useParams } from "react-router-dom";
import Navbar from "./components/Navbar";
import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api";
import CardFront from "./components/CardFront";
import CardBack from "./components/CardBack";
import Button from "./components/Button";

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
    interval: number;
    due_in: number; 
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

function LearningPage() {

    const params = useParams();
    const navigate = useNavigate();
    const [deck, setDeck] = useState<Deck>();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showFront, setShowFront] = useState(true);
    
    useEffect(() => {
        const fetchDeck = async () => {
            try {
                const result = await invoke<Deck>("get_deck_by_id", { deckId: params.deck_id });
                setDeck(result);
            } catch (error) {
                console.error("Error retrieving decks:", error);
            }
        };
        fetchDeck();
    }, [params.deck_id]);

    const getNewCards = (deck: Deck) => {
        return deck.cards.filter(card => card.status === 'new');
    }

    const getLearningCards = (deck : Deck) => {
        return deck.cards.filter(card => card.status === 'learn' || card.status === 'relearn');
    }

    const getDueCards = (deck : Deck) => {
        return deck.cards.filter(card => card.status === 'due' && card.due_in === 0);
    }

    const handleShowAnswer = () => {
        setShowFront(false);
    };

    const nextCard = () => {
        if (deck && currentIndex < deck.cards.length - 1) {
            setCurrentIndex(currentIndex + 1);
            setShowFront(true);
        }
    };

    const handleFail = () => {
        // Fail Logic Here
        nextCard()
    }

    const handlePass = () => {
        // Pass Logic Here
        nextCard()
    }

    return (
        <div className="">
            <Navbar />
            <div className="">
                {deck && deck.cards.length > 0 && (
                    <>
                        {showFront ? (
                            <CardFront
                                vocabulary={deck.cards[currentIndex].content?.vocabulary}
                                clue={deck.cards[currentIndex].content?.clue}
                                onShowAnswer={handleShowAnswer}
                            />
                        ) : (
                            <CardBack
                                vocabulary={deck.cards[currentIndex].content?.vocabulary}
                                clue={deck.cards[currentIndex].content?.clue}
                                asset={deck.cards[currentIndex].content?.asset}
                                definition={deck.cards[currentIndex].content?.definition}
                                description={deck.cards[currentIndex].content?.description}
                                onPass={handlePass}
                                onFail={handleFail}
                            />
                        )}
                    </>
                )}
            </div>
        </div>
    );

}

export default LearningPage;