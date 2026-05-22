import React, {type TextareaHTMLAttributes } from 'react';
import './Textarea.css';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    error?: string;
}

const Textarea: React.FC<TextareaProps> = ({
                                               label,
                                               error,
                                               style,
                                               className,
                                               disabled, // Вытаскиваем disabled
                                               ...rest
                                           }) => {
    return (
        <div style={style} className="textarea-wrapper">
            {label && (
                <label className="textarea-label">
                    {label}
                </label>
            )}
            <textarea
                className={`custom-textarea ${error ? 'custom-textarea--error' : ''} ${disabled ? 'custom-textarea--disabled' : ''} ${className || ''}`}
                disabled={disabled}
                {...rest}
            />
            {error && (
                <div className="textarea-error-msg">
                    {error}
                </div>
            )}
        </div>
    );
};

export default Textarea;