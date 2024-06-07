interface GamePlayer {
  game_id: string,
  user_id: string,
  score: number,
  correct_answers: number,
  incorrect_answers: number,
}

export default GamePlayer;