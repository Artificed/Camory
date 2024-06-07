import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "./components/Navbar";
import { invoke } from "@tauri-apps/api";
import CardDisplay from "./components/CardDisplay";
import UserCard from "./models/UserCard";
import Deck from "./models/Deck";

function LearningPage() {
  const params = useParams();
  const [showFront, setShowFront] = useState(true);

  const [newCards, setNewCards] = useState<UserCard[]>([]);
  const [dueCards, setDueCards] = useState<UserCard[]>([]);
  const [redCards, setRedCards] = useState<UserCard[]>([]); // Learning + Relearning Cards

  const fetchDeck = async () => {
    try {
      const result = await invoke<Deck>("get_deck_by_id", {
        deckId: params.deck_id,
      });
      const newCards = result.cards.filter((card) => card.status === "new");
      const learningCards = result.cards.filter(
        (card) => card.status === "learning"
      );
      const relearningCards = result.cards.filter(
        (card) => card.status === "relearning"
      );
      const dueCards = result.cards.filter(
        (card) => card.status === "due" && new Date(card.due) < new Date()
      );
      const redCards = learningCards
        .concat(relearningCards)
        .sort((a, b) => new Date(a.due).getTime() - new Date(b.due).getTime());

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

  const handleFail = async (card: UserCard) => {
    try {
      if (card.status === "new" || card.status === "learning") {
        await invoke("fail_learning_card", { cardId: card.id });
      } else if (card.status === "due" || card.status === "relearning") {
        await invoke("fail_due_card", { cardId: card.id });
      }
      await fetchDeck(); // Wait for deck to be fetched
    } catch (error) {
      console.error("Error updating card:", error);
    }
    nextCard();
  };

  const handlePass = async (card: UserCard) => {
    try {
      if (card.status === "new") {
        await invoke("pass_new_card", { cardId: card.id });
      } else if (card.status === "learning") {
        await invoke("pass_learning_card", { cardId: card.id });
      } else if (card.status === "due") {
        await invoke("pass_due_card", { cardId: card.id });
      } else if (card.status === "relearning") {
        await invoke("pass_relearning_card", { cardId: card.id });
      }
      await fetchDeck(); // Wait for deck to be fetched
    } catch (error) {
      console.error("Error updating card:", error);
    }
    nextCard();
  };

  const getCurrentCardSet = (): UserCard[] => {
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
