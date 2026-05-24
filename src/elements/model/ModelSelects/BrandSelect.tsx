import React from 'react';
import { useTranslation } from 'react-i18next';
import { type Brand } from '../../../api/carsApi';
import './ModelSelects.css';

interface BrandSelectProps {
    brands: Brand[];
    value: string;
    onChange: (value: string) => void;
    disabled?: boolean;
}

export const BrandSelect: React.FC<BrandSelectProps> = ({ brands, value, onChange, disabled }) => {
    const { t } = useTranslation();

    return (
        <div className="model-select-wrapper">
            <label className="model-select-label">{t('admin.models.brandSelect', 'Select Brand')}</label>
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                disabled={disabled}
                className="model-select-input"
            >
                <option value="">{t('admin.models.chooseBrand', 'Choose a brand...')}</option>
                {brands.map((brand) => (
                    <option key={brand._id} value={brand._id}>
                        {brand.name}
                    </option>
                ))}
            </select>
        </div>
    );
};