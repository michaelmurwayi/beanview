import { useState } from 'react';
import { Box, Tabs, Tab, Typography, Paper } from '@mui/material';
import Sidebar from '../components/sidebar/Sidebar';

const FormUpload = () => (
  <Box p={2}>
    <Typography variant="h6">Form Upload</Typography>
    {/* Your form fields go here */}
  </Box>
);

const FileUpload = () => (
  <Box p={2}>
    <Typography variant="h6">File Upload</Typography>
    {/* Your file input logic goes here */}
  </Box>
);

const UploadTabs = () => {
  const [tabIndex, setTabIndex] = useState(0);

  return (
    <Box display="flex" height="100vh" width="100vw" overflow="hidden" m={0} p={0}>
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
