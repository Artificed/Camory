import GameCard from "../models/GameCard";
import GraphBar from "./GraphBar";

interface AnswerDisplayProps {
  gameCard: GameCard;
  answer: string;
  nextQuestion: () => void;
}

const AnswerDisplay: React.FC<AnswerDisplayProps> = ({ gameCard, answer, nextQuestion }) => { // Hardcoded
  const maxClickedTimes = Math.max(...gameCard.choices.map(choice => choice.clicked_times));

  return (
    <div className="flex flex-col items-center">
      <div className="h-96 mt-20 grid grid-cols-4 px-5 border-b border-black">
        <GraphBar clickedTimes={gameCard.choices[0].clicked_times} maxClickedTimes={maxClickedTimes} colorClass="theme-blue" />
        <GraphBar clickedTimes={gameCard.choices[1].clicked_times} maxClickedTimes={maxClickedTimes} colorClass="theme-green" />
        <GraphBar clickedTimes={gameCard.choices[2].clicked_times} maxClickedTimes={maxClickedTimes} colorClass="bright-red" />
        <GraphBar clickedTimes={gameCard.choices[3].clicked_times} maxClickedTimes={maxClickedTimes} colorClass="theme-brown-dark" />
      </div>
      <div className="absolute translate-y-96 mt-20 grid grid-cols-4 px-5 *:mx-10 *:w-24 *:flex *:justify-center">
        <div>{gameCard.choices[0].answer}</div>
        <div>{gameCard.choices[1].answer}</div>
        <div>{gameCard.choices[2].answer}</div>
        <div>{gameCard.choices[3].answer}</div>
      </div>
      <div className="mt-14 text-center text-2xl text-blue-950">Correct Answer is...</div>
      <div className="mt-6 px-8 py-3 text-xl theme-green text-green-900 rounded-lg">{answer}</div>
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" 
        className="size-24 absolute right-10 top-1/2 transform -translate-y-1/2 cursor-pointer" onClick={nextQuestion}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m5.25 4.5 7.5 7.5-7.5 7.5m6-15 7.5 7.5-7.5 7.5" />
      </svg>
    </div>
  );
};

export default AnswerDisplay;
