import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { type Brand } from '../../api/carsApi';
import './CarFilters.css'; // Импортируем вынесенные стили

interface CarFiltersProps {
    categories: string[];
    selectedCategories: string[];
    onCategoryToggle: (category: string) => void;

    brands: Brand[];
    selectedBrands: string[];
    onBrandToggle: (brandId: string) => void;

    searchQuery: string;
    onSearchChange: (query: string) => void;
    onClearAll: () => void;
}

const CarFilters: React.FC<CarFiltersProps> = ({
                                                   categories,
                                                   selectedCategories,
                                                   onCategoryToggle,
                                                   brands,
                                                   selectedBrands,
                                                   onBrandToggle,
                                                   searchQuery,
                                                   onSearchChange,
                                                   onClearAll
                                               }) => {
    const { t } = useTranslation();
    const [isBrandOpen, setIsBrandOpen] = useState(false);
    const [brandSearch, setBrandSearch] = useState('');
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close on click outside
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setIsBrandOpen(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    // Filter brands for the dropdown list
    const filteredBrands = useMemo(() => {
        return [...brands]
            .filter(b => b.name.toLowerCase().includes(brandSearch.toLowerCase()))
            .sort((a, b) => a.name.localeCompare(b.name));
    }, [brands, brandSearch]);

    // Map IDs back to objects for chips
    const selectedBrandObjects = useMemo(() => {
        return brands.filter(b => selectedBrands.includes(b._id!));
    }, [brands, selectedBrands]);

    return (
        <section className="car-filters-container">

            {/* Search + Clear All logic */}
            <div className="car-filters-search-row">
                <input
                    type="text"
                    placeholder={t('home.searchPlaceholder', 'Search...')}
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="car-filters-search-input"
                />
                <button
                    onClick={onClearAll}
                    className="car-filters-clear-btn"
                >
                    {t('home.clearAll', 'Clear All')}
                </button>
            </div>

            <div className="car-filters-columns">
                {/* Category chips */}
                <div className="car-filters-categories-box">
                    <strong className="car-filters-categories-title">{t('home.categories', 'Categories')}</strong>
                    <div className="car-filters-categories-chips">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => onCategoryToggle(cat)}
                                className={`car-filters-category-chip ${selectedCategories.includes(cat) ? 'car-filters-category-chip--active' : ''}`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Brands dropdown with internal chips */}
                <div className="car-filters-brands-wrapper" ref={dropdownRef}>
                    <div
                        onClick={() => setIsBrandOpen(!isBrandOpen)}
                        className="car-filters-brands-trigger"
                    >
                        {selectedBrandObjects.length === 0 && (
                            <span className="car-filters-brands-placeholder">{t('home.brands', 'Select Brands')}</span>
                        )}

                        {selectedBrandObjects.map(brand => (
                            <div
                                key={brand._id!}
                                onClick={(e) => e.stopPropagation()}
                                className="car-filters-brand-chip"
                            >
                                <span>{brand.name}</span>
                                <button
                                    onClick={() => onBrandToggle(brand._id!)}
                                    className="car-filters-brand-chip-remove"
                                >
                                    ×
                                </button>
                            </div>
                        ))}
                        <span className="car-filters-brands-arrow">{isBrandOpen ? '▲' : '▼'}</span>
                    </div>

                    {isBrandOpen && (
                        <div className="car-filters-brands-menu">
                            <div className="car-filters-brands-search-wrapper">
                                <input
                                    type="text"
                                    placeholder={t('home.filterBrandSearch', 'Quick search...')}
                                    value={brandSearch}
                                    onChange={(e) => setBrandSearch(e.target.value)}
                                    className="car-filters-brands-search-input"
                                    onClick={(e) => e.stopPropagation()}
                                />
                            </div>

                            <div className="car-filters-brands-list">
                                {filteredBrands.map(brand => (
                                    <label key={brand._id!} className="car-filters-brand-label">
                                        <input
                                            type="checkbox"
                                            checked={selectedBrands.includes(brand._id!)}
                                            onChange={() => onBrandToggle(brand._id!)}
                                        />
                                        <span>{brand.name}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default CarFilters;