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
            className={props.className || "submit-button"}
        >
            {loading ? '...' : children}
        </Button>
    );
};

export default SubmitButton;