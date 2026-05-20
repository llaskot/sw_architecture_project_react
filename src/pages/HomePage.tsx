import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { type RootState, type AppDispatch } from '../app/store';
import { fetchCategoriesThunk, fetchBrandsThunk } from '../slices/carsSlice';
import { getCars, type Car } from '../api/carsApi';
import CarFilters from '../elements/filters/CarFilters';
import CarCard from "../elements/carCard/CarCard.tsx";
import './HomePage.css';

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
        <div className="home-page-container">
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
                <div className="home-page-loading">{t('home.loading')}</div>
            ) : (
                <div className="home-page-grid">
                    {cars.map((car) => (
                        <CarCard key={car._id} car={car} />
                    ))}
                </div>
            )}

            <footer className="home-page-footer">
                <button
                    disabled={page <= 1}
                    onClick={() => setPage(p => p - 1)}
                    className="home-page-pagination-btn"
                >
                    {t('home.prev')}
                </button>
                <span>{t('home.pageOf', { page, total: totalPages })}</span>
                <button
                    disabled={page >= totalPages}
                    onClick={() => setPage(p => p + 1)}
                    className="home-page-pagination-btn"
                >
                    {t('home.next')}
                </button>
            </footer>
        </div>
    );
};

export default HomePage;