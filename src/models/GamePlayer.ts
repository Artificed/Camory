interface GamePlayer {
  game_id: string,
  user_id: string,
  score: number,
  correct_answer: number,
  incorrect_answer: number,
}

export default GamePlayer;