import { useState, useEffect } from 'react';
import {
  Box, Tabs, Tab, Typography, Paper, Container, Button, Alert, TextField
} from '@mui/material';
import Sidebar from '../components/sidebar/Sidebar';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { submitCoffee, fetchCoffee } from '../store/slices/Coffee/coffeeActions';
import CoffeeUploadForm from '../components/coffeeupload/UploadForm'; // Adjust the import path as needed



const FormUpload = () => {
  const formData = useSelector((state) => state.coffee.CoffeeUploadFormData);
  const dispatch = useDispatch();
  const { success, error } = useSelector((state) => state.coffee);

  const handleChange = (e) => {
    const { name, value } = e.target;
    dispatch({
      type: 'coffee/updateCoffeeFormField',
      payload: { field: name, value }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const resultAction = await dispatch(submitCoffee(formData));
    if (resultAction.type.includes('fulfilled')) {
      toast.success('Coffee submitted!');
      dispatch({ type: 'coffee/resetCoffeeForm' });
      dispatch(fetchCoffee());
    } else {
      toast.error('Submit failed');
    }
  };

  return (
    <Container sx={{ mt: 4 }}>
      {success && <Alert severity="success">Coffee submitted successfully</Alert>}
      {error && <Alert severity="error">{error}</Alert>}
      <CoffeeUploadForm
        formData={formData}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
    />
    </Container>
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
        🚧 This feature is coming soon.
      </Typography>
    </Paper>
  </Box>
);

const UploadCoffeeTabs = () => {
  const [tabIndex, setTabIndex] = useState(0);

  return (
    <Box display="flex" height="100%" width="100%" sx={{ overflow: 'hidden auto' }}>
      {/* Sidebar */}
      <Box width="250px" bgcolor="#121330">
        <Sidebar />
      </Box>

      {/* Main Content */}
      <Box flex={1} display="flex" flexDirection="column">
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

export default UploadCoffeeTabs;
