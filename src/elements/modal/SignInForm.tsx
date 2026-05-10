

import React, { useState, type FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux'; // Импортируем хук
import { loginUser } from '../../slices/authSlice'; // Импортируем наш Thunk
import { type AppDispatch } from '../../app/store';
import LoginInput from '../input/LoginInput';
import PasswordInput from '../input/PasswordInput';
import SubmitButton from '../button/SubmitButton';

interface SignInFormProps {
    onRegisterClick: () => void;
    onForgotPassClick: () => void;
}

const SignInForm: React.FC<SignInFormProps> = ({ onRegisterClick, onForgotPassClick }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch<AppDispatch>();

    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');

    // Ошибки полей
    const [loginError, setLoginError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    // Общая ошибка от сервера (например, 401)
    const [serverError, setServerError] = useState('');
    // Состояние загрузки
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoginError('');
        setPasswordError('');
        setServerError('');

        let isValid = true;

        if (login.length < 6) {
            setLoginError(t('auth.errorMinLength'));
            isValid = false;
        }

        if (password.length < 6) {
            setPasswordError(t('auth.errorMinLength'));
            isValid = false;
        }

        if (isValid) {
            setIsLoading(true);

            // Запускаем Thunk и ждем результат
            const resultAction = await dispatch(loginUser({ login, password }));

            if (loginUser.rejected.match(resultAction)) {
                // Если Thunk вернул ошибку (rejectWithValue)
                setServerError(resultAction.payload as string);
            }

            // Если успех — ModalManager сам закроет окно, так как в Slice
            // прописано activeModal = null при успехе.
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
            <LoginInput
                placeholder={t('auth.loginLabel')}
                value={login}
                onChange={(e) => setLogin(e.target.value)}
                error={loginError}
                disabled={isLoading}
            />

            <PasswordInput
                placeholder={t('auth.passwordLabel')}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={passwordError}
                disabled={isLoading}
            />

            {/* Вывод ошибки от сервера */}
            {serverError && (
                <div style={{ color: 'red', marginBottom: '1rem', fontSize: '0.9rem' }}>
                    {serverError}
                </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '1rem' }}>
                <span
                    onClick={onForgotPassClick}
                    style={{ color: '#007bff', cursor: 'pointer' }}
                >
                    {t('auth.forgotPass')}
                </span>
            </div>

            <SubmitButton disabled={isLoading}>
                {isLoading ? '...' : t('auth.signInBtn')}
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