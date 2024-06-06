import GameCard from "./GameCard";

interface Game {
  id: string,
  name: string,
  asset: string,
  game_cards: GameCard[],
}

export default Game;