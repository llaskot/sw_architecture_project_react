import React, { useState, useRef, useEffect } from 'react';
import './StageDropdown.css';

export interface StageOption {
    value: string;
    label: string;
}

export interface StageDropdownProps {
    options: StageOption[];
    value: string | null;
    onChange: (value: string) => void;
    placeholder?: string;
    label?: string;
    error?: string;
    disabled?: boolean;
}

const StageDropdown: React.FC<StageDropdownProps> = ({
                                                         options,
                                                         value,
                                                         onChange,
                                                         placeholder,
                                                         label,
                                                         error,
                                                         disabled = false
                                                     }) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (optionValue: string) => {
        onChange(optionValue);
        setIsOpen(false);
    };

    const selectedOption = options.find(opt => opt.value === value);

    return (
        <div className="stage-dropdown-wrapper" ref={containerRef}>
            {label && <label className="stage-dropdown-label">{label}</label>}

            <div
                className={`stage-dropdown-trigger ${isOpen ? 'stage-dropdown-trigger--open' : ''} ${error ? 'stage-dropdown-trigger--error' : ''} ${disabled ? 'stage-dropdown-trigger--disabled' : ''}`}
                onClick={() => !disabled && setIsOpen(!isOpen)}
            >
                <span className="stage-dropdown-display">
                    {selectedOption ? selectedOption.label : (placeholder || '')}
                </span>
                <span className="stage-dropdown-arrow">▼</span>
            </div>

            {isOpen && !disabled && (
                <div className="stage-dropdown-menu">
                    {options.length > 0 ? (
                        options.map((option) => (
                            <div
                                key={option.value}
                                className={`stage-dropdown-option ${value === option.value ? 'stage-dropdown-option--selected' : ''}`}
                                onClick={() => handleSelect(option.value)}
                            >
                                {option.label}
                            </div>
                        ))
                    ) : (
                        <div className="stage-dropdown-empty">
                            No options
                        </div>
                    )}
                </div>
            )}

            {error && (
                <div className="stage-dropdown-error-msg">
                    {error}
                </div>
            )}
        </div>
    );
};

export default StageDropdown;