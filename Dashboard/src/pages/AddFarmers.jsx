import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import {
  Box,
  Tabs,
  Tab,
  Typography,
  Paper,
  Container,
  Button,
  Alert,
} from '@mui/material';
import Sidebar from '../components/sidebar/Sidebar';
import CoffeeForm from '../components/farmerupload/UploadForm'; // Assuming this is your form
import { updateFarmerFormField} from '../store/slices/Farmers/farmerSlice'; // Adjust the import path as needed
import { submitFarmer } from '../store/slices/Farmers/farmerActions';

const FormUpload = () => {
  const formData = useSelector((state) => state.farmer.FarmerUploadFormData);
  console.log('Form Data:', formData);
  const { error, success } = useSelector((state) => state.farmer);

  const dispatch = useDispatch();
  

  
  const handleChange = (e) => {
    const { name, value } = e.target;
    dispatch(updateFarmerFormField({ field: name, value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted with:', formData);
    // Dispatch submit action here if needed
    dispatch(submitFarmer(formData));
  };

   // Clear error after 5s
   useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        dispatch(postFarmerFailure(null));
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, success, dispatch]);


  return (
    <Box p={2}>
      <Container sx={{ mt: 4 }}>
        <form onSubmit={handleSubmit}>
          <CoffeeForm formData={formData} handleChange={handleChange} handleSubmit={handleSubmit} />
          {/* Submit button removed */}
        </form>
      </Container>
    </Box>
  );
};


const FileUpload = () => (
  <Box p={2} display="flex" justifyContent="center" alignItems="center" height="100vh">
    <Paper
      elevation={3}
      sx={{
        p: 4,
        bgcolor: '#f0f0f0',
        borderRadius: 2,
        textAlign: 'center',
        maxWidth: 400,
        width: '100%',
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


const UploadTabs = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const { error, success } = useSelector((state) => state.farmer);

  return (
    <Box display="flex" height="100%" width="100%" sx={{ overflow: 'hidden auto' }} m={0} p={0}>
      {/* Sidebar */}
      <Box width="250px" bgcolor="#121330">
        <Sidebar />
      </Box>

      {/* Main Content */}
      <Box flex={1} display="flex" flexDirection="column">
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

        <Paper
          elevation={1}
          sx={{
            height: '100%',
            width: '100%',
            borderRadius: 0,
            backgroundColor: '#f9f9fb',
          }}
        >
          <Tabs
            value={tabIndex}
            onChange={(e, newIndex) => setTabIndex(newIndex)}
            variant="fullWidth"
            sx={{
              backgroundColor: '#ffffff',
              borderBottom: '1px solid #e0e0e0',
              '& .MuiTab-root': {
                textTransform: 'none',
                fontWeight: 500,
                fontSize: '1rem',
                borderRadius: '8px 8px 0 0',
                mx: 0.5,
                transition: 'all 0.2s ease',
                color: '#555',
                '&:hover': {
                  backgroundColor: '#f0f0f5',
                },
              },
              '& .Mui-selected': {
                backgroundColor: '#e7f0fa',
                color: '#1976d2',
              },
              '& .MuiTabs-indicator': {
                height: 3,
                backgroundColor: '#90caf9',
                borderRadius: 2,
              },
            }}
          >
            <Tab label="Form Upload" />
            <Tab label="File Upload" />
          </Tabs>

          <Box p={2}>
            {tabIndex === 0 && <FormUpload />}
            {tabIndex === 1 && <FileUpload />}
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default UploadTabs;
