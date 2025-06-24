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
  const { apiBaseUrl } = getState().farmer;
  dispatch(fetchFarmersRequest());

  try {
    const response = await axios.get(`${apiBaseUrl}/farmers/`);
    dispatch(fetchFarmersSuccess(response.data));
  } catch (error) {
    dispatch(fetchFarmersFailure(error.message));
  }
}

export const deleteFarmer = (id) => async (dispatch, getState) => {
  const { apiBaseUrl } = getState().farmer;

  try {
    const response = await axios.delete(`${apiBaseUrl}/farmers/${id}/`);
    if (response.status === 204) { // No content means successful deletion
      dispatch(fetchFarmers()); // Refresh the list after deletion
    } else {
      throw new Error('Failed to delete farmer');
    }
  } catch (error) {
    console.error('Error deleting farmer:', error);
    // Handle error appropriately, e.g., show a notification
  }
}

export const updateFarmer = (farmer) => async (dispatch, getState) => {
  const {apiBaseUrl}  = getState().farmer;
  console.log('Updating farmer with ID:', farmer);
  try {
    const { id, ...payload } = farmer;
    console.log('Updating farmer with payload:', payload), id;
    const response = await axios.put(`${apiBaseUrl}/farmers/${id}/`, payload);
    dispatch(updateFarmerRequest(response.data));

    dispatch(updateFarmerSuccess(response.data));
  } catch (error) {
    dispatch(updateFarmerFailure(error.response?.data || error.message));
  }
};
  
