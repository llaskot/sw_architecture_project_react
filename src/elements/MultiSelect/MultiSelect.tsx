import React, { useState, useRef, useEffect } from 'react';
import './MultiSelect.css';

interface MultiSelectProps {
    label?: string;
    options: string[];
    selectedValues: string[];
    onChange: (values: string[]) => void;
    placeholder?: string;
}

const MultiSelect: React.FC<MultiSelectProps> = ({
                                                     label,
                                                     options,
                                                     selectedValues,
                                                     onChange,
                                                     placeholder = 'Select options'
                                                 }) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside of the component
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleToggleOption = (option: string) => {
        const isSelected = selectedValues.includes(option);
        const newSelected = isSelected
            ? selectedValues.filter((val) => val !== option)
            : [...selectedValues, option];
        onChange(newSelected);
    };

    return (
        <div className="custom-multiselect" ref={containerRef}>
            {label && <label className="custom-multiselect__label">{label}</label>}

            <div
                className={`custom-multiselect__trigger ${isOpen ? 'custom-multiselect__trigger--open' : ''}`}
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className="custom-multiselect__display">
                    {selectedValues.length === 0
                        ? placeholder
                        : selectedValues.join(', ')}
                </span>
                <span className="custom-multiselect__arrow">▼</span>
            </div>

            {isOpen && (
                <div className="custom-multiselect__dropdown">
                    {options.map((option) => {
                        const isChecked = selectedValues.includes(option);
                        return (
                            <label key={option} className="custom-multiselect__item">
                                <input
                                    type="checkbox"
                                    checked={isChecked}
                                    onChange={() => handleToggleOption(option)}
                                    className="custom-multiselect__checkbox"
                                />
                                <span className="custom-multiselect__text">{option}</span>
                            </label>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default MultiSelect;