import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Button from '../Button';
import './CreateActionButton.css';

interface CreateActionButtonProps {
    navigateTo: string;
}

export const CreateActionButton: React.FC<CreateActionButtonProps> = ({ navigateTo }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    return (
        <Button
            type="button"
            className="create-action-button"
            onClick={() => navigate(navigateTo)}
        >
            <span className="create-action-button-icon">+</span>
            {t('buttons.create', 'Create')}
        </Button>
    );
};