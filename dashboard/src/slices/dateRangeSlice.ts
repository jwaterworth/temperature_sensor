import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DateRange } from './types';

interface InitialState {
    dateRange: DateRange | null;
}

const initialState: InitialState = { dateRange: { startDate: null, endDate: null } };

const dateRangeSlice = createSlice({
    name: 'setDateRange',
    initialState,
    reducers: {
        setSelectedDateRange(state, action: PayloadAction<InitialState | null>) {
            state.dateRange = action.payload?.dateRange || null;
        },
    },
});

export const { setSelectedDateRange } = dateRangeSlice.actions;

export const selectDateRange = (state: InitialState) => state.dateRange;

export default dateRangeSlice.reducer;