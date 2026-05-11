import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
    en: {
        translation: {
            header: {
                projectName: "My Project",
                signIn: "Sign In",
                signUp: "Sign Up",
                username: "User"
            },
            profile: {
                title: "User Profile",
                email: "Email",
                login: "Login",
                firstName: "First Name",
                lastName: "Last Name",
                role: "Role",
                edit: "Edit",
                save: "Save",
                cancel: "Cancel"
            },
            auth: {
                logout: "Logout"
            },
            guest: "Guest"
        }
    },
    uk: {
        translation: {
            header: {
                projectName: "Мій Проєкт",
                signIn: "Увійти",
                signUp: "Реєстрація",
                username: "Користувач"
            },
            profile: {
                title: "Профіль користувача",
                email: "Електронна пошта",
                login: "Логін",
                first_name: "Ім'я",      // Было firstName
                last_name: "Прізвище",   // Было lastName
                role: "Роль",
                edit: "Редагувати",
                save: "Зберегти",
                cancel: "Скасувати"
            },
            auth: {
                logout: "Вийти"
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