import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { apiClient } from '../api/apiClient';

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
    activeModal: ModalType;
}

// Пытаемся достать данные из localStorage при старте
const savedUser = localStorage.getItem('user');
const savedToken = localStorage.getItem('token');

const initialState: AuthState = {
    user: savedUser ? JSON.parse(savedUser) : null,
    token: savedToken || null,
    activeModal: null,
};

// 1. Создаем асинхронный экшен для логина
export const loginUser = createAsyncThunk(
    'auth/loginUser',
    async (credentials: { login: string; password: any }, { rejectWithValue }) => {
        try {
            const data = await apiClient('/auth/login', {
                method: 'POST',
                body: JSON.stringify(credentials),
            });
            return data; // Возвращает { user, access_token }
        } catch (error: any) {
            return rejectWithValue(error.detail || 'Something went wrong');
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        openModal: (state, action: PayloadAction<'signIn' | 'signUp' | 'forgotPassword'>) => {
            state.activeModal = action.payload;
        },
        closeModal: (state) => {
            state.activeModal = null;
        },
        setCredentials: (state, action: PayloadAction<{ user: User; access_token: string }>) => {
            state.user = action.payload.user;
            state.token = action.payload.access_token;
            state.activeModal = null;

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
    // 2. Добавляем обработку асинхронного экшена
    extraReducers: (builder) => {
        builder.addCase(loginUser.fulfilled, (state, action: PayloadAction<{ user: User; access_token: string }>) => {
            // Если запрос успешен (fulfilled):
            state.user = action.payload.user;
            state.token = action.payload.access_token;

            // ЗАКРЫВАЕМ модалку
            state.activeModal = null;

            // Сохраняем данные в браузер
            localStorage.setItem('user', JSON.stringify(action.payload.user));
            localStorage.setItem('token', action.payload.access_token);
        });
    },
});

export const { openModal, closeModal, setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;