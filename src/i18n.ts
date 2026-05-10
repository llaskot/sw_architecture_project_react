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
        }
    }
};

i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: "uk", // язык по умолчанию
        interpolation: {
            escapeValue: false
        }
    });

export default i18n;