import React from 'react';
import {
  Box,
  Grid,
  TextField,
  Typography,
  Paper,
  Divider
} from '@mui/material';

const CoffeeForm = ({ formData, handleChange }) => {
  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 900, mx: 'auto' }}>
      <Typography variant="h6" gutterBottom>
        Coffee Information
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Outturn Number"
            name="outturnNumber"
            value={formData.outturnNumber}
            onChange={handleChange}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Mark Number"
            name="markNumber"
            value={formData.markNumber}
            onChange={handleChange}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Certificate"
            name="certificate"
            value={formData.certificate}
            onChange={handleChange}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Season"
            name="season"
            value={formData.season}
            onChange={handleChange}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            label="Grade"
            name="grade"
            value={formData.grade}
            onChange={handleChange}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            label="Bags"
            name="bags"
            type="number"
            value={formData.bags}
            onChange={handleChange}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            label="Pockets"
            name="pockets"
            type="number"
            value={formData.pockets}
            onChange={handleChange}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Weight (Kgs)"
            name="weight"
            type="number"
            value={formData.weight}
            onChange={handleChange}
            fullWidth
          />
        </Grid>
      </Grid>

      <Divider sx={{ my: 4 }} />

      <Typography variant="h6" gutterBottom>
        Additional Information
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Miller Code"
            name="millerCode"
            value={formData.millerCode}
            onChange={handleChange}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Warehouse"
            name="warehouse"
            value={formData.warehouse}
            onChange={handleChange}
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            fullWidth
          />
        </Grid>
      </Grid>
    </Paper>
  );
};

export default CoffeeForm;
