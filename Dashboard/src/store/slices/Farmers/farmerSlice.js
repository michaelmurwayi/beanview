import { createSlice } from '@reduxjs/toolkit';
import { globalInitialState } from '../../initialState';

const farmerSlice = createSlice({
  name: 'farmers',
  initialState: globalInitialState,
  reducers: {
    updateFarmerFormField: (state, action) => {
      const { field, value } = action.payload;
      state.FarmerUploadFormData[field] = value;
    },
    resetFarmerForm: (state) => {
      state.FarmerUploadFormData = { ...globalInitialState.FarmerUploadFormData };
    },
    postFarmerRequest: (state) => {
      state.loading = true;
      state.error = null;
      state.success = false;
    },
    postFarmerSuccess: (state, action) => {
      state.loading = false;
      state.success = true;
      state.farmers = [...state.farmers, action.payload];
    },
    postFarmerFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.success = false;
    },
    fetchFarmersRequest: (state) => {
      state.loading = true;
      state.error = null;
      state.farmers = [...state.farmers, action.payload]; // Keep existing farmers while fetching new ones
    },
    fetchFarmersSuccess: (state, action) => {
      state.farmers = action.payload;
      state.loading = false;
      state.error = null;
    },
    fetchFarmersFailure: (state, action) => {
      state.farmers = [];
      state.loading = false;
      state.error = action.payload;
    },
    clearFormStatus: (state) => {
      state.error = null;
      state.success = false;
    },
  },
});

export const {
  updateFarmerFormField,
  resetFarmerForm,
  postFarmerRequest,
  postFarmerSuccess,
  postFarmerFailure,
  fetchFarmersSuccess,
  fetchFarmersFailure,
  clearFormStatus,
} = farmerSlice.actions;

export default farmerSlice.reducer;
