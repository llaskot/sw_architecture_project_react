import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { type Brand } from '../../../api/carsApi';
import './ModelSelects.css'; // Используем те же стили, что и для ModelSelectDropdown

interface BrandSelectProps {
    brands: Brand[];
    value: string;
    onChange: (brandId: string) => void;
    disabled?: boolean;
}

export const BrandSelect: React.FC<BrandSelectProps> = ({
                                                            brands,
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

    const filteredBrands = brands
        .slice()
        .sort((a, b) => a.name.localeCompare(b.name))
        .filter(brand => brand.name.toLowerCase().includes(searchTerm.toLowerCase()));

    const selectedBrand = brands.find(b => b._id === value);

    const displayValue = isOpen
        ? searchTerm
        : (selectedBrand ? selectedBrand.name : '');

    const handleSelect = (brandId: string) => {
        onChange(brandId);
        setIsOpen(false);
        setSearchTerm('');
    };

    return (
        <div className={`model-select-dropdown ${disabled ? 'disabled' : ''}`} ref={dropdownRef}>
            <div className="model-select-input-wrapper">
                <label className="model-select-label">{t('admin.models.brandSelect', 'Brand')}</label>
                <input
                    type="text"
                    className="model-select-input"
                    placeholder={t('admin.models.searchBrand', 'Search brand...')}
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
                    {filteredBrands.length > 0 ? (
                        filteredBrands.map(brand => (
                            <li
                                key={brand._id}
                                className={`model-select-item ${brand._id === value ? 'selected' : ''}`}
                                onClick={() => handleSelect(brand._id)}
                            >
                                {brand.name}
                            </li>
                        ))
                    ) : (
                        <li className="model-select-item-empty">
                            {t('admin.models.noBrandsFound', 'No brands found')}
                        </li>
                    )}
                </ul>
            )}
        </div>
    );
};