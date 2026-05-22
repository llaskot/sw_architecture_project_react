import React, { type InputHTMLAttributes } from 'react';
import './Input.css';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    error?: string;
    label?: string;
}

const Input: React.FC<InputProps> = ({
                                         label,
                                         error,
                                         style,
                                         className,
                                         disabled,
                                         ...rest
                                     }) => {
    return (
        <div className="custom-input-wrapper">
            {label && (
                <label className="custom-input-label">
                    {label}
                </label>
            )}
            <input
                className={`custom-input-field ${error ? 'custom-input-field--error' : ''} ${disabled ? 'custom-input-field--disabled' : ''} ${className || ''}`}
                disabled={disabled}
                style={style}
                {...rest}
            />
            {error && (
                <div className="custom-input-error-text">
                    {error}
                </div>
            )}
        </div>
    );
};

export default Input;