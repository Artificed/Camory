import { useNavigate } from "react-router-dom";
import Game from "../models/Game";
import Button from "./Button";

interface GameCardPreviewProps {
  game: Game;
}

const GameCardPreview: React.FC<GameCardPreviewProps> = ({ game }) => {
  const imageSrc = game.asset ? `data:image/jpeg;base64,${game.asset}` : '';
  const navigate = useNavigate();

  const handleGameClick = () => {
    navigate(`/game/${game.id}`)
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-4 flex flex-col items-center">
      <img src={imageSrc} className="w-full h-48 object-cover rounded-md mb-4" />
      <h2 className="text-lg font-semibold my-2">{game.name}</h2>
      <Button text="Play Game" className="bg-blue-500 text-white text-sm h-10 w-28" onclick={handleGameClick}/>
    </div>
  );
}

export default GameCardPreview;