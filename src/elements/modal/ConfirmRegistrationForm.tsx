import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { confirmRegistration, clearRegistrationPending } from '../../slices/authSlice';
import type { AppDispatch, RootState } from '../../app/store';
import Input from '../input/Input';
import SubmitButton from '../button/SubmitButton';
import './ConfirmRegistrationForm.css';

const ConfirmRegistrationForm: React.FC = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch<AppDispatch>();
    const { loading, error } = useSelector((state: RootState) => state.auth);

    const [code, setCode] = useState('');
    const [validationError, setValidationError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setValidationError('');

        // Validation: code must be exactly 6 characters (usually digits)
        if (code.length !== 6) {
            setValidationError(t('confirm.errorInvalidCode'));
            return;
        }

        dispatch(confirmRegistration(code));
    };

    return (
        <div className="confirm-registration-container">
            <h2 className="confirm-registration-title">{t('confirm.title')}</h2>
            <p className="confirm-registration-text">
                {t('signUp.checkEmail')}
            </p>

            <form onSubmit={handleSubmit} className="confirm-registration-form">
                <Input
                    label={t('confirm.codeLabel')}
                    type="text"
                    maxLength={6}
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))} // Only digits
                    error={validationError || error || ''}
                    placeholder="123456"
                />

                <SubmitButton loading={loading}>
                    {t('confirm.submitButton')}
                </SubmitButton>
            </form>

            <div className="confirm-registration-footer">
                <span
                    onClick={() => dispatch(clearRegistrationPending())}
                    className="confirm-registration-link"
                >
                    {t('profile.cancel')} / {t('signUp.title')}
                </span>
            </div>
        </div>
    );
};

export default ConfirmRegistrationForm;