import {apiClient} from './apiClient';

export const userApi = {
    getProfile: () => apiClient('/users/profile'),


    updateProfile: (userData: any) => apiClient('/users/profile', {
        method: 'PATCH',
        body: JSON.stringify(userData),
    }),
}
