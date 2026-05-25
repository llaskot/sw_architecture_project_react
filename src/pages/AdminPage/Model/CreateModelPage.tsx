import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {useNavigate} from 'react-router-dom';
import {
    getBrands,
    getCategories,
    createModel,
    type AutoModelCreate,
    type Brand
} from '../../../api/carsApi';
import {ModelFields} from '../../../elements/model/ModelFields/ModelFields';
import SubmitButton from '../../../elements/button/SubmitButton';
import RentErrorBlock from '../../../elements/rent/RentErrorBlock/RentErrorBlock';
import {parseApiError} from '../../../utils/errorHandler';
import './CreateModelPage.css';
import Button from "../../../elements/button/Button.tsx"; // Исправлен импорт

interface CreateModelPageProps {
    role: 'admin' | 'manager';
}

export const CreateModelPage: React.FC<CreateModelPageProps> = ({role = "admin"}) => {
    const {t} = useTranslation();
    const navigate = useNavigate();

    const [loading, setLoading] = useState<boolean>(false);
    const [pageLoading, setPageLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Типизация массивов явно указана
    const [brands, setBrands] = useState<Brand[]>([]);
    const [categories, setCategories] = useState<string[]>([]);

    const [formData, setFormData] = useState<AutoModelCreate>({
        brand_id: '',
        name: '',
        description: '',
        category: '',
        active: true
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [brandsData, categoriesData] = await Promise.all([
                    getBrands(),
                    getCategories()
                ]);
                setBrands(brandsData);
                setCategories(categoriesData);
            } catch (err: any) {
                setError(t('admin.models.loadError', 'Failed to load options.'));
            } finally {
                setPageLoading(false);
            }
        };
        fetchData();
    }, [t]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            await createModel(formData);
            navigate('/admin/models');
        } catch (err: any) {
            setError(parseApiError(err, t('admin.models.createError', 'Failed to create model.')));
        } finally {
            setLoading(false);
        }
    };
    const handleGoBack = () => {
        navigate(`/${role}/models`);
    };

    if (pageLoading) return <div>{t('rent.loading', 'Loading...')}</div>;

    return (
        <div className="create-car-page"> {/* Исправлен класс */}
            <div className="admin-rent-header">
                <h2>{t('admin.models.createNew', 'Create Model')}</h2>
                <Button onClick={handleGoBack} className="btn-nav create-car-back-btn">
                    {t('admin.nav.back', 'Go Back')}
                </Button>
            </div>
            <RentErrorBlock message={error}/>
            <form onSubmit={handleSubmit}>
                <ModelFields
                    data={formData}
                    onChange={setFormData}
                    brands={brands}
                    categories={categories}
                />
                <div className="form-actions">
                    <SubmitButton loading={loading} className="btn-action">
                        {t('admin.actions.save', 'Save')}
                    </SubmitButton>
                </div>
            </form>
        </div>
    );
};

export default CreateModelPage;