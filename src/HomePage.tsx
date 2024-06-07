import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api";
import { useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Button from "./components/Button";
import DeckDisplay from "./components/DeckDisplay";
import User from "./models/User";
import Deck from "./models/Deck";

function HomePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [decks, setDecks] = useState<Deck[]>([]);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const result = await invoke<User | null>("get_current_user");
        if (result) {
          setUser(result);
          fetchDecks(result.id);
        } else {
          navigate("/login");
        }
      } catch (error) {
        console.error("Error retrieving current user:", error);
        navigate("/login");
      }
    };

    const fetchDecks = async (userId: string) => {
      try {
        const result = await invoke<Deck[]>("get_decks", { userId });
        setDecks(result);
      } catch (error) {
        console.error("Error retrieving decks:", error);
      }
    };

    fetchCurrentUser();
  }, [navigate]);

  const handleCreateDeckClick = () => {
    navigate("/create-deck");
  };

  return (
    <div>
      <Navbar />
      <div className="mt-16 flex flex-col items-center hide-scrollbar">
        <form action="" className="flex justify-center w-5/6">
          <input
            type="text"
            name=""
            id=""
            className="bg-[#FAF6EE] rounded-lg w-full h-12 mt-10 mr-3 p-5 text-md transition ease-linear duration-300 hover:bg-[#f2eadb]"
            placeholder="Enter Deck Name"
          />
          <Button
            text="Search"
            className="p-3 bright-red w-24 mt-10 ml-3 text-sm border-none hover:bg-[#edaa92]"
          />
        </form>
        <div className="flex justify-start w-5/6 my-5">
          <Button
            text="+ Create Deck"
            className="w-36 h-10 text-sm theme-green hover:bg-[#aee78a]"
            onclick={handleCreateDeckClick}
          />
        </div>
        {user ? (
          <div className="w-5/6">
            {decks.map((deck) => (
              <div key={deck.id}>
                <DeckDisplay deck={deck} />
              </div>
            ))}
          </div>
        ) : (
          <div>Error</div>
        )}
      </div>
    </div>
  );
}

export default HomePage;
