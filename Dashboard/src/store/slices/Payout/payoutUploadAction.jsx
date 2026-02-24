// store/slices/Payout/payoutUploadAction.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../../../apiClient"; // Axios client with auth interceptor

export const uploadPayoutFile = createAsyncThunk(
  "payout/upload",
  async (file, { rejectWithValue }) => {
    try {
      if (!file) {
        return rejectWithValue("No file selected");
      }

      const formData = new FormData();
      formData.append("file", file);

      const response = await apiClient.post("catalogue/upload_payout/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Return server response
      return response.data;
    } catch (err) {
      console.error("Upload error:", err);
      return rejectWithValue(
        err.response?.data?.error || err.message || "Upload failed"
      );
    }
  }
);