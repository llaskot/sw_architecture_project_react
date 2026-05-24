import React, { useEffect, useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { getBrandsAdm, deleteBrand, type Brand } from '../../../api/carsApi';
import BrandsTable from '../../../elements/brand/BrandsTable/BrandsTable';
import DeleteModal from '../../../elements/modal/DeleteModal';
import RentErrorBlock from '../../../elements/rent/RentErrorBlock/RentErrorBlock';
import { CreateActionButton } from '../../../elements/button/CreateActionButton/CreateActionButton';
import Input from '../../../elements/input/Input';
import './BrandsListPage.css';
import { SectionNavigation } from '../../../elements/navigation/SectionNavigation/SectionNavigation';

interface BrandsListPageProps {
    role: 'admin' | 'manager';
}

export const BrandsListPage: React.FC<BrandsListPageProps> = ({ role }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const [brands, setBrands] = useState<Brand[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [hideInactive, setHideInactive] = useState<boolean>(true);

    // Delete Modal State
    const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
    const [brandToDelete, setBrandToDelete] = useState<Brand | null>(null);

    const fetchBrands = async (hide: boolean) => {
        setLoading(true);
        setError(null);
        try {
            const data = await getBrandsAdm(hide);
            setBrands(data);
        } catch (err: any) {
            console.error("Failed to fetch brands:", err);
            setError(t('admin.brands.loadError', 'Failed to load brands list.'));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBrands(hideInactive);
    }, [hideInactive]);

    const handleDetailsClick = (brand: Brand) => {
        navigate(`/${role}/brands/${brand._id}`);
    };

    const handleDeleteClick = (brand: Brand) => {
        setBrandToDelete(brand);
        setDeleteModalOpen(true);
    };

    // Client-side filtering
    const filteredBrands = useMemo(() => {
        if (!searchTerm.trim()) return brands;
        const lowerSearch = searchTerm.toLowerCase();

        return brands.filter(brand => {
            const nameMatch = brand.name?.toLowerCase().includes(lowerSearch);
            const countryMatch = brand.country?.toLowerCase().includes(lowerSearch);
            const descMatch = brand.description?.toLowerCase().includes(lowerSearch);
            return nameMatch || countryMatch || descMatch;
        });
    }, [brands, searchTerm]);

    return (
        <div className="admin-page-container">
            {/* Mandatory inner content wrapper */}
            <div className="admin-page-content">

                <div className="cars-list-header">
                    <h2>{t('admin.brands.title', 'Brands Management')}</h2>
                    <SectionNavigation role={role} />
                </div>

                {/* Using the global filter panel from AdminPage.css */}
                <div className="admin-filters-panel">
                    <div className="admin-filter-item admin-filter-item--fluid">
                        <label className="admin-filter-label">{t('admin.brands.search', 'Search Brands')}</label>
                        <Input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder={t('admin.brands.searchPlaceholder', 'Type name, country or description...')}
                        />
                    </div>

                    {role === 'admin' && (
                        <div className="cars-list-admin-actions">
                            <div className="cars-list-admin-actions">
                                <label className="admin-checkbox-filter">
                                    <input
                                        type="checkbox"
                                        checked={hideInactive}
                                        onChange={(e) => setHideInactive(e.target.checked)}
                                    />
                                    {t('admin.filters.hideInactive', 'Hide Inactive')}
                                </label>
                            </div>

                            <div className="admin-filter-item">
                                <CreateActionButton navigateTo={`/${role}/brands/create`} />
                            </div>
                        </div>
                    )}
                </div>

                <div className="data-table-container">
                    <RentErrorBlock message={error} />

                    {loading ? (
                        <div className="brands-list-loading">{t('rent.loading', 'Loading...')}</div>
                    ) : !error && (
                        <BrandsTable
                            brands={filteredBrands}
                            role={role}
                            onDetailsClick={handleDetailsClick}
                            onDeleteClick={role === 'admin' ? handleDeleteClick : undefined}
                        />
                    )}

                    {filteredBrands.length === 0 && !loading && !error && (
                        <div className="brands-list-empty">
                            {t('admin.brands.noBrands', 'No brands found matching your search.')}
                        </div>
                    )}
                </div>
            </div>

            <DeleteModal
                id={brandToDelete?._id || ''}
                isOpen={deleteModalOpen}
                title={t('admin.brands.deleteConfirmTitle', 'Delete Brand')}
                message={t('admin.brands.deleteConfirmMessage', 'Are you sure you want to delete this brand?')}
                confirmBtnText={t('admin.actions.delete', 'Delete')}
                errorText={t('admin.brands.deleteError', 'Failed to delete brand.')}
                onDeleteApi={deleteBrand}
                onClose={() => setDeleteModalOpen(false)}
                onSuccess={() => {
                    if (brandToDelete) {
                        setBrands(prev => prev.filter(b => b._id !== brandToDelete._id));
                    }
                    setDeleteModalOpen(false);
                }}
            />
        </div>
    );
};

export default BrandsListPage;