import QuestionDisplay from "./QuestionDisplay";
import AnswerDisplay from "./AnswerDisplay";
import GameCard from "../models/GameCard";
import GamePlayer from "../models/GamePlayer";
import GameCardChoice from "../models/GameCardChoice";

interface GameDisplayProps {
    game_card: GameCard;
    game_player: GamePlayer | null;
    showQuestion: Boolean;
    showAnswer: (selectedAnswer: GameCardChoice, timeLeft: number) => void;  // Update type
    nextQuestion: () => void;
    timeLeft: number;
    setTimeLeft: React.Dispatch<React.SetStateAction<number>>;
}

const GameDisplay: React.FC<GameDisplayProps> = ({ game_card, game_player, showQuestion, showAnswer, nextQuestion, timeLeft, setTimeLeft}) => {
    return (
        <div className="w-screen h-screen">
          <div className="mt-16">
            {showQuestion ? (
                <QuestionDisplay
                  gameCard={game_card}
                  game_player={game_player}
                  showAnswer={showAnswer}
                  timeLeft={timeLeft}
                  setTimeLeft={setTimeLeft}
                />
            ) : (
                <AnswerDisplay
                  
                />
            )}
          </div>
        </div>
    );
};

export default GameDisplay;