import React, {useState} from 'react';
import Input from './Input';
import {type InputHTMLAttributes} from 'react';

interface PasswordInputProps extends InputHTMLAttributes<HTMLInputElement> {
    error?: string;
    label?: string;
}
const PasswordInput: React.FC<PasswordInputProps> = ({label, ...props}) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div style={{ position: 'relative' }}>
            <Input
                {...props}
                label={label} // Передаем лейбл в базовый Input
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
            />
            <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                    position: 'absolute',
                    right: '10px',
                    // Вместо top: 35px делаем так:
                    bottom: '7px', // Привязываем к низу контейнера (где инпут)
                    transform: 'translateY(-50%)', // Идеальное центрирование
                    height: '40px', // Высота как у инпута для точности
                    display: 'flex',
                    alignItems: 'center',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '1.2rem',
                    zIndex: 10
                }}
            >
                {showPassword ? '🔒' : '👁️'}
            </button>

        </div>
    );
};

export default PasswordInput;