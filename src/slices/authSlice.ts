import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit'; // Исправлено: импорт типа
import { apiClient } from '../api/apiClient';

// 1. Описание типов (Snake_case как в твоем JSON)
export interface UserProfile {
    _id: string;
    email: string;
    login: string;
    first_name: string;
    last_name: string;
    active: boolean;
    is_admin: boolean;
    is_manager: boolean;
}

// Тип ответа при логине (токен + данные юзера)
interface LoginResponse {
    access_token: string;
    user: UserProfile;
}

interface AuthState {
    user: UserProfile | null;
    token: string | null;
    loading: boolean;
    error: string | null;
    activeModal: 'signIn' | 'signUp' | null;
}

// 2. Инициализация (подтягиваем из памяти браузера)
const storedToken = localStorage.getItem('token');
const storedUser = localStorage.getItem('user');

const initialState: AuthState = {
    user: storedUser ? JSON.parse(storedUser) : null,
    token: storedToken || null,
    loading: false,
    error: null,
    activeModal: null,
};

// 3. Упрощенный Thunk (только один запрос)
export const loginUser = createAsyncThunk(
    'auth/loginUser',
    async (credentials: any, { rejectWithValue }) => {
        try {
            // Если при логине летит всё сразу — просто возвращаем результат
            const data: LoginResponse = await apiClient('/auth/login', {
                method: 'POST',
                credentials: "include",
                body: JSON.stringify(credentials),
            });
            return data;
        } catch (error: any) {
            return rejectWithValue(error.detail || 'Login failed');
        }
    }
);

// 3.2. Register Thunk
export const registerUser = createAsyncThunk(
    'auth/registerUser',
    async (userData: any, { rejectWithValue }) => {
        try {
            const data = await apiClient('/auth/register', {
                method: 'POST',
                body: JSON.stringify(userData),
            });
            return data; // Returns { success: boolean, email: string }
        } catch (error: any) {
            return rejectWithValue(error.detail || 'Registration failed');
        }
    }
);



// 3.1. Logout Thunk
export const logoutUser = createAsyncThunk(
    'auth/logoutUser',
    async (_, { dispatch, rejectWithValue }) => {
        try {
            await apiClient('/auth/logout', {
                method: 'POST',
                credentials: "include"
            });
            dispatch(logout());
        } catch (error: any) {
            // Clear local state even if server session is already gone
            dispatch(logout());
            return rejectWithValue(error.detail || 'Logout failed');
        }
    }
);


// 4. Слайс
const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        openModal: (state, action: PayloadAction<'signIn' | 'signUp'>) => {
            state.activeModal = action.payload;
            state.error = null;
        },
        closeModal: (state) => {
            state.activeModal = null;
            state.error = null;
        },
        logout: (state) => {
            state.user = null;
            state.token = null;
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        },
        setAccessToken: (state, action: PayloadAction<string>) => {
            state.token = action.payload;
            localStorage.setItem('token', action.payload);
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.token = action.payload.access_token;
                state.user = action.payload.user; // Берем юзера из ответа логина
                state.activeModal = null;

                localStorage.setItem('token', action.payload.access_token);
                localStorage.setItem('user', JSON.stringify(action.payload.user));
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(registerUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state) => {
                state.loading = false;
                // Success is handled in the UI (e.g., showing a message to check email)
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });

    },
});

export const { openModal, closeModal, logout, setAccessToken } = authSlice.actions;
export default authSlice.reducer;