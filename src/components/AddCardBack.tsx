import frame from '../assets/frame.png'

interface AddCardBackProps {
    asset: File | null;
    setAsset: (asset: File) => void;
    preview: string | ArrayBuffer | null;
    setPreview: (preview: string | ArrayBuffer | null) => void;
    definition: string;
    setDefinition: (definition: string) => void;
    description: string;
    setDescription: (description: string) => void;
}

function AddCardBack({ asset, setAsset, preview, setPreview, definition, setDefinition, description, setDescription }: AddCardBackProps) {

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const target = event.target as HTMLInputElement & {
            files: FileList;
        };
        if(target.files[0].type === 'image/png' || target.files[0].type === 'image/jpeg') {
            setAsset(target.files[0]);
            const file = new FileReader();
            file.onload = function() {
                setPreview(file.result);
            };
            file.readAsDataURL(target.files[0]);
        }
    };

    return (
        <div className="flex flex-col justify-center items-center">
            <div className="mt-10">
                <input type="file" id="asset" className="hidden" onChange={handleFileChange} />
                <label htmlFor="asset" className="flex items-center *:mx-1">
                {preview ? (
                        <img src={preview as string} className="h-28" alt="Preview" />
                    ) : (
                        <>
                            <img src={frame} className="h-28" alt="Add asset" />
                            <p className="text-blue-950 opacity-50 font-medium ml-2">Add Image</p>
                        </>
                    )}
                </label>
            </div>
            <hr className="w-5/6 my-8 border border-opacity-50 border-orange-400" />
            <textarea 
                value={definition} 
                className="w-full h-24 text-2xl text-blue-950 rounded-xl font-extrabold px-12 focus:outline-none resize-none" 
                onChange={(e) => setDefinition(e.target.value)} 
                placeholder="Definition"
            />
            <textarea 
                value={description} 
                className="w-full h-20 text-blue-950 rounded-xl focus:outline-none px-12 mt-5 resize-none" 
                onChange={(e) => setDescription(e.target.value)} 
                placeholder="Description"
            />
        </div>
    );
}

export default AddCardBack;