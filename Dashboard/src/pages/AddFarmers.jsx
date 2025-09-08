import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Box,
  Tabs,
  Tab,
  Typography,
  Paper,
  Container,
  Alert,
} from "@mui/material";
import Sidebar from "../components/sidebar/Sidebar";
import CoffeeForm from "../components/farmerupload/UploadForm";
import { updateFarmerFormField } from "../store/slices/Farmers/farmerSlice";
import { submitFarmer } from "../store/slices/Farmers/farmerActions";

// ==================
// Styles
// ==================
const styles = {
  layoutContainer: {
    display: "flex",
    width: "100%",
    minHeight: "100vh",
    backgroundColor: "#f9f9fb",
  },
  mainContent: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
  },
  tabPaper: {
    backgroundColor: "#ffffff",
    borderBottom: "1px solid #e0e0e0",
    position: "sticky",
    top: 0,
    zIndex: 10,
  },
  tabs: {
    "& .MuiTab-root": {
      textTransform: "none",
      fontWeight: 500,
      fontSize: "1rem",
      color: "#555",
      borderRadius: "8px 8px 0 0",
      mx: 0.5,
      transition: "all 0.2s ease",
      "&:hover": {
        backgroundColor: "#f0f0f5",
      },
    },
    "& .Mui-selected": {
      backgroundColor: "#e7f0fa",
      color: "#1976d2",
    },
    "& .MuiTabs-indicator": {
      height: 3,
      backgroundColor: "#90caf9",
      borderRadius: 2,
    },
  },
  contentWrapper: {
    flex: 1,
    padding: { xs: 2, sm: 3 },
    overflow: "auto",
  },
  alertBox: {
    px: { xs: 2, sm: 3 },
    py: 2,
  },
};

// ==================
// Farmer Form Upload
// ==================
const FormUpload = () => {
  const formData = useSelector((state) => state.farmer.FarmerUploadFormData);
  const { error, success } = useSelector((state) => state.farmer);
  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value } = e.target;
    dispatch(updateFarmerFormField({ field: name, value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitting farmer:", formData);
    dispatch(submitFarmer(formData));
  };

  // Clear form when submission is successful
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        dispatch(resetFarmerForm());
      }, 2000); // Wait 2 seconds before clearing so user can see success message

      return () => clearTimeout(timer);
    }
  }, [success, dispatch]);

  // Clear notifications after 5 seconds
  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        dispatch({ type: "farmer/postFarmerFailure", payload: null });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, success, dispatch]);

  return (
    <Container maxWidth="lg">
      <form onSubmit={handleSubmit}>
        <CoffeeForm
          formData={formData}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
        />
      </form>
    </Container>
  );
};

// ==================
// File Upload Placeholder
// ==================
const FileUpload = () => (
  <Box
    display="flex"
    justifyContent="center"
    alignItems="center"
    height="60vh"
    textAlign="center"
    p={3}
  >
    <Paper
      elevation={3}
      sx={{
        p: 4,
        bgcolor: "#f0f0f0",
        borderRadius: 2,
        maxWidth: 400,
        width: "100%",
      }}
    >
      <Typography variant="h6" gutterBottom>
        File Upload
      </Typography>
      <Typography variant="body1" color="text.secondary">
        🚧 This service is coming soon. Stay tuned!
      </Typography>
    </Paper>
  </Box>
);

// ==================
// Main Upload Tabs Layout
// ==================
const UploadTabs = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const { error, success } = useSelector((state) => state.farmer);

  return (
    <Box sx={styles.layoutContainer}>
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <Box sx={styles.mainContent}>
        {/* Tabs at the very top */}
        <Paper elevation={0} sx={styles.tabPaper}>
          <Tabs
            value={tabIndex}
            onChange={(e, newIndex) => setTabIndex(newIndex)}
            variant="fullWidth"
            sx={styles.tabs}
          >
            <Tab label="Form Upload" />
            <Tab label="File Upload" />
          </Tabs>
        </Paper>

        {/* Alerts */}
        <Box sx={styles.alertBox}>
          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              Farmer submitted successfully!
            </Alert>
          )}
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
        </Box>

        {/* Tab Content */}
        <Box sx={styles.contentWrapper}>
          {tabIndex === 0 && <FormUpload />}
          {tabIndex === 1 && <FileUpload />}
        </Box>
      </Box>
    </Box>
  );
};

export default UploadTabs;
