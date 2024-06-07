interface GraphBarProps {
  clickedTimes: number;
  maxClickedTimes: number;
  colorClass: string;
}

const GraphBar: React.FC<GraphBarProps> = ({ clickedTimes, maxClickedTimes, colorClass }) => {
  return (
    <div className="flex flex-col justify-end items-center">
      <div className={`${colorClass} mx-10 w-24 flex justify-center items-end`} style={{ height: `${(clickedTimes / maxClickedTimes) * 100}%` }}>
        {clickedTimes}
      </div>
    </div>
  );
};

export default GraphBar;