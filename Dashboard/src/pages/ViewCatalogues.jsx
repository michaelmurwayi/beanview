import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  ToggleButton,
  ToggleButtonGroup,
  TextField,
  MenuItem,
  
} from '@mui/material';
import Sidebar from '../components/sidebar/Sidebar';

const ViewCatalogue = () => {
  const [collection, setCollection] = useState('spark');
  const [season, setSeason] = useState('');
  const [saleNumber, setSaleNumber] = useState('');

  const handleChange = (event, newCollection) => {
    if (newCollection !== null) setCollection(newCollection);
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh', bgcolor: '#f4f6f8' }}>
      {/* Sidebar */}
      <Box
        sx={{
          width: { xs: '100%', sm: '30%', md: '25%', lg: '18%' },
          maxWidth: 280,
          bgcolor: '#121330',
          height: '100%',
        }}
      >
        <Sidebar />
      </Box>

      {/* Main Content */}
      <Box sx={{ flex: 1, p: 4 }}>
        <Paper
          elevation={3}
          sx={{
            borderRadius: 3,
            p: 4,
            background: 'linear-gradient(to right, #4CB8C4, #3CD3AD)',
            color: 'white',
            minHeight: '400px',
            backgroundImage: `url("https://i.pinimg.com/736x/d1/73/b5/d173b5f9086434078208a8ecb43fef99.jpg")`,
            backgroundRepeat: 'repeat',
          }}
        >
          
          <Typography variant="h4" fontWeight="bold" sx={{ mb: 2 }}>
            Catalogue Guide
          </Typography>

          
          <Typography variant="body2" sx={{ color: '#f0f0f0', mb: 4 }}>
            View generated catalogue records, generate catalogue upload files and sale summaries.
          </Typography>
          <Grid container spacing={2} sx={{ mb: 4 }}>
            <Box display="flex" gap={2} alignItems="center" mb={4}>
              <TextField
                select
                label="Season"
                variant="outlined"
                size="small"
                value={season}
                onChange={(e) => setSeason(e.target.value)}
                sx={{ backgroundColor: 'white', borderRadius: 1, minWidth: 150 }}
              >
                {['2023/24', '2022/23', '2021/22'].map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                label="Sale Number"
                variant="outlined"
                size="small"
                value={saleNumber}
                onChange={(e) => setSaleNumber(e.target.value)}
                sx={{ backgroundColor: 'white', borderRadius: 1 }}
              />
            </Box>
            </Grid>
         
        </Paper>
      </Box>
    </Box>
  );
};

export default ViewCatalogue;
