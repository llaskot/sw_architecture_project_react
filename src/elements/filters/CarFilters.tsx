import React from 'react';
import { useTranslation } from 'react-i18next';

interface CarFiltersProps {
    categories: string[];
    selectedCategories: string[];
    onCategoryToggle: (category: string) => void;
    searchQuery: string;
    onSearchChange: (query: string) => void;
}

const CarFilters: React.FC<CarFiltersProps> = ({
                                                   categories,
                                                   selectedCategories,
                                                   onCategoryToggle,
                                                   searchQuery,
                                                   onSearchChange
                                               }) => {
    const { t } = useTranslation();

    return (
        <section style={{ marginBottom: '30px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {/* Поиск */}
            <input
                type="text"
                placeholder={t('home.searchPlaceholder', 'Search cars...')}
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ddd', width: '100%' }}
            />

            <div style={{ display: 'flex', gap: '20px' }}>
                {/* Фильтр Категорий */}
                <div style={{ flex: 1, padding: '15px', border: '1px solid #eee', borderRadius: '8px' }}>
                    <strong style={{ display: 'block', marginBottom: '10px' }}>
                        {t('home.categories', 'Categories')}
                    </strong>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => onCategoryToggle(cat)}
                                style={{
                                    padding: '6px 12px',
                                    borderRadius: '20px',
                                    border: '1px solid #007bff',
                                    cursor: 'pointer',
                                    backgroundColor: selectedCategories.includes(cat) ? '#007bff' : '#fff',
                                    color: selectedCategories.includes(cat) ? '#fff' : '#007bff',
                                    fontSize: '14px'
                                }}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Заглушка для второго фильтра (Бренды) */}
                <div style={{ flex: 1, padding: '15px', border: '1px dashed #ccc', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999' }}>
                    {t('home.filterBrandStub', '[ Brand Filter Placeholder ]')}
                </div>
            </div>
        </section>
    );
};

export default CarFilters;