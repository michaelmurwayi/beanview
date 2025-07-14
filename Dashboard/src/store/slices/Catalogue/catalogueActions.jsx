// store/slices/catalogue/catalogueActions.js
import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import  {generateAuctionFileFromData}  from '../../../utils/generateAuctionFile';

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

export const generateAuctionFile = createAsyncThunk(
  'catalogue/generateAuctionFile',
  async (recordData, thunkAPI) => {
    try {
      console.log("Generating auction file with data:", recordData);
      const { fileBlob, filename } = generateAuctionFileFromData(recordData); // ✅

      // Trigger download
      const link = document.createElement('a');
      link.href = URL.createObjectURL(fileBlob);
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      URL.revokeObjectURL(link.href);
      document.body.removeChild(link);

      return { fileBlob, filename }; // ✅ match actual return
    } catch (error) {
      console.error("Auction file generation error:", error);
      return thunkAPI.rejectWithValue('Failed to generate auction file.');
    }
  }
);
