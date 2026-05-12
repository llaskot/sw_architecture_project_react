import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { type Brand } from '../../api/carsApi';

interface CarFiltersProps {
    categories: string[];
    selectedCategories: string[];
    onCategoryToggle: (category: string) => void;

    brands: Brand[];
    selectedBrands: string[]; // Массив ID выбранных брендов
    onBrandToggle: (brandId: string) => void;

    searchQuery: string;
    onSearchChange: (query: string) => void;
}

const CarFilters: React.FC<CarFiltersProps> = ({
                                                   categories,
                                                   selectedCategories,
                                                   onCategoryToggle,
                                                   brands,
                                                   selectedBrands,
                                                   onBrandToggle,
                                                   searchQuery,
                                                   onSearchChange
                                               }) => {
    const { t } = useTranslation();
    const [isBrandOpen, setIsBrandOpen] = useState(false);
    const [brandSearch, setBrandSearch] = useState('');
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Закрытие при клике вне
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsBrandOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Локальный поиск в дропдауне
    const filteredBrands = useMemo(() => {
        return [...brands]
            .filter(b => b.name.toLowerCase().includes(brandSearch.toLowerCase()))
            .sort((a, b) => a.name.localeCompare(b.name));
    }, [brands, brandSearch]);

    // Получаем массив объектов выбранных брендов для отображения "чипсов"
    const selectedBrandObjects = useMemo(() => {
        return brands.filter(b => selectedBrands.includes(b._id!));
    }, [brands, selectedBrands]);

    return (
        <section style={{ marginBottom: '30px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {/* 1. Поиск по модели */}
            <input
                type="text"
                placeholder={t('home.searchPlaceholder', 'Search by model...')}
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ddd', width: '100%', outline: 'none' }}
            />

            <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
                {/* 2. Категории */}
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
                                    color: selectedCategories.includes(cat) ? '#fff' : '#007bff',
                                    fontSize: '13px', transition: 'all 0.2s'
                                }}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* 3. Дропдаун Брендов (Контейнер с чипсами) */}
                <div style={{ flex: 1, position: 'relative' }} ref={dropdownRef}>
                    <div
                        onClick={() => setIsBrandOpen(!isBrandOpen)}
                        style={{
                            width: '100%', minHeight: '52px', padding: '10px 15px', borderRadius: '8px', border: '1px solid #eee',
                            backgroundColor: '#fff', cursor: 'pointer', display: 'flex', flexWrap: 'wrap',
                            alignItems: 'center', gap: '8px', position: 'relative'
                        }}
                    >
                        {/* Если ничего не выбрано - показываем текст */}
                        {selectedBrandObjects.length === 0 && (
                            <span style={{ color: '#aaa', fontWeight: 'bold' }}>{t('home.brands', 'Select Brands')}</span>
                        )}

                        {/* Список выбранных айтемов (чипсов) */}
                        {selectedBrandObjects.map(brand => (
                            <div
                                key={brand._id}
                                onClick={(e) => e.stopPropagation()} // Чтобы не закрывался дропдаун при клике на чипс
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: '#f0f2f5',
                                    padding: '4px 10px', borderRadius: '6px', fontSize: '13px', border: '1px solid #dcdfe6'
                                }}
                            >
                                <span>{brand.name}</span>
                                <button
                                    onClick={() => onBrandToggle(brand._id!)}
                                    style={{
                                        border: 'none', background: 'none', cursor: 'pointer', padding: '0 2px',
                                        fontSize: '14px', fontWeight: 'bold', color: '#909399', display: 'flex', alignItems: 'center'
                                    }}
                                >
                                    ×
                                </button>
                            </div>
                        ))}

                        {/* Иконка стрелочки в углу */}
                        <span style={{ marginLeft: 'auto', color: '#666', fontSize: '12px' }}>
                            {isBrandOpen ? '▲' : '▼'}
                        </span>
                    </div>

                    {/* Выпадающий список (без изменений логики) */}
                    {isBrandOpen && (
                        <div style={{
                            position: 'absolute', top: '100%', left: 0, zIndex: 100,
                            width: 'max-content', maxWidth: '66vw', minWidth: '100%',
                            marginTop: '5px', backgroundColor: '#fff', border: '1px solid #ddd',
                            borderRadius: '8px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', overflow: 'hidden'
                        }}>
                            <div style={{ padding: '10px', borderBottom: '1px solid #eee', backgroundColor: '#f9f9f9' }}>
                                <input
                                    type="text"
                                    placeholder={t('home.filterBrandSearch', 'Filter...')}
                                    value={brandSearch}
                                    onChange={(e) => setBrandSearch(e.target.value)}
                                    style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc', outline: 'none' }}
                                    onClick={(e) => e.stopPropagation()}
                                />
                            </div>

                            <div style={{ maxHeight: '300px', overflowY: 'auto', padding: '5px' }}>
                                {filteredBrands.length > 0 ? (
                                    filteredBrands.map(brand => (
                                        <label
                                            key={brand._id}
                                            style={{
                                                display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 12px',
                                                cursor: 'pointer', transition: 'background 0.2s', borderRadius: '4px'
                                            }}
                                            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f5f7fa')}
                                            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={selectedBrands.includes(brand._id!)}
                                                onChange={() => onBrandToggle(brand._id!)}
                                                style={{ cursor: 'pointer', width: '16px', height: '16px' }}
                                            />
                                            <span style={{ fontSize: '14px' }}>{brand.name}</span>
                                        </label>
                                    ))
                                ) : (
                                    <div style={{ padding: '20px', textAlign: 'center', color: '#999' }}>{t('home.noBrandsFound', 'Not found')}</div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default CarFilters;