import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { confirmForgotPassword, openModal } from '../../slices/authSlice';
import type { AppDispatch, RootState } from '../../app/store';
import Input from '../input/Input';
import PasswordInput from '../input/PasswordInput';
import SubmitButton from '../button/SubmitButton';
import './ConfirmForgotPasswordForm.css';

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

        // Validation
        if (password.length < 6) {
            setLocalError(t('auth.errorMinLength')); // Minimum 6 characters
            return;
        }

        if (password !== confirmPass) {
            setLocalError(t('auth.errorPasswordMismatch')); // Passwords do not match
            return;
        }

        if (!code) {
            setLocalError(t('auth.errorCodeRequired')); // Code is required
            return;
        }

        dispatch(confirmForgotPassword({ code, password }));
    };

    return (
        <form onSubmit={handleSubmit} className="confirm-forgot-form">
            <h2 className="confirm-forgot-title">{t('auth.confirmResetTitle')}</h2>

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
                className="confirm-forgot-link"
            >
                {t('auth.backToCode')}
            </span>
        </form>
    );
};

export default ConfirmForgotPasswordForm;