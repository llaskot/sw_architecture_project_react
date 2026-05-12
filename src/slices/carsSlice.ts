import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getCategories } from '../api/carsApi';

interface CarsState {
    categories: string[];
    loadingCategories: boolean;
    error: string | null;
}

const initialState: CarsState = {
    categories: [],
    loadingCategories: false,
    error: null,
};

// Thunk для загрузки категорий
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

const carsSlice = createSlice({
    name: 'cars',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCategoriesThunk.pending, (state) => {
                state.loadingCategories = true;
            })
            .addCase(fetchCategoriesThunk.fulfilled, (state, action) => {
                state.loadingCategories = false;
                state.categories = action.payload;
            })
            .addCase(fetchCategoriesThunk.rejected, (state, action) => {
                state.loadingCategories = false;
                state.error = action.payload as string;
            });
    },
});

export default carsSlice.reducer;