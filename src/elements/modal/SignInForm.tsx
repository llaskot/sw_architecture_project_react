import React, { useState, type FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { loginUser } from '../../slices/authSlice';
import { type AppDispatch } from '../../app/store';
import LoginInput from '../input/LoginInput';
import PasswordInput from '../input/PasswordInput';
import SubmitButton from '../button/SubmitButton';
import './ModalForm.css';

interface SignInFormProps {
    onRegisterClick: () => void;
    onForgotPassClick: () => void;
}

const SignInForm: React.FC<SignInFormProps> = ({ onRegisterClick, onForgotPassClick }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch<AppDispatch>();

    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');

    // Field errors
    const [loginError, setLoginError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    // General server error (e.g., 401)
    const [serverError, setServerError] = useState('');
    // Loading state
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

            // Trigger Thunk and await result
            const resultAction = await dispatch(loginUser({ login, password }));

            if (loginUser.rejected.match(resultAction)) {
                // If Thunk returned an error (rejectWithValue)
                setServerError(resultAction.payload as string);
            }

            // On success - ModalManager will close the window automatically
            // because activeModal = null is set in the Slice upon success.
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="signin-form">
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

            {/* Displaying server error */}
            {serverError && (
                <div className="signin-form__server-error">
                    {serverError}
                </div>
            )}

            <div className="signin-form__links-container">
                <span
                    onClick={onForgotPassClick}
                    className="signin-form__clickable-link"
                >
                    {t('auth.forgotPass')}
                </span>
            </div>

            <SubmitButton disabled={isLoading}>
                {isLoading ? '...' : t('auth.signInBtn')}
            </SubmitButton>

            <div className="signin-form__footer">
                {t('auth.noAccount')}{' '}
                <span
                    onClick={onRegisterClick}
                    className="signin-form__clickable-link signin-form__clickable-link--bold"
                >
                    {t('header.signUp')}
                </span>
            </div>
        </form>
    );
};

export default SignInForm;