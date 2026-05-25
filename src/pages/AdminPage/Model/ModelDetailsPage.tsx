import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {useNavigate, useParams} from 'react-router-dom';
import {
    getBrands,
    getCategories,
    getModelByIdAdm,
    updateModel,
    type AutoModelCreate,
    type Brand
} from '../../../api/carsApi';
import {ModelFields} from '../../../elements/model/ModelFields/ModelFields';
import SubmitButton from '../../../elements/button/SubmitButton';
import RentErrorBlock from '../../../elements/rent/RentErrorBlock/RentErrorBlock';
import {parseApiError} from '../../../utils/errorHandler';
import './ModelDetailsPage.css';
import Button from "../../../elements/button/Button.tsx";

interface ModelDetailsPageProps {
    role: 'admin' | 'manager';
}

export const ModelDetailsPage: React.FC<ModelDetailsPageProps> = ({role}) => {
    const {t} = useTranslation();
    const navigate = useNavigate();
    const {id} = useParams<{ id: string }>(); // ID модели из URL

    const [loading, setLoading] = useState<boolean>(false);
    const [pageLoading, setPageLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState<boolean>(false);

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
            setIsEditing(false);
        } catch (err: any) {
            setError(parseApiError(err, t('admin.models.updateError', 'Failed to update model.')));
        } finally {
            setLoading(false);
        }
    };

    if (pageLoading) return <div className="model-details-loading">{t('rent.loading', 'Loading...')}</div>;

    return (
        <div className="admin-rent-details-container">
            <div className="model-details-header">
                {/* Кнопка назад */}

                <h2 className="car-details-title">
                    {t('admin.models.editTitle', 'Model:')} {id}
                </h2>
                <>
                    <Button className="btn-nav" onClick={() => navigate('/admin/models')}>
                        {t('admin.actions.back', 'Back')}
                    </Button>
                </>

            </div>

            <RentErrorBlock message={error}/>

            {formData && (
                <form onSubmit={handleSubmit}>
                    <ModelFields
                        data={formData}
                        onChange={setFormData}
                        brands={brands}
                        categories={categories}
                        disabled={!isEditing}
                    />
                    {role === 'admin' && !isEditing && (
                        <div className="model-details-actions">
                            <Button className="btn-action" onClick={() => setIsEditing(true)}>
                                {t('admin.actions.edit', 'Edit')}
                            </Button>
                        </div>
                    )}
                    {isEditing && (
                        <div className="form-actions">
                            <Button type="button" className="btn-nav" onClick={() => setIsEditing(false)}>
                                {t('admin.actions.cancel', 'Cancel')}
                            </Button>
                            <SubmitButton loading={loading} className="btn-action">
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