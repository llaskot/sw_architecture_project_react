import React from 'react';
import { useTranslation } from 'react-i18next';
import { type AutoModelCreate, type Brand } from '../../../api/carsApi';
import Input from '../../input/Input';
import Textarea from '../../input/Textarea';
import { BrandSelect } from '../ModelSelects/BrandSelect';
import { CategorySelect } from '../ModelSelects/CategorySelect';
import './ModelFields.css';

interface ModelFieldsProps {
    data: AutoModelCreate;
    onChange: (data: AutoModelCreate) => void;
    brands: Brand[];
    categories: string[];
    disabled?: boolean;
}

export const ModelFields: React.FC<ModelFieldsProps> = ({
                                                            data,
                                                            onChange,
                                                            brands,
                                                            categories,
                                                            disabled
                                                        }) => {
    const { t } = useTranslation();

    const updateField = (field: keyof AutoModelCreate, value: any) => {
        onChange({ ...data, [field]: value });
    };

    return (
        <div className="model-fields">
            <div className="admin-field-row">
                <label className="admin-field-label">{t('admin.models.brand', 'Brand')}</label>
                <div className="admin-field-value">
                    <BrandSelect
                        brands={brands}
                        value={data.brand_id}
                        onChange={(val) => updateField('brand_id', val)}
                        disabled={disabled}
                    />
                </div>
            </div>

            <div className="admin-field-row">
                <label className="admin-field-label">{t('admin.models.name', 'Name')}</label>
                <div className="admin-field-value">
                    <Input
                        name="name"
                        value={data.name}
                        onChange={(e) => updateField('name', e.target.value)}
                        disabled={disabled}
                    />
                </div>
            </div>

            <div className="admin-field-row">
                <label className="admin-field-label">{t('admin.models.category', 'Category')}</label>
                <div className="admin-field-value">
                    <CategorySelect
                        categories={categories}
                        value={data.category}
                        onChange={(val) => updateField('category', val)}
                        disabled={disabled}
                    />
                </div>
            </div>

            <div className="admin-field-row align-top">
                <label className="admin-field-label">{t('admin.models.description', 'Description')}</label>
                <div className="admin-field-value">
                    <Textarea
                        name="description"
                        value={data.description}
                        onChange={(e) => updateField('description', e.target.value)}
                        disabled={disabled}
                    />
                </div>
            </div>

            <div className="admin-field-row">
                <label className="admin-field-label">{t('admin.models.status', 'Status')}</label>
                <div className="admin-field-value model-checkbox-field">
                    <label className="car-fields-checkbox-label">
                        <input
                            type="checkbox"
                            checked={!!data.active}
                            onChange={(e) => updateField('active', e.target.checked)}
                            disabled={disabled}
                        />
                        {t('admin.models.active', 'Active')}
                    </label>
                </div>
            </div>
        </div>
    );
};