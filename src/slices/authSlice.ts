import type {PayloadAction} from '@reduxjs/toolkit'; // Исправлено: импорт типа
import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {authApi} from "../api/apiAuth.ts";

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
    activeModal: 'signIn' | 'signUp' | 'confirmRegistration' | 'forgotPassword'
        | 'confirmForgotPassword' | 'checkupAct' | null;
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
    async (credentials: any, {rejectWithValue}) => {
        try {
            const data: LoginResponse = await authApi.login(credentials)
            return data;
        } catch (error: any) {
            return rejectWithValue(error.detail || 'Login failed');
        }
    }
);

// 3.2. Register Thunk
export const registerUser = createAsyncThunk(
    'auth/registerUser',
    async (userData: any, {rejectWithValue}) => {
        try {
            return await authApi.register(userData); // Returns { success: boolean, email: string }
        } catch (error: any) {
            return rejectWithValue(error.detail || 'Registration failed');
        }
    }
);

// 3.3. Confirm Registration Thunk
export const confirmRegistration = createAsyncThunk(
    'auth/confirmRegistration',
    async (code: string, {rejectWithValue}) => {
        try {
            const data = await authApi.confirmRegistration(code);
            return data; // Возвращает LoginResponse { access_token, user }
        } catch (error: any) {
            return rejectWithValue(error.detail || 'Confirmation failed');
        }
    }
);

export const forgotPassword = createAsyncThunk(
    'auth/forgotPassword',
    async (email: string, {rejectWithValue}) => {
        try {
            return await authApi.forgotPassword(email);
        } catch (error: any) {
            return rejectWithValue(error.detail || 'Failed to send reset code');
        }
    }
);

export const confirmForgotPassword = createAsyncThunk(
    'auth/confirmForgotPassword',
    async (data: any, {rejectWithValue}) => {
        try {
            return await authApi.confirmForgotPassword(data);
        } catch (error: any) {
            return rejectWithValue(error.detail || 'Failed to reset password');
        }
    }
);

// 3.1. Logout Thunk
export const logoutUser = createAsyncThunk(
    'auth/logoutUser',
    async (_, {dispatch, rejectWithValue}) => {
        try {
            await authApi.logout()
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
        openModal: (state,
                    action: PayloadAction<'signIn' | 'signUp' | 'confirmRegistration'
                        | 'forgotPassword' | 'confirmForgotPassword' | 'checkupAct'>) => {
            if (action.payload === 'signUp') {
                const pending = localStorage.getItem('registration_pending');
                if (pending) {
                    const {expiry} = JSON.parse(pending);
                    if (Date.now() < expiry) {
                        state.activeModal = 'confirmRegistration';
                        state.error = null;
                        return;
                    } else {
                        localStorage.removeItem('registration_pending');
                    }
                }
            }
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
        },
        // редьюсер для ручного возврата к форме регистрации
        clearRegistrationPending: (state) => {
            localStorage.removeItem('registration_pending');
            state.activeModal = 'signUp';
            state.error = null;
        },
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
            .addCase(registerUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(registerUser.fulfilled, (state) => {
                state.loading = false;
                state.activeModal = 'confirmRegistration';
                // Устанавливаем маркер на 10 минут
                const expiry = Date.now() + 10 * 60 * 1000;
                localStorage.setItem('registration_pending', JSON.stringify({expiry}));
            })
            .addCase(confirmRegistration.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(confirmRegistration.fulfilled, (state, action) => {
                state.loading = false;
                state.token = action.payload.access_token;
                state.user = action.payload.user;
                state.activeModal = null;

                // Очищаем временный маркер и сохраняем данные входа
                localStorage.removeItem('registration_pending');
                localStorage.setItem('token', action.payload.access_token);
                localStorage.setItem('user', JSON.stringify(action.payload.user));
            })
            .addCase(confirmRegistration.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Forgot Password
            .addCase(forgotPassword.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(forgotPassword.fulfilled, (state) => {
                state.loading = false;
                state.activeModal = 'confirmForgotPassword'; // Переключаем на ввод кода и нового пароля
            })
            .addCase(forgotPassword.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // Confirm Forgot Password
            .addCase(confirmForgotPassword.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(confirmForgotPassword.fulfilled, (state) => {
                state.loading = false;
                state.activeModal = 'signIn'; // После успеха отправляем логиниться с новым паролем
            })
            .addCase(confirmForgotPassword.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

    },
});

export const {openModal, closeModal, logout, setAccessToken, clearRegistrationPending} = authSlice.actions;
export default authSlice.reducer;