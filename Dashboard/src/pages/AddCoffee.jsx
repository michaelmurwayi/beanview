import { useState, useEffect } from "react";
import {
  Box,
  Tabs,
  Tab,
  Typography,
  Paper,
  Container,
  Alert,
  Button,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Sidebar from "../components/sidebar/Sidebar";
import CoffeeUploadForm from "../components/coffeeupload/UploadForm";
import UploadFile from "../components/coffeeupload/UploadFile";
import {
  submitCoffee,
  fetchCoffee,
} from "../store/slices/Coffee/coffeeActions";
import { globalInitialState } from "../store/initialState";

const initialCoffeeForm = globalInitialState.coffee.CoffeeUploadFormData;

/** ---------- FORM UPLOAD ---------- **/
const FormUpload = () => {
  const [formData, setFormData] = useState(initialCoffeeForm);
  const dispatch = useDispatch();
  const { coffeeRecords, success, error } = useSelector((state) => state.coffee);

  // Fetch coffee records on mount
  useEffect(() => {
    dispatch(fetchCoffee());
  }, [dispatch]);

  // Extract unique marks
  const uniqueMarks = [
    ...new Set(coffeeRecords.map((record) => record.mark).filter(Boolean)),
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log("Updating field:", name, "with value:", value); // Debug log

    setFormData((prev) => ({
      ...prev,
      [name]: isNaN(value) || value === "" ? value : Number(value),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(submitCoffee(formData)).unwrap();

      // Reset form after successful submission
      setFormData(initialCoffeeForm);

      // Refresh the coffee records list
      dispatch(fetchCoffee());
    } catch (err) {
      console.error("Coffee submission failed:", err);
    }
  };


  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      {/* Alerts */}
      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Coffee record saved successfully.
        </Alert>
      )}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error || "An error occurred while saving coffee record."}
        </Alert>
      )}

      {/* Coffee Form */}
      <form onSubmit={handleSubmit}>
        <CoffeeUploadForm
          formData={formData}
          handleChange={handleChange}
          marks={uniqueMarks} // Pass unique marks to form
        />

        {/* Submit Button */}
        <Box display="flex" justifyContent="center" mt={4}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            type="submit"
            sx={{
              px: 4,
              py: 1.5,
              fontSize: "1rem",
              borderRadius: 2,
            }}
          >
            Submit
          </Button>
        </Box>
      </form>
    </Container>
  );
};

/** ---------- FILE UPLOAD ---------- **/
const FileUpload = () => {
  const { success, error } = useSelector((state) => state.coffee);

  const handleFileSelect = (file) => {
    console.log("Selected file:", file);
    // TODO: Implement file upload handling
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4, textAlign: "center" }}>
      {/* Alerts */}
      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Coffee file uploaded successfully.
        </Alert>
      )}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error || "An error occurred while uploading the file."}
        </Alert>
      )}

      <Typography
        variant="h5"
        sx={{
          color: "#121330",
          mb: 3,
          fontWeight: "bold",
          textAlign: "center",
        }}
      >
        Coffee File Upload
      </Typography>

      <Paper
        elevation={3}
        sx={{
          p: 4,
          bgcolor: "#f9f9fb",
          borderRadius: 3,
          maxWidth: 400,
          mx: "auto",
        }}
      >
        <UploadFile
          sheetNames={["Sheet1", "Sheet2"]}
          selectedSheet="Sheet1"
          onFileSelect={handleFileSelect}
        />
      </Paper>
    </Container>
  );
};

/** ---------- MAIN UPLOAD TABS ---------- **/
const UploadCoffeeTabs = () => {
  const [tabIndex, setTabIndex] = useState(0);

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#f9f9fb" }}>
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          pl: { xs: 2, sm: 3, md: 5 },
          pr: 0,
        }}
      >
        {/* Tabs Header */}
        <Paper
          elevation={1}
          sx={{
            backgroundColor: "#fff",
            borderBottom: "1px solid #e0e0e0",
            mb: 3,
          }}
        >
          <Tabs
            value={tabIndex}
            onChange={(e, newIndex) => setTabIndex(newIndex)}
            variant="fullWidth"
            sx={{
              "& .MuiTab-root": {
                textTransform: "none",
                fontWeight: 500,
                fontSize: "1rem",
                color: "#555",
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
              },
            }}
          >
            <Tab label="Form Upload" />
            <Tab label="File Upload" />
          </Tabs>
        </Paper>

        {/* Tab Content */}
        <Box
          sx={{
            flex: 1,
            overflowY: "auto",
            p: { xs: 2, sm: 3 },
            backgroundColor: "#f9f9fb",
          }}
        >
          {tabIndex === 0 && <FormUpload />}
          {tabIndex === 1 && <FileUpload />}
        </Box>
      </Box>
    </Box>
  );
};

export default UploadCoffeeTabs;
