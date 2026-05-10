import React from 'react';
import Input from './Input';
import { type InputHTMLAttributes } from 'react';

interface PasswordInputProps extends InputHTMLAttributes<HTMLInputElement> {
    error?: string;
}

const PasswordInput: React.FC<PasswordInputProps> = (props) => {
    return (
        <Input
            {...props}
    type="password" // Фиксируем тип для пароля
    autoComplete="current-password"
        />
);
};

export default PasswordInput;