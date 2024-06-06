import { useNavigate, useParams } from "react-router-dom";
import Navbar from './components/Navbar';
import { invoke } from '@tauri-apps/api';
import { useEffect, useState } from "react";
import Card from "./models/Card";

function GamePage() {

  const navigate = useNavigate();
  const params = useParams();
  const [cards, setCards] = useState<Card[]>([]);

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const result = await invoke<Card[]>("get_cards_for_game", { gameId: params.game_id });
        setCards(result);
      } catch (error) {
        console.error("Error retrieving cards:", error);
      }
    };
    const registerPlayer = async () => {
      try {
        await invoke ("register_game_player", { gameId: params.game_id });
      } catch (error) {
        console.error("Error retrieving cards:", error);
      }
    }
    fetchCards();
    registerPlayer();
  }, [navigate]);

  return (
    <div>
      <Navbar />
      <div className="">
        test
      </div>
    </div>
  );
}

export default GamePage;