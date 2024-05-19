import classNames from 'classnames';

interface ButtonProps {
    text: string;
    className?: string;
    type?: 'button' | 'submit' | 'reset';
    onclick?: () => void;
}

const Button: React.FC<ButtonProps> = ({ type, text, className, onclick }) => {
    return (
        <button type={type} className={classNames('h-12 w-40 rounded-lg border border-gray-400 text-xl', className)} onClick={onclick}>
            {text}
        </button>
    );
}

export default Button;