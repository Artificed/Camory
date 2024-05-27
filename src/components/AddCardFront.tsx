interface AddCardFrontProps {
    vocabulary: string;
    setVocabulary: (vocabulary: string) => void;
    clue: string;
    setClue: (clue: string) => void;
}

function AddCardFront({ vocabulary, setVocabulary, clue, setClue }: AddCardFrontProps) {
    return (
        <div className="flex flex-col justify-center items-center">
            <input type="text" value={vocabulary} className="w-full text-4xl text-blue-950 rounded-xl
                focus:outline-none font-extrabold text-center mt-36" 
                onChange={(e) => setVocabulary(e.target.value)} placeholder="Question"/>
            <input type="text" value={clue} className="w-full text-2xl text-blue-950 rounded-xl
                focus:outline-none text-center mt-20" 
                onChange={(e) => setClue(e.target.value)} placeholder="Clue"/>
        </div>
    );
}

export default AddCardFront;