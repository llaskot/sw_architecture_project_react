import { store } from '../app/store';
import { openModal } from '../slices/authSlice';

// 1. Берем базовый адрес ОДИН РАЗ здесь
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export const apiClient = async (endpoint: string, options: RequestInit = {}) => {
    // 2. Склеиваем адрес (например: http://localhost:8080 + /auth/login)
    const url = `${BASE_URL}${endpoint}`;

    const state = store.getState();
    const token = state.auth.token;

    const headers = new Headers(options.headers);
    headers.set('Content-Type', 'application/json');
    headers.set('Accept', 'application/json');

    if (token) {
        headers.set('Authorization', `Bearer ${token}`);
    }

    try {
        const response = await fetch(url, { ...options, headers });

        // 3. Тот самый задел на 403 (Refresh Token)
        if (response.status === 403) {
            // Пока просто выкидываем на логин, если токен протух
            store.dispatch(openModal('signIn'));
            throw new Error('Forbidden');
        }

        if (!response.ok) {
            // Если бекенд вернул 401 и текст ошибки, пробрасываем его дальше
            const errorData = await response.json().catch(() => ({}));
            throw errorData;
        }

        return await response.json();
    } catch (error) {
        return Promise.reject(error);
    }
};