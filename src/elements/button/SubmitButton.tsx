import React from 'react';
import Button from './Button';
import { type ButtonHTMLAttributes } from 'react';

// Мы наследуем всё от базовой кнопки
interface SubmitButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {}

const SubmitButton: React.FC<SubmitButtonProps> = (props) => {
    return (
        <Button
            {...props}
            type="submit" // Всегда submit для отправки форм
            style={{
                backgroundColor: props.disabled ? '#ccc' : '#28a745', // Зеленая кнопка для входа
                fontWeight: 'bold',
                marginTop: '1rem',
                ...props.style
            }}
        >
            {props.children}
        </Button>
    );
};

export default SubmitButton;