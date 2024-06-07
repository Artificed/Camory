import { useEffect, useState } from "react";
import GameCard from "../models/GameCard";
import GamePlayer from "../models/GamePlayer";
import Button from "./Button";
import GameCardChoice from "../models/GameCardChoice";

interface QuestionDisplayProps {
  gameCard: GameCard;
  game_player: GamePlayer | null;
  nextQuestion: () => void;
  showAnswer: (selectedAnswer: GameCardChoice, timeLeft: number) => void;  // Update type
}

function QuestionDisplay({ gameCard, game_player, nextQuestion, showAnswer }: QuestionDisplayProps) {

  const [timeLeft, setTimeLeft] = useState<number>(30);
  const imageSrc = gameCard.card.asset ? `data:image/jpeg;base64,${gameCard.card.asset}` : ''

  useEffect(() => {
    if (timeLeft === 0) {
      showAnswer(gameCard.choices[-1], 0);
    }

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, showAnswer]);
  
  const formattedTime = String(timeLeft).padStart(2, '0');

  return (
    <div className="flex flex-col items-center">
      <div className="h-72 w-96 mt-10 flex flex-col items-center justify-center shadow-md rounded-lg p-4">
        <img src={imageSrc} alt="Game Card" className="max-h-full max-w-full object-cover" />
      </div> 
      <div className="mt-6 grid grid-cols-2 *:mx-12 *:my-4 *:h-32 *:w-96 *:text-2xl">
        <Button text={gameCard.choices[0].answer} className="theme-blue" onclick={() => showAnswer(gameCard.choices[0], timeLeft)}/>
        <Button text={gameCard.choices[1].answer} className="theme-green" onclick={() => showAnswer(gameCard.choices[1], timeLeft)}/>
        <Button text={gameCard.choices[2].answer} className="bright-red" onclick={() => showAnswer(gameCard.choices[2], timeLeft)}/>
        <Button text={gameCard.choices[3].answer} className="theme-brown-dark" onclick={() => showAnswer(gameCard.choices[3], timeLeft)}/>
      </div>
      <div className="absolute top-52 right-16 flex flex-col items-center justify-center">
        <div className="border border-b-2 py-6 px-10 shadow-sm rounded-lg">
          <div className="flex items-center justify-center *:mx-1">
            <span className="text-green-500">{game_player?.correct_answers} </span>
            <span className=""> | </span>
            <span className="text-red-500"> {game_player?.incorrect_answers}</span>
          </div>
          <div className="text-2xl mt-4 font-bold text-blue-950 text-center">
            Score: {game_player?.score}
          </div>
        </div>
      </div>
      <div className="absolute top-60 left-16 w-40 h-16 flex flex-col items-center justify-center">
        <div className="border w-36 h-16 border-b-2 py-4 px-6 shadow-sm rounded-lg theme-brown-light">
          <div className="text-xl text-blue-950 text-center">
            <span className="inline-block w-10">00</span>
            <span>:</span>
            <span className="inline-block w-10">{formattedTime}</span>
          </div>
        </div>
      </div>
    </div>
  );}

export default QuestionDisplay;