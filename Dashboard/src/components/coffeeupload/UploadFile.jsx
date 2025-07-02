import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  IconButton,
  Stack,
  Alert,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import {importCoffeeFile}  from '../../store/slices/Coffee/coffeeActions'; // Adjust path as needed

const FileUpload = ({ sheetNames = [], selectedSheet = 'all' }) => {
  const dispatch = useDispatch();
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
    }
  };

  const handleRemove = () => {
    setFile(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      toast.warn("⚠️ No file selected.");
      return;
    }

    const dataToSend = new FormData();
    dataToSend.append('file', file);
    dataToSend.append('filename', file.name);

    if (selectedSheet === 'all') {
      dataToSend.append('sheetnames', sheetNames.join(','));
    } else {
      dataToSend.append('sheetnames', selectedSheet);
    }

    try {
      setUploading(true);
      await dispatch(importCoffeeFile(dataToSend));
      toast.success('✅ File uploaded successfully');
      setFile(null);
    } catch (error) {
      console.error(error);
      toast.error('❌ Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Paper
      elevation={2}
      sx={{
        p: 3,
        textAlign: 'center',
        border: '2px solid #90caf9',
        bgcolor: '#f9f9f9',
        borderRadius: 2,
        maxWidth: 500,
        margin: '0 auto',
      }}
    >
      <input
        accept=".csv,.xlsx,.xls,.json"
        type="file"
        id="file-upload"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
      {!file ? (
        <label htmlFor="file-upload">
          <Stack alignItems="center" spacing={1}>
            <CloudUploadIcon color="primary" fontSize="large" />
            <Typography variant="body2" color="textSecondary">
              Drag & drop or click to select a file
            </Typography>
            <Button
              variant="contained"
              component="span"
              sx={{ textTransform: 'none' }}
            >
              Choose File
            </Button>
          </Stack>
        </label>
      ) : (
        <Box>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Box textAlign="left">
              <Typography fontWeight={600}>{file.name}</Typography>
              <Typography variant="caption" color="textSecondary">
                {(file.size / 1024).toFixed(2)} KB
              </Typography>
            </Box>
            <IconButton onClick={handleRemove} color="error">
              <DeleteIcon />
            </IconButton>
          </Box>

          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleSubmit}
            disabled={uploading}
            sx={{ textTransform: 'none' }}
          >
            {uploading ? 'Uploading...' : 'Upload File'}
          </Button>
        </Box>
      )}
    </Paper>
  );
};

export default FileUpload;
