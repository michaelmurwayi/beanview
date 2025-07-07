import { createSlice } from '@reduxjs/toolkit';
import { globalInitialState } from '../../initialState';
import { generateSummaryFile } from './coffeeActions'; // ✅ NEW

const coffeeSlice = createSlice({
  name: 'coffee',
  initialState: globalInitialState.coffee,
  reducers: {
    updateCoffeeFormField: (state, action) => {
      const { field, value } = action.payload;
      state.CoffeeUploadFormData[field] = value;
    },
    resetCoffeeForm: (state) => {
      state.CoffeeUploadFormData = {};
    },

    postCoffeeRequest: (state) => {
      state.loading = true;
      state.error = null;
      state.success = false;
    },
    postCoffeeSuccess: (state, action) => {
      state.loading = false;
      state.success = true;
      state.coffeeRecords.push(action.payload);
    },
    postCoffeeFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.success = false;
    },

    fetchCoffeeRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchCoffeeSuccess: (state, action) => {
      state.loading = false;
      state.coffeeRecords = action.payload;
      state.error = null;
    },
    fetchCoffeeFailure: (state, action) => {
      state.loading = false;
      state.coffeeRecords = [];
      state.error = action.payload;
    },

    updateCoffeeRequest: (state) => {
      state.loading = true;
      state.error = null;
      state.success = false;
    },
    updateCoffeeSuccess: (state, action) => {
      state.loading = false;
      state.success = true;
      state.coffeeRecords = state.coffeeRecords.map((record) =>
        record.id === action.payload.id ? action.payload : record
      );
    },
    updateCoffeeFailure: (state, action) => {
      state.loading = false;
      state.success = false;
      state.error = action.payload;
    },

    deleteCoffeeSuccess: (state, action) => {
      state.coffeeRecords = state.coffeeRecords.filter(
        (record) => record.id !== action.payload
      );
    },

    clearCoffeeFormStatus: (state) => {
      state.error = null;
      state.success = false;
    },

    
  },

  extraReducers: (builder) => {
    builder
      .addCase(generateSummaryFile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(generateSummaryFile.fulfilled, (state, action) => {
        state.loading = false;
        state.generatedFiles = action.payload;
      })
      .addCase(generateSummaryFile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  updateCoffeeFormField,
  resetCoffeeForm,
  postCoffeeRequest,
  postCoffeeSuccess,
  postCoffeeFailure,
  fetchCoffeeRequest,
  fetchCoffeeSuccess,
  fetchCoffeeFailure,
  updateCoffeeRequest,
  updateCoffeeSuccess,
  updateCoffeeFailure,
  deleteCoffeeSuccess,
  clearCoffeeFormStatus,
 // frontend Excel writer
} = coffeeSlice.actions;

export default coffeeSlice.reducer;
