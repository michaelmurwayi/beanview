// store/slices/catalogue/catalogueActions.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import apiClient from "../../../../apiClient";
import { generateAuctionFileFromData } from "../../../utils/generateAuctionFile";
import { downloadBlobFile } from "../../../utils/downloadBlobFile";

// 📘 Generate Catalogue File (backend - PDF)
export const generateCatalogueFile = createAsyncThunk(
  "catalogue/generateCatalogueFile",
  async (catalogueData, { rejectWithValue }) => {
    try {
      const response = await apiClient.post(
        "/catalogue/generate_catalogue_file/",
        catalogueData,
        { responseType: "blob" }
      );

      const blob = new Blob([response.data], {
        type: response.headers["content-type"] || "application/pdf",
      });

      const contentDisposition = response.headers["content-disposition"];
      const filename =
        contentDisposition
          ?.split("filename=")[1]
          ?.replace(/["']/g, "")
          .trim() || "catalogue.pdf";

      downloadBlobFile(blob, filename);
      toast.success("Catalogue PDF downloaded successfully");

      return { success: true, filename };
    } catch (error) {
      const message = error.response?.data || error.message;
      toast.error("Catalogue PDF generation failed");
      return rejectWithValue(message);
    }
  }
);

// 📘 Generate Auction File (frontend)
export const generateAuctionFile = createAsyncThunk(
  "catalogue/generateAuctionFile",
  async (recordData, thunkAPI) => {
    try {
      console.log("Generating auction file with data:", recordData);
      const { fileBlob, filename } = generateAuctionFileFromData(recordData);

      downloadBlobFile(fileBlob, filename);
      toast.success("Auction file downloaded");

      return { success: true, filename };
    } catch (error) {
      console.error("Auction file generation error:", error);
      toast.error("Failed to generate auction file");
      return thunkAPI.rejectWithValue("Failed to generate auction file.");
    }
  }
);

// 📘 Generate Sale File (backend)
export const generateSaleFile = createAsyncThunk(
  "catalogue/generateSaleFile",
  async (saleNumber, { rejectWithValue }) => {
    try {
      const response = await apiClient.post(
        "/catalogue/generate_sale_file/",
        { saleNumber },
        { responseType: "blob" }
      );

      const contentDisposition = response.headers["content-disposition"];
      const filename =
        contentDisposition?.split("filename=")[1]?.replace(/["']/g, "").trim() ||
        "sale_files.zip";

      const blob = new Blob([response.data], {
        type: response.headers["content-type"],
      });
      downloadBlobFile(blob, filename);

      toast.success("Sale file downloaded");
      return { success: true, filename };
    } catch (error) {
      const message =
        error.response?.data?.error || "Sale file generation failed";
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);
