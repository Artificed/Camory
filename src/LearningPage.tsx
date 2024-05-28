import { useNavigate, useParams } from "react-router-dom";
import Navbar from "./components/Navbar";
import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api";
import CardFront from "./components/CardFront";
import CardBack from "./components/CardBack";

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
        if(cards[currentIndex].status === 'new') {
            console.log('test')
            try {
                await invoke('fail_learning_card', { 
                    cardId: cards[currentIndex].id,
                });
            } catch (error) {
                console.error("Error retrieving decks:", error);
            }
        }
        nextCard(cards);
    };

    const handlePass = async (cards: Card[]) => {
        if(cards[currentIndex].status === 'new') {
            try {
                await invoke('pass_new_card', { 
                    cardId: cards[currentIndex].id,
                });
            } catch (error) {
                console.error("Error retrieving decks:", error);
            }
        }
        nextCard(cards);
    };

    return (
        <div>
            <Navbar />
            <div>
                <div className="absolute mt-60">
                    {newCards.length}
                    {learningCards.length}
                    {dueCards.length}
                    {deck?.cards.length}
                </div>
                {newCards.length > 0 && (
                    <>
                        {showFront ? (
                            <CardFront
                                vocabulary={newCards[currentIndex]?.content?.vocabulary || ""}
                                clue={newCards[currentIndex]?.content?.clue || ""}
                                onShowAnswer={handleShowAnswer}
                            />
                        ) : (
                            <CardBack
                                vocabulary={newCards[currentIndex]?.content?.vocabulary || ""}
                                clue={newCards[currentIndex]?.content?.clue || ""}
                                asset={newCards[currentIndex]?.content?.asset || ""}
                                definition={newCards[currentIndex]?.content?.definition || ""}
                                description={newCards[currentIndex]?.content?.description || ""}
                                onPass={() => handlePass(newCards)}
                                onFail={() => handleFail(newCards)}
                            />
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

export default LearningPage;