import { apiClient } from './apiClient';

/**
 * Interface for creating and updating models
 */
export interface AutoModelCreate {
    brand_id: string;
    name: string;
    description: string;
    category: string;
    active?: boolean;
}

/**
 * Basic brand information from the server
 */
export interface Brand {
    _id?: string | null;
    name: string;
    country: string;
    description: string;
    active: boolean;
}

export interface BrandCreate {
    name: string;
    country: string;
    description: string;
}

export interface BrandUpdate {
    name?: string | null;
    country?: string | null;
    description?: string | null;
    active?: boolean;
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

export const getModels = async (): Promise<AutoModelRead[]> => {
    return await apiClient('/models/');
};

export const createCar = async (carData: Partial<Car>): Promise<Car> => {
    return await apiClient('/cars/', {
        method: 'POST',
        body: JSON.stringify(carData)
    });
};

export const updateCar = async (carId: string, carData: Partial<Car>): Promise<Car> => {
    return await apiClient(`/cars/${carId}`, {
        method: 'PATCH', // Используем PATCH (или PUT, если бэкенд требует его)
        body: JSON.stringify(carData)
    });
};

export const getCar = async (carId: string): Promise<Car> => {
    return await apiClient(`/cars/adm/${carId}`);
};

export const deleteCar = async (carId: string): Promise<void> => {
    return await apiClient(`/cars/${carId}`, {
        method: 'DELETE'
    });
};

export const uploadCarImage = async (carId: string, file: File): Promise<any> => {
    const formData = new FormData();
    formData.append('file', file);

    return await apiClient(`/files/${carId}`, {
        method: 'POST',
        body: formData
    });
};


// --- Models API ---

export const getModelsAdm = async (hideInactive: boolean = true): Promise<AutoModelRead[]> => {
    const params = new URLSearchParams({
        hide_inactive: hideInactive.toString()
    });
    return await apiClient(`/models/admin?${params.toString()}`);
};

export const createModel = async (modelData: AutoModelCreate): Promise<AutoModelRead> => {
    return await apiClient('/models/', {
        method: 'POST',
        body: JSON.stringify(modelData)
    });
};

export const updateModel = async (modelId: string, modelData: Partial<AutoModelCreate>): Promise<AutoModelRead> => {
    return await apiClient(`/models/${modelId}`, {
        method: 'PATCH',
        body: JSON.stringify(modelData)
    });
};

export const deleteModel = async (modelId: string): Promise<void> => {
    return await apiClient(`/models/${modelId}`, {
        method: 'DELETE'
    });
};



export const getModelByIdAdm = async (id: string): Promise<AutoModelRead> => {
    return await apiClient(`/models/admin/${id}`);
};

export const getBrandsAdm = async (hideInactive: boolean = true): Promise<Brand[]> => {
    const params = new URLSearchParams({
        hide_inactive: hideInactive.toString()
    });
    return await apiClient(`/brand/admin/?${params.toString()}`);
};

export const getBrandByIdAdm = async (id: string): Promise<Brand> => {
    return await apiClient(`/brand/admin/${id}`);
};

export const createBrand = async (brandData: BrandCreate): Promise<Brand> => {
    return await apiClient('/brand/', {
        method: 'POST',
        body: JSON.stringify(brandData)
    });
};

export const updateBrand = async (brandId: string, brandData: Partial<BrandCreate>): Promise<Brand> => {
    return await apiClient(`/brand/${brandId}`, {
        method: 'PATCH',
        body: JSON.stringify(brandData)
    });
};

export const deleteBrand = async (brandId: string): Promise<void> => {
    return await apiClient(`/brand/${brandId}`, {
        method: 'DELETE'
    });
};
