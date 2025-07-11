// store/slices/catalogue/catalogueActions.js
import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const generateCatalogueFile = createAsyncThunk(
  'catalogue/generateCatalogueFile',
  async (catalogueData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        'http://127.0.0.1:8000/api/catalogue/generate_catalogue_file/',
        catalogueData,
        {
          responseType: 'blob', // Important for binary file download
        }
      );

      // Return full response including headers for filename
      return {
        data: response.data,
        headers: response.headers,
      };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
