import { useEffect, useState } from "react";
import { invoke } from '@tauri-apps/api';
import { useNavigate } from 'react-router-dom';
import GameCard from "../models/GameCard";
import GamePlayer from "../models/GamePlayer";
import Button from "./Button";
import GameCardChoice from "../models/GameCardChoice";
import classNames from 'classnames';
import profilePicture from '../assets/profile_picture.jpg';
import User from '../models/User';


interface QuestionDisplayProps {
  gameCard: GameCard;
  game_player: GamePlayer | null;
  showAnswer: (selectedAnswer: GameCardChoice, timeLeft: number) => void;
  timeLeft: number;
  setTimeLeft: React.Dispatch<React.SetStateAction<number>>;
}

function QuestionDisplay({ gameCard, game_player, showAnswer, timeLeft, setTimeLeft }: QuestionDisplayProps) {
  const navigate = useNavigate();
  const [timeIsRed, setTimeIsRed] = useState("");
  const imageSrc = gameCard.card.asset ? `data:image/jpeg;base64,${gameCard.card.asset}` : ''
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
          const result = await invoke<User | null>("get_current_user");
          if (result) {
              console.log(result);
              setUser(result);
          } else {
              navigate('/login');
          }
      } catch (error) {
          console.error("Error retrieving current user:", error);
          navigate('/login');
      }
    };
    fetchCurrentUser();

    if (timeLeft === 0) {
      showAnswer(gameCard.choices[-1], 0);
      setTimeIsRed("");
    }

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
    }, 1000);

    if(timeLeft <= 5) {
      setTimeIsRed("text-red-500");
    }

    return () => clearInterval(timer);
  }, [timeLeft, showAnswer, setTimeLeft, gameCard.choices]);
  
  const formattedTime = String(timeLeft).padStart(2, '0');

  return (
    <div className="flex flex-col items-center">
      <div className="h-72 w-[28rem] mt-10 mr-64 flex flex-col items-center justify-center shadow-md rounded-lg p-4 self-end">
        <img src={imageSrc} alt="Game Card" className="max-h-full max-w-full object-cover" />
      </div>
      <div className="mt-10 grid grid-cols-2 *:mx-6 *:my-3 *:h-24 *:w-80 *:text-2xl">
        <Button text={gameCard.choices[0].answer} className="theme-blue" onclick={() => showAnswer(gameCard.choices[0], timeLeft)}/>
        <Button text={gameCard.choices[1].answer} className="theme-green" onclick={() => showAnswer(gameCard.choices[1], timeLeft)}/>
        <Button text={gameCard.choices[2].answer} className="bright-red" onclick={() => showAnswer(gameCard.choices[2], timeLeft)}/>
        <Button text={gameCard.choices[3].answer} className="theme-brown-dark" onclick={() => showAnswer(gameCard.choices[3], timeLeft)}/>
      </div>

      
      <img src={profilePicture} alt="" className='w-20 absolute left-[20rem] top-24 rounded-full object-cover -z-20'/>
 
      <div className="absolute top-32 left-64 flex flex-col items-center justify-centerspace-y-4">
        <div className="border border-b-2 py-6 px-10 h-[11.3rem] content-end shadow-lg rounded-lg -z-50">
          <h2 className="text-2xl text-center mb-2 font-bold">{user?.username}</h2>
          <div className="flex items-center justify-center *:mx-1">
            <span className="text-green-500">{game_player?.correct_answers} </span>
            <span className=""> | </span>
            <span className="text-red-500"> {game_player?.incorrect_answers}</span>
          </div>
          <div className="text-lg text-blue-950 text-center">
            Score: {game_player?.score}
          </div>
        </div>

        <div className="w-44 h-14 flex flex-col items-center justify-center my-4">
          <div className="w-48 h-16 py-4 px-6 shadow-lg rounded-lg theme-brown-light">
            <div className="text-xl text-blue-950 text-center">
              <span className={classNames('inline-block w-10', timeIsRed)}>00</span>
              <span className={classNames(timeIsRed)}>:</span>
              <span className={classNames('inline-block w-10', timeIsRed)}>{formattedTime}</span>
            </div>
          </div>
        </div>

      </div>

      
    </div>
  );}

export default QuestionDisplay;