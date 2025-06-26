// redux/actions/farmerActions.js
import axios from 'axios';
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
} from './farmerSlice';
import { createAsyncThunk } from '@reduxjs/toolkit';


export const submitFarmer = () => async (dispatch, getState) => {
    dispatch(postFarmerRequest());
    const { apiBaseUrl, FarmerUploadFormData } = getState().farmer;
  
    try {
      const response = await fetch(`${apiBaseUrl}/farmers/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(FarmerUploadFormData),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        // response.ok is false for 4xx or 5xx
        const errorMsg = data?.error || 'Failed to add farmer';
        dispatch(postFarmerFailure(errorMsg));
      } else {
        dispatch(postFarmerSuccess(data));
      }
    } catch (error) {
      dispatch(postFarmerFailure(error.message));
    }
  };

export const fetchFarmers = () => async (dispatch, getState) => {
  const  apiBaseUrl  = "http://localhost:8000/api"; // Use your actual API base URL here
  dispatch(fetchFarmersRequest());

  try {
    const response = await axios.get(`${apiBaseUrl}/farmers/`);
    // console.log('Fetched Farmers:', response.data);
    dispatch(fetchFarmersSuccess(response.data));
  } catch (error) {
    dispatch(fetchFarmersFailure(error.message));
  }
}

export const deleteFarmer = (id) => async (dispatch) => {
  dispatch(fetchFarmersRequest());

  try {
    await axios.delete(`${apiBaseUrl}/farmers/${id}/`);
    
    // Option 1: Re-fetch the full list after deletion
    const response = await axios.get(`${process.env.REACT_APP_API_URL}/farmers/`);
    dispatch(fetchFarmersSuccess(response.data));

    // Option 2: Or remove locally without refetching (requires additional reducer)
    // dispatch(deleteFarmerSuccess(id));
  } catch (error) {
    dispatch(fetchFarmersFailure(error.response?.data || error.message));
  }
};

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

export const updateFarmer = createAsyncThunk(
  'farmers/update',
  async (farmer, { rejectWithValue }) => {
    try {
      const { id, ...payload } = farmer;
      const response = await axios.put(`${apiBaseUrl}/farmers/${id}/`, payload);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
  
