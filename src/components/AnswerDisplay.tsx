import GameCard from "../models/GameCard";
import GamePlayer from "../models/GamePlayer";

interface AnswerDisplayProps {
  gameCard: GameCard;
  game_player: GamePlayer | null;
  nextQuestion: () => void;
}

function AnswerDisplay() {
  return (
    <div className="">
      
    </div>
  );
}

export default AnswerDisplay;