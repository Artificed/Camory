import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from './components/Navbar';
import AddCardFront from './components/AddCardFront';
import AddCardBack from './components/AddCardBack';
import Button from './components/Button';
import Loading from './components/Loading'
import WarningMessage from './components/WarningMessage';
import { invoke } from '@tauri-apps/api';

function AddCardPage() {

    const params = useParams();
    const navigate = useNavigate();

    const [pageNumber, setPageNumber] = useState(1);
    const [pageInfo, setPageInfo] = useState("Front card");

    const [vocabulary, setVocabulary] = useState<string>("");
    const [clue, setClue] = useState<string>("");

    const [asset, setAsset] = useState<File | null>(null);

    const [preview, setPreview] = useState<string | ArrayBuffer | null>(null);

    const [definition, setDefinition] = useState<string>("");
    const [description, setDescription] = useState<string>("");

    const [errorMessage, setErrorMessage] = useState<string>("");

    const [isLoading, setIsLoading] = useState(false); 

    const handleArrowBack = () => {
        setPageNumber(1);
        setPageInfo("Front card");
    }

    const handleArrowFront = () => {
        setPageNumber(2)
        setPageInfo("Back card");
    }

    const handleSubmit = async () => {
        setIsLoading(true);
        if (!vocabulary) {
            setErrorMessage("Vocabulary cannot be empty!");
            setIsLoading(false);
            return;
        } else if (!clue) {
            setErrorMessage("Clue cannot be empty!");
            setIsLoading(false);
            return;
        } else if (!asset) {
            setErrorMessage("Asset cannot be empty!");
            setIsLoading(false);
            return;
        } else if (!definition) {
            setErrorMessage("Definition cannot be empty!");
            setIsLoading(false);
            return;
        } else if (!description) {
            setErrorMessage("Description cannot be empty!");
            setIsLoading(false);
            return;
        } 

        const reader = new FileReader();
        reader.onload = async () => {
            const fileAsArrayBuffer = reader.result;
            const uint8Array = new Uint8Array(fileAsArrayBuffer as ArrayBuffer);
            const base64String = btoa(String.fromCharCode(...uint8Array));
            const temp = params.deck_id;
            try {
                await invoke('insert_user_card', { 
                    deckId: temp, 
                    vocabulary, 
                    clue, 
                    asset: base64String, 
                    definition, 
                    description 
                });
                setIsLoading(false);
                navigate('/home');
            } catch (error) {
                setErrorMessage("Create Card Failed!");
                console.error("Create Card Error:", error);
                setIsLoading(false);
            }
        };
        reader.readAsArrayBuffer(asset);
        setIsLoading(false);
    };

    return (
        <div className="theme-brown-light h-screen flex justify-center">
            <Navbar />
            <div className="grid grid-cols-2 justify-center items-center translate-x-20">
                <form className="flex bg-white h-2/3 aspect-square rounded-3xl
                border-b-2 border-r-2 border-gray-200 flex-col items-center shadow-md">
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
                        strokeWidth={4} stroke="currentColor" className="size-9 hover:bg-slate-300 p-2 rounded-xl" onClick={handleArrowBack}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                        </svg>
                        <p className="mx-8 my-[0.4rem]">{pageInfo}</p>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" 
                        strokeWidth={4} stroke="currentColor" className="size-9 hover:bg-slate-300 p-2 rounded-xl" onClick={handleArrowFront}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                        </svg>
                    </div>

                    {errorMessage && 
                    <WarningMessage className="absolute translate-y-14"
                        errorMessage={errorMessage}
                    />
                    }

                    {pageNumber === 2 && !isLoading && (
                        <Button text='Submit' className='bright-red absolute translate-y-24 hover:bg-[#edaa92]' onclick={handleSubmit}/>
                    )}

                    {pageNumber == 2 && isLoading && 
                    (<Loading className="absolute translate-y-24 text-red-800"></Loading>)}
                </div>
            </div>
        </div>
    );
}

export default AddCardPage;