import { useNavigate, useParams } from "react-router-dom";
import Navbar from './components/Navbar';
import { invoke } from '@tauri-apps/api';
import { useEffect, useState } from "react";
import GamePlayer from "./models/GamePlayer";
import Button from "./components/Button";
import GameCard from "./models/GameCard";
import GameDisplay from './components/GameDisplay';

function GamePage() {

  const navigate = useNavigate();
  const params = useParams();
  const gameId = params.game_id;

  const [showQuestion, setShowQuestion] = useState<Boolean>(true);  // true: Ques, false: Ans

  const [gameCards, setGameCards] = useState<GameCard[]>([]);       // Game's Cards
  const [playerCardIds, setPlayerCardIds] = useState<string[]>([]); // Filter out new cards learned
  const [gamePlayer, setGamePlayer] = useState<GamePlayer | null>(null);     // To register user as a player
  const [currentIndex, setCurrentIndex] = useState<number>(0);
 
  useEffect(() => {
    const fetchData = async () => {
      try {
        const cardsResult = await invoke<GameCard[]>("get_cards_for_game", { gameId });
        const playerResult = await invoke<GamePlayer>("register_game_player", { gameId });
        const playerCardIdsResult = await invoke<string[]>("get_user_card_ids");
        setGameCards(cardsResult);
        setGamePlayer(playerResult);
        setPlayerCardIds(playerCardIdsResult);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [params.game_id]); 

  const nextQuestion = () => {
    if(currentIndex == gameCards.length) {
      navigate(`game/${gameId}/summary/`)
    }
    setCurrentIndex(currentIndex + 1);
    setShowQuestion(true);
  };

  const showAnswer = () => {
    setShowQuestion(false);
  }

  return (
    <div>
      <Navbar />
      <div className="flex flex-col items-center mt-32">
        {gameCards.length > 0 ? (
          <GameDisplay
            game_card={gameCards[currentIndex]}
            game_player={gamePlayer}
            showQuestion={showQuestion}
            onShowAnswer={showAnswer}
            nextQuestion={nextQuestion}
          />
        ) : (
          <p>Loading cards...</p>
        )}
      </div>
    </div>
  );
}

export default GamePage;