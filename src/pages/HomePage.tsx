import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { type RootState, type AppDispatch } from '../app/store';
import { fetchCategoriesThunk, fetchBrandsThunk } from '../slices/carsSlice';
import { getCars, type Car } from '../api/carsApi';
import CarFilters from '../elements/filters/CarFilters';

const HomePage: React.FC = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch<AppDispatch>();

    const {
        categories,
        brands,
        loadingCategories,
        loadingBrands,
        categoriesLoaded, // Get new flags from store
        brandsLoaded
    } = useSelector((state: RootState) => state.cars);


    const [cars, setCars] = useState<Car[]>([]);
    const [total, setTotal] = useState(0);
    const [loadingCars, setLoadingCars] = useState(true);

    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [selectedBrandIds, setSelectedBrandIds] = useState<string[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [page, setPage] = useState(1);
    const limit = 10;

// Initial reference data fetch
    useEffect(() => {
        // Only fetch if not loaded yet and not currently loading
        if (!categoriesLoaded && !loadingCategories) {
            dispatch(fetchCategoriesThunk());
        }
        if (!brandsLoaded && !loadingBrands) {
            dispatch(fetchBrandsThunk());
        }
    }, [dispatch, categoriesLoaded, brandsLoaded, loadingCategories, loadingBrands]);

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

            selectedCategories.forEach(cat => params.append('categories', cat));
            selectedBrandIds.forEach(id => params.append('brand_ids', id));

            // Re-fetch triggered on every keystroke
            if (searchQuery) {
                params.append('search', searchQuery);
            }

            const data = await getCars(params);
            setCars(data.items || []);
            setTotal(data.total || 0);
        } catch (error) {
            console.error('API Error:', error);
        } finally {
            setLoadingCars(false);
        }
    }, [page, selectedCategories, selectedBrandIds, searchQuery]);

    useEffect(() => {
        fetchCars();
    }, [fetchCars]);

    const handleCategoryToggle = (category: string) => {
        setSelectedCategories(prev =>
            prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]
        );
        setPage(1);
    };

    const handleBrandToggle = (brandId: string) => {
        setSelectedBrandIds(prev =>
            prev.includes(brandId) ? prev.filter(id => id !== brandId) : [...prev, brandId]
        );
        setPage(1);
    };

    // Full reset handler
    const handleClearAll = () => {
        setSelectedCategories([]);
        setSelectedBrandIds([]);
        setSearchQuery('');
        setPage(1);
    };

    const totalPages = Math.ceil(total / limit) || 1;

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
            <CarFilters
                categories={categories}
                selectedCategories={selectedCategories}
                onCategoryToggle={handleCategoryToggle}
                brands={brands}
                selectedBrands={selectedBrandIds}
                onBrandToggle={handleBrandToggle}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                onClearAll={handleClearAll}
            />

            {loadingCars ? (
                <div style={{ textAlign: 'center', padding: '50px' }}>{t('home.loading')}</div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    {cars.map((car) => (
                        <div key={car._id!} style={{ border: '1px solid #eee', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', backgroundColor: '#fff' }}>
                            <h3 style={{ margin: '0 0 10px 0' }}>{car.model?.brand?.name} {car.model?.name}</h3>
                            <div style={{ fontSize: '1.2em', color: '#28a745', fontWeight: 'bold' }}>
                                ${car.price_per_day} / {t('home.pricePerDay')}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <footer style={{ marginTop: '40px', display: 'flex', justifyContent: 'center', gap: '15px', alignItems: 'center' }}>
                <button disabled={page <= 1} onClick={() => setPage(p => p - 1)} style={{ padding: '8px 16px' }}>{t('home.prev')}</button>
                <span>{t('home.pageOf', { page, total: totalPages })}</span>
                <button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)} style={{ padding: '8px 16px' }}>{t('home.next')}</button>
            </footer>
        </div>
    );
};

export default HomePage;