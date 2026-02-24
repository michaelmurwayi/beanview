import React, { useState, useEffect, useMemo } from 'react';
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
import PayoutUpload from '../components/payout/PayoutUpload';

const ViewCatalogue = () => {
  const dispatch = useDispatch();
  const { coffeeRecords } = useSelector((state) => state.coffee);

  const [season, setSeason] = useState('');
  const [saleNumber, setSaleNumber] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedGroupedRecords, setSelectedGroupedRecords] = useState([]);
  const [selectedSale, setSelectedSale] = useState('');

  // Fetch coffee records on mount
  useEffect(() => {
    dispatch(fetchCoffee());
  }, [dispatch]);

  // Merge bulk outturn records
  const mergeBulkOutturn = (records) => {
    const bulked = [];
    const groupedMap = new Map();
    const mergedRecords = [];

    records.forEach((record) => {
      const bulkoutturn = record.bulkoutturn?.trim();
      const grade = record.grade?.trim();

      if (!bulkoutturn) {
        bulked.push(record);
        return;
      }

      const key = `${bulkoutturn}_${grade}`;
      if (!groupedMap.has(key)) groupedMap.set(key, []);
      groupedMap.get(key).push(record);
    });

    groupedMap.forEach((recordsGroup, key) => {
      const [bulkoutturn, grade] = key.split('_');
      const totalWeight = recordsGroup.reduce((sum, r) => sum + parseFloat(r.weight || 0), 0);
      const bags = Math.floor(totalWeight / 50);
      const pockets = Math.round(totalWeight % 50);

      const base = recordsGroup[0];
      mergedRecords.push({
        ...base,
        outturn: bulkoutturn,
        mark: `${grade}/Bulk`,
        weight: totalWeight.toFixed(2),
        bags,
        pockets,
      });
    });

    return [...mergedRecords, ...bulked];
  };

  // Reset filters
  const handleResetFilters = () => {
    setSeason('');
    setSaleNumber('');
  };

  // Filter records based on season and sale number
  const filteredRecordsRaw = useMemo(() => {
    return coffeeRecords.filter((record) => {
      return (
        (season ? record.season === season : true) &&
        (saleNumber ? record.sale?.toString().includes(saleNumber) : true)
      );
    });
  }, [coffeeRecords, season, saleNumber]);

  // Merge bulk outturn after filtering
  const filteredRecords = useMemo(() => mergeBulkOutturn(filteredRecordsRaw), [filteredRecordsRaw]);

  // Open modal when a catalogue card is clicked
  const handleCardClick = (sale) => {
    const saleRecords = filteredRecords.filter((r) => r.sale === sale);
    setSelectedGroupedRecords(saleRecords);
    setSelectedSale(sale);
    setModalOpen(true);
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f4f6f8' }}>
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <Box sx={{ flex: 1, p: 4 }}>
        {/* Header */}
        <Paper
          elevation={3}
          sx={{
            borderRadius: 3,
            p: 4,
            mb: 4,
            background: 'linear-gradient(to right, #4CB8C4, #3CD3AD)',
            color: 'white',
            backgroundImage: `url("https://i.pinimg.com/736x/d1/73/b5/d173b5f9086434078208a8ecb43fef99.jpg")`,
            backgroundRepeat: 'repeat',
          }}
        >
          {/* Top row: title + upload */}
          <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" mb={3}>
            <Box>
              <Typography variant="h4" fontWeight="bold" sx={{ mb: 1 }}>
                Catalogue Guide
              </Typography>
              <Typography variant="body2" sx={{ color: '#f0f0f0' }}>
                View generated catalogue records, generate catalogue upload files and sale summaries.
              </Typography>
            </Box>
            <PayoutUpload />
          </Box>

          {/* Filters */}
          <Box display="flex" gap={2} alignItems="center" flexWrap="wrap">
            <TextField
              select
              label="Season"
              value={season}
              onChange={(e) => setSeason(e.target.value)}
              size="small"
              sx={{ backgroundColor: 'white', borderRadius: 1, minWidth: 150 }}
            >
              {['2024/2025'].map((option) => (
                <MenuItem key={option} value={option}>{option}</MenuItem>
              ))}
            </TextField>

            <TextField
              label="Sale Number"
              value={saleNumber}
              onChange={(e) => setSaleNumber(e.target.value)}
              size="small"
              sx={{ backgroundColor: 'white', borderRadius: 1 }}
            />

            <Button
              onClick={handleResetFilters}
              variant="contained"
              size="small"
              sx={{
                textTransform: 'none',
                fontWeight: 'bold',
                bgcolor: '#1976d2',
                '&:hover': { bgcolor: '#115293' },
              }}
            >
              Reset Filters
            </Button>
          </Box>
        </Paper>

        {/* Catalogue cards */}
        <Box>
          <CatalogueCardRow data={filteredRecords} onClick={handleCardClick} />
        </Box>

        {/* Summary Modal */}
        <CatalogueModalSummary
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          groupedData={selectedGroupedRecords}
          sale={selectedSale}
        />
      </Box>
    </Box>
  );
};

export default ViewCatalogue;