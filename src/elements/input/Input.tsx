import React, { type InputHTMLAttributes } from 'react';

// Наследуем все стандартные свойства инпута (value, onChange, type, name и т.д.)
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    error?: string;
    label?: string;
}

const Input: React.FC<InputProps> = ({ label, error, style, ...rest }) => {
    return (
        <div style={{ marginBottom: '1.2rem', textAlign: 'left', width: '100%' }}>
            {label && (
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '0.9rem' }}>
                    {label}
                </label>
            )}
            <input
                {...rest} // Пробрасываем все стандартные атрибуты
                style={{
                    width: '100%',
                    padding: '0.6rem',
                    borderRadius: '4px',
                    border: error ? '1px solid red' : '1px solid #ccc',
                    boxSizing: 'border-box',
                    fontSize: '1rem',
                    outline: 'none',
                    ...style // Позволяем точечно переопределять стили при вызове
                }}
            />
            {/* Если есть ошибка, отображаем её под полем */}
            {error && (
                <div style={{ color: 'red', fontSize: '0.8rem', marginTop: '0.2rem' }}>
                    {error}
                </div>
            )}
        </div>
    );
};

export default Input;