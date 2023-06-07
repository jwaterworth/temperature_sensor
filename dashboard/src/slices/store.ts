import { DateRange } from './types';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import dateRangeReducer from './dateRangeSlice';

export interface RootState {
    selectedDateRange: DateRange | null;
}
// const rootReducer = combineReducers({
//     selectedDateRange: dateRangeReducer,
// });

// export const store = configureStore({
//     reducer: rootReducer,
// });


export const store = configureStore({
    reducer: dateRangeReducer,
});
