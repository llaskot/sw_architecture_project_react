import React from 'react';
import { type ButtonHTMLAttributes } from 'react';
import Button from './Button';
import './SubmitButton.css';

// We inherit everything from the base button, adding only the loading state flag
interface SubmitButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    loading?: boolean;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({ children, loading, ...props }) => {
    return (
        <Button
            {...props}
            type="submit" // Always submit for form submission
            className="submit-button"
            style={{
                backgroundColor: (props.disabled || loading) ? '#aaa' : '#28a745',
                cursor: (props.disabled || loading) ? 'not-allowed' : 'pointer',
                ...props.style
            }}
        >
            {loading ? '...' : children}
        </Button>
    );
};

export default SubmitButton;