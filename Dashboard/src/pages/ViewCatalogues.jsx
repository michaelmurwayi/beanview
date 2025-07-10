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
import CatalogueModalSummary from '../components/catalogue/CatalogueModalSummary';
import { fetchCoffee } from '../store/slices/Coffee/coffeeActions';

const ViewCatalogue = () => {
  const dispatch = useDispatch();
  const { coffeeRecords } = useSelector((state) => state.coffee);

  const [season, setSeason] = useState('');
  const [saleNumber, setSaleNumber] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedGroupedRecords, setSelectedGroupedRecords] = useState([]);
  const [selectedSale, setSelectedSale] = useState('');

  // Fetch coffee records when component mounts
  useEffect(() => {
    dispatch(fetchCoffee());
  }, [dispatch]);

  // Log grouped records when they change
  useEffect(() => {
    console.log('Updated selectedGroupedRecords:', selectedGroupedRecords);
    
  }, [selectedGroupedRecords]);

  // Optional: log when modal opens
  useEffect(() => {
    if (modalOpen) {
      console.log('Modal opened for sale:', selectedSale);
    }
  }, [modalOpen]);

  // Reset filters
  const handleResetFilters = () => {
    setSeason('');
    setSaleNumber('');
  };

  // Apply filters to coffee records
  const filteredRecords = coffeeRecords.filter((record) => {
    return (
      (season ? record.season === season : true) &&
      (saleNumber ? record.sale?.toString().includes(saleNumber) : true)
    );
  });

  // When a card is clicked, open the modal and set grouped records
  const handleCardClick = (sale) => {
    console.log("we are here")
    const saleRecords = filteredRecords.filter((r) => r.sale === sale);
    setSelectedGroupedRecords(saleRecords);
    setSelectedSale(sale);
    setModalOpen(true);
  };

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
              placeholder="Enter Sale"
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
          <CatalogueCardRow
            data={filteredRecords}
            onClick={handleCardClick}
          />
        </Box>
      </Box>

      {/* Summary Modal */}
      <CatalogueModalSummary
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        groupedData={selectedGroupedRecords}
        title={`Catalogue Summary for Sale ${selectedSale}`}
      />
    </Box>
  );
};

export default ViewCatalogue;
