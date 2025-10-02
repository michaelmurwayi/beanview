// src/store/coffeeThunks.js
import {
  postCoffeeRequest,
  postCoffeeSuccess,
  postCoffeeFailure,
  fetchCoffeeRequest,
  fetchCoffeeSuccess,
  fetchCoffeeFailure,
} from "./coffeeSlice";

import { createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../../../apiClient";

// ✅ Submit new coffee record
export const submitCoffee = () => async (dispatch, getState) => {
  dispatch(postCoffeeRequest());
  const { CoffeeUploadFormData } = getState().coffee;
  const formData = { ...CoffeeUploadFormData };

  if (formData.mark) {
    formData.mark = formData.mark.trim().toUpperCase();
  }

  try {
    const response = await apiClient.post("/coffee/", formData);
    dispatch(postCoffeeSuccess(response.data));
  } catch (error) {
    dispatch(postCoffeeFailure(error.response?.data || error.message));
  }
};

// ✅ Fetch coffee
export const fetchCoffee = () => async (dispatch) => {
  dispatch(fetchCoffeeRequest());
  try {
    console.log('Fetched coffee data:');
    const response = await apiClient.get("/coffee/");
    dispatch(fetchCoffeeSuccess(response.data));
  } catch (error) {
    dispatch(fetchCoffeeFailure(error.response?.data || error.message));
  }
};

// ✅ Delete coffee
export const deleteCoffee = createAsyncThunk(
  "coffee/deleteCoffee",
  async (id, { rejectWithValue }) => {
    try {
      await apiClient.delete(`/coffee/${id}/`);
      const response = await apiClient.get("/coffee/");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// ✅ Update coffee
export const updateCoffee = createAsyncThunk(
  "coffee/update",
  async (record, { rejectWithValue }) => {
    try {
      const { id, ...payload } = record;
      const response = await apiClient.put(`/coffee/${id}/`, payload);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// ✅ Import coffee file
export const importCoffeeFile = createAsyncThunk(
  "coffee/importFile",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await apiClient.post("/coffee/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// ✅ Generate summary file
export const generateSummaryFile = createAsyncThunk(
  "coffee/generateSummaryFile",
  async (summaries, { rejectWithValue }) => {
    try {
      const response = await apiClient.post(
        "/coffee/generate_summary_file/",
        { summaries },
        { responseType: "blob" }
      );

      // Extract filename
      const contentDisposition = response.headers["content-disposition"];
      let filename = "summary_files.zip";
      if (contentDisposition?.includes("filename=")) {
        filename = contentDisposition.split("filename=")[1].replace(/["']/g, "").trim();
      }

      // Trigger file download
      const blob = new Blob([response.data], { type: response.headers["content-type"] });
      const urlBlob = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = urlBlob;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(urlBlob);

      return true;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
