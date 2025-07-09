import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  MenuItem,
  Button,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import Sidebar from '../components/sidebar/Sidebar';
import CatalogueCardRow from '../components/catalogue/CatalogueCardRow';
import { fetchCoffee } from '../store/slices/Coffee/coffeeActions';

const ViewCatalogue = () => {
  const dispatch = useDispatch();
  const { coffeeRecords } = useSelector((state) => state.coffee);

  const [season, setSeason] = useState('');
  const [saleNumber, setSaleNumber] = useState('');

  useEffect(() => {
    dispatch(fetchCoffee());
  }, [dispatch]);

  const handleResetFilters = () => {
    setSeason('');
    setSaleNumber('');
  };

  const filteredRecords = coffeeRecords.filter((record) => {
    return (
      (season ? record.season === season : true) &&
      (saleNumber ? record.sale?.toString().includes(saleNumber) : true)
    );
  });

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f4f6f8' }}>
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
        {/* Header Paper */}
        <Paper
          elevation={3}
          sx={{
            borderRadius: 3,
            p: 4,
            background: 'linear-gradient(to right, #4CB8C4, #3CD3AD)',
            color: 'white',
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

          <Box display="flex" gap={2} alignItems="center" flexWrap="wrap">
            <TextField
              select
              label="Season"
              placeholder="Select Season"
              variant="outlined"
              size="small"
              value={season}
              onChange={(e) => setSeason(e.target.value)}
              sx={{
                backgroundColor: 'white',
                borderRadius: 1,
                minWidth: 150,
                '& .MuiInputBase-input::placeholder': {
                  color: '#333',
                  fontWeight: 600,
                  opacity: 1,
                },
              }}
            >
              {['2024/2025'].map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              label="Sale Number"
              placeholder=""
              variant="outlined"
              size="small"
              value={saleNumber}
              onChange={(e) => setSaleNumber(e.target.value)}
              sx={{
                backgroundColor: 'white',
                borderRadius: 1,
                '& .MuiInputBase-input::placeholder': {
                  color: '#333',
                  fontWeight: 600,
                  opacity: 1,
                },
              }}
            />

            <Button
              onClick={handleResetFilters}
              variant="contained"
              size="small"
              sx={{
                textTransform: 'none',
                fontWeight: 'bold',
                bgcolor: '#1976d2',
                color: 'white',
                '&:hover': {
                  bgcolor: '#115293',
                },
              }}
            >
              Reset Filters
            </Button>
          </Box>
        </Paper>

        {/* Catalogue cards */}
        <Box mt={4}>
          <CatalogueCardRow data={filteredRecords} onCardClick={(sale) => console.log('Clicked sale:', sale)} />
        </Box>
      </Box>
    </Box>
  );
};

export default ViewCatalogue;
