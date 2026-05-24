import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import {
    getBrands,
    getCategories,
    getModelByIdAdm,
    updateModel,
    type AutoModelCreate,
    type Brand
} from '../../../api/carsApi';
import { ModelFields } from '../../../elements/model/ModelFields/ModelFields';
import SubmitButton from '../../../elements/button/SubmitButton';
import RentErrorBlock from '../../../elements/rent/RentErrorBlock/RentErrorBlock';
import { parseApiError } from '../../../utils/errorHandler';
import './ModelDetailsPage.css';

interface ModelDetailsPageProps {
    role: 'admin' | 'manager';
}

export const ModelDetailsPage: React.FC<ModelDetailsPageProps> = ({ role }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();

    const [loading, setLoading] = useState<boolean>(false);
    const [pageLoading, setPageLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Исправлено: явное указание типов
    const [brands, setBrands] = useState<Brand[]>([]);
    const [categories, setCategories] = useState<string[]>([]);
    const [formData, setFormData] = useState<AutoModelCreate | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            if (!id) return;
            try {
                const [brandsData, categoriesData, modelData] = await Promise.all([
                    getBrands(),
                    getCategories(),
                    getModelByIdAdm(id)
                ]);
                setBrands(brandsData);
                setCategories(categoriesData);
                setFormData({
                    brand_id: modelData.brand?._id || '',
                    name: modelData.name || '',
                    description: modelData.description || '',
                    category: modelData.category || '',
                    active: modelData.active
                });
            } catch (err: any) {
                setError(t('admin.models.loadError', 'Failed to load model details.'));
            } finally {
                setPageLoading(false);
            }
        };
        fetchData();
    }, [id, t]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!id || !formData) return;
        setLoading(true);
        setError(null);
        try {
            await updateModel(id, formData);
            navigate('/admin/models');
        } catch (err: any) {
            setError(parseApiError(err, t('admin.models.updateError', 'Failed to update model.')));
        } finally {
            setLoading(false);
        }
    };

    if (pageLoading) return <div className="model-details-loading">{t('rent.loading', 'Loading...')}</div>;

    return (
        <div className="model-details-page">
            <div className="model-details-header">
                <h2 className="model-details-title">{t('admin.models.editTitle', 'Edit Model')}</h2>
            </div>
            <RentErrorBlock message={error} />
            {formData && (
                <form onSubmit={handleSubmit}>
                    <ModelFields
                        data={formData}
                        onChange={setFormData}
                        brands={brands}
                        categories={categories}
                        disabled={role !== 'admin'}
                    />
                    {role === 'admin' && (
                        <div className="form-actions">
                            <SubmitButton loading={loading}>
                                {t('admin.actions.save', 'Save')}
                            </SubmitButton>
                        </div>
                    )}
                </form>
            )}
        </div>
    );
};

export default ModelDetailsPage;