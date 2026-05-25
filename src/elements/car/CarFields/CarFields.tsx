import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import Input from '../../input/Input';
import { ModelSelectDropdown } from '../ModelSelectDropdown/ModelSelectDropdown';
import { type AutoModelRead } from '../../../api/carsApi';
import './CarFields.css';
import Button from "../../button/Button.tsx";

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

interface CarFieldsProps {
    formData: any;
    onChange: (field: string, value: any) => void;
    disabled?: boolean;
    models: AutoModelRead[];
}

export const CarFields: React.FC<CarFieldsProps> = ({
                                                        formData,
                                                        onChange,
                                                        disabled = false,
                                                        models
                                                    }) => {
    const { t } = useTranslation();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        const finalValue = type === 'checkbox' ? checked : value;
        onChange(name, finalValue);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            onChange('newImageFile', e.target.files[0]);
        }
    };

    return (
        <div className="car-fields-container">
            <div className="admin-field-row align-top">
                <label className="admin-field-label">{t('admin.car.image', 'Image')}</label>
                <div className="admin-field-value car-fields-image-section">
                    <div className="car-fields-image-wrapper">
                        {formData.newImageFile ? (
                            <img
                                src={URL.createObjectURL(formData.newImageFile)}
                                alt="Preview"
                                className="car-fields-image"
                            />
                        ) : formData.img?.small ? (
                            <img
                                src={`${BASE_URL}/${formData.img.small}?t=${Date.now()}`}
                                alt="Car"
                                className="car-fields-image"
                            />
                        ) : (
                            <div className="car-fields-image-placeholder">
                                {t('admin.car.noImage', 'No Image')}
                            </div>
                        )}
                    </div>
                    {!disabled && (
                        <>
                            <Button
                                className="btn-nav car-fields-image-btn"
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                            >
                                {t('admin.car.changeImage', 'Change Image')}
                            </Button>
                            <input
                                type="file"
                                ref={fileInputRef}
                                style={{ display: 'none' }}
                                accept="image/jpeg, image/png, image/webp"
                                onChange={handleFileChange}
                            />
                        </>
                    )}
                </div>
            </div>

            <div className="admin-field-row">
                <label className="admin-field-label">{t('admin.car.status', 'Status')}</label>
                <div className="admin-field-value car-fields-checkboxes">
                    <label className="car-fields-checkbox-label">
                        <input
                            type="checkbox"
                            name="active"
                            checked={!!formData.active}
                            onChange={handleInputChange}
                            disabled={disabled}
                        />
                        {t('admin.car.active', 'Active')}
                    </label>

                    <label className="car-fields-checkbox-label">
                        <input
                            type="checkbox"
                            name="available"
                            checked={!!formData.available}
                            onChange={handleInputChange}
                            disabled={disabled}
                        />
                        {t('admin.car.available', 'Available')}
                    </label>

                    <label className="car-fields-checkbox-label">
                        <input
                            type="checkbox"
                            name="in_use"
                            checked={!!formData.in_use}
                            onChange={handleInputChange}
                            disabled={disabled}
                        />
                        {t('admin.car.inUse', 'In Use')}
                    </label>
                </div>
            </div>

            <div className="admin-field-row">
                <label className="admin-field-label">{t('admin.car.model', 'Model')}</label>
                <div className="admin-field-value">
                    <ModelSelectDropdown
                        models={models}
                        value={formData.model_id || formData.model?._id || ''}
                        onChange={(val) => onChange('model_id', val)}
                        disabled={disabled}
                    />
                </div>
            </div>

            <div className="admin-field-row">
                <label className="admin-field-label">{t('admin.car.vin', 'VIN')}</label>
                <div className="admin-field-value">
                    <Input
                        name="vin"
                        value={formData.vin || ''}
                        onChange={handleInputChange}
                        disabled={disabled}
                    />
                </div>
            </div>

            <div className="admin-field-row">
                <label className="admin-field-label">{t('admin.car.plateNumber', 'Plate Number')}</label>
                <div className="admin-field-value">
                    <Input
                        name="plate_number"
                        value={formData.plate_number || ''}
                        onChange={handleInputChange}
                        disabled={disabled}
                    />
                </div>
            </div>

            <div className="admin-field-row">
                <label className="admin-field-label">{t('admin.car.year', 'Year')}</label>
                <div className="admin-field-value">
                    <Input
                        name="year"
                        type="number"
                        value={formData.year || ''}
                        onChange={handleInputChange}
                        disabled={disabled}
                    />
                </div>
            </div>

            <div className="admin-field-row">
                <label className="admin-field-label">{t('admin.car.color', 'Color')}</label>
                <div className="admin-field-value">
                    <Input
                        name="color"
                        value={formData.color || ''}
                        onChange={handleInputChange}
                        disabled={disabled}
                    />
                </div>
            </div>

            <div className="admin-field-row">
                <label className="admin-field-label">{t('admin.car.mileage', 'Mileage')}</label>
                <div className="admin-field-value">
                    <Input
                        name="mileage"
                        type="number"
                        value={formData.mileage || ''}
                        onChange={handleInputChange}
                        disabled={disabled}
                    />
                </div>
            </div>

            <div className="admin-field-row">
                <label className="admin-field-label">{t('admin.car.pricePerDay', 'Price Per Day')}</label>
                <div className="admin-field-value">
                    <Input
                        name="price_per_day"
                        type="number"
                        value={formData.price_per_day || ''}
                        onChange={handleInputChange}
                        disabled={disabled}
                    />
                </div>
            </div>
        </div>
    );
};