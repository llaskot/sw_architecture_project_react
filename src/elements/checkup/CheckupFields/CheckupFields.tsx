import React from 'react';
import {useTranslation} from 'react-i18next';
import Input from '../../input/Input';
import './CheckupFields.css';
import Textarea from "../../input/Textarea.tsx";
import type {Checkup} from "../../../api/carsApi.ts";


interface CarFieldsProps {
    formData: any;
    onChange: (data: Checkup) => void;
    disabled?: boolean;
}

export const CheckupFields: React.FC<CarFieldsProps> = ({
                                                            formData,
                                                            onChange,
                                                            disabled = false,
                                                        }) => {
    const {t} = useTranslation();


    const handleInputChange = (field: keyof Checkup, value: any) => {
        onChange({...formData, [field]: value});
    };
    console.log(formData)


    return (
        <div className="car-fields-container">


            <div className="admin-field-row">
                <label className="admin-field-label">{t('admin.checkup.rentId', 'Rent ID')}</label>
                <div className="admin-field-value">
                    <Input
                        name="summary"
                        value={formData.rent_id || '---'}
                        disabled={true}
                    />
                </div>

            </div>


            <div className="admin-field-row">
                <label className="admin-field-label">{t('admin.checkup.summary', 'Summary')}</label>
                <div className="admin-field-value">
                    <Input
                        name="summary"
                        value={formData?.summary}
                        onChange={(e) => handleInputChange('summary', e.target.value)}
                        disabled={disabled}
                    />
                </div>
            </div>

            <div className="admin-field-row">
                <label className="admin-field-label">{t('admin.checkup.notes', 'Notes')}</label>
                <div className="admin-field-value">
                    <Textarea
                        name="notes"
                        value={formData?.notis}
                        onChange={(e) => handleInputChange('notis', e.target.value)}
                        disabled={disabled}
                    />
                </div>
            </div>

            <div className="admin-field-row">
                <label className="admin-field-label">{t('admin.checkup.price', 'Price')}</label>
                <div className="admin-field-value">
                    <Input
                        name="additonal price"
                        type='number'
                        value={formData?.price}
                        onChange={(e) => handleInputChange('price', e.target.value)}
                        disabled={disabled}
                    />
                </div>
            </div>

        </div>
    );
};