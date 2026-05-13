import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { confirmForgotPassword, openModal } from '../../slices/authSlice';
import type { AppDispatch, RootState } from '../../app/store';
import Input from '../input/Input';
import PasswordInput from '../input/PasswordInput';
import SubmitButton from '../button/SubmitButton';

const ConfirmForgotPasswordForm: React.FC = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch<AppDispatch>();
    const { loading, error } = useSelector((state: RootState) => state.auth);

    const [code, setCode] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPass, setConfirmPass] = useState('');
    const [localError, setLocalError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Валидация
        if (password.length < 6) {
            setLocalError(t('auth.errorMinLength')); // Минимум 6 символов
            return;
        }

        if (password !== confirmPass) {
            setLocalError(t('auth.errorPasswordMismatch')); // Пароли не совпадают
            return;
        }

        if (!code) {
            setLocalError(t('auth.errorCodeRequired')); // Код обязателен
            return;
        }

        dispatch(confirmForgotPassword({ code, password }));
    };

    return (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px', minWidth: '320px' }}>
            <h2 style={{ textAlign: 'center' }}>{t('auth.confirmResetTitle')}</h2>

            <Input
                label={t('auth.codeLabel')}
                type="text"
                value={code}
                onChange={(e) => {
                    setCode(e.target.value);
                    setLocalError('');
                }}
                placeholder="123456"
                error={localError && localError.includes('code') ? localError : ''}
            />

            <PasswordInput
                label={t('auth.newPasswordLabel')}
                value={password}
                onChange={(e) => {
                    setPassword(e.target.value);
                    setLocalError('');
                }}
                error={localError && localError.includes('length') ? localError : ''}
            />

            <PasswordInput
                label={t('auth.confirmNewPasswordLabel')}
                value={confirmPass}
                onChange={(e) => {
                    setConfirmPass(e.target.value);
                    setLocalError('');
                }}
                error={localError && localError.includes('match') ? localError : error || ''}
            />

            <SubmitButton loading={loading}>{t('auth.resetPasswordBtn')}</SubmitButton>

            <span
                onClick={() => dispatch(openModal('forgotPassword'))}
                style={{ textAlign: 'center', color: '#007bff', cursor: 'pointer', fontSize: '0.9rem' }}
            >
                {t('auth.backToCode')}
            </span>
        </form>
    );
};

export default ConfirmForgotPasswordForm;