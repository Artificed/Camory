import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from './components/Navbar';
import AddCardFront from './components/AddCardFront';
import AddCardBack from './components/AddCardBack';
import Button from './components/Button';
import { invoke } from '@tauri-apps/api';

function AddCardPage() {

    const params = useParams();
    const navigate = useNavigate();

    const [pageNumber, setPageNumber] = useState(1);

    const [vocabulary, setVocabulary] = useState<string>("");
    const [clue, setClue] = useState<string>("");

    const [asset, setAsset] = useState<File | null>(null);

    const [preview, setPreview] = useState<string | ArrayBuffer | null>(null);

    const [definition, setDefinition] = useState<string>("");
    const [description, setDescription] = useState<string>("");

    const [errorMessage, setErrorMessage] = useState<string>("");

    const handleArrowBack = () => {
        setPageNumber(1)
    }

    const handleArrowFront = () => {
        setPageNumber(2)
    }

    const handleSubmit = async () => {
        if (!vocabulary) {
            setErrorMessage("Vocabulary cannot be empty!");
            return;
        } else if (!clue) {
            setErrorMessage("Clue cannot be empty!");
            return;
        } else if (!asset) {
            setErrorMessage("Asset cannot be empty!");
            return;
        } else if (!definition) {
            setErrorMessage("Definition cannot be empty!");
            return;
        } else if (!description) {
            setErrorMessage("Description cannot be empty!");
            return;
        } 

        const reader = new FileReader();
        reader.onload = async () => {
            const fileAsArrayBuffer = reader.result;
            const uint8Array = new Uint8Array(fileAsArrayBuffer as ArrayBuffer);
            const base64String = btoa(String.fromCharCode(...uint8Array));
            const temp = params.deck_id;
            try {
                await invoke('insert_card', { 
                    deckId: temp, 
                    vocabulary, 
                    clue, 
                    asset: base64String, 
                    definition, 
                    description 
                });
                navigate('/home');
            } catch (error) {
                setErrorMessage("Create Card Failed!");
                console.error("Create Card Error:", error);
            }
        };
        reader.readAsArrayBuffer(asset);
    };

    return (
        <div className="theme-brown-light h-screen flex justify-center">
            <Navbar />
            <div className="grid grid-cols-2 justify-center items-center translate-x-20">
                <form className="flex bg-white h-2/3 aspect-square rounded-3xl
                border-b-2 border-r-2 border-gray-200 flex-col items-center">
                    {pageNumber === 1 ? (
                        <AddCardFront vocabulary={vocabulary} setVocabulary={setVocabulary} 
                            clue={clue} setClue={setClue}/>
                    ) : (
                        <AddCardBack asset={asset} setAsset={setAsset} preview={preview} setPreview={setPreview} definition={definition} 
                            setDefinition={setDefinition} description={description} setDescription={setDescription}/>
                    )}
                </form>
                <div className="flex flex-col items-center">
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
                    {pageNumber === 2 && (
                        <Button text='Submit' className='bright-red absolute translate-y-20' onclick={handleSubmit}/>
                    )}
                    {errorMessage && <p className="text-red-500 translate-y-4 text-sm">{errorMessage}</p>}
                </div>
            </div>
        </div>
    );
}

export default AddCardPage;