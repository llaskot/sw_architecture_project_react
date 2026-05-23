import React, { type ButtonHTMLAttributes, type ReactNode } from 'react';
import './Button.css';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode;
}

const Button: React.FC<ButtonProps> = ({ children, className, ...rest }) => {
    return (
        <button
            {...rest}
            className={className ? `${className}` : "button base-button"}
        >
            {children}
        </button>
    );
};

export default Button;