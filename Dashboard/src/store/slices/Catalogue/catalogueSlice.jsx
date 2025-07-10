// store/slices/catalogue/catalogueSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { generateCatalogueFile } from './catalogueActions';

const initialState = {
  fileData: null,
  loading: false,
  error: null,
};

const catalogueSlice = createSlice({
  name: 'catalogue',
  initialState,
  reducers: {
    clearCatalogueState: (state) => {
      state.fileData = null;
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
      .addCase(generateCatalogueFile.fulfilled, (state, action) => {
        state.loading = false;
        state.fileData = action.payload;
      })
      .addCase(generateCatalogueFile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCatalogueState } = catalogueSlice.actions;
export default catalogueSlice.reducer;
