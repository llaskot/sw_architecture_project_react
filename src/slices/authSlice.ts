// import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
//
// // Описываем структуру данных пользователя на основе твоего примера
// interface User {
//     _id: string;
//     email: string;
//     login: string;
//     first_name: string;
//     last_name: string;
//     active: boolean;
//     is_admin: boolean;
//     is_manager: boolean;
// }
//
// interface AuthState {
//     user: User | null;
//     token: string | null;
// }
//
// // Пытаемся достать данные из localStorage, если они там есть
// const savedUser = localStorage.getItem('user');
// const savedToken = localStorage.getItem('token');
//
// const initialState: AuthState = {
//     user: savedUser ? JSON.parse(savedUser) : null,
//     token: savedToken || null,
// };
//
// const authSlice = createSlice({
//     name: 'auth',
//     initialState,
//     reducers: {
//         // Этот метод мы вызовем после успешного ответа от бекенда
//         setCredentials: (state, action: PayloadAction<{ user: User; access_token: string }>) => {
//             state.user = action.payload.user;
//             state.token = action.payload.access_token;
//
//             // Сохраняем в браузер, чтобы данные не пропали после F5
//             localStorage.setItem('user', JSON.stringify(action.payload.user));
//             localStorage.setItem('token', action.payload.access_token);
//         },
//         // Метод для выхода из системы
//         logout: (state) => {
//             state.user = null;
//             state.token = null;
//             localStorage.removeItem('user');
//             localStorage.removeItem('token');
//         },
//     },
// });
//
// export const { setCredentials, logout } = authSlice.actions;
// export default authSlice.reducer;

import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

// Структура пользователя
interface User {
    _id: string;
    email: string;
    login: string;
    first_name: string;
    last_name: string;
    active: boolean;
    is_admin: boolean;
    is_manager: boolean;
}

// Типы доступных модальных окон
type ModalType = 'signIn' | 'signUp' | 'forgotPassword' | null;

interface AuthState {
    user: User | null;
    token: string | null;
    activeModal: ModalType; // Добавили поле для отслеживания модалки
}

const savedUser = localStorage.getItem('user');
const savedToken = localStorage.getItem('token');

const initialState: AuthState = {
    user: savedUser ? JSON.parse(savedUser) : null,
    token: savedToken || null,
    activeModal: null, // Изначально все окна закрыты
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        // Открыть конкретное окно
        openModal: (state, action: PayloadAction<'signIn' | 'signUp' | 'forgotPassword'>) => {
            state.activeModal = action.payload;
        },
        // Закрыть текущее окно
        closeModal: (state) => {
            state.activeModal = null;
        },
        setCredentials: (state, action: PayloadAction<{ user: User; access_token: string }>) => {
            state.user = action.payload.user;
            state.token = action.payload.access_token;
            state.activeModal = null; // Закрываем модалку при успешном входе

            localStorage.setItem('user', JSON.stringify(action.payload.user));
            localStorage.setItem('token', action.payload.access_token);
        },
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.activeModal = null;
            localStorage.removeItem('user');
            localStorage.removeItem('token');
        },
    },
});

export const { openModal, closeModal, setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;