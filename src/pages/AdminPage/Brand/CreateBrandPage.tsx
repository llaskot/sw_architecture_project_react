import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { createBrand, type BrandCreate } from '../../../api/carsApi';
import BrandFields from '../../../elements/brand/BrandFields/BrandFields';
import SubmitButton from '../../../elements/button/SubmitButton';
import RentErrorBlock from '../../../elements/rent/RentErrorBlock/RentErrorBlock';
import './CreateBrandPage.css';

interface CreateBrandPageProps {
    role?: 'admin' | 'manager';
}

export const CreateBrandPage: React.FC<CreateBrandPageProps> = ({ role = 'admin' }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const [formData, setFormData] = useState<BrandCreate>({
        name: '',
        country: '',
        description: ''
    });

    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            await createBrand(formData);
            navigate(`/${role}/brands`);
        } catch (err: any) {
            console.error("Failed to create brand:", err);
            setError(t('admin.brands.createError', 'Failed to create brand. Please check the entered data.'));
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        navigate(`/${role}/brands`);
    };

    return (
        <div className="create-brand-page">
            <div className="create-brand-header">
                <h2 className="create-brand-title">{t('admin.brands.createTitle', 'Create New Brand')}</h2>
            </div>

            <form onSubmit={handleSubmit} className="create-brand-form">
                <BrandFields
                    data={formData}
                    onChange={(updatedData) => setFormData({
                        name: updatedData.name || '',
                        country: updatedData.country || '',
                        description: updatedData.description || ''
                    })}
                    disabled={loading}
                    showActive={false}
                />

                <RentErrorBlock message={error} />

                <div className="create-brand-actions">
                    <button
                        type="button"
                        className="btn-cancel"
                        onClick={handleCancel}
                        disabled={loading}
                    >
                        {t('admin.actions.cancel', 'Cancel')}
                    </button>
                    <SubmitButton loading={loading}>
                        {t('admin.actions.create', 'Create')}
                    </SubmitButton>
                </div>
            </form>
        </div>
    );
};

export default CreateBrandPage;