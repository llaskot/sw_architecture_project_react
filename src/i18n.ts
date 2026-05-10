import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
    en: {
        translation: {
            header: {
                projectName: "Project Name",
                signIn: "Sign In",
                signUp: "Sign Up",
                username: "Username"
            },
            auth: {
                loginLabel: "Login or Email",
                passwordLabel: "Password",
                errorMinLength: "Minimum 6 characters required",
                signInBtn: "Login",
                forgotPass: "Forgot password?",
                noAccount: "Don't have an account?"
            },
            guest: "Guest"
        }
    },
    uk: {
        translation: {
            header: {
                projectName: "Назва Проекту",
                signIn: "Увійти",
                signUp: "Реєстрація",
                username: "Користувач"
            },
            auth: {
                loginLabel: "Логін або Email",
                passwordLabel: "Пароль",
                errorMinLength: "Не менше 6 символів",
                signInBtn: "Увійти",
                forgotPass: "Забули пароль?",
                noAccount: "Немає акаунту?"
            },
            guest: "Гість"
        }
    }
};

i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: "uk",
        interpolation: {
            escapeValue: false
        }
    });

export default i18n;