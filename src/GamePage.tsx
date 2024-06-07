import { useNavigate, useParams } from "react-router-dom";
import Navbar from './components/Navbar';
import { invoke } from '@tauri-apps/api';
import { useEffect, useState } from "react";
import GamePlayer from "./models/GamePlayer";
import GameCard from "./models/GameCard";
import GameDisplay from './components/GameDisplay';
import GameSummary from "./components/GameSummary";
import GameCardChoice from "./models/GameCardChoice";

function GamePage() {
  const navigate = useNavigate();
  const params = useParams();
  const gameId = params.game_id;

  const [showQuestion, setShowQuestion] = useState<Boolean>(true);        // true: Ques, false: Ans

  const [gameCards, setGameCards] = useState<GameCard[]>([]);             // Game's Cards
  const [playerCardIds, setPlayerCardIds] = useState<string[]>([]);       // Filter out new cards learned
  const [gamePlayer, setGamePlayer] = useState<GamePlayer | null>(null);  // To register user as a player
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(30);
 
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

  useEffect(() => {
    fetchData();
  }, [params.game_id]); 

  const nextQuestion = () => {
    setCurrentIndex(currentIndex + 1);
    fetchData();
    setTimeLeft(30); // Reset the timer
    setShowQuestion(true);
  };

  const showAnswer = async (gameCardChoice: GameCardChoice, timeLeft: number) => {
    try {
      if(timeLeft != 0) {
        await invoke("increment_clicked_times", { gameCardId: gameCards[currentIndex].id, answer: gameCardChoice.answer });
        await invoke("update_player_stats", { gameId: gameId, isCorrect: gameCardChoice.is_correct, timeLeft: timeLeft });
      } else {
         await invoke("update_player_stats", { gameId: gameId, isCorrect: false, timeLeft: 0 });
      }
    } catch (error) {
      console.error("Error updating:", error);
    }
    setShowQuestion(false);
  }

  return (
    <div>
      <Navbar />
      <div className="flex flex-col items-center">
        {currentIndex < gameCards.length ? (
          <GameDisplay
            game_card={gameCards[currentIndex]}
            game_player={gamePlayer}
            showQuestion={showQuestion}
            showAnswer={showAnswer}
            nextQuestion={nextQuestion}
            timeLeft={timeLeft}
            setTimeLeft={setTimeLeft}
          />
        ) : (
          <GameSummary />
        )}
      </div>
    </div>
  );
}

export default GamePage;