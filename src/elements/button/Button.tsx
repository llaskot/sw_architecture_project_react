import React, { type ButtonHTMLAttributes, type ReactNode } from 'react';

// Наследуем все стандартные атрибуты кнопки (onClick, type, disabled, title и т.д.)
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode;
}

const Button: React.FC<ButtonProps> = ({ children, style, ...rest }) => {
    return (
        <button
            {...rest} // Передаем все остальные параметры (onClick, type и т.д.) автоматически
            style={{
                width: '100%',
                padding: '0.6rem',
                borderRadius: '4px',
                backgroundColor: rest.disabled ? '#ccc' : '#007bff',
                color: 'white',
                border: 'none',
                cursor: rest.disabled ? 'not-allowed' : 'pointer',
                marginBottom: '0.5rem',
                ...style // Позволяем переопределять стили через пропсы
            }}
        >
            {children}
        </button>
    );
};

export default Button;