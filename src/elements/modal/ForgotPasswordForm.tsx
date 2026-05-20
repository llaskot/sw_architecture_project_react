import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { forgotPassword, openModal } from '../../slices/authSlice';
import type { AppDispatch, RootState } from '../../app/store';
import Input from '../input/Input';
import SubmitButton from '../button/SubmitButton';
import './ForgotPasswordForm.css';

const ForgotPasswordForm: React.FC = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch<AppDispatch>();
    const { loading, error } = useSelector((state: RootState) => state.auth);
    const [identifier, setIdentifier] = useState('');
    const [localError, setLocalError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (identifier.length < 6) {
            setLocalError(t('auth.errorMinLength')); // Localization of length error
            return;
        }
        dispatch(forgotPassword(identifier));
    };

    return (
        <form onSubmit={handleSubmit} className="forgot-password-form">
            <h2 className="forgot-password-form-title">{t('auth.forgotRecovery')}</h2>
            <p className="forgot-password-form-instructions">{t('auth.resetInstructions')}</p>

            <Input
                label={t('auth.loginLabel')} // "Login or Email" from i18n
                type="text"
                value={identifier}
                onChange={(e) => {
                    setIdentifier(e.target.value);
                    setLocalError('');
                }}
                error={localError || error || ''}
            />

            <SubmitButton loading={loading}>{t('home.next')}</SubmitButton>

            <span
                onClick={() => dispatch(openModal('signIn'))}
                className="forgot-password-form-link"
            >
                {t('profile.cancel')}
            </span>
        </form>
    );
};

export default ForgotPasswordForm;