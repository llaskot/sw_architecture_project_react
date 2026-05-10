import React from 'react';
import Input from './Input';
import { type InputHTMLAttributes } from 'react';

interface LoginInputProps extends InputHTMLAttributes<HTMLInputElement> {
    error?: string;
}

const LoginInput: React.FC<LoginInputProps> = (props) => {
    return (
        <Input
            {...props}
            type="text" // Фиксируем тип для логина
            autoComplete="username"
        />
    );
};

export default LoginInput;