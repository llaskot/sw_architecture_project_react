import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
// import { CarFields } from '../CarFields/CarFields';
import Button from '../../button/Button';
import SubmitButton from '../../button/SubmitButton';
// import RentErrorBlock from '../../rent/RentErrorBlock/RentErrorBlock';
// import { parseApiError } from '../../../utils/errorHandler';
import {type Car, type AutoModelRead, type Checkup} from '../../../api/carsApi';
import './CheckupContainer.css';
import {CarFields} from "../../car/CarFields/CarFields.tsx";
import {CheckupFields} from "../CheckupFields/CheckupFields.tsx";

interface CarContainerProps {
    initialData: Partial<Checkup>;
    // role: 'admin' | 'manager';
    mode: 'view' | 'create';
    // models: AutoModelRead[];
    // onSave: (data: Partial<Car>) => Promise<void>;
    onCancelBack?: () => void;
}

export const CheckupContainer: React.FC<CarContainerProps> = ({
                                                              initialData,
    //                                                           role,
                                                              mode,
    //                                                           // onSave,
                                                             onCancelBack
                                                          }) => {
    const { t } = useTranslation();
    const [formData, setFormData] = useState<Partial<Checkup>>(initialData);
    const [isEditing, setIsEditing] = useState(mode === 'create');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    //
    // // Update form data when initialData changes (e.g. after a successful save)
    useEffect(() => {
        setFormData(initialData);
    }, [initialData]);

    const handleChange = (field: string, value: any) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };
    //
    const handleCancel = () => {
        if (mode === 'create') {
            if (onCancelBack) onCancelBack();
        } else {
            setFormData(initialData);
            setIsEditing(false);
            setError(null);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            // await onSave(formData);
            // if (mode === 'view') {
            //     setIsEditing(false);
            console.log(formData);
            // }
        } catch (err: any) {
            console.error("Save Car Error:", err);
            // setError(parseApiError(err, t('rent.edit.errorSubmit', 'Error saving data')));
        } finally {
            setLoading(false);
        }
    };


    return (
        <form className="car-container-wrapper" onSubmit={handleSave}>
            {/*<RentErrorBlock message={error} />*/}

            <CheckupFields
                formData={formData}
                onChange={handleChange}
                disabled={!isEditing}
            />

            <div className="car-container-actions">
                { !isEditing && (
                    <Button
                        type="button"
                        className="btn-action"
                        onClick={() => setIsEditing(true)}
                    >
                        {t('profile.edit', 'Edit')}
                    </Button>
                )}

                {isEditing && (
                    <>
                        <Button
                            type="button"
                            className="btn-nav"
                            onClick={handleCancel}
                            // disabled={loading}
                        >
                            {t('profile.cancel', 'Cancel')}
                        </Button>

                        <SubmitButton
                            loading={loading}
                            className="btn-action"
                        >
                            {t('profile.save', 'Save')}
                        </SubmitButton>
                    </>
                )}
            </div>
        </form>
    );
};