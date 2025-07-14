// store/slices/catalogue/catalogueSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { generateCatalogueFile } from './catalogueActions';
import { generateAuctionFile } from './catalogueActions';

const initialState = {
  loading: false,
  error: null,
  files: [], // Array to hold generated auction files
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
      })
      .addCase(generateAuctionFile.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.files = [];
      })
      .addCase(generateAuctionFile.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.files = action.payload; // Expecting: [{ mark, fileBlob, filename }]
      })
      .addCase(generateAuctionFile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to generate auction file';
      });

  },
});

export const { clearCatalogueState } = catalogueSlice.actions;
export default catalogueSlice.reducer;
