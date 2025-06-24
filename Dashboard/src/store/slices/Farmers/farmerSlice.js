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
      state.success = false;
      
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
    updateFarmerRequest: (state) => {
      state.loading = true;
      state.error = null;
      state.success = false;
    },
    updateFarmerSuccess: (state, action) => {
      state.loading = false;
      state.success = true;
      state.farmers = state.farmers.map((farmer) =>
        farmer.id === action.payload.id ? action.payload : farmer
      );
    },
    updateFarmerFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.success = false;
    },

});

export const {
  updateFarmerFormField,
  resetFarmerForm,
  postFarmerRequest,
  postFarmerSuccess,
  postFarmerFailure,
  fetchFarmersRequest,
  fetchFarmersSuccess,
  fetchFarmersFailure,
  clearFormStatus,
  updateFarmerRequest,
  updateFarmerSuccess,
  updateFarmerFailure,
} = farmerSlice.actions;

export default farmerSlice.reducer;
