import QuestionDisplay from "./QuestionDisplay";
import AnswerDisplay from "./AnswerDisplay";
import GameCard from "../models/GameCard";
import GamePlayer from "../models/GamePlayer";

interface GameDisplayProps {
    game_card: GameCard;
    game_player: GamePlayer | null;
    showQuestion: Boolean;
    showAnswer: () => void;
    nextQuestion: () => void;
}

const GameDisplay: React.FC<GameDisplayProps> = ({ game_card, game_player, showQuestion, showAnswer, nextQuestion}) => {
    return (
        <div className="w-screen h-screen">
          <div className="mt-16">
            {showQuestion ? (
                <QuestionDisplay
                  gameCard={game_card}
                  game_player={game_player}
                  nextQuestion={nextQuestion}
                  showAnswer={showAnswer}
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