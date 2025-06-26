import React from 'react';
import {
  Box,
  Grid,
  TextField,
  Typography,
  Divider,
  Paper,
  Button,
} from '@mui/material';

const sectionTitleStyle = {
  fontSize: '0.7rem',
  fontWeight: 600,
  color: '#B6D0E2',
  textTransform: 'uppercase',
  marginBottom: '1rem',
};

const inputFieldStyle = {
  '& .MuiInputBase-root': {
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
  },
};

const CoffeeUploadForm = ({ formData, handleChange, handleSubmit }) => {
  return (
    <Box
      display="flex"
      justifyContent="center"
      px={{ xs: 2, sm: 4 }}
      width="100%"
      sx={{ overflowX: 'hidden' }}
    >
      <Paper
        elevation={2}
        sx={{
          p: 4,
          width: '100%',
          maxWidth: 1000,
          bgcolor: '#fff',
          mt: 4,
          mb: 4,
        }}
      >
        <Box display="flex" justifyContent="flex-end" mb={2}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{ textTransform: 'none', px: 4 }}
            onClick={handleSubmit}
          >
            Submit
          </Button>
        </Box>

        {/* Section: Basic Details */}
        <Typography sx={sectionTitleStyle}>Basic Coffee Details</Typography>
        <Grid container spacing={3}>
          {['lot', 'outturn', 'bulkoutturn', 'mark', 'type', 'grade', 'bags', 'pockets', 'weight', 'sale', 'season', 'mill'].map((field) => (
            <Grid item xs={12} sm={6} key={field}>
              <TextField
                label={field.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
                name={field}
                value={formData[field]}
                onChange={handleChange}
                fullWidth
                sx={inputFieldStyle}
              />
            </Grid>
          ))}
        </Grid>

        <Divider sx={{ my: 4 }} />

        {/* Section: Charges */}
        <Typography sx={sectionTitleStyle}>Charges</Typography>
        <Grid container spacing={3}>
          {['milling_charges', 'warehouse_charges', 'brokerage_charges', 'export_charges', 'transport_charges'].map((field) => (
            <Grid item xs={12} sm={6} key={field}>
              <TextField
                label={field.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
                name={field}
                value={formData[field]}
                onChange={handleChange}
                fullWidth
                sx={inputFieldStyle}
              />
            </Grid>
          ))}
        </Grid>

        <Divider sx={{ my: 4 }} />

        {/* Section: Financials */}
        <Typography sx={sectionTitleStyle}>Financial Summary</Typography>
        <Grid container spacing={3}>
          {['price', 'net_value', 'gross_value', 'reserve'].map((field) => (
            <Grid item xs={12} sm={6} key={field}>
              <TextField
                label={field.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
                name={field}
                value={formData[field]}
                onChange={handleChange}
                fullWidth
                sx={inputFieldStyle}
              />
            </Grid>
          ))}
        </Grid>

        <Divider sx={{ my: 4 }} />

        {/* Section: Logistics & Remarks */}
        <Typography sx={sectionTitleStyle}>Logistics & Remarks</Typography>
        <Grid container spacing={3}>
          {['certificate', 'status', 'catalogue', 'catalogue_type', 'buyer', 'remarks'].map((field) => (
            <Grid item xs={12} sm={6} key={field}>
              <TextField
                label={field.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
                name={field}
                value={formData[field]}
                onChange={handleChange}
                fullWidth
                sx={inputFieldStyle}
              />
            </Grid>
          ))}
        </Grid>
      </Paper>
    </Box>
  );
};

export default CoffeeUploadForm;
