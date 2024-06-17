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
    <div className="bg-white shadow-md rounded-lg flex flex-col items-center transition-transform hover:scale-[1.01] hover:shadow-md">
      <img src={imageSrc} className="w-full h-60 object-cover rounded-t-md mb-4" />
      <h2 className="text-lg my-2 px-4 text-center">{game.name}</h2>
      <h2 className="text-sm mb-4 px-4 text-cyan-700">{game.game_cards.length} Cards</h2>
      <Button text="Play Game" className="theme-blue text-sm h-10 w-28 mb-4" onclick={handleGameClick}/>
    </div>
  );
}

export default GameCardPreview;