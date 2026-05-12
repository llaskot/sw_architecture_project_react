import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../slices/authSlice';
import carsReducer from '../slices/carsSlice'; // <-- Импорт

export const store = configureStore({
    reducer: {
        auth: authReducer,
        cars: carsReducer, // <-- Регистрация
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;