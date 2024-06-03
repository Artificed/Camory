import CardBack from "./CardBack";
import CardFront from "./CardFront";

interface Card {
    id: string;
    deck_id: string;
    status: string;
    ease: number;
    fails: number;
    streak: number;
    review_time: Date;
    due: Date;
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

interface CardDisplayProps {
    card: Card;
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