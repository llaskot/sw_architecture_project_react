
import { store } from '../app/store';
import { openModal, logout } from '../slices/authSlice';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export const apiClient = async (endpoint: string, options: RequestInit = {}) => {
    const url = `${BASE_URL}${endpoint}`;

    // Получаем состояние напрямую из стора для доступа к токену
    const state = store.getState();
    const token = state.auth.token;

    // Формируем заголовки
    const headers = new Headers(options.headers);
    headers.set('Content-Type', 'application/json');

    // Если токен есть — подставляем его во все запросы автоматически
    if (token) {
        headers.set('Authorization', `Bearer ${token}`);
    }

    const config = {
        ...options,
        headers,
    };

    try {
        const response = await fetch(url, config);

        // Проверка на 401 (Неавторизован) или 403 (Запрещено/Протух токен)
        if (response.status === 401 || response.status === 403) {
            // Если запрос требовал авторизации, но токен не подошел
            console.error('Auth error or token expired');

            // Пока что просто разлогиниваем и открываем модалку
            // (Позже сюда добавим логику Refresh Token)
            store.dispatch(logout());
            store.dispatch(openModal('signIn'));

            throw new Error('Unauthorized or Forbidden');
        }

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw errorData;
        }

        // Если контента нет (например, 204 No Content), не пытаемся парсить JSON
        if (response.status === 204) return null;

        return await response.json();
    } catch (error) {
        return Promise.reject(error);
    }
};