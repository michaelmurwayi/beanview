import {createSlice} from '@reduxjs/toolkit';
import { globalInitialState } from '../../store/initialState';


export const navigationSlice = createSlice({
    name: 'navigation',
    initialState: globalInitialState.navigation,
    reducers: {
        setNavigationItems: (state, action) => {
            state.items = action.payload;
        }
    }
});     

export const { setNavigationItems } = navigationSlice.actions;
export default navigationSlice.reducer;