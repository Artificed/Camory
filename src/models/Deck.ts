import UserCard from "./UserCard";

interface Deck {
  id: string;
  user_id: string;
  name: string;
  new_cards_per_day: number;
  cards: UserCard[];
}
export default Deck;