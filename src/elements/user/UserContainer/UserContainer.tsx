import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { UserFields } from '../UserFields/UserFields';
import Button from '../../button/Button';
import SubmitButton from '../../button/SubmitButton';
import RentErrorBlock from '../../rent/RentErrorBlock/RentErrorBlock';
import './UserContainer.css';
import {parseApiError} from "../../../utils/errorHandler.ts";

interface UserData {
    email: string;
    login?: string | null;
    first_name?: string | null;
    last_name?: string | null;
    active?: boolean | null;
    is_admin?: boolean | null;
    is_manager?: boolean | null;
    password?: string;
}

interface UserContainerProps {
    initialData: Partial<UserData>;
    role: 'admin' | 'manager';
    mode: 'view' | 'create';
    onSave: (data: Partial<UserData>) => Promise<void>;
    onCancelBack?: () => void;
}

export const UserContainer: React.FC<UserContainerProps> = ({
                                                                initialData,
                                                                role,
                                                                mode,
                                                                onSave,
                                                                onCancelBack
                                                            }) => {
    const { t } = useTranslation();
    const [formData, setFormData] = useState<Partial<UserData>>(initialData);
    const [isEditing, setIsEditing] = useState(mode === 'create');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleChange = (field: keyof UserData, value: any) => {
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
            console.error("Save User Error:", err);

            setError(parseApiError(err, t('carDetail.errorLoad', 'Error loading data')));

        } finally {
            setLoading(false);
        }
    };
    const canEdit = role === 'admin' && mode === 'view';

    return (
        <form className="user-container-wrapper" onSubmit={handleSave}>
            <RentErrorBlock message={error} />


            <div className="user-fields-container">
                <UserFields
                    data={formData}
                    onChange={handleChange}
                    disabled={!isEditing}
                    showPassword={mode === 'create'}
                />
            </div>

            <div className="admin-rent-actions">
                {canEdit && !isEditing && (
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
                            disabled={loading}
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