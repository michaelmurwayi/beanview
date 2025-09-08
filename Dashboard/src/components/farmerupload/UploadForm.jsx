import React from "react";
import {
  Box,
  Grid,
  TextField,
  Typography,
  Divider,
  Paper,
  Button,
} from "@mui/material";

const sectionTitleStyle = {
  fontSize: "0.85rem",
  fontWeight: 700,
  color: "#3b5998",
  textTransform: "uppercase",
  letterSpacing: "0.5px",
  marginBottom: "1rem",
};

const inputFieldStyle = {
  "& .MuiInputBase-root": {
    backgroundColor: "#f9f9f9",
    borderRadius: "10px",
    height: "50px",
  },
  "& .MuiInputLabel-root": {
    fontSize: "0.85rem",
  },
};

const FarmerForm = ({ formData, handleChange, handleSubmit }) => {
  return (
    <Box
      display="flex"
      justifyContent="center"
      px={{ xs: 2, sm: 4 }}
      width="100%"
      sx={{ overflowX: "hidden" }}
    >
      <Paper
        elevation={4}
        sx={{
          p: { xs: 3, sm: 4 },
          width: "100%",
          maxWidth: 950,
          bgcolor: "#fff",
          mt: 4,
          mb: 4,
          borderRadius: "16px",
        }}
      >
        {/* ======= Header ======= */}
        <Typography
          variant="h5"
          sx={{
            fontWeight: "bold",
            color: "#121330",
            letterSpacing: "0.5px",
            mb: 3,
          }}
        >
          Farmer Registration
        </Typography>

        {/* ======= Section 1: Farmer Identification ======= */}
        <Typography sx={sectionTitleStyle}>Farmer Identification</Typography>
        <Grid container spacing={3}>
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

        <Divider sx={{ my: 5 }} />

        {/* ======= Section 2: Farmer Details ======= */}
        <Typography sx={sectionTitleStyle}>Farmer Details</Typography>
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
        </Grid>

        <Divider sx={{ my: 5 }} />

        {/* ======= Section 3: Contact Information ======= */}
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
              label="Phone Number"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              fullWidth
              sx={inputFieldStyle}
              inputProps={{ maxLength: 15 }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              fullWidth
              sx={inputFieldStyle}
            />
          </Grid>
        </Grid>

        <Divider sx={{ my: 5 }} />

        {/* ======= Section 4: Banking Information ======= */}
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
              inputProps={{ maxLength: 20 }}
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

        {/* ======= Footer Submit Button ======= */}
        <Box display="flex" justifyContent="flex-end" mt={6}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{
              textTransform: "none",
              px: 4,
              py: 1.2,
              fontSize: "1rem",
              borderRadius: "10px",
              fontWeight: "bold",
            }}
            onClick={handleSubmit}
          >
            Submit
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default FarmerForm;
