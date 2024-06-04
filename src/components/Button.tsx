import classNames from 'classnames';

interface ButtonProps {
    text: string;
    className?: string;
    type?: 'button' | 'submit' | 'reset';
    onclick?: () => void;
}

const Button: React.FC<ButtonProps> = ({ type, text, className, onclick }) => {
    return (
        <button type={type} className={classNames('h-12 w-32 rounded-lg text-lg transition-colors hover:shadow-md', className)} onClick={onclick}>
            {text}
        </button>
    );
}

export default Button;