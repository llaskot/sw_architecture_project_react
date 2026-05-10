import React, { useState, type FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import LoginInput from '../input/LoginInput';
import PasswordInput from '../input/PasswordInput';
import SubmitButton from '../button/SubmitButton';

interface SignInFormProps {
    onSuccess: (data: any) => void;
    onRegisterClick: () => void;
    onForgotPassClick: () => void;
}

const SignInForm: React.FC<SignInFormProps> = ({ onRegisterClick, onForgotPassClick }) => {
    const { t } = useTranslation();

    // Состояния для полей
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');

    // Состояния для ошибок
    const [loginError, setLoginError] = useState('');
    const [passwordError, setPasswordError] = useState('');

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        // Сбрасываем ошибки перед проверкой
        setLoginError('');
        setPasswordError('');

        let isValid = true;

        // Валидация логина
        if (login.length < 6) {
            setLoginError(t('auth.errorMinLength'));
            isValid = false;
        }

        // Валидация пароля
        if (password.length < 6) {
            setPasswordError(t('auth.errorMinLength'));
            isValid = false;
        }

        if (isValid) {
            console.log('Sending data to backend:', { login, password });
            // Здесь на следующем этапе мы добавим вызов Redux Thunk или API
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
            <LoginInput
                placeholder={t('auth.loginLabel')}
                value={login}
                onChange={(e) => setLogin(e.target.value)}
                error={loginError}
            />

            <PasswordInput
                placeholder={t('auth.passwordLabel')}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={passwordError}
            />

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '1rem' }}>
        <span
            onClick={onForgotPassClick}
            style={{ color: '#007bff', cursor: 'pointer' }}
        >
          {t('auth.forgotPass')}
        </span>
            </div>

            <SubmitButton>
                {t('auth.signInBtn')}
            </SubmitButton>

            <div style={{ marginTop: '1rem', fontSize: '0.9rem' }}>
                {t('auth.noAccount')}{' '}
                <span
                    onClick={onRegisterClick}
                    style={{ color: '#007bff', cursor: 'pointer', fontWeight: 'bold' }}
                >
          {t('header.signUp')}
        </span>
            </div>
        </form>
    );
};

export default SignInForm;