import { useParams } from "react-router-dom";
import Navbar from './components/Navbar';
import { invoke } from '@tauri-apps/api';
import { useEffect } from "react";

function GamePage() {

  const params = useParams();
  useEffect(() => {
    console.log(params.game_id) // test
  });

  return (
    <div>
      <Navbar />
      <div className="mt-60">
        test
      </div>
    </div>
  );
}

export default GamePage;