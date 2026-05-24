import React from 'react';
import { useTranslation } from 'react-i18next';
import Input from '../../input/Input';
import { ModelSelectDropdown } from '../ModelSelectDropdown/ModelSelectDropdown';
import { type AutoModelRead } from '../../../api/carsApi';
import './CarFields.css';

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

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        const finalValue = type === 'checkbox' ? checked : value;
        onChange(name, finalValue);
    };

    const handleImageClick = () => {
        console.log('Change image placeholder clicked');
        alert(t('admin.car.changeImageMock', 'Image upload is not implemented yet.'));
    };

    return (
        <div className="car-fields-container">
            <div className="car-fields-top-section">
                <div className="car-fields-image-section">
                    <div className="car-fields-image-wrapper">
                        {formData.image_url ? (
                            <img src={formData.image_url} alt="Car" className="car-fields-image" />
                        ) : (
                            <div className="car-fields-image-placeholder">
                                {t('admin.car.noImage', 'No Image')}
                            </div>
                        )}
                    </div>
                    {!disabled && (
                        <button
                            type="button"
                            className="btn-small car-fields-image-btn"
                            onClick={handleImageClick}
                        >
                            {t('admin.car.changeImage', 'Change Image')}
                        </button>
                    )}
                </div>

                <div className="car-fields-checkboxes">
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

            <div className="car-fields-grid">
                <div className="car-fields-group">
                    <label className="car-fields-label">{t('admin.car.model', 'Model')}</label>
                    <ModelSelectDropdown
                        models={models}
                        value={formData.model_id || formData.model?._id || ''}
                        onChange={(val) => onChange('model_id', val)}
                        disabled={disabled}
                    />
                </div>

                <Input
                    label={t('admin.car.vin', 'VIN')}
                    name="vin"
                    value={formData.vin || ''}
                    onChange={handleInputChange}
                    disabled={disabled}
                />

                <Input
                    label={t('admin.car.plateNumber', 'Plate Number')}
                    name="plate_number"
                    value={formData.plate_number || ''}
                    onChange={handleInputChange}
                    disabled={disabled}
                />

                <Input
                    label={t('admin.car.year', 'Year')}
                    name="year"
                    type="number"
                    value={formData.year || ''}
                    onChange={handleInputChange}
                    disabled={disabled}
                />

                <Input
                    label={t('admin.car.color', 'Color')}
                    name="color"
                    value={formData.color || ''}
                    onChange={handleInputChange}
                    disabled={disabled}
                />

                <Input
                    label={t('admin.car.mileage', 'Mileage')}
                    name="mileage"
                    type="number"
                    value={formData.mileage || ''}
                    onChange={handleInputChange}
                    disabled={disabled}
                />

                <Input
                    label={t('admin.car.pricePerDay', 'Price Per Day')}
                    name="price_per_day"
                    type="number"
                    value={formData.price_per_day || ''}
                    onChange={handleInputChange}
                    disabled={disabled}
                />
            </div>
        </div>
    );
};