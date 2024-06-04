import Card from './Card';

interface UserCard {
  id: string;
  card_id: string;
  deck_id: string;
  status: string;
  ease: number;
  fails: number;
  streak: number;
  review_time: Date;
  due: Date;
  content?: Card;
}

export default UserCard;