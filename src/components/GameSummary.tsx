import { useEffect, useRef, useState } from "react";
import GameCard from "../models/GameCard";
import GamePlayer from "../models/GamePlayer";
import Button from "./Button";
import { useNavigate } from "react-router-dom";
import Deck from "../models/Deck";
import User from "../models/User";
import { invoke } from "@tauri-apps/api";

interface GameSummaryProps {
  playerCardIds: string[];
  gameCards: GameCard[];
  gamePlayer: GamePlayer | null;
}

const GameSummary: React.FC<GameSummaryProps> = ({ playerCardIds, gameCards, gamePlayer }) => {
  
  const navigate = useNavigate();

  const [decks, setDecks] = useState<Deck[]>([]);
  const [chosenDeck, setChosenDeck] = useState<Deck | undefined>();
  const newCards = gameCards
    .filter(gameCard => !playerCardIds.includes(gameCard.card.id))
    .map(gameCard => gameCard.card);

    const getUserDecks = async () => {
      try {
        const user: User | null = await invoke<User | null>("get_current_user");
        const result = await invoke<Deck[]>("get_decks", { userId: user?.id }); 
        setDecks(result);
      } catch (error) {
        console.error("Error retrieving current user:", error);
      }
    }

  useEffect(() => {
    getUserDecks();
    console.log(playerCardIds)
    gameCards.forEach(c => {console.log(c.card.id)})
    setChosenDeck(decks[0]);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const insertCard = async (deck_id: string | undefined, card_id: string) => {
      try {
          await invoke('insert_user_card_from_game', { 
              deckId: deck_id, 
              cardId: card_id
          });
          navigate('/home');
      } catch (error) {
          console.error("Create Card Error:", error);
      }
  } 

  const handleContinueClick = () => {
      try {
        newCards.forEach(newCard => {
          insertCard(chosenDeck?.id, newCard.id);
        });
      } catch (error) {
        console.error("Error inserting to deck: ", error);
      }
    navigate('/gamemenu')
  }

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleSelect = (deck: Deck) => {
    setChosenDeck(deck);
    setIsOpen(false);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  };

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center theme-brown-light text-blue-950">
      <div className="w-4/5 h-4/5 flex flex-col p-14 items-center justify-center rounded-3xl border shadow-lg">
        <div className="border-b pb-8 w-3/4 flex justify-center border-blue-950">
          <h1 className="text-4xl">Game Summary</h1>
        </div>
        <div className="cream mt-8 px-8 py-4 rounded-lg">
          <p className="text-xl font-bold">Overall Score: {gamePlayer?.score}</p>
        </div>
        <div className="w-2/3 mt-5 flex flex-col">
          <p className="text-lg">Answers:</p>
          <div className="h-16 mt-2 w-full flex rounded-xl overflow-hidden *:flex *:justify-center *:items-center">
            <div
              className="h-full bg-green-400"
              style={{ width: `${(gamePlayer?.correct_answers || 0) / ((gamePlayer?.correct_answers || 0) + (gamePlayer?.incorrect_answers || 0)) * 100}%` }}
            >{gamePlayer?.correct_answers} Correct</div>
            <div
              className="h-full bg-red-400"
              style={{ width: `${(gamePlayer?.incorrect_answers || 0) / ((gamePlayer?.correct_answers || 0) + (gamePlayer?.incorrect_answers || 0)) * 100}%` }}
            >{gamePlayer?.incorrect_answers} Incorrect</div>
          </div>
        </div>
        <p className="text-xl mt-8">You Learned {newCards.length} new cards!</p>
        <div className="flex justify-center *:mx-5 mt-2 h-32 items-center">
          <div className="flex flex-col *:my-2">
            Select Deck To Add:
            <div className="relative w-48" ref={dropdownRef}>
              <div className="border border-gray-300 rounded-md px-4 py-2 text-lg flex justify-between items-center cursor-pointer"
                onClick={() => setIsOpen(!isOpen)}>
                {chosenDeck ? chosenDeck.name : "Select a deck"}
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                </svg>
              </div>
              {isOpen && (
                <ul className=" absolute w-full bg-white border border-gray-300 rounded-md mt-1">
                  {decks.map(deck => (
                    <li key={deck.id} className="p-2 hover:bg-blue-500 hover:text-white cursor-pointer" onClick={() => handleSelect(deck)}>
                      {deck.name}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
          <Button text="Continue" onclick={handleContinueClick} className="theme-blue w-40 h-14 text-xl"/>
        </div>
      </div>
    </div>
  );
};

export default GameSummary;