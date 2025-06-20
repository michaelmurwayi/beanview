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
      dispatch(postFarmerSuccess(data));
    } catch (error) {
      dispatch(postFarmerFailure(error.message));
    }
  };
  

