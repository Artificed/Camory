import CardBack from "./CardBack";
import CardFront from "./CardFront";
import UserCard from "../models/UserCard";

interface CardDisplayProps {
    card: UserCard;
    onShowAnswer: () => void;
    onPass: () => void;
    onFail: () => void;
    showFront: boolean;
}

const CardDisplay: React.FC<CardDisplayProps> = ({ card, onShowAnswer, onPass, onFail, showFront }) => {
    return (
        <div>
            {showFront ? (
                <CardFront
                    vocabulary={card.content?.vocabulary || ""}
                    clue={card.content?.clue || ""}
                    onShowAnswer={onShowAnswer}
                />
            ) : (
                <CardBack
                    vocabulary={card.content?.vocabulary || ""}
                    clue={card.content?.clue || ""}
                    asset={card.content?.asset || ""}
                    definition={card.content?.definition || ""}
                    description={card.content?.description || ""}
                    onPass={onPass}
                    onFail={onFail}
                />
            )}
        </div>
    );
};

export default CardDisplay;