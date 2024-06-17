import classNames from 'classnames';

interface Message {
    errorMessage: string;
    className?: string;
}
  
const WarningMessage: React.FC<Message> = ({ className, errorMessage }) => {
return (
    <div className={classNames("flex flex-row items-center", className)}> 
        <div className="relative flex h-3 w-3">
            <div className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></div>
            <div className="relative inline-flex rounded-full h-3 w-3 bg-yellow-500"></div>
        </div>
        {errorMessage && <div className="text-yellow-500 mx-3">{errorMessage}</div>}
    </div>
);}

export default WarningMessage;