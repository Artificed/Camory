import { useNavigate, useParams } from "react-router-dom";
import Navbar from "./components/Navbar";
import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api";
import CardDisplay from "./components/CardDisplay"

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
    const navigate = useNavigate();
    const [deck, setDeck] = useState<Deck>();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showFront, setShowFront] = useState(true);

    const [newCards, setNewCards] = useState<Card[]>([]);
    const [learningCards, setLearningCards] = useState<Card[]>([]);
    const [relearningCards, setRelearningCards] = useState<Card[]>([]);
    const [dueCards, setDueCards] = useState<Card[]>([]);

    const [cardList, setCardList] = useState<Card[]>([]);

    useEffect(() => {
        const fetchDeck = async () => {
            try {
                const result = await invoke<Deck>("get_deck_by_id", { deckId: params.deck_id });
                setDeck(result);
                setNewCards(result.cards.filter(card => card.status === 'new'));
                setLearningCards(result.cards.filter(card => card.status === 'learning'));
                setRelearningCards(result.cards.filter(card => card.status === 'relearning'));
                setDueCards(result.cards.filter(card => card.status === 'due'));
            } catch (error) {
                console.error("Error retrieving deck:", error);
            }
        };
        fetchDeck();
    }, [params.deck_id]);

    const handleShowAnswer = () => {
        setShowFront(false);
    };

    const nextCard = (cards: Card[]) => {
        if (currentIndex < cards.length - 1) {
            setCurrentIndex(currentIndex + 1);
            setShowFront(true);
        } else {
            setCurrentIndex(0);
            setShowFront(true);
        }
    };

    const handleFail = async (cards: Card[]) => {
        try {
            if(cards[currentIndex].status === 'new' || cards[currentIndex].status === 'learning') {
                await invoke('fail_learning_card', { 
                    cardId: cards[currentIndex].id,
                });
            } else if(cards[currentIndex].status === 'due' || cards[currentIndex].status === 'relearning') {
                await invoke('fail_due_card', { 
                    cardId: cards[currentIndex].id,
                });
            }
        } catch (error) {
            console.error("Error retrieving decks:", error);
        }
        nextCard(cards);
    };

    const handlePass = async (cards: Card[]) => {
        try {
            if(cards[currentIndex].status === 'new') {
                await invoke('pass_new_card', { 
                    cardId: cards[currentIndex].id,
                }); 
            } else if (cards[currentIndex].status === 'learning') {
                await invoke('pass_learning_card', { 
                    cardId: cards[currentIndex].id,
                }); 
            } else if (cards[currentIndex].status === 'due') {
                await invoke('pass_due_card', { 
                    cardId: cards[currentIndex].id,
                }); 
            } else if (cards[currentIndex].status === 'relearning') {
                await invoke('pass_relearning_card', { 
                    cardId: cards[currentIndex].id,
                }); 
            }
        } catch (error) {
            console.error("Error retrieving decks:", error);
        }
        nextCard(cards);
    };

    const currentCardSet = dueCards;

    return (
        <div>
            <Navbar />
            <div>
                {currentCardSet.length > 0 && (
                    <CardDisplay
                        card={currentCardSet[currentIndex]}
                        onShowAnswer={handleShowAnswer}
                        onPass={() => handlePass(currentCardSet)}
                        onFail={() => handleFail(currentCardSet)}
                        showFront={showFront}
                    />
                )}
            </div>
        </div>
    );
}

export default LearningPage;