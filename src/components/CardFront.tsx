import Button from "./Button";

interface CardFrontProps {
    vocabulary?: string;
    clue?: string;
    onShowAnswer: () => void;
}

function CardFront({ vocabulary, clue, onShowAnswer }: CardFrontProps) {
    return (
        <div className="flex flex-col items-center justify-center translate-y-5 mt-60">
            <p className="text-4xl">{vocabulary}</p>
            <p className="text-2xl mt-8">{clue}</p>
            <Button text="Show Answer" className="theme-blue mt-20 h-16 w-48 rounded-3xl" onclick={onShowAnswer} />
        </div>
    );
}

export default CardFront;