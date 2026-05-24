import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { type AutoModelRead } from '../../../api/carsApi';
import './ModelSelectDropdown.css';

interface ModelSelectDropdownProps {
    models: AutoModelRead[];
    value: string;
    onChange: (modelId: string) => void;
    disabled?: boolean;
}

export const ModelSelectDropdown: React.FC<ModelSelectDropdownProps> = ({
                                                                            models,
                                                                            value,
                                                                            onChange,
                                                                            disabled = false
                                                                        }) => {
    const { t } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const filteredModels = models
        .slice()
        .sort((a, b) => a.name.localeCompare(b.name))
        .filter(model => {
            const fullName = `${model.brand?.name || ''} ${model.name}`.toLowerCase();
            return fullName.includes(searchTerm.toLowerCase());
        });

    const selectedModel = models.find(m => m._id === value);

    const displayValue = isOpen
        ? searchTerm
        : (selectedModel ? `${selectedModel.brand?.name || ''} ${selectedModel.name}`.trim() : '');

    const handleSelect = (modelId: string) => {
        onChange(modelId);
        setIsOpen(false);
        setSearchTerm('');
    };

    return (
        <div className={`model-select-dropdown ${disabled ? 'disabled' : ''}`} ref={dropdownRef}>
            <div className="model-select-input-wrapper">
                <input
                    type="text"
                    className="model-select-input"
                    placeholder={t('admin.car.selectModel', 'Search and select a model...')}
                    value={displayValue}
                    onChange={(e) => {
                        if (!disabled) {
                            setSearchTerm(e.target.value);
                            if (!isOpen) setIsOpen(true);
                        }
                    }}
                    onClick={() => {
                        if (!disabled) {
                            setIsOpen(true);
                            setSearchTerm('');
                        }
                    }}
                    disabled={disabled}
                    readOnly={disabled}
                />
                <span className={`model-select-arrow ${isOpen ? 'open' : ''}`}>▼</span>
            </div>

            {isOpen && !disabled && (
                <ul className="model-select-list">
                    {filteredModels.length > 0 ? (
                        filteredModels.map(model => (
                            <li
                                key={model._id}
                                className={`model-select-item ${model._id === value ? 'selected' : ''}`}
                                onClick={() => handleSelect(model._id)}
                            >
                                {model.brand?.name} {model.name}
                            </li>
                        ))
                    ) : (
                        <li className="model-select-item-empty">
                            {t('admin.car.noModelsFound', 'No models found')}
                        </li>
                    )}
                </ul>
            )}
        </div>
    );
};