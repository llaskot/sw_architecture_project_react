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
                serverError: "Invalid login or password",
                forgotRecovery: "Password Recovery",
                resetInstructions: "Enter your login or email to receive a recovery code",
                confirmResetTitle: "Set New Password",
                codeLabel: "Confirmation Code",
                newPasswordLabel: "New Password",
                confirmNewPasswordLabel: "Confirm New Password",
                resetPasswordBtn: "Reset Password",
                backToCode: "Go back",
                // Validation errors
                errorPasswordMismatch: "Passwords do not match",
                errorCodeRequired: "Enter the code from email",
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
            carCard: {
                brandLabel: "Brand",
                year: "Year",
                color: "Color",
                pricePerDay: "day",
                available: "Available",
                unavailable: "Unavailable",
                moreDetails: "More details",
                plate_number: "license plate",

            },
            carDetail: {
                errorLoad: "Error loading data",
                notFound: "Vehicle not found",
                backToList: "Back to list",
                countryLabel: "Brand origin",
                categoryLabel: "Comfort class",
                mileageLabel: "Mileage",
                bookBtn: "Book for the future"
            },
            rent: {
                pageTitle: "Car Rental Form",
                closeTab: "Close tab",
                successTitle: "Rental successfully booked!",
                successText: "Your order has been accepted for processing. A manager will contact you shortly.",
                startDateLabel: "Rental start date and time",
                daysQtyLabel: "Number of rental days",
                userDockLabel: "Passport data / Driver's license",
                userDockPlaceholder: "Series, number or ID card",
                driverLabel: "Driver required",
                totalPriceLabel: "Total price",
                submittingBtn: "Processing...",
                submitBtn: "Confirm order",
                error: {
                    startDateRequired: "Please select a start date and time",
                    userDockRequired: "Please provide document details",
                    daysMin: "Minimum rental period is 1 day",
                    serverDefault: "Failed to book the rental. The vehicle might already be reserved for these dates."
                }
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
                serverError: "Невірний логін або пароль",
                forgotRecovery: "Відновлення пароля",
                resetInstructions: "Введіть ваш логін або email для отримання коду відновлення",
                confirmResetTitle: "Встановлення нового пароля",
                codeLabel: "Код підтвердження",
                newPasswordLabel: "Новий пароль",
                confirmNewPasswordLabel: "Підтвердіть новий пароль",
                resetPasswordBtn: "Змінити пароль",
                backToCode: "Повернутися назад",
                // Ошибки валидации
                errorPasswordMismatch: "Паролі не співпадають",
                errorCodeRequired: "Введіть код з листа",
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
            carCard: {
                brandLabel: "Бренд",
                year: "Рік",
                color: "Колір",
                pricePerDay: "доба",
                available: "Доступно",
                unavailable: "Недоступно",
                moreDetails: "Детальніше",
                plate_number: "Держномер",

            },
            carDetail: {
                errorLoad: "Помилка завантаження даних",
                notFound: "Автомобіль не знайдено",
                backToList: "Назад до списку",
                countryLabel: "Країна походження",
                categoryLabel: "Клас комфорту",
                mileageLabel: "Пробіг",
                bookBtn: "Забронювати на майбутнє"
            },
            rent: {
                pageTitle: "Оформлення оренди",
                closeTab: "Закрити вкладку",
                successTitle: "Оренду успішно оформлено!",
                successText: "Ваше замовлення прийнято в обробку. Менеджер зв'яжеться з вами найближчим часом.",
                startDateLabel: "Дата та час початку оренди",
                daysQtyLabel: "Кількість діб оренди",
                userDockLabel: "Паспортні дані / Посвідчення водія",
                userDockPlaceholder: "Серія, номер або ID-картка",
                driverLabel: "Потрібен водій",
                totalPriceLabel: "Загальна вартість",
                submittingBtn: "Обробка...",
                submitBtn: "Підтвердити замовлення",
                error: {
                    startDateRequired: "Оберіть дату та час початку",
                    userDockRequired: "Вкажіть дані документа",
                    daysMin: "Мінімальний термін — 1 доба",
                    serverDefault: "Не вдалося оформити оренду. Можливо, авто вже заброньовано на ці дати."
                }
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