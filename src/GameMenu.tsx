import { useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api";
import Game from "./models/Game";
import GameCardPreview from "./components/GamePreview";
import logo_load from "./assets/logo_load.png"

function GameMenu() {
  const navigate = useNavigate();
  const [games, setGames] = useState<Game[]>([]);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const result = await invoke<Game[]>("get_games");
        setGames(result);
      } catch (error) {
        console.error("Error retrieving decks:", error);
      }
    };
    fetchGames();
  }, [navigate]);


  return (
    <div>
      <Navbar />
      <div className="mt-16 flex flex-col items-center hide-scrollbar">
        {games.length === 0 ? (
          <div className="flex flex-col justify-center items-center w-1/5 absolute top-1/3">
            <img src={logo_load} alt="Centered Image" className="animate-pulse"></img>
            <div className="text-2xl font-medium opacity-65">Loading...</div>
          </div>
        ) : (
          <div>
            <h1 className="ml-10 px-4 mt-7 title">Games</h1>
            <div className="grid grid-cols-3 gap-10 mx-10 mb-2 p-4">
              {games.map((game) => (
                <GameCardPreview key={game.id} game={game} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default GameMenu;
