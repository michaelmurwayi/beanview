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

const FarmerForm = ({ formData, handleChange, handleSubmit }) => {
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
          maxWidth: 900,
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

        {/* Section: Personal Information */}
        <Typography sx={sectionTitleStyle} >Farmer Information</Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Full Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              fullWidth
              sx={inputFieldStyle}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="National ID"
              name="nation_id"
              value={formData.nation_id}
              onChange={handleChange}
              fullWidth
              sx={inputFieldStyle}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Mark"
              name="mark"
              value={formData.mark}
              onChange={handleChange}
              required
              fullWidth
              sx={inputFieldStyle}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Farmer Code"
              name="code"
              value={formData.code}
              onChange={handleChange}
              required
              fullWidth
              sx={inputFieldStyle}
            />
          </Grid>
        </Grid>

        <Divider sx={{ my: 4 }} />

        {/* Section: Contact Information */}
        <Typography sx={sectionTitleStyle}>Contact Information</Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              fullWidth
              sx={inputFieldStyle}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="County"
              name="county"
              value={formData.county}
              onChange={handleChange}
              fullWidth
              sx={inputFieldStyle}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Town"
              name="town"
              value={formData.town}
              onChange={handleChange}
              fullWidth
              sx={inputFieldStyle}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              fullWidth
              sx={inputFieldStyle}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              fullWidth
              sx={inputFieldStyle}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              fullWidth
              sx={inputFieldStyle}
            />
          </Grid>
        </Grid>

        <Divider sx={{ my: 4 }} />

        {/* Section: Banking Information */}
        <Typography sx={sectionTitleStyle}>Banking Information</Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Bank"
              name="bank"
              value={formData.bank}
              onChange={handleChange}
              fullWidth
              sx={inputFieldStyle}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Branch"
              name="branch"
              value={formData.branch}
              onChange={handleChange}
              fullWidth
              sx={inputFieldStyle}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Account Number"
              name="account"
              value={formData.account}
              onChange={handleChange}
              fullWidth
              sx={inputFieldStyle}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Currency"
              name="currency"
              value={formData.currency}
              onChange={handleChange}
              fullWidth
              sx={inputFieldStyle}
            />
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default FarmerForm;
