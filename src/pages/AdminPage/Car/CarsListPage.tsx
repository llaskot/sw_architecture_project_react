import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { type RootState, type AppDispatch } from '../../../app/store';
import { fetchCategoriesThunk, fetchBrandsThunk } from '../../../slices/carsSlice';
import { getCars, deleteCar, type Car } from '../../../api/carsApi';
import { SectionNavigation } from '../../../elements/navigation/SectionNavigation/SectionNavigation';
import CarFilters from '../../../elements/filters/CarFilters';
import { CarsTable } from '../../../elements/car/CarsTable/CarsTable';
import Pagination from '../../../elements/Pagination/Pagination';
import { CreateActionButton } from '../../../elements/button/CreateActionButton/CreateActionButton';
import DeleteModal from '../../../elements/modal/DeleteModal';
import './CarsListPage.css';

interface CarsListPageProps {
    role?: 'admin' | 'manager';
}

export const CarsListPage: React.FC<CarsListPageProps> = ({ role = 'admin' }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch<AppDispatch>();

    // Redux State
    const {
        categories,
        brands,
        loadingCategories,
        loadingBrands,
        categoriesLoaded,
        brandsLoaded
    } = useSelector((state: RootState) => state.cars);

    // Cars List State
    const [cars, setCars] = useState<Car[]>([]);
    const [total, setTotal] = useState(0);
    const [loadingCars, setLoadingCars] = useState(true);

    // Filters & Pagination
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [selectedBrandIds, setSelectedBrandIds] = useState<string[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [page, setPage] = useState(1);
    const limit = 10;

    // Admin State
    const [hideInactive, setHideInactive] = useState(true);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [carToDelete, setCarToDelete] = useState<string | null>(null);

    // Fetch Brands & Categories
    useEffect(() => {
        if (!categoriesLoaded && !loadingCategories) {
            dispatch(fetchCategoriesThunk());
        }
        if (!brandsLoaded && !loadingBrands) {
            dispatch(fetchBrandsThunk());
        }
    }, [dispatch, categoriesLoaded, brandsLoaded, loadingCategories, loadingBrands]);

    // Fetch Cars Data
    const fetchCarsList = useCallback(async () => {
        setLoadingCars(true);
        try {
            const params = new URLSearchParams({
                sort_price: 'desc',
                sort_model: 'asc',
                hide_inactive: hideInactive.toString(),
                page: page.toString(),
                limit: limit.toString()
            });

            selectedCategories.forEach(cat => params.append('categories', cat));
            selectedBrandIds.forEach(id => params.append('brand_ids', id));

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
    }, [page, limit, selectedCategories, selectedBrandIds, searchQuery, hideInactive]);

    useEffect(() => {
        fetchCarsList();
    }, [fetchCarsList]);

    // Handlers
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

    const handleClearAll = () => {
        setSelectedCategories([]);
        setSelectedBrandIds([]);
        setSearchQuery('');
        setPage(1);
    };

    const handleDeleteClick = (id: string) => {
        setCarToDelete(id);
        setDeleteModalOpen(true);
    };

    const totalPages = Math.ceil(total / limit) || 1;

    return (
        <div className="admin-page-container">
            <div className="admin-page-content">

                <div className="cars-list-header">
                    <h2>{t('admin.carsTitle', 'Cars Management')}</h2>
                    <SectionNavigation role={role} />
                </div>

                <div className="admin-filters-panel-full cars-list-custom-panel">
                    <div className="cars-list-filters-wrapper">
                        <CarFilters
                            categories={categories}
                            selectedCategories={selectedCategories}
                            onCategoryToggle={handleCategoryToggle}
                            brands={brands}
                            selectedBrands={selectedBrandIds}
                            onBrandToggle={handleBrandToggle}
                            searchQuery={searchQuery}
                            onSearchChange={(q) => { setSearchQuery(q); setPage(1); }}
                            onClearAll={handleClearAll}
                        />
                    </div>

                    {role === 'admin' && (
                        <div className="cars-list-admin-actions">
                            <label className="admin-checkbox-filter">
                                <input
                                    type="checkbox"
                                    checked={hideInactive}
                                    onChange={(e) => {
                                        setHideInactive(e.target.checked);
                                        setPage(1);
                                    }}
                                />
                                {t('admin.filters.hideInactive', 'Hide Inactive')}
                            </label>

                            <CreateActionButton navigateTo={`/${role}/cars/create`} />
                        </div>
                    )}
                </div>

                <div className="data-table-container">
                    <CarsTable
                        cars={cars}
                        loading={loadingCars}
                        role={role}
                        onDeleteClick={handleDeleteClick}
                    />
                </div>

                <div className="cars-list-pagination">
                    <Pagination
                        currentPage={page}
                        totalPages={totalPages}
                        onPageChange={setPage}
                    />
                </div>
            </div>

            <DeleteModal
                id={carToDelete || ''}
                isOpen={deleteModalOpen}
                title={t('admin.cars.deleteTitle', 'Delete Car')}
                message={t('admin.cars.deleteConfirm', 'Are you sure you want to delete this car?')}
                confirmBtnText={t('rent.actions.delete', 'Delete')}
                errorText={t('admin.cars.deleteError', 'Failed to delete car')}
                onDeleteApi={deleteCar}
                onClose={() => {
                    setDeleteModalOpen(false);
                    setCarToDelete(null);
                }}
                onSuccess={() => fetchCarsList()}
            />
        </div>
    );
};