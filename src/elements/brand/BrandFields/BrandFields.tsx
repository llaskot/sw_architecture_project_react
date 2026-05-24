import React from 'react';
import { useTranslation } from 'react-i18next';
import Input from '../../input/Input';
import Textarea from '../../input/Textarea';
import { type BrandUpdate } from '../../../api/carsApi';
import './BrandFields.css';

interface BrandFieldsProps {
    data: BrandUpdate;
    onChange: (data: BrandUpdate) => void;
    disabled?: boolean;
    showActive?: boolean;
}

export const BrandFields: React.FC<BrandFieldsProps> = ({
                                                            data,
                                                            onChange,
                                                            disabled = false,
                                                            showActive = false
                                                        }) => {
    const { t } = useTranslation();

    const handleChange = (field: keyof BrandUpdate, value: any) => {
        onChange({ ...data, [field]: value });
    };

    return (
        <div className="brand-fields-container">
            <Input
                label={t('admin.brands.name', 'Name')}
                name="name"
                value={data.name || ''}
                onChange={(e) => handleChange('name', e.target.value)}
                disabled={disabled}
                placeholder={t('admin.brands.namePlaceholder', 'Enter brand name')}
            />

            <Input
                label={t('admin.brands.country', 'Country')}
                name="country"
                value={data.country || ''}
                onChange={(e) => handleChange('country', e.target.value)}
                disabled={disabled}
                placeholder={t('admin.brands.countryPlaceholder', 'Enter country')}
            />

            <Textarea
                label={t('admin.brands.description', 'Description')}
                name="description"
                value={data.description || ''}
                onChange={(e) => handleChange('description', e.target.value)}
                disabled={disabled}
                placeholder={t('admin.brands.descriptionPlaceholder', 'Enter description')}
            />

            {showActive && (
                <label className="brand-active-checkbox">
                    <input
                        type="checkbox"
                        checked={data.active || false}
                        onChange={(e) => handleChange('active', e.target.checked)}
                        disabled={disabled}
                    />
                    {t('admin.brands.active', 'Active')}
                </label>
            )}
        </div>
    );
};

export default BrandFields;