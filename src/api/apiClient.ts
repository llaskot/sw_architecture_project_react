//
// import { store } from '../app/store';
// import { openModal, logout } from '../slices/authSlice';
//
// const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';
//
// export const apiClient = async (endpoint: string, options: RequestInit = {}) => {
//     const url = `${BASE_URL}${endpoint}`;
//
//     // Получаем состояние напрямую из стора для доступа к токену
//     const state = store.getState();
//     const token = state.auth.token;
//
//     // Формируем заголовки
//     const headers = new Headers(options.headers);
//     headers.set('Content-Type', 'application/json');
//
//     // Если токен есть — подставляем его во все запросы автоматически
//     if (token) {
//         headers.set('Authorization', `Bearer ${token}`);
//     }
//
//     const config = {
//         ...options,
//         headers,
//     };
//
//     try {
//         const response = await fetch(url, config);
//
//         // Проверка на 401 (Неавторизован) или 403 (Запрещено/Протух токен)
//         if (response.status === 401 || response.status === 403) {
//             // Если запрос требовал авторизации, но токен не подошел
//             console.error('Auth error or token expired');
//
//             // Пока что просто разлогиниваем и открываем модалку
//             // (Позже сюда добавим логику Refresh Token)
//             store.dispatch(logout());
//             store.dispatch(openModal('signIn'));
//
//             throw new Error('Unauthorized or Forbidden');
//         }
//
//         if (!response.ok) {
//             const errorData = await response.json().catch(() => ({}));
//             throw errorData;
//         }
//
//         // Если контента нет (например, 204 No Content), не пытаемся парсить JSON
//         if (response.status === 204) return null;
//
//         return await response.json();
//     } catch (error) {
//         return Promise.reject(error);
//     }
// };


import { store } from '../app/store';
import { logout, setAccessToken } from '../slices/authSlice';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

const subscribeTokenRefresh = (cb: (token: string) => void) => {
    refreshSubscribers.push(cb);
};

const onTokenRefreshed = (token: string) => {
    refreshSubscribers.forEach((cb) => cb(token));
    refreshSubscribers = [];
};

export const apiClient = async (endpoint: string, options: RequestInit = {}): Promise<any> => {
    const url = `${BASE_URL}${endpoint}`;

    // Игнорируем рефреш для эндпоинтов авторизации
    const isAuthRequest = endpoint.includes('/auth/login') || endpoint.includes('/auth/register');

    let token = store.getState().auth.token;

    const headers = new Headers(options.headers);
    headers.set('Content-Type', 'application/json');
    if (token) {
        headers.set('Authorization', `Bearer ${token}`);
    }

    const config = {
        ...options,
        headers,
    };

    try {
        const response = await fetch(url, config);

        // Если 401/403 и это НЕ запрос на логин — пробуем рефреш
        if ((response.status === 401 || response.status === 403) && !isAuthRequest) {

            if (isRefreshing) {
                return new Promise((resolve) => {
                    subscribeTokenRefresh((newToken) => {
                        headers.set('Authorization', `Bearer ${newToken}`);
                        resolve(fetch(url, { ...options, headers }).then(res => res.json()));
                    });
                });
            }

            isRefreshing = true;

            try {
                const refreshResponse = await fetch(`${BASE_URL}/auth/refresh`, {
                    method: 'GET',
                    credentials: 'include',
                });

                if (refreshResponse.ok) {
                    const data = await refreshResponse.json();
                    const newToken = data.access_token;

                    store.dispatch(setAccessToken(newToken));
                    isRefreshing = false;
                    onTokenRefreshed(newToken);

                    headers.set('Authorization', `Bearer ${newToken}`);
                    const retryResponse = await fetch(url, { ...options, headers });
                    return await retryResponse.json();
                } else {
                    throw new Error('Refresh failed');
                }
            } catch (refreshError) {
                isRefreshing = false;
                refreshSubscribers = [];
                store.dispatch(logout());
                return Promise.reject(refreshError);
            }
        }

        // Если это была ошибка, но не попадающая под рефреш
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            return Promise.reject(errorData); // Важно возвращать Reject для Thunk
        }

        if (response.status === 204) return null;
        return await response.json();

    } catch (error) {
        return Promise.reject(error);
    }
};

