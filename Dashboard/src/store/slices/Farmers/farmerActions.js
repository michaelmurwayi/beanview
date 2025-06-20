// redux/actions/farmerActions.js
import axios from 'axios';
import {
  postFarmerRequest,
  postFarmerSuccess,
  postFarmerFailure,
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
  dispatch(postFarmerRequest());

  try {
    const response = await axios.get(`${apiBaseUrl}/farmers/`);
    dispatch(postFarmerSuccess(response.data));
  } catch (error) {
    dispatch(postFarmerFailure(error.message));
  }
}
  
