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
            <BrandSelect
                brands={brands}
                value={data.brand_id}
                onChange={(val) => updateField('brand_id', val)}
                disabled={disabled}
            />

            <Input
                label={t('admin.models.name', 'Name')}
                name="name"
                value={data.name}
                onChange={(e) => updateField('name', e.target.value)}
                disabled={disabled}
            />

            <CategorySelect
                categories={categories}
                value={data.category}
                onChange={(val) => updateField('category', val)}
                disabled={disabled}
            />

            <Textarea
                label={t('admin.models.description', 'Description')}
                name="description"
                value={data.description}
                onChange={(e) => updateField('description', e.target.value)}
                disabled={disabled}
            />

            <div className="model-checkbox-field">
                <label>
                    <input
                        type="checkbox"
                        checked={data.active}
                        onChange={(e) => updateField('active', e.target.checked)}
                        disabled={disabled}
                    />
                    {t('admin.models.active', 'Active')}
                </label>
            </div>
        </div>
    );
};