import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const generateCatalogueFile = createAsyncThunk(
  'catalogue/generateCatalogueFile',
  async (catalogueData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        'http://127.0.0.1:8000/api/catalogue/generate_catalogue_file/',
        catalogueData
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);