import QuestionDisplay from "./QuestionDisplay";
import AnswerDisplay from "./AnswerDisplay";
import GameCard from "../models/GameCard";
import GamePlayer from "../models/GamePlayer";

interface GameDisplayProps {
    game_card: GameCard;
    game_player: GamePlayer | null;
    showQuestion: Boolean;
    onShowAnswer: () => void;
    nextQuestion: () => void;
}

const CardDisplay: React.FC<GameDisplayProps> = ({ game_card, game_player, showQuestion, onShowAnswer, nextQuestion}) => {
    return (
        <div>
            {showQuestion ? (
                <QuestionDisplay

                />
            ) : (
                <AnswerDisplay

                />
            )}
        </div>
    );
};

export default CardDisplay;