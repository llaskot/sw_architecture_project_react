import React, { type ButtonHTMLAttributes, type ReactNode } from 'react';
import './Button.css';

// Наследует все стандартные атрибуты кнопки (onClick, type, disabled, title и т.д.)
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode;
}

const Button: React.FC<ButtonProps> = ({ children, style, ...rest }) => {
    return (
        <button
            {...rest} // Передаем все остальные параметры (onClick, type и т.д.) автоматически
            className="base-button"
            style={{
                backgroundColor: rest.disabled ? '#ccc' : '#007bff',
                cursor: rest.disabled ? 'not-allowed' : 'pointer',
                ...style // переопределять стили через пропсы
            }}
        >
            {children}
        </button>
    );
};

export default Button;