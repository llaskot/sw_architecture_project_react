import React from 'react';
import Button from './Button';
import { type ButtonHTMLAttributes } from 'react';

// Мы наследуем всё от базовой кнопки
interface SubmitButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    loading?: boolean;
}
const SubmitButton: React.FC<SubmitButtonProps> = ({ loading, ...props }) => {
    return (
        <Button
            {...props}
            disabled={props.disabled || loading}
            type="submit"     // Всегда submit для отправки форм
            style={{
                backgroundColor: (props.disabled || loading) ? '#ccc' : '#28a745',
                cursor: (props.disabled || loading) ? 'not-allowed' : 'pointer',
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