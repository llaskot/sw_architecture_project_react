import React, {useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {useTranslation} from 'react-i18next';
import {CheckupFields} from "../../../elements/checkup/CheckupFields/CheckupFields.tsx";
import Button from "../../../elements/button/Button.tsx";
import SubmitButton from "../../../elements/button/SubmitButton.tsx";
import {
    type Checkup,
    getCheckupByIdAdm,
    updateCheckup
} from "../../../api/carsApi.ts";
import {parseApiError} from "../../../utils/errorHandler.ts";
import RentErrorBlock from "../../../elements/rent/RentErrorBlock/RentErrorBlock.tsx";
import {useSelector} from "react-redux";
import {useDispatch} from "react-redux";
import {setCurrentCheckup} from "../../../slices/carsSlice";
import type {RootState} from "../../../app/store.ts";
import {openModal} from "../../../slices/authSlice.ts";


export const CheckupDetailsPage: React.FC = () => {
    const navigate = useNavigate();
    const {id} = useParams<{ id: string }>();
    const {user} = useSelector((state: RootState) => state.auth);
    const manager_role = user?.is_admin || user?.is_manager;
    const {t} = useTranslation();
    const [loading, setLoading] = useState<boolean>(false);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [formData, setFormData] = useState<Checkup>({
        rent_id: '',
        summary: '',
        notis: '',
        price: 0,
    });
    const [error, setError] = useState<string | null>(null);
    const dispatch = useDispatch();
    const [refreshTrigger, setRefreshTrigger] = useState(0);


    useEffect(() => {
        const fetchData = async () => {
            if (!id) return;
            try {
                const checkup = await getCheckupByIdAdm(id)
                dispatch(setCurrentCheckup(checkup));
                setFormData({
                    rent_id: checkup.rent_id,
                    summary: checkup.summary,
                    notis: checkup.notis,
                    price: checkup.price,
                });
            } catch (err: any) {
                setError(t('admin.checkup.loadError', 'Failed to load checkup details.'));
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id, refreshTrigger]);


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            await updateCheckup(id!, formData);
            setIsEditing(false);
            setRefreshTrigger(prev => prev + 1);
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
                    {t('admin.checkup.details', 'Checkup')}
                </h2>
                <div className="model-details-actions">

                    <Button onClick={() => dispatch(openModal('checkupAct'))} className="create-doc">
                        {t('admin.nav.print', '🖨️')}
                    </Button>

                    {manager_role && (
                        <Button className="btn-action" onClick={() => setIsEditing(true)}>
                            {t('admin.actions.edit', 'Edit')}
                        </Button>
                    )}
                    <Button onClick={handleGoBack} className="btn-nav create-car-back-btn">
                        {t('admin.nav.back', 'Go Back')}
                    </Button>
                </div>
            </div>

            <RentErrorBlock message={error}/>
            <div className="create-car-content">
                <form onSubmit={handleSubmit}>
                    <CheckupFields
                        formData={formData}
                        onChange={setFormData}
                        disabled={!isEditing}
                    />
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
            </div>
        </div>
    );
};