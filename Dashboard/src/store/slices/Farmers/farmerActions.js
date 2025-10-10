// redux/actions/farmerActions.js
import {
  postFarmerRequest,
  postFarmerSuccess,
  postFarmerFailure,
  fetchFarmersRequest,
  fetchFarmersSuccess,
  fetchFarmersFailure,
  updateFarmerRequest,
  updateFarmerSuccess,
  updateFarmerFailure,
} from "./farmerSlice";

import { createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../../../apiClient"; // 👈 import your shared axios instance

// -------------------------------------------
// POST new farmer
// -------------------------------------------
export const submitFarmer = () => async (dispatch, getState) => {
  dispatch(postFarmerRequest());
  const { FarmerUploadFormData } = getState().farmer;

  try {
    const response = await apiClient.post("/farmers/", FarmerUploadFormData);
    dispatch(postFarmerSuccess(response.data));
  } catch (error) {
    const errorMsg =
      error.response?.data?.detail ||
      error.response?.data?.error ||
      error.message ||
      "Failed to add farmer";
    dispatch(postFarmerFailure(errorMsg));
  }
};

// -------------------------------------------
// GET all farmers
// -------------------------------------------
export const fetchFarmers = () => async (dispatch) => {
  dispatch(fetchFarmersRequest());
  try {
    const response = await apiClient.get("/farmers/");
    dispatch(fetchFarmersSuccess(response.data));
  } catch (error) {
    const errMsg =
      error.response?.data?.detail ||
      error.message ||
      "Failed to fetch farmers";
    dispatch(fetchFarmersFailure(errMsg));
  }
};

// -------------------------------------------
// DELETE a farmer
// -------------------------------------------
export const deleteFarmer = (id) => async (dispatch) => {
  dispatch(fetchFarmersRequest());
  try {
    await apiClient.delete(`/farmers/${id}/`);
    const response = await apiClient.get("/farmers/");
    dispatch(fetchFarmersSuccess(response.data));
  } catch (error) {
    const errMsg =
      error.response?.data?.detail ||
      error.message ||
      "Failed to delete farmer";
    dispatch(fetchFarmersFailure(errMsg));
  }
};

// -------------------------------------------
// UPDATE farmer (using createAsyncThunk)
// -------------------------------------------
export const updateFarmer = createAsyncThunk(
  "farmers/update",
  async (farmer, { rejectWithValue }) => {
    try {
      const { id, ...payload } = farmer;
      const response = await apiClient.put(`/farmers/${id}/`, payload);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.detail ||
          error.message ||
          "Failed to update farmer"
      );
    }
  }
);
