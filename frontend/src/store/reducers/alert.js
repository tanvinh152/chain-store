// types
import { createSlice } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
// initial state
const initialState = {};

// ==============================|| SLICE - MENU ||============================== //

const alertSlice = createSlice({
    name: 'alert',
    initialState,
    reducers: {
        alert(state, action) {
            if (action.payload.success) {
                toast.success(action.payload.success);
            }
            if (action.payload.error) {
                toast.error(action.payload.error);
            }
            return { ...action.payload };
        }
    }
});

export default alertSlice.reducer;

export const { alert } = alertSlice.actions;
