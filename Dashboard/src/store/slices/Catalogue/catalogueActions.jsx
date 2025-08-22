// store/slices/catalogue/catalogueActions.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { generateAuctionFileFromData } from "../../../utils/generateAuctionFile";

export const generateCatalogueFile = createAsyncThunk(
  "catalogue/generateCatalogueFile",
  async (catalogueData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/catalogue/generate_catalogue_file/",
        catalogueData,
        {
          responseType: "blob", // Important for binary file download
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
  "catalogue/generateAuctionFile",
  async (recordData, thunkAPI) => {
    try {
      console.log("Generating auction file with data:", recordData);
      const { fileBlob, filename } = generateAuctionFileFromData(recordData); // ✅

      // Trigger download
      const link = document.createElement("a");
      link.href = URL.createObjectURL(fileBlob);
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      URL.revokeObjectURL(link.href);
      document.body.removeChild(link);

      return { fileBlob, filename }; // ✅ match actual return
    } catch (error) {
      console.error("Auction file generation error:", error);
      return thunkAPI.rejectWithValue("Failed to generate auction file.");
    }
  }
);

// Generate a summary based on sale records
export const generateSaleFile = createAsyncThunk(
  "catalogue/generateSaleFile",

  async (summaries, { getState, rejectWithValue }) => {
    try {
      const url = `${apiBaseUrl}/catalogue/generate_sale_file/`;

      // ✅ Request file as blob
      const response = await axios.post(
        url,
        { summaries },
        {
          responseType: "blob",
        }
      );

      // ✅ Extract filename from Content-Disposition header
      const contentDisposition = response.headers["content-disposition"];
      let filename = "sale_files.zip"; // default fallback

      if (contentDisposition && contentDisposition.includes("filename=")) {
        filename = contentDisposition
          .split("filename=")[1]
          .replace(/["']/g, "")
          .trim();
      }

      // ✅ Create blob and trigger download
      const blob = new Blob([response.data], {
        type: response.headers["content-type"],
      });
      const urlBlob = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = urlBlob;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();

      // Clean up blob URL
      window.URL.revokeObjectURL(urlBlob);

      toast.success("Sale file downloaded");
      return true;
    } catch (error) {
      const message =
        error.response?.data?.error || "Sale file generation failed";
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);
