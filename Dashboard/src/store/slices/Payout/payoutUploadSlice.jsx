import { createSlice } from "@reduxjs/toolkit";
import { uploadPayoutFile } from "./payoutUploadAction";

const initialState = {
  loading: false,
  success: false,
  error: null,
  message: null,
};

const payoutUploadSlice = createSlice({
  name: "payoutUpload",
  initialState,
  reducers: {
    resetUploadState: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(uploadPayoutFile.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(uploadPayoutFile.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload.message;
      })
      .addCase(uploadPayoutFile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetUploadState } = payoutUploadSlice.actions;

export default payoutUploadSlice.reducer;