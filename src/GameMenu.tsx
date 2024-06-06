import { useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api";
import Game from "./models/Game";
import GameCardPreview from "./components/GamePreview";

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
          <p>Loading games...</p>
        ) : (
          <div className="grid grid-cols-3 gap-10 mx-10 my-5 p-4">
            {games.map((game) => (
              <GameCardPreview key={game.id} game={game} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default GameMenu;
