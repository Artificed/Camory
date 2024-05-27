import Button from "./Button";

interface CardBackProps {
    vocabulary?: string;
    clue?: string;
    asset?: string;
    definition?: string;
    description?: string;
    onPass: () => void;
    onFail: () => void;
}

function CardBack({ vocabulary, clue, asset, definition, description, onPass, onFail }: CardBackProps) {
    return (
        <div className="flex flex-col h-5/6 items-center justify-center mt-32">
            <p className="text-3xl font-semibold">{vocabulary}</p>
            <p className="text-xl mt-5">{clue}</p>
            <div className="h-52"></div>
            {/* {asset && <img src={asset} alt="asset" />} */}
            <p className="mt-24 h-10 break-words">{definition}</p>
            <p className="mt-5">{description}</p>
            <div className="flex space-x-5 absolute bottom-24">
                <Button text="Pass" className="theme-green" onclick={onPass} />
                <Button text="Fail" className="bright-red" onclick={onFail} />
            </div>
        </div>
    );
}

export default CardBack;