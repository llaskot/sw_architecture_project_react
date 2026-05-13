import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { forgotPassword, openModal } from '../../slices/authSlice';
import type { AppDispatch, RootState } from '../../app/store';
import Input from '../input/Input';
import SubmitButton from '../button/SubmitButton';

const ForgotPasswordForm: React.FC = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch<AppDispatch>();
    const { loading, error } = useSelector((state: RootState) => state.auth);
    const [identifier, setIdentifier] = useState('');
    const [localError, setLocalError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (identifier.length < 6) {
            setLocalError(t('auth.errorMinLength')); // Локализация ошибки длины
            return;
        }
        dispatch(forgotPassword(identifier));
    };

    return (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px', minWidth: '320px' }}>
            <h2 style={{ textAlign: 'center' }}>{t('auth.forgotRecovery')}</h2>
            <p style={{ fontSize: '0.9rem', color: '#666' }}>{t('auth.resetInstructions')}</p>

            <Input
                label={t('auth.loginLabel')} // "Логін або Email" из i18n
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
                style={{ textAlign: 'center', color: '#007bff', cursor: 'pointer', fontSize: '0.9rem' }}
            >
                {t('profile.cancel')}
            </span>
        </form>
    );
};

export default ForgotPasswordForm;