import { createSlice } from '@reduxjs/toolkit';
import { globalInitialState } from '../../store/initialState';

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
} = farmerSlice.actions;

export default farmerSlice.reducer;
