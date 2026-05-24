import React from 'react';
import { useTranslation } from 'react-i18next';
import './ModelSelects.css';

interface CategorySelectProps {
    categories: string[];
    value: string;
    onChange: (value: string) => void;
    disabled?: boolean;
}

export const CategorySelect: React.FC<CategorySelectProps> = ({ categories, value, onChange, disabled }) => {
    const { t } = useTranslation();

    return (
        <div className="model-select-wrapper">
            <label className="model-select-label">{t('admin.models.categorySelect', 'Select Category')}</label>
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                disabled={disabled}
                className="model-select-input"
            >
                <option value="">{t('admin.models.chooseCategory', 'Choose a category...')}</option>
                {categories.map((cat) => (
                    <option key={cat} value={cat}>
                        {cat}
                    </option>
                ))}
            </select>
        </div>
    );
};