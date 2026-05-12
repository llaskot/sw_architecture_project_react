import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getCategories, getBrands, type Brand } from '../api/carsApi';

interface CarsState {
    categories: string[];
    brands: Brand[];
    loadingCategories: boolean;
    loadingBrands: boolean;
    categoriesLoaded: boolean; // Flag to prevent re-fetching empty data
    brandsLoaded: boolean;     // Flag to prevent re-fetching empty data
    error: string | null;
}

const initialState: CarsState = {
    categories: [],
    brands: [],
    loadingCategories: false,
    loadingBrands: false,
    categoriesLoaded: false,
    brandsLoaded: false,
    error: null,
};

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
            // Categories
            .addCase(fetchCategoriesThunk.pending, (state) => {
                state.loadingCategories = true;
            })
            .addCase(fetchCategoriesThunk.fulfilled, (state, action) => {
                state.loadingCategories = false;
                state.categories = action.payload;
                state.categoriesLoaded = true; // Mark as successfully fetched
            })
            .addCase(fetchCategoriesThunk.rejected, (state, action) => {
                state.loadingCategories = false;
                state.error = action.payload as string;
                state.categoriesLoaded = true; // Even on error, we stop trying
            })
            // Brands
            .addCase(fetchBrandsThunk.pending, (state) => {
                state.loadingBrands = true;
            })
            .addCase(fetchBrandsThunk.fulfilled, (state, action) => {
                state.loadingBrands = false;
                state.brands = action.payload;
                state.brandsLoaded = true; // Mark as successfully fetched
            })
            .addCase(fetchBrandsThunk.rejected, (state, action) => {
                state.loadingBrands = false;
                state.error = action.payload as string;
                state.brandsLoaded = true; // Stop infinite retries
            });
    },
});

export default carsSlice.reducer;