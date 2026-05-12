import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { type Brand } from '../../api/carsApi';

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
        <section style={{ marginBottom: '30px', display: 'flex', flexDirection: 'column', gap: '15px' }}>

            {/* Search + Clear All logic */}
            <div style={{ display: 'flex', gap: '12px' }}>
                <input
                    type="text"
                    placeholder={t('home.searchPlaceholder', 'Search...')}
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #ddd', outline: 'none' }}
                />
                <button
                    onClick={onClearAll}
                    style={{
                        padding: '0 20px', borderRadius: '8px', border: '1px solid #ff4d4f',
                        backgroundColor: '#fff', color: '#ff4d4f', cursor: 'pointer', fontWeight: 'bold'
                    }}
                >
                    {t('home.clearAll', 'Clear All')}
                </button>
            </div>

            <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
                {/* Category chips */}
                <div style={{ flex: 1, padding: '15px', border: '1px solid #eee', borderRadius: '8px', backgroundColor: '#fff' }}>
                    <strong style={{ display: 'block', marginBottom: '10px' }}>{t('home.categories', 'Categories')}</strong>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => onCategoryToggle(cat)}
                                style={{
                                    padding: '6px 12px', borderRadius: '20px', border: '1px solid #007bff', cursor: 'pointer',
                                    backgroundColor: selectedCategories.includes(cat) ? '#007bff' : '#fff',
                                    color: selectedCategories.includes(cat) ? '#fff' : '#007bff', fontSize: '13px'
                                }}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Brands dropdown with internal chips */}
                <div style={{ flex: 1, position: 'relative' }} ref={dropdownRef}>
                    <div
                        onClick={() => setIsBrandOpen(!isBrandOpen)}
                        style={{
                            width: '100%', minHeight: '52px', padding: '10px 15px', borderRadius: '8px', border: '1px solid #eee',
                            backgroundColor: '#fff', cursor: 'pointer', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px'
                        }}
                    >
                        {selectedBrandObjects.length === 0 && (
                            <span style={{ color: '#aaa', fontWeight: 'bold' }}>{t('home.brands', 'Select Brands')}</span>
                        )}

                        {selectedBrandObjects.map(brand => (
                            <div
                                key={brand._id!}
                                onClick={(e) => e.stopPropagation()}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: '#f0f2f5',
                                    padding: '4px 10px', borderRadius: '6px', fontSize: '13px', border: '1px solid #dcdfe6'
                                }}
                            >
                                <span>{brand.name}</span>
                                <button
                                    onClick={() => onBrandToggle(brand._id!)}
                                    style={{ border: 'none', background: 'none', cursor: 'pointer', fontWeight: 'bold', color: '#909399' }}
                                >
                                    ×
                                </button>
                            </div>
                        ))}
                        <span style={{ marginLeft: 'auto', color: '#666' }}>{isBrandOpen ? '▲' : '▼'}</span>
                    </div>

                    {isBrandOpen && (
                        <div style={{
                            position: 'absolute', top: '100%', left: 0, zIndex: 100, width: 'max-content', maxWidth: '66vw', minWidth: '100%',
                            marginTop: '5px', backgroundColor: '#fff', border: '1px solid #ddd', borderRadius: '8px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
                        }}>
                            <div style={{ padding: '10px', borderBottom: '1px solid #eee' }}>
                                <input
                                    type="text"
                                    placeholder={t('home.filterBrandSearch', 'Quick search...')}
                                    value={brandSearch}
                                    onChange={(e) => setBrandSearch(e.target.value)}
                                    style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc', outline: 'none' }}
                                    onClick={(e) => e.stopPropagation()}
                                />
                            </div>

                            <div style={{ maxHeight: '300px', overflowY: 'auto', padding: '5px' }}>
                                {filteredBrands.map(brand => (
                                    <label key={brand._id!} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 12px', cursor: 'pointer' }}>
                                        <input
                                            type="checkbox"
                                            checked={selectedBrands.includes(brand._id!)}
                                            onChange={() => onBrandToggle(brand._id!)}
                                        />
                                        <span style={{ fontSize: '14px' }}>{brand.name}</span>
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