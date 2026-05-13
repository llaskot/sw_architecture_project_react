import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser, openModal } from '../../slices/authSlice';
import type {AppDispatch, RootState} from '../../app/store';
import Input from '../input/Input';
import SubmitButton from '../button/SubmitButton';

const SignUpForm: React.FC = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch<AppDispatch>();
    const { loading, error } = useSelector((state: RootState) => state.auth);

    const [formData, setFormData] = useState({
        email: '',
        login: '',
        password: '',
        confirmPassword: '',
        first_name: '',
        last_name: '',
    });

    const [showPassword, setShowPassword] = useState(false);
    const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

    const validate = () => {
        const errors: Record<string, string> = {};

        // 1. Email validation (regex for EmailStr)
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            errors.email = t('validation.invalidEmail');
        }

        // 2. Login validation: 6-20 chars
        if (formData.login.length < 6 || formData.login.length > 20) {
            errors.login = t('validation.loginLength');
        }

        // 3. Password validation: min 6 chars
        if (formData.password.length < 6) {
            errors.password = t('validation.passwordLength');
        }

        // 4. Password confirmation check
        if (formData.password !== formData.confirmPassword) {
            errors.confirmPassword = t('validation.passwordsDoNotMatch');
        }

        // 5. Names validation: min 1 char
        if (!formData.first_name.trim()) {
            errors.first_name = t('validation.firstNameRequired');
        }
        if (!formData.last_name.trim()) {
            errors.last_name = t('validation.lastNameRequired');
        }

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validate()) {
            const { confirmPassword, ...submitData } = formData;
            dispatch(registerUser(submitData));
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '15px',
                minWidth: '320px',
                maxHeight: '75vh',      // 3/4 of display height
                overflowY: 'auto',     // enable vertical scroll
                paddingRight: '12px',  // space for scrollbar
                paddingLeft: '4px',
                scrollbarWidth: 'thin' // optional: makes scrollbar less bulky in Firefox
            }}
        >            <h2 style={{ textAlign: 'center', marginBottom: '10px' }}>{t('signUp.title')}</h2>

            {error && <p style={{ color: 'red', fontSize: '0.85rem', margin: 0 }}>{error}</p>}

            <Input
                label={t('signUp.emailLabel')}
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                error={validationErrors.email}
                required
            />

            <Input
                label={t('signUp.loginLabel')}
                type="text"
                value={formData.login}
                onChange={(e) => setFormData({ ...formData, login: e.target.value })}
                error={validationErrors.login}
                required
            />

            <Input
                label={t('signUp.firstNameLabel')}
                type="text"
                value={formData.first_name}
                onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                error={validationErrors.first_name}
                required
            />

            <Input
                label={t('signUp.lastNameLabel')}
                type="text"
                value={formData.last_name}
                onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                error={validationErrors.last_name}
                required
            />

            <div style={{ position: 'relative' }}>
                <Input
                    label={t('signUp.passwordLabel')}
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    error={validationErrors.password}
                    required
                />
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                        position: 'absolute',
                        right: '10px',
                        top: '35px',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '1.2rem'
                    }}
                >
                    {showPassword ? '🔒' : '👁️'}
                </button>
            </div>

            <Input
                label={t('signUp.confirmPasswordLabel')}
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                error={validationErrors.confirmPassword}
                required
            />

            <SubmitButton loading={loading}>
                {t('signUp.submitButton')}
            </SubmitButton>

            <p style={{ textAlign: 'center', fontSize: '0.9rem', marginTop: '10px' }}>
                {t('signUp.alreadyHaveAccount')}{' '}
                <span
                    onClick={() => dispatch(openModal('signIn'))}
                    style={{ color: '#007bff', cursor: 'pointer', textDecoration: 'underline' }}
                >
                    {t('signUp.signInLink')}
                </span>
            </p>
        </form>
    );
};

export default SignUpForm;