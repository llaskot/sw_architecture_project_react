import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { confirmRegistration, clearRegistrationPending } from '../../slices/authSlice';
import type { AppDispatch, RootState } from '../../app/store';
import Input from '../input/Input';
import SubmitButton from '../button/SubmitButton';

const ConfirmRegistrationForm: React.FC = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch<AppDispatch>();
    const { loading, error } = useSelector((state: RootState) => state.auth);

    const [code, setCode] = useState('');
    const [validationError, setValidationError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setValidationError('');

        // Валидация: код должен быть ровно 6 символов (обычно цифры)
        if (code.length !== 6) {
            setValidationError(t('confirm.errorInvalidCode'));
            return;
        }

        dispatch(confirmRegistration(code));
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', minWidth: '320px' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '5px' }}>{t('confirm.title')}</h2>
            <p style={{ textAlign: 'center', fontSize: '0.9rem', color: '#555', marginBottom: '10px' }}>
                {t('signUp.checkEmail')}
            </p>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <Input
                    label={t('confirm.codeLabel')}
                    type="text"
                    maxLength={6}
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))} // Только цифры
                    error={validationError || error || ''}
                    placeholder="123456"
                />

                <SubmitButton loading={loading}>
                    {t('confirm.submitButton')}
                </SubmitButton>
            </form>

            <div style={{ marginTop: '10px', textAlign: 'center' }}>
                <span
                    onClick={() => dispatch(clearRegistrationPending())}
                    style={{ color: '#007bff', cursor: 'pointer', fontSize: '0.85rem', textDecoration: 'underline' }}
                >
                    {t('profile.cancel')} / {t('signUp.title')}
                </span>
            </div>
        </div>
    );
};

export default ConfirmRegistrationForm;