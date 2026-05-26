import React from 'react';
import { useTranslation } from 'react-i18next';
import './CarSort.css';

interface CarSortProps {
    value: string;
    onChange: (val: string) => void;
}

const CarSort: React.FC<CarSortProps> = ({ value, onChange }) => {
    const { t } = useTranslation();

    return (
        <div className="car-sort-wrapper">
            <span className="car-sort-title">{t('sort.label', 'Sort by:')}</span>
            <div className="car-sort-options">
                <label>
                    <input
                        type="radio"
                        name="sort"
                        value="model_asc"
                        checked={value === 'model_asc'}
                        onChange={(e) => onChange(e.target.value)}
                    />
                    {t('sort.modelAsc', 'Model: A-Z')}
                </label>
                <label>
                    <input
                        type="radio"
                        name="sort"
                        value="model_desc"
                        checked={value === 'model_desc'}
                        onChange={(e) => onChange(e.target.value)}
                    />
                    {t('sort.modelDesc', 'Model: Z-A')}
                </label>
                <label>
                    <input
                        type="radio"
                        name="sort"
                        value="price_asc"
                        checked={value === 'price_asc'}
                        onChange={(e) => onChange(e.target.value)}
                    />
                    {t('sort.priceAsc', 'Price: Low to High')}
                </label>
                <label>
                    <input
                        type="radio"
                        name="sort"
                        value="price_desc"
                        checked={value === 'price_desc'}
                        onChange={(e) => onChange(e.target.value)}
                    />
                    {t('sort.priceDesc', 'Price: High to Low')}
                </label>
            </div>
        </div>
    );
};

export default CarSort;