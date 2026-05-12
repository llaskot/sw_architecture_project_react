import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { type RootState, type AppDispatch } from '../app/store';
import { fetchCategoriesThunk } from '../slices/carsSlice';
import { getCars, type Car } from '../api/carsApi';
import CarFilters from '../elements/filters/CarFilters';

const HomePage: React.FC = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch<AppDispatch>();

    // 1. Данные из Redux
    const { categories, loadingCategories } = useSelector((state: RootState) => state.cars);

    // 2. Локальное состояние для управления списком машин
    const [cars, setCars] = useState<Car[]>([]);
    const [total, setTotal] = useState(0);
    const [loadingCars, setLoadingCars] = useState(true);

    // 3. Состояние фильтрации и пагинации
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [page, setPage] = useState(1);
    const limit = 10;

    // Загрузка категорий при монтировании (если их еще нет в сторе)
    useEffect(() => {
        if (categories.length === 0 && !loadingCategories) {
            dispatch(fetchCategoriesThunk());
        }
    }, [dispatch, categories.length, loadingCategories]);

    // Основная функция загрузки машин
    const fetchCars = useCallback(async () => {
        setLoadingCars(true);
        try {
            const params = new URLSearchParams({
                sort_price: 'desc',
                sort_model: 'asc',
                hide_inactive: 'true',
                page: page.toString(),
                limit: limit.toString()
            });

            // Добавляем выбранные категории в URL параметры
            selectedCategories.forEach(cat => params.append('categories', cat));

            // Здесь в будущем можно добавить params.append('search', searchQuery)
            // если бекенд поддержит поиск

            const data = await getCars(params);
            setCars(data.items || []);
            setTotal(data.total || 0);
        } catch (error) {
            console.error('Failed to load cars:', error);
        } finally {
            setLoadingCars(false);
        }
    }, [page, selectedCategories]);

    // Перезагружаем машины при изменении страницы или фильтров
    useEffect(() => {
        fetchCars();
    }, [fetchCars]);

    // Обработчик переключения категорий
    const handleCategoryToggle = (category: string) => {
        setSelectedCategories(prev =>
            prev.includes(category)
                ? prev.filter(c => c !== category)
                : [...prev, category]
        );
        setPage(1); // При смене фильтра всегда возвращаемся на 1 страницу
    };

    const totalPages = Math.ceil(total / limit) || 1;

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>

            {/* Секция фильтров и поиска */}
            <CarFilters
                categories={categories}
                selectedCategories={selectedCategories}
                onCategoryToggle={handleCategoryToggle}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
            />

            {/* Сетка машин */}
            {loadingCars ? (
                <div style={{ textAlign: 'center', padding: '50px' }}>{t('home.loading', 'Loading cars...')}</div>
            ) : (
                <>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '20px'
                    }}>
                        {cars.map((car, idx) => (
                            <div key={car._id || idx} style={{
                                border: '1px solid #eee',
                                padding: '20px',
                                borderRadius: '12px',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                            }}>
                                <h3 style={{ margin: '0 0 10px 0' }}>
                                    {car.model?.brand?.name} {car.model?.name}
                                </h3>
                                <div style={{ fontSize: '1.2em', color: '#28a745', fontWeight: 'bold' }}>
                                    ${car.price_per_day}
                                    <span style={{ fontSize: '0.7em', color: '#666', fontWeight: 'normal' }}>
                                        / {t('home.pricePerDay', 'day')}
                                    </span>
                                </div>
                                <div style={{ marginTop: '10px', color: '#888', fontSize: '0.9em' }}>
                                    {car.year} | {car.color}
                                </div>
                            </div>
                        ))}
                    </div>

                    {!loadingCars && cars.length === 0 && (
                        <div style={{ textAlign: 'center', padding: '50px', color: '#999' }}>
                            {t('home.noCars', 'No cars found matching your criteria.')}
                        </div>
                    )}
                </>
            )}

            {/* Пагинация */}
            <footer style={{
                marginTop: '40px',
                display: 'flex',
                justifyContent: 'center',
                gap: '15px',
                alignItems: 'center'
            }}>
                <button
                    disabled={page <= 1}
                    onClick={() => setPage(p => p - 1)}
                    style={{ padding: '8px 16px', cursor: page <= 1 ? 'default' : 'pointer' }}
                >
                    {t('home.prev', 'Prev')}
                </button>

                <span style={{ fontWeight: '500' }}>
                    {t('home.pageOf', { page, total: totalPages })}
                </span>

                <button
                    disabled={page >= totalPages}
                    onClick={() => setPage(p => p + 1)}
                    style={{ padding: '8px 16px', cursor: page >= totalPages ? 'default' : 'pointer' }}
                >
                    {t('home.next', 'Next')}
                </button>
            </footer>
        </div>
    );
};

export default HomePage;