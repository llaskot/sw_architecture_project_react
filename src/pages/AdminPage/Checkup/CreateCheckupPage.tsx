import React, {useState} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import {useTranslation} from 'react-i18next';
import './CreateCarPage.css';
import {CheckupFields} from "../../../elements/checkup/CheckupFields/CheckupFields.tsx";
import Button from "../../../elements/button/Button.tsx";
import SubmitButton from "../../../elements/button/SubmitButton.tsx";
import {type Checkup, createCheckup} from "../../../api/carsApi.ts";
import {parseApiError} from "../../../utils/errorHandler.ts";
import RentErrorBlock from "../../../elements/rent/RentErrorBlock/RentErrorBlock.tsx";


export const CreateCheckupPage: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const passedRentId = location.state?.rent_id || '';
    const {t} = useTranslation();
    const [loading, setLoading] = useState<boolean>(false);
    const [formData, setFormData] = useState<Checkup>({
        rent_id: passedRentId,
        summary: 'ok',
        notis: 'ok',
        price: 0,
    });
    const [error, setError] = useState<string | null>(null);


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            await createCheckup(formData);
            navigate(-1);
        } catch (err: any) {
            setError(parseApiError(err, t('admin.models.createError', 'Failed to create model.')));
        } finally {
            setLoading(false);
        }
    };


    const handleGoBack = () => {
        navigate(-1);
    };

    return (
        <div className="create-car-page">
            <div className="admin-rent-header">
                <h2 className="create-car-title">
                    {t('admin.car.createNew', 'Create New Checkup')}
                </h2>
                <Button onClick={handleGoBack} className="btn-nav create-car-back-btn">
                    {t('admin.nav.back', 'Go Back')}
                </Button>
            </div>

            <RentErrorBlock message={error}/>
            <div className="create-car-content">
                <form onSubmit={handleSubmit}>
                    <CheckupFields
                        formData={formData}
                        onChange={setFormData}
                        disabled={false}
                    />
                    <div className="form-actions">
                        <SubmitButton loading={loading} className="btn-action">
                            {t('admin.actions.save', 'Save')}
                        </SubmitButton>
                    </div>
                </form>
            </div>
        </div>
    );
};