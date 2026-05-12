import { apiClient } from './apiClient';

// --- ИНТЕРФЕЙСЫ (на основе openapi.json) ---

export interface Brand {
    _id?: string | null;
    name: string;
}

export interface AutoModelRead {
    _id?: string | null;
    name: string;
    brand?: Brand | null;
}

export interface Car {
    _id: string | null;
    year: number;
    color: string;
    price_per_day: number;
    model?: AutoModelRead | null;
}

export interface AllCarsResponse {
    total: number;
    page: number;
    limit: number;
    items: Car[];
}

// --- ФУНКЦИИ ЗАПРОСОВ ---

/**
 * Получение списка категорий
 * GET /models/categories
 */
export const getCategories = async (): Promise<string[]> => {
    return await apiClient('/models/categories');
};

/**
 * Получение списка машин с фильтрацией и пагинацией
 * GET /cars/
 */
export const getCars = async (params: URLSearchParams): Promise<AllCarsResponse> => {
    return await apiClient(`/cars/?${params.toString()}`);
};