import axios from 'axios';
import {
  postCoffeeRequest,
  postCoffeeSuccess,
  postCoffeeFailure,
  fetchCoffeeRequest,
  fetchCoffeeSuccess,
  fetchCoffeeFailure,
  updateCoffeeRequest,
  updateCoffeeSuccess,
  updateCoffeeFailure,
} from './coffeeSlice';

import { createAsyncThunk } from '@reduxjs/toolkit';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

/** Submit new coffee record */
export const submitCoffee = () => async (dispatch, getState) => {
  dispatch(postCoffeeRequest());

  const { CoffeeUploadFormData } = getState().coffee;

  // Make a copy to avoid mutating state
  const formData = { ...CoffeeUploadFormData };

  // Capitalize and trim the mark field
  if (formData.mark) {
    formData.mark = formData.mark.trim().toUpperCase();
  }

  console.log('Submitting Coffee Data:', formData);

  try {
    const response = await fetch(`${apiBaseUrl}/coffee/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (!response.ok) {
      const errorMsg = data?.error || 'Failed to add coffee record';
      dispatch(postCoffeeFailure(errorMsg));
    } else {
      dispatch(postCoffeeSuccess(data));
    }
  } catch (error) {
    dispatch(postCoffeeFailure(error.message));
  }
};

/** Fetch all coffee records */
export const fetchCoffee = () => async (dispatch) => {
  dispatch(fetchCoffeeRequest());

  try {
    const response = await axios.get(`${apiBaseUrl}/coffee/`);
    dispatch(fetchCoffeeSuccess(response.data));
  } catch (error) {
    dispatch(fetchCoffeeFailure(error.message));
  }
};

/** Delete a coffee record */
export const deleteCoffee = (id) => async (dispatch) => {
  dispatch(fetchCoffeeRequest());

  try {
    await axios.delete(`${apiBaseUrl}/coffee/${id}/`);

    // Option: Re-fetch after deletion
    const response = await axios.get(`${apiBaseUrl}/coffee/`);
    dispatch(fetchCoffeeSuccess(response.data));

    // Option: dispatch deleteCoffeeSuccess(id); if you're managing state manually
  } catch (error) {
    dispatch(fetchCoffeeFailure(error.response?.data || error.message));
  }
};

/** Update a coffee record */
export const updateCoffee = createAsyncThunk(
  'coffee/update',
  async (record, { rejectWithValue }) => {
    try {
      const { id, ...payload } = record;
      console.log('Updating Coffee Record:', id);
      const response = await axios.put(`${apiBaseUrl}/coffee/${id}/`, payload);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const importCoffeeFile = createAsyncThunk(
  'coffee/importFile',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${apiBaseUrl}/coffee/`, // change path if needed
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);
export const generateSummaryFile = createAsyncThunk(
  'coffee/generateSummaryFile',

  async (summaries, { getState, rejectWithValue }) => {
    try {
      const url = `${apiBaseUrl}/coffee/generate_summary_file/`;

      // ✅ Request file as blob
      const response = await axios.post(url, { summaries }, {
        responseType: 'blob',
      });

      // ✅ Extract filename from Content-Disposition header
      const contentDisposition = response.headers['content-disposition'];
      let filename = 'summary_files.zip'; // default fallback

      if (contentDisposition && contentDisposition.includes('filename=')) {
        filename = contentDisposition
          .split('filename=')[1]
          .replace(/["']/g, '')
          .trim();
      }

      // ✅ Create blob and trigger download
      const blob = new Blob([response.data], { type: response.headers['content-type'] });
      const urlBlob = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = urlBlob;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();

      // Clean up blob URL
      window.URL.revokeObjectURL(urlBlob);

      toast.success('Summary file downloaded');
      return true;

    } catch (error) {
      const message = error.response?.data?.error || 'Summary file generation failed';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);