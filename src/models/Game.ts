import GameCard from "./GameCard";

interface Game {
  id: string,
  name: string,
  game_cards: GameCard[],
}

export default Game;