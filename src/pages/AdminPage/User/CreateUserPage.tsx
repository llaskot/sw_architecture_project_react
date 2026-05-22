import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { UserContainer } from '../../../elements/user/UserContainer/UserContainer';
import Button from '../../../elements/button/Button';
import './CreateUserPage.css';
import {apiClient} from "../../../api/apiClient.ts";

export const CreateUserPage: React.FC = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();

    // Начальное состояние для создания нового пользователя
    const initialUserData = {
        email: '',
        login: '',
        first_name: '',
        last_name: '',
        password: '',
        active: true,
        is_admin: false,
        is_manager: false,
    };

    const handleCreate = async (formData: any) => {
        // Отправляем POST запрос на бэкенд для создания нового пользователя
        await apiClient('/users/', {
            method: 'POST',
            body: JSON.stringify(formData),
        });

        // После успешного создания возвращаемся на предыдущую страницу (список пользователей)
        navigate(-1);
    };

    return (
        <div className="create-user-page">
            <div className="create-user-header">
                <h2>{t('user.createTitle', 'Create New User')}</h2>
                <Button type="button" className="btn-small" onClick={() => navigate(-1)}>
                    {t('common.back', 'Back')}
                </Button>
            </div>

            <UserContainer
                initialData={initialUserData}
                role="admin" // Создавать пользователей может только админ
                mode="create"
                onSave={handleCreate}
                onCancelBack={() => navigate(-1)}
            />
        </div>
    );
};