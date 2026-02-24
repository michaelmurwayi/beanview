import React, { useRef, useState, useEffect } from "react";
import {
  Paper,
  Button,
  Typography,
  CircularProgress,
  Alert,
  Box,
} from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import { useDispatch, useSelector } from "react-redux";
import { uploadPayoutFile } from "../../store/slices/Payout/payoutUploadAction";
import { resetUploadState } from "../../store/slices/Payout/payoutUploadSlice";

const PayoutUpload = () => {
  const dispatch = useDispatch();
  const fileRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);

  // Ensure the key matches your store
  const { loading, success, error, message } = useSelector(
    (state) => state.payoutUpload
  ) || {};

  useEffect(() => {
    console.log("Upload State:", { loading, success, error, message });
  }, [loading, success, error, message]);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    setSelectedFile(file); // Store selected file for display
  };

  const handleUpload = () => {
    if (!selectedFile) return;
    dispatch(uploadPayoutFile(selectedFile));
  };

  const handleReset = () => {
    dispatch(resetUploadState());
    setSelectedFile(null); // clear selected file
  };

  return (
    <Paper sx={{ p: 4, maxWidth: 400, margin: "auto", mt: 5, boxShadow: 3, bgcolor:"#183048" }}>
      <Typography variant="h6" color="white" mb={2}>
        Upload Payout File
      </Typography>

      <input
        type="file"
        hidden
        ref={fileRef}
        accept=".xlsx,.xls,.csv"
        onChange={handleFileSelect}
      />

      <Box mb={2} display="flex" flexDirection="column" gap={1}>
        <Button
          fullWidth
          variant="contained"
          startIcon={<UploadFileIcon />}
          onClick={() => fileRef.current.click()}
          disabled={loading}
        >
          Select File
        </Button>

        {selectedFile && (
          <Typography variant="body2" color="textSecondary">
            Selected file: {selectedFile.name}
          </Typography>
        )}

        <Button
          fullWidth
          variant="outlined"
          color="white"
          onClick={handleUpload}
          disabled={!selectedFile || loading}
        >
          Upload
        </Button>
      </Box>

      <Box mt={2}>
        {loading && (
          <Box display="flex" justifyContent="center" my={2}>
            <CircularProgress />
          </Box>
        )}

        {success && (
          <Alert severity="success" onClose={handleReset} sx={{ mt: 2 }}>
            {message || "Upload successful"}
          </Alert>
        )}

        {error && (
          <Alert severity="error" onClose={handleReset} sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
      </Box>
    </Paper>
  );
};

export default PayoutUpload;