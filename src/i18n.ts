import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
    en: {
        translation: {
            header: {
                projectName: "Highway to Hell",
                signIn: "Sign In",
                signUp: "Sign Up",
                username: "User"
            },
            profile: {
                title: "User Profile",
                email: "Email",
                login: "Login",
                first_name: "First Name",
                last_name: "Last Name",
                role: "Role",
                edit: "Edit",
                save: "Save",
                cancel: "Cancel",
            },
            auth: {
                logout: "Logout",
                loginLabel: "Login or Email",
                passwordLabel: "Password",
                forgotPass: "Forgot password?",
                signInBtn: "Sign In",
                noAccount: "Don't have an account?",
                errorMinLength: "Minimum 6 characters required",
                serverError: "Invalid login or password"
            },
            signUp: {
                title: "Create Account",
                emailLabel: "Email",
                loginLabel: "Login",
                firstNameLabel: "First Name",
                lastNameLabel: "Last Name",
                passwordLabel: "Password",
                confirmPasswordLabel: "Confirm Password",
                submitButton: "Register",
                alreadyHaveAccount: "Already have an account?",
                signInLink: "Sign In",
                checkEmail: "Registration successful! Please check your email for the confirmation code."
            },
            confirm: {
                title: "Confirm Registration",
                codeLabel: "6-digit Code",
                submitButton: "Confirm",
                errorInvalidCode: "Invalid or expired code"
            },
            validation: {
                invalidEmail: "Invalid email address",
                loginLength: "Login must be 6-20 characters",
                passwordLength: "Password must be at least 6 characters",
                passwordsDoNotMatch: "Passwords do not match",
                firstNameRequired: "First name is required",
                lastNameRequired: "Last name is required"
            },
            home: {
                searchPlaceholder: "Search cars...",
                loading: "Loading cars...",
                noCars: "No cars found",
                pricePerDay: "price per day",
                prev: "Prev",
                next: "Next",
                pageOf: "Page {{page}} of {{total}}",
                clearAll: "Clear All",
                brands: "Brands",
                categories: "Comfort category"

            },
            guest: "Guest"
        }
    },
    uk: {
        translation: {
            header: {
                projectName: "Highway to Hell",
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
                logout: "Вийти",
                loginLabel: "Логін або Email",
                passwordLabel: "Пароль",
                forgotPass: "Забули пароль?",
                signInBtn: "Увійти",
                noAccount: "Немає акаунту?",
                errorMinLength: "Мінімум 6 символів",
                serverError: "Невірний логін або пароль"
            },
            signUp: {
                title: "Реєстрація",
                emailLabel: "Електронна пошта",
                loginLabel: "Логін",
                firstNameLabel: "Ім'я",
                lastNameLabel: "Прізвище",
                passwordLabel: "Пароль",
                confirmPasswordLabel: "Підтвердіть пароль",
                submitButton: "Зареєструватися",
                alreadyHaveAccount: "Вже є акаунт?",
                signInLink: "Увійти",
                checkEmail: "Реєстрація успішна! Будь ласка, перевірте пошту для отримання коду підтвердження."
            },
            confirm: {
                title: "Підтвердження",
                codeLabel: "6-значний код",
                submitButton: "Підтвердити",
                errorInvalidCode: "Невірний або прострочений код"
            },
            validation: {
                invalidEmail: "Невірний формат пошти",
                loginLength: "Логін має бути від 6 до 20 символів",
                passwordLength: "Пароль має бути не менше 6 символів",
                passwordsDoNotMatch: "Паролі не збігаються",
                firstNameRequired: "Ім'я обов'язкове",
                lastNameRequired: "Прізвище обов'язкове"
            },
            home: {
                searchPlaceholder: "Пошук авто...",
                loading: "Завантаження машин...",
                noCars: "Машин не знайдено",
                pricePerDay: "ціна за добу",
                prev: "Назад",
                next: "Вперед",
                pageOf: "Сторінка {{page}} з {{total}}",
                clearAll: "Очистити все",
                brands: "Бренд",
                categories: "Клас комфорту"

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