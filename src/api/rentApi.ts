import {apiClient} from './apiClient';
import { type Car } from './carsApi';

// Схема запроса на создание аренды (из RentRequest в OpenAPI)
export interface RentRequest {
    car_id: string;      // Обязательное поле
    user_dock: string;   // Обязательное поле
    start_date: string;  // Обязательное поле (формат date-time ISO)
    driver?: boolean;    // Необязательное, по умолчанию false
    days_qty?: number;   // Необязательное, по умолчанию 1
}

// Схема запроса на частичное обновление (из RentUpdateRequest в OpenAPI)
export interface RentUpdateRequest {
    car_id?: string | null;
    user_dock?: string | null;
    start_date?: string | null;
    driver?: boolean | null;
    days_qty?: number | null;
}

export interface RentClient {
    _id: string;
    email: string;
    first_name: string | null;
    last_name: string | null;
    active: boolean;
}

// Схема ответа сервера (из RentRead в OpenAPI)
export interface RentRead {
    _id: string | null;
    car_id: string;
    client_id: string;
    driver: boolean;
    created_at: string;
    updated_at: string;
    updated_by: string | null;
    stage: 'ordered' | 'declined' | 'approved' | 'rented' | 'returned' | 'closed'; // RentStage из OpenAPI
    comment: string | null;
    start_date: string;
    end_date: string;
    days_qty: number;
    user_dock: string;
    total_price: number;
    active: boolean;
    car?: Car | null;
    client?: RentClient | null;
}

// 1. Создание новой аренды (POST /rent/)
export const createRent = async (data: RentRequest): Promise<RentRead> => {
    return await apiClient('/rent/', {
        method: 'POST',
        body: JSON.stringify(data),
    });
};

// 2. Получение информации об одной аренде по её ID (GET /rent/{rent_id})
export const getRentById = async (rentId: string): Promise<RentRead> => {
    return await apiClient(`/rent/${rentId}`);
};

// 3. Обновление параметров аренды (PATCH /rent/{rent_id})
export const updateRent = async (rentId: string, data: RentUpdateRequest): Promise<RentRead> => {
    return await apiClient(`/rent/${rentId}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
    });
};