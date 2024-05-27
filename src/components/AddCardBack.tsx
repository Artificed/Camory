import frame from '../assets/frame.png'

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
        <div className="flex flex-col justify-center items-center">
            <div className="mt-10">
            <input type="file" id="asset" value={asset} className="hidden" 
                onChange={(e) => setAsset(e.target.value)}/>
            <label htmlFor="asset" className="flex items-center *:mx-1">
                <img src={frame} className="h-24" />
                <p className="text-blue-950 opacity-50 font-medium">Add Image</p>
            </label>
        </div>
        <hr className="w-5/6 my-8 border border-opacity-50 border-orange-400"/>
        <textarea value={definition} className="w-full h-28 text-2xl text-blue-950 rounded-xl
            font-extrabold px-12 focus:outline-none resize-none" 
            onChange={(e) => setDefinition(e.target.value)} placeholder="Definition"></textarea>
        <textarea value={description} className="w-full h-20  text-blue-950 rounded-xl
            focus:outline-none px-12 mt-5 resize-none" 
            onChange={(e) => setDescription(e.target.value)} placeholder="Description"></textarea>
        </div>
    );
}

export default AddCardBack;