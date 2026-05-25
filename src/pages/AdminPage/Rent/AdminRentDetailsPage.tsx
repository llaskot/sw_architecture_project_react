import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getRentById, updateRent } from '../../../api/rentApi';

import Input from '../../../elements/input/Input';
import Textarea from '../../../elements/input/Textarea';
import CarSelectDropdown from '../../../elements/rent/CarSelectDropdown/CarSelectDropdown';
import RentDatePicker from '../../../elements/rent/RentDatePicker/RentDatePicker';
import Button from '../../../elements/button/Button';
import SubmitButton from '../../../elements/button/SubmitButton';
import RentErrorBlock from '../../../elements/rent/RentErrorBlock/RentErrorBlock';

import './AdminRentDetailsPage.css';
import {parseApiError} from "../../../utils/errorHandler.ts";
import type {AdminProps} from "../AdminPage.tsx";

interface FormData {
    car_id: string;
    start_date: string;
    days_qty: number;
    driver: boolean;
    user_dock: string;
}

const AdminRentDetailsPage: React.FC<AdminProps> = ({role}) => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { t } = useTranslation();

    const [rent, setRent] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [saving, setSaving] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const [isEditing, setIsEditing] = useState<boolean>(false);

    const [formData, setFormData] = useState<FormData>({
        car_id: '',
        start_date: '',
        days_qty: 1,
        driver: false,
        user_dock: ''
    });

    const [currentPricePerDay, setCurrentPricePerDay] = useState<number>(0);

    useEffect(() => {
        if (id) {
            fetchRentDetails();
        }
    }, [id]);

    const fetchRentDetails = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await getRentById(id!);
            setRent(data);

            setFormData({
                car_id: data.car?._id || data.car_id || '',
                start_date: data.start_date ? data.start_date.split('T')[0] : '',
                days_qty: data.days_qty || 1,
                driver: data.driver || false,
                user_dock: data.user_dock || ''
            });
            setCurrentPricePerDay(data.car?.price_per_day || 0);
        } catch (err: any) {
            console.error("ОШИБКА:", err);
            setError(parseApiError(err, t('rent.edit.errorLoad', 'Failed to load rental details')));
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === 'days_qty' ? Math.max(1, parseInt(value) || 1) : value
        }));
    };

    const handleCarChange = (carId: string, car: any) => {
        setFormData((prev) => ({ ...prev, car_id: carId }));
        if (car && car.price_per_day) {
            setCurrentPricePerDay(car.price_per_day);
        }
    };

    const handleDateChange = (date: string) => {
        setFormData((prev) => ({ ...prev, start_date: date }));
    };

    const handleCancel = () => {
        if (rent) {
            setFormData({
                car_id: rent.car._id || rent.car_id,
                start_date: rent.start_date.split('T')[0],
                days_qty: rent.days_qty,
                driver: rent.driver,
                user_dock: rent.user_dock || ''
            });
            setCurrentPricePerDay(rent.car.price_per_day);
        }
        setIsEditing(false);
        setError(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!id) return;

        try {
            setSaving(true);
            setError(null);

            const updatedData = await updateRent(id, formData);
            setRent(updatedData);
            setIsEditing(false);
        } catch (err: any) {
            setError(parseApiError(err, t('rent.edit.errorUpdate', 'Failed to update rent')));
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div style={{ textAlign: 'center', padding: '50px' }}>Loading...</div>;
    if (!rent) return <div style={{ textAlign: 'center', padding: '50px' }}>{t('rent.edit.notFound', 'Order not found')}</div>;

    const computedTotalPrice = currentPricePerDay * formData.days_qty;
    return (
        <div className="admin-rent-details-container">
            <div className="admin-rent-header">
                <h2>{t('rent.pageTitle', 'Order Details')} #{rent._id}</h2>
                <div>
                    <Button
                        onClick={() => navigate(-1)}
                        type="button"
                        className="btn-nav"
                    >
                        {t('common.back', 'Back')}
                    </Button>

                    {!isEditing && (role === 'admin' || ["booked", "ordered"].includes(rent.stage ?? "" ) ) && (
                        <Button
                            onClick={() => setIsEditing(true)}
                            type="button"
                            className="btn-action"
                        >
                            {t('profile.edit', 'Edit')}
                        </Button>
                    )}
                </div>
            </div>

            <RentErrorBlock message={error} />

            <form onSubmit={handleSubmit}>

                <div className="admin-field-row">
                    <div className="admin-field-label">{t('rent.table.stage', 'Stage')}</div>
                    <div className="admin-field-value">
                        <Input value={rent.stage} disabled={true} />
                    </div>
                </div>

                <div className="admin-field-row">
                    <div className="admin-field-label">{t('profile.first_name', 'First Name')}</div>
                    <div className="admin-field-value">
                        <Input value={rent.client?.first_name || '-'} disabled={true} />
                    </div>
                </div>

                <div className="admin-field-row">
                    <div className="admin-field-label">{t('profile.last_name', 'Last Name')}</div>
                    <div className="admin-field-value">
                        <Input value={rent.client?.last_name || '-'} disabled={true} />
                    </div>
                </div>

                <div className="admin-field-row">
                    <div className="admin-field-label">{t('profile.email', 'Email')}</div>
                    <div className="admin-field-value">
                        <Input value={rent.client?.email || '-'} disabled={true} />
                    </div>
                </div>

                <div className="admin-field-row">
                    <div className="admin-field-label">{t('admin.filters.vehicle', 'Vehicle')}</div>
                    <div className="admin-field-value">
                        <CarSelectDropdown
                            selectedCarId={formData.car_id}
                            onCarChange={handleCarChange}
                            disabled={!isEditing}
                        />
                        {!isEditing && rent.car && (
                            <div className="car-meta-info">
                                {rent.car.model?.name} • {rent.car.plate_number}
                            </div>
                        )}
                    </div>
                </div>

                <div className="admin-field-row">
                    <div className="admin-field-label">{t('rent.startDateLabel', 'Start Date')}</div>
                    <div className="admin-field-value">
                        <RentDatePicker
                            label=""
                            value={formData.start_date}
                            onChange={handleDateChange}
                            disabled={!isEditing}
                        />
                    </div>
                </div>

                <div className="admin-field-row">
                    <div className="admin-field-label">{t('rent.daysQtyLabel', 'Days Quantity')}</div>
                    <div className="admin-field-value">
                        <Input
                            type="number"
                            name="days_qty"
                            min={1}
                            value={formData.days_qty}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                        />
                    </div>
                </div>

                <div className="admin-field-row">
                    <div className="admin-field-label">{t('rent.userDockLabel', 'Passport / ID')}</div>
                    <div className="admin-field-value">
                        <Input
                            type="text"
                            name="user_dock"
                            value={formData.user_dock}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                        />
                    </div>
                </div>

                <div className="admin-field-row">
                    <div className="admin-field-label">{t('rent.driverLabel', 'Driver Required')}</div>
                    <div className="admin-field-value" style={{ display: 'flex', alignItems: 'center' }}>
                        <input
                            type="checkbox"
                            checked={formData.driver}
                            onChange={(e) => setFormData(prev => ({ ...prev, driver: e.target.checked }))}
                            disabled={!isEditing}
                            style={{ width: '20px', height: '20px', cursor: isEditing ? 'pointer' : 'not-allowed' }}
                        />
                    </div>
                </div>

                <div className="admin-field-row align-top">
                    <div className="admin-field-label">Comment</div>
                    <div className="admin-field-value">
                        <Textarea
                            value={rent.comment || ''}
                            disabled={true}
                            rows={3}
                        />
                    </div>
                </div>

                <div className="admin-field-row">
                    <div className="admin-field-label" style={{ fontWeight: 'bold' }}>
                        {t('rent.totalPriceLabel', 'Total Price')}
                    </div>
                    <div className="admin-field-value">
                        <Input
                            value={`${computedTotalPrice} USD`}
                            disabled={true}
                            style={{ fontWeight: 'bold', backgroundColor: '#f8fafc', color: '#0f172a' }}
                        />
                    </div>
                </div>

                {isEditing && (
                    <div className="admin-rent-actions">
                        <Button
                            type="button"
                            onClick={handleCancel}
                            disabled={saving}
                            className="btn-nav"
                        >
                            {t('profile.cancel', 'Cancel')}
                        </Button>
                        <SubmitButton
                            loading={saving}
                            className="btn-action"
                        >
                            {t('profile.save', 'Save')}
                        </SubmitButton>
                    </div>
                )}
            </form>
        </div>
    );
};

export default AdminRentDetailsPage;