import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getBrandByIdAdm, updateBrand, type Brand, type BrandUpdate } from '../../../api/carsApi';
import BrandFields from '../../../elements/brand/BrandFields/BrandFields';
import SubmitButton from '../../../elements/button/SubmitButton';
import RentErrorBlock from '../../../elements/rent/RentErrorBlock/RentErrorBlock';
import './BrandDetailsPage.css';
import Button from "../../../elements/button/Button.tsx";

interface BrandDetailsPageProps {
    role?: 'admin' | 'manager';
}

export const BrandDetailsPage: React.FC<BrandDetailsPageProps> = ({ role = 'admin' }) => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { t } = useTranslation();

    const [brand, setBrand] = useState<Brand | null>(null);
    const [formData, setFormData] = useState<BrandUpdate>({});

    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    const [saveLoading, setSaveLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchBrand = async () => {
            if (!id) return;
            setLoading(true);
            setError(null);
            try {
                const data = await getBrandByIdAdm(id);
                setBrand(data);
                setFormData({
                    name: data.name,
                    country: data.country,
                    description: data.description,
                    active: data.active
                });
            } catch (err: any) {
                console.error("Failed to fetch brand details:", err);
                setError(t('admin.brands.fetchDetailsError', 'Failed to load brand details.'));
            } finally {
                setLoading(false);
            }
        };

        fetchBrand();
    }, [id, t]);

    const handleCancel = () => {
        if (brand) {
            setFormData({
                name: brand.name,
                country: brand.country,
                description: brand.description,
                active: brand.active
            });
        }
        setIsEditing(false);
        setError(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!id) return;
        setSaveLoading(true);
        setError(null);

        try {
            // Formatting data to match Partial<BrandCreate> preventing TS2345
            const updatePayload = {
                name: formData.name ?? undefined,
                country: formData.country ?? undefined,
                description: formData.description ?? undefined,
                active: formData.active
            };

            const updatedBrand = await updateBrand(id, updatePayload);
            setBrand(updatedBrand);
            setFormData({
                name: updatedBrand.name,
                country: updatedBrand.country,
                description: updatedBrand.description,
                active: updatedBrand.active
            });
            setIsEditing(false);
        } catch (err: any) {
            console.error("Failed to update brand:", err);
            setError(t('admin.brands.updateError', 'Failed to update brand details.'));
        } finally {
            setSaveLoading(false);
        }
    };

    const handleBack = () => {
        navigate(-1);
    };

    if (loading) {
        return <div className="brand-details-loading">{t('rent.loading', 'Loading...')}</div>;
    }

    if (!brand && !loading) {
        return (
            <div className="brand-details-page">
                <RentErrorBlock message={error || t('admin.brands.notFound', 'Brand not found.')} />
                <button className="btn-cancel" onClick={handleBack}>
                    {t('admin.actions.back', 'Back to List')}
                </button>
            </div>
        );
    }

    return (
        <div className="admin-rent-details-container">
                <div className="model-details-header">

                    <h2 className="car-details-title">
                        {t('admin.brands.editTitle', 'Brand:')} {id}
                    </h2>
                    <Button className="btn-nav" onClick={handleBack}>
                         {t('admin.actions.back', 'Back')}
                    </Button>
                </div>


            <form onSubmit={handleSubmit} className="brand-details-form">
                <BrandFields
                    data={formData}
                    onChange={setFormData}
                    disabled={!isEditing || saveLoading}
                    showActive={true}
                />

                <RentErrorBlock message={error} />
                {role === 'admin' && !isEditing && (
                    <div className="model-details-actions">
                        <Button className="btn-action" onClick={() => setIsEditing(true)}>
                            {t('admin.actions.edit', 'Edit')}
                        </Button>
                    </div>
                )}

                {isEditing && (
                    <div className="brand-details-actions">
                        <Button
                            type="button"
                            className="btn-nav"
                            onClick={handleCancel}
                            disabled={saveLoading}
                        >
                            {t('admin.actions.cancel', 'Cancel')}
                        </Button>
                        <SubmitButton loading={saveLoading} className="btn-action">
                            {t('admin.actions.save', 'Save')}
                        </SubmitButton>
                    </div>
                )}
            </form>
        </div>
    );
};

export default BrandDetailsPage;