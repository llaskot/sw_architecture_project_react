import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getCategories, getBrands, type Brand } from '../api/carsApi';

interface CarsState {
    categories: string[];
    brands: Brand[]; // Список брендов
    loadingCategories: boolean;
    loadingBrands: boolean; // Отдельный лоадер для брендов
    error: string | null;
}

const initialState: CarsState = {
    categories: [],
    brands: [],
    loadingCategories: false,
    loadingBrands: false,
    error: null,
};

// Thunk для категорий (уже был)
export const fetchCategoriesThunk = createAsyncThunk(
    'cars/fetchCategories',
    async (_, { rejectWithValue }) => {
        try {
            return await getCategories();
        } catch (error: any) {
            return rejectWithValue(error.detail || 'Failed to load categories');
        }
    }
);

// НОВОЕ: Thunk для загрузки брендов
export const fetchBrandsThunk = createAsyncThunk(
    'cars/fetchBrands',
    async (_, { rejectWithValue }) => {
        try {
            return await getBrands();
        } catch (error: any) {
            return rejectWithValue(error.detail || 'Failed to load brands');
        }
    }
);

const carsSlice = createSlice({
    name: 'cars',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Категории
            .addCase(fetchCategoriesThunk.pending, (state) => {
                state.loadingCategories = true;
            })
            .addCase(fetchCategoriesThunk.fulfilled, (state, action) => {
                state.loadingCategories = false;
                state.categories = action.payload;
            })
            // Бренды
            .addCase(fetchBrandsThunk.pending, (state) => {
                state.loadingBrands = true;
            })
            .addCase(fetchBrandsThunk.fulfilled, (state, action) => {
                state.loadingBrands = false;
                state.brands = action.payload;
            })
            .addCase(fetchBrandsThunk.rejected, (state, action) => {
                state.loadingBrands = false;
                state.error = action.payload as string;
            });
    },
});

export default carsSlice.reducer;