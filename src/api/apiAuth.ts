
const BASE_URL = import.meta.env.VITE_API_URL
const authFetch = async (endpoint: string, options: RequestInit = {}) => {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
    });

    if (!response.ok) {
        throw await response.json().catch(() => ({})); // Пробрасываем ошибку для catch в thunk
    }

    return response.status === 204 ? null : await response.json();
};





export const authApi = {
    register: (userData: any) => authFetch('/auth/register', {
        method: 'POST',
        credentials: "include",
        body: JSON.stringify(userData),
    }),
    login: (credentials: any) => authFetch('/auth/login', {
        method: 'POST',
        credentials: "include",
        body: JSON.stringify(credentials),
    }),
    logout: () => authFetch('/auth/logout', {
        method: 'POST',
        credentials: "include"
    }),
    confirmRegistration: (code: string) => authFetch('/auth/register/confirm', {
        method: 'POST',
        credentials: "include",
        body: JSON.stringify({ conf_code: code }),
    }),
    forgotPassword: (email: string) => authFetch('/auth/restore', {
        method: 'POST',
        credentials: "include",
        body: JSON.stringify({ login: email }),
    }),
    confirmForgotPassword: (data: any) => authFetch('/auth/restore/confirm', {
        method: 'POST',
        credentials: "include",
        body: JSON.stringify({
            conf_code: data.code,
            new_password: data.password
        }),
    })
}