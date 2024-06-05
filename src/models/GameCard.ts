import Card from "./Card";
import GameCardChoice from "./GameCardChoice";

interface GameCard {
  id: string,
  game_id: string,
  card: Card,
  choices: GameCardChoice[],
};

export default GameCard;