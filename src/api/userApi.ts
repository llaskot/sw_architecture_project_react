import {apiClient} from './apiClient';


export interface GetUsersParams {
    search?: string | null;
    hide_inactive?: boolean | null;
    page?: number;
    limit?: number;
}

export interface UserResponseAdm {
    _id: string;
    email: string;
    login?: string | null;
    first_name?: string | null;
    last_name?: string | null;
    active?: boolean | null;
    is_admin?: boolean | null;
    is_manager?: boolean | null;
}

export interface AllUsersResponse {
    items: UserResponseAdm[];
    total: number;
    page: number;
    limit: number;
}

export const userApi = {
    getProfile: () => apiClient('/users/profile'),


    updateProfile: (userData: any) => apiClient('/users/profile', {
        method: 'PATCH',
        body: JSON.stringify(userData),
    }),
}


// Get all users for admin/manager filtering with pagination and search
export const getAllUsers = async (params: GetUsersParams = {}): Promise<AllUsersResponse> => {
    const queryParts: string[] = [];

    if (params.page) {
        queryParts.push(`page=${params.page}`);
    }
    if (params.limit) {
        queryParts.push(`limit=${params.limit}`);
    }
    if (params.search) {
        queryParts.push(`search=${encodeURIComponent(params.search)}`);
    }
    if (params.hide_inactive !== undefined && params.hide_inactive !== null) {
        queryParts.push(`hide_inactive=${params.hide_inactive}`);
    }

    const queryString = queryParts.length > 0 ? `?${queryParts.join('&')}` : '';
    return await apiClient(`/users/${queryString}`);
};


// Добавь эти методы в объект userApi или экспортируй отдельно
export const getUserById = async (id: string): Promise<UserResponseAdm> => {
    return await apiClient(`/users/${id}`);
};

export const updateUser = async (id: string, userData: Partial<UserResponseAdm>): Promise<UserResponseAdm> => {
    return await apiClient(`/users/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(userData),
    });
};