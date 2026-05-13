import {apiClient} from './apiClient';

export const authApi = {
    register: (userData: any) => apiClient('/auth/register', {
        method: 'POST',
        credentials: "include",
        body: JSON.stringify(userData),
    }),
    login: (credentials: any) => apiClient('/auth/login', {
        method: 'POST',
        credentials: "include",
        body: JSON.stringify(credentials),
    }),
    logout: () => apiClient('/auth/logout', {
        method: 'POST',
        credentials: "include"
    }),
    confirmRegistration: (code: string) => apiClient('/auth/register/confirm', {
        method: 'POST',
        credentials: "include",
        body: JSON.stringify({ conf_code: code }),
    })
}