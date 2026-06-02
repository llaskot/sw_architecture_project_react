// import { store } from '../app/store';
// import { logoutUser, openModal, setAccessToken} from '../slices/authSlice';
//
// const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';
//
// let isRefreshing = false;
// let refreshSubscribers: ((token: string) => void)[] = [];
//
// const subscribeTokenRefresh = (cb: (token: string) => void) => {
//     refreshSubscribers.push(cb);
// };
//
// const onTokenRefreshed = (token: string) => {
//     refreshSubscribers.forEach((cb) => cb(token));
//     refreshSubscribers = [];
// };
//
// export const apiClient = async (endpoint: string, options: RequestInit = {}): Promise<any> => {
//     const url = `${BASE_URL}${endpoint}`;
//
//     // Игнорируем рефреш для эндпоинтов авторизации
//     const isAuthRequest = endpoint.includes('/auth/login') || endpoint.includes('/auth/register');
//
//     let token = store.getState().auth.token;
//
//     const headers = new Headers(options.headers);
//     headers.set('Content-Type', 'application/json');
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
//         // Если 401/403 и это НЕ запрос на логин — пробуем рефреш
//         if ((response.status === 401 || response.status === 403) && !isAuthRequest) {
//
//             if (isRefreshing) {
//                 return new Promise((resolve) => {
//                     subscribeTokenRefresh((newToken) => {
//                         headers.set('Authorization', `Bearer ${newToken}`);
//                         resolve(fetch(url, { ...options, headers }).then(res => res.json()));
//                     });
//                 });
//             }
//
//             isRefreshing = true;
//
//             try {
//                 const refreshResponse = await fetch(`${BASE_URL}/auth/refresh`, {
//                     method: 'GET',
//                     credentials: 'include',
//                 });
//
//                 if (refreshResponse.ok) {
//                     const data = await refreshResponse.json();
//                     const newToken = data.access_token;
//
//                     store.dispatch(setAccessToken(newToken));
//                     isRefreshing = false;
//                     onTokenRefreshed(newToken);
//
//                     headers.set('Authorization', `Bearer ${newToken}`);
//                     const retryResponse = await fetch(url, { ...options, headers });
//                     return await retryResponse.json();
//                 } else {
//                     throw new Error('Refresh failed');
//                 }
//             } catch (refreshError) {
//                 isRefreshing = false;
//                 refreshSubscribers = [];
//                 store.dispatch(logoutUser());
//                 store.dispatch(openModal('signIn'));
//                 return Promise.reject(refreshError);
//             }
//         }
//
//         // Если это была ошибка, но не попадающая под рефреш
//         if (!response.ok) {
//             const errorData = await response.json().catch(() => ({}));
//             return Promise.reject(errorData); // Важно возвращать Reject для Thunk
//         }
//
//         if (response.status === 204) return null;
//         return await response.json();
//
//     } catch (error) {
//         return Promise.reject(error);
//     }
// };
//


import { store } from '../app/store';
import { logoutUser, openModal, setAccessToken } from '../slices/authSlice';

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

    const isAuthRequest = endpoint.includes('/auth/login') || endpoint.includes('/auth/register');

    let token = store.getState().auth.token;

    const headers = new Headers(options.headers);

    if (!(options.body instanceof FormData)) {
        if (!headers.has('Content-Type')) {
            headers.set('Content-Type', 'application/json');
        }
    }

    if (token) {
        headers.set('Authorization', `Bearer ${token}`);
    }

    const config = {
        ...options,
        headers,
    };

    try {
        const response = await fetch(url, config);

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
                store.dispatch(logoutUser());
                store.dispatch(openModal('signIn'));
                return Promise.reject(refreshError);
            }
        }

        // if (!response.ok) {
        //     const errorData = await response.json().catch(() => ({}));
        //     return Promise.reject(errorData);
        // }

        if (!response.ok) {
            let errorData = await response.json().catch(() => ({}));
            if (typeof errorData !== 'object' || errorData === null) {
                errorData = { message: errorData };
            }
            errorData.code = response.status;
            return Promise.reject(errorData);
        }

        if (response.status === 204) return null;
        return await response.json();

    } catch (error) {
        return Promise.reject(error);
    }
};