import React from 'react';

interface AddCardBackProps {
    asset: string;
    setAsset: (asset: string) => void;
    definition: string;
    setDefinition: (definition: string) => void;
    description: string;
    setDescription: (description: string) => void;
}

function AddCardBack({ asset, setAsset, definition, setDefinition, description, setDescription }: AddCardBackProps) {
    return (
        <form className="flex items-center bg-white aspect-square rounded-3xl
            border-b-2 border-r-2 border-gray-200 flex-col justify-center *:my-5">
            <input type="text" value={asset} className="w-full text-2xl text-blue-950 rounded-xl
                focus:outline-none font-extrabold text-center" 
                onChange={(e) => setAsset(e.target.value)} placeholder="Asset"/>
            <input type="text" value={definition} className="w-full text-2xl text-blue-950 rounded-xl
                focus:outline-none font-extrabold text-center" 
                onChange={(e) => setDefinition(e.target.value)} placeholder="Question"/>
            <input type="text" value={description} className="w-full text-base text-blue-950 rounded-xl
                focus:outline-none text-center" 
                onChange={(e) => setDescription(e.target.value)} placeholder="Clue"/>
        </form>
    );
}

export default AddCardBack;