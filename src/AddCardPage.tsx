import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from './components/Navbar';
import AddCardFront from './components/AddCardFront';
import AddCardBack from './components/AddCardBack';

function AddCardPage() {

    const { deck_id } = useParams();
    const navigate = useNavigate();

    const [pageNumber, setPageNumber] = useState(1);

    const [asset, setAsset] = useState<string>("");
    const [definition, setDefinition] = useState<string>("");
    const [description, setDescription] = useState<string>("");

    const [vocabulary, setVocabulary] = useState("");
    const [clue, setClue] = useState("");

    const handleArrowBack = () => {
        setPageNumber(1)
    }

    const handleArrowFront = () => {
        setPageNumber(2)
    }

    return (
        <div className="theme-brown-light h-screen flex justify-center">
            <Navbar />
            <div className="grid grid-cols-2 justify-center items-center">
                {pageNumber === 1 ? (
                    <AddCardFront vocabulary={vocabulary} setVocabulary={setVocabulary} 
                        clue={clue} setClue={setClue}/>
                ) : (
                    <AddCardBack asset={asset} setAsset={setAsset} definition={definition} 
                        setDefinition={setDefinition} description={description} setDescription={setDescription}/>
                )}
                <div className="flex justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" 
                    strokeWidth={4} stroke="currentColor" className="size-6" onClick={handleArrowBack}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                    </svg>
                    <p className="mx-8">{pageNumber}</p>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" 
                    strokeWidth={4} stroke="currentColor" className="size-6" onClick={handleArrowFront}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                    </svg>
                </div>
            </div>
        </div>
    );
}

export default AddCardPage;