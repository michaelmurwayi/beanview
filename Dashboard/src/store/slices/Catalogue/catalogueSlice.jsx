// store/slices/catalogue/catalogueSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { generateCatalogueFile } from './catalogueActions';

const initialState = {
  loading: false,
  error: null,
};

const catalogueSlice = createSlice({
  name: 'catalogue',
  initialState,
  reducers: {
    clearCatalogueState: (state) => {
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(generateCatalogueFile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(generateCatalogueFile.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
        // No need to store blob or headers
      })
      .addCase(generateCatalogueFile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCatalogueState } = catalogueSlice.actions;
export default catalogueSlice.reducer;
