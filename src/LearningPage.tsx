import { useParams } from "react-router-dom";
import Navbar from "./components/Navbar";

function LearningPage() {

    const params = useParams();

    return (
        <div className="">
            <Navbar />
            <div className="mt-60">{params.deck_id}</div>
        </div>
    );

}

export default LearningPage;