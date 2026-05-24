import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CarFields } from '../CarFields/CarFields';
import Button from '../../button/Button';
import SubmitButton from '../../button/SubmitButton';
import RentErrorBlock from '../../rent/RentErrorBlock/RentErrorBlock';
import { parseApiError } from '../../../utils/errorHandler';
import { type Car, type AutoModelRead } from '../../../api/carsApi';
import './CarContainer.css';

interface CarContainerProps {
    initialData: Partial<Car>;
    role: 'admin' | 'manager';
    mode: 'view' | 'create';
    models: AutoModelRead[];
    onSave: (data: Partial<Car>) => Promise<void>;
    onCancelBack?: () => void;
}

export const CarContainer: React.FC<CarContainerProps> = ({
                                                              initialData,
                                                              role,
                                                              mode,
                                                              models,
                                                              onSave,
                                                              onCancelBack
                                                          }) => {
    const { t } = useTranslation();
    const [formData, setFormData] = useState<Partial<Car>>(initialData);
    const [isEditing, setIsEditing] = useState(mode === 'create');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleChange = (field: string, value: any) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

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
            await onSave(formData);
            if (mode === 'view') {
                setIsEditing(false);
            }
        } catch (err: any) {
            console.error("Save Car Error:", err);
            setError(parseApiError(err, t('rent.edit.errorSubmit', 'Error saving data')));
        } finally {
            setLoading(false);
        }
    };

    const canEdit = role === 'admin' && mode === 'view';

    return (
        <form className="car-container-wrapper" onSubmit={handleSave}>
            <RentErrorBlock message={error} />

            <CarFields
                formData={formData}
                onChange={handleChange}
                disabled={!isEditing}
                models={models}
            />

            <div className="car-container-actions">
                {canEdit && !isEditing && (
                    <Button
                        type="button"
                        className="btn-small"
                        onClick={() => setIsEditing(true)}
                    >
                        {t('profile.edit', 'Edit')}
                    </Button>
                )}

                {isEditing && (
                    <>
                        <Button
                            type="button"
                            className="btn-small"
                            onClick={handleCancel}
                            disabled={loading}
                        >
                            {t('profile.cancel', 'Cancel')}
                        </Button>

                        <SubmitButton
                            loading={loading}
                            className="btn-small"
                        >
                            {t('profile.save', 'Save')}
                        </SubmitButton>
                    </>
                )}
            </div>
        </form>
    );
};