import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  TextField,
  Typography,
  Divider,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  CircularProgress,
  Alert,
} from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import {
  updateCoffeeFormField,
  resetCoffeeForm,
} from "../../store/slices/Coffee/coffeeSlice";
import { fetchFarmers } from "../../store/slices/Farmers/farmerActions";

const CoffeeUploadForm = ({ handleSubmit }) => {
  const dispatch = useDispatch();

  const formData = useSelector((state) => state.coffee.CoffeeUploadFormData);
  const farmers = useSelector((state) => state.farmer.farmers || []);
  const farmerStatus = useSelector((state) => state.farmer.status); // "idle", "loading", "succeeded", "failed"
  const farmerError = useSelector((state) => state.farmer.error);

  const [uniqueMarks, setUniqueMarks] = useState([]);

  // Fetch farmers on component load
  useEffect(() => {
    dispatch(fetchFarmers());
  }, [dispatch]);

  // Extract unique marks dynamically
  useEffect(() => {
    if (Array.isArray(farmers)) {
      const marks = [
        ...new Set(farmers.map((farmer) => farmer.mark).filter(Boolean)),
      ];
      setUniqueMarks(marks);
    }
  }, [farmers]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    dispatch(updateCoffeeFormField({ field: name, value }));
  };

  const handleRetry = () => {
    dispatch(fetchFarmers());
  };

  const sectionTitle = (title) => (
    <Typography
      variant="subtitle1"
      sx={{
        fontWeight: 600,
        color: "#3b5998",
        textTransform: "uppercase",
        mb: 2,
        mt: 3,
      }}
    >
      {title}
    </Typography>
  );

  const inputFieldStyle = {
    "& .MuiInputBase-root": {
      backgroundColor: "#f9f9f9",
      borderRadius: "8px",
      height: "56px", // consistent height
    },
    "& .MuiInputLabel-root": {
      fontSize: "0.9rem",
    },
  };

  // ===== Fallback states for loading and errors =====
  if (farmerStatus === "loading") {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="50vh"
      >
        <CircularProgress size={50} />
      </Box>
    );
  }

  if (farmerStatus === "failed") {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="50vh"
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            width: "100%",
            maxWidth: 500,
            textAlign: "center",
          }}
        >
          <Alert severity="error" sx={{ mb: 3 }}>
            Failed to load upload Form: {farmerError}
          </Alert>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Please check your internet connection or try again later.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={handleRetry}
            sx={{ borderRadius: "8px", px: 4 }}
          >
            Retry
          </Button>
        </Paper>
      </Box>
    );
  }

  // ===== Main Form =====
  return (
    <Box display="flex" justifyContent="center" width="100%">
      <Paper
        elevation={3}
        sx={{
          p: { xs: 2, sm: 4 },
          width: "100%",
          maxWidth: 1100,
          bgcolor: "#fff",
          mt: 4,
          mb: 4,
          borderRadius: "12px",
        }}
      >
        {/* Header */}
        <Typography
          variant="h5"
          sx={{
            fontWeight: "bold",
            color: "#121330",
            mb: 4,
            textAlign: "center",
          }}
        >
          Coffee Registration
        </Typography>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit(formData);
            dispatch(resetCoffeeForm());
          }}
        >
          {/* ===== Basic Coffee Details ===== */}
          {sectionTitle("Basic Coffee Details")}
          <Grid container spacing={3}>
            <Grid item xs={6} sm={4}>
              <TextField
                label="Outturn"
                name="outturn"
                value={formData.outturn || ""}
                onChange={handleChange}
                fullWidth
                sx={inputFieldStyle}
              />
            </Grid>

            <Grid item xs={6} sm={4}>
              <TextField
                label="Bulk Outturn"
                name="bulkoutturn"
                value={formData.bulkoutturn || ""}
                onChange={handleChange}
                fullWidth
                sx={inputFieldStyle}
              />
            </Grid>

            {/* Mark Dropdown - FIXED WIDTH */}
            <Grid item xs={6} sm={4}>
              <FormControl variant="outlined" fullWidth sx={inputFieldStyle}>
                <InputLabel id="mark-label">Mark</InputLabel>
                <Select
                  labelId="mark-label"
                  name="mark"
                  value={formData.mark || ""}
                  onChange={handleChange}
                  label="Mark"
                >
                  {uniqueMarks.length > 0 ? (
                    uniqueMarks.map((mark) => (
                      <MenuItem key={mark} value={mark}>
                        {mark}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem disabled>No Marks Available</MenuItem>
                  )}
                </Select>
              </FormControl>
            </Grid>

            {/* Other basic fields */}
            {[
              "type",
              "grade",
              "bags",
              "pockets",
              "weight",
              "sale",
              "season",
              "mill",
            ].map((field) => (
              <Grid item xs={6} sm={4} key={field}>
                <TextField
                  label={field.charAt(0).toUpperCase() + field.slice(1)}
                  name={field}
                  value={formData[field] || ""}
                  onChange={handleChange}
                  fullWidth
                  sx={inputFieldStyle}
                />
              </Grid>
            ))}
          </Grid>

          <Divider sx={{ my: 4 }} />

          {/* ===== Charges Section ===== */}
          {sectionTitle("Charges")}
          <Grid container spacing={3}>
            {[
              "milling_charges",
              "warehouse_charges",
              "brokerage_charges",
              "export_charges",
              "transport_charges",
            ].map((field) => (
              <Grid item xs={6} sm={4} key={field}>
                <TextField
                  label={field
                    .replace(/_/g, " ")
                    .replace(/\b\w/g, (c) => c.toUpperCase())}
                  name={field}
                  value={formData[field] || ""}
                  onChange={handleChange}
                  fullWidth
                  sx={inputFieldStyle}
                />
              </Grid>
            ))}
          </Grid>

          <Divider sx={{ my: 4 }} />

          {/* ===== Financial Summary ===== */}
          {sectionTitle("Financial Summary")}
          <Grid container spacing={3}>
            {["price", "net_value", "gross_value", "reserve"].map((field) => (
              <Grid item xs={6} sm={4} key={field}>
                <TextField
                  label={field
                    .replace(/_/g, " ")
                    .replace(/\b\w/g, (c) => c.toUpperCase())}
                  name={field}
                  value={formData[field] || ""}
                  onChange={handleChange}
                  fullWidth
                  sx={inputFieldStyle}
                />
              </Grid>
            ))}
          </Grid>

          <Divider sx={{ my: 4 }} />

          {/* ===== Logistics & Remarks ===== */}
          {sectionTitle("Logistics & Remarks")}
          <Grid container spacing={3}>
            <Grid item xs={6} sm={4}>
              <TextField
                label="Certificate"
                name="certificate"
                value={formData.certificate || ""}
                onChange={handleChange}
                fullWidth
                sx={inputFieldStyle}
              />
            </Grid>

            {/* Status Dropdown */}
            <Grid item xs={6} sm={4}>
              <FormControl variant="outlined" fullWidth sx={inputFieldStyle}>
                <InputLabel>Status</InputLabel>
                <Select
                  name="status"
                  value={formData.status || ""}
                  onChange={handleChange}
                  label="Status"
                >
                  <MenuItem value="Pending">Pending</MenuItem>
                  <MenuItem value="Approved">Catalogued</MenuItem>
                  <MenuItem value="Rejected">Sold</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={6} sm={4}>
              <TextField
                label="Buyer"
                name="buyer"
                value={formData.buyer || ""}
                onChange={handleChange}
                fullWidth
                sx={inputFieldStyle}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Remarks"
                name="remarks"
                value={formData.remarks || ""}
                onChange={handleChange}
                fullWidth
                multiline
                rows={3}
                sx={inputFieldStyle}
              />
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default CoffeeUploadForm;
