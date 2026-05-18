import { apiClient } from './apiClient';

/**
 * Basic brand information from the server
 */
export interface Brand {
    _id: string;
    name: string;
    country: string;
    description: string;
    active: boolean;
}

/**
 * Model details linked to a brand
 */
export interface AutoModelRead {
    _id: string;
    brand_id: string;
    name: string;
    description: string;
    category: string;
    active: boolean;
    brand?: Brand | null;
}

/**
 * Main car object
 */
export interface Car {
    _id: string;
    model_id: string;
    vin: string;
    plate_number: string;
    year: number;
    color: string;
    mileage: number;
    price_per_day: number;
    available: boolean;
    in_use: boolean;
    active: boolean;
    img?: {
        small: string;
        large: string;
    } | null;
    model?: AutoModelRead | null;
}

export interface AllCarsResponse {
    total: number;
    page: number;
    limit: number;
    items: Car[];
}

// Fetching reference data
export const getCategories = async (): Promise<string[]> => {
    return await apiClient('/models/categories');
};

export const getBrands = async (): Promise<Brand[]> => {
    return await apiClient('/brand/');
};

// Main listing fetch
export const getCars = async (params: URLSearchParams): Promise<AllCarsResponse> => {
    return await apiClient(`/cars/?${params.toString()}`);
};

export const getCarById = async (carId: string): Promise<Car> => {
    return await apiClient(`/cars/${carId}`);
};