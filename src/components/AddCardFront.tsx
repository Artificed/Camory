import React from 'react';

interface AddCardFrontProps {
    vocabulary: string;
    setVocabulary: (vocabulary: string) => void;
    clue: string;
    setClue: (clue: string) => void;
}

function AddCardFront({ vocabulary, setVocabulary, clue, setClue }: AddCardFrontProps) {
    return (
        <form className="flex items-center bg-white aspect-square rounded-3xl
            border-b-2 border-r-2 border-gray-200 flex-col justify-center *:my-5">
            <input type="text" value={vocabulary} className="w-full text-2xl text-blue-950 rounded-xl
                focus:outline-none font-extrabold text-center" 
                onChange={(e) => setVocabulary(e.target.value)} placeholder="Question"/>
            <input type="text" value={clue} className="w-full text-base text-blue-950 rounded-xl
                focus:outline-none text-center" 
                onChange={(e) => setClue(e.target.value)} placeholder="Clue"/>
        </form>
    );
}

export default AddCardFront;