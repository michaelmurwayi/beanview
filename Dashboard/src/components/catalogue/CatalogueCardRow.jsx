import React, { useState } from 'react';

import {
  Box,
  Typography,
  Paper,
  Chip,
  IconButton,
} from '@mui/material';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import CatalogueModalSummary from './CatalogueModalSummary';

const CatalogueCardRow = ({ data }) => {
  const [openModal, setOpenModal] = useState(false);
  const [selectedSale, setSelectedSale] = useState(null);
  const [groupedByMark, setGroupedByMark] = useState({});

  // Group sales by sale number
  const salesGrouped = data.reduce((acc, record) => {
    const sale = record.sale || 'No Sale';
    if (!acc[sale]) acc[sale] = [];
    acc[sale].push(record);
    return acc;
  }, {});

  const handleOpenModal = (sale) => {
    const records = salesGrouped[sale] || [];

    // Group by farmer.mark directly here
    const grouped = records.reduce((acc, record) => {
      const mark = record.farmer?.mark || 'No Mark';
      if (!acc[mark]) acc[mark] = [];
      acc[mark].push(record);
      return acc;
    }, {});
    console.log('Grouped by Mark for Sale', sale, grouped);
    setGroupedByMark(grouped);
    setSelectedSale(sale);
    setOpenModal(true);
  };

  const uniqueSales = Array.from(
    new Map(
      data
        .filter((item) => item.sale && item.season)
        .map((item) => [item.sale, item])
    )
  )
    .map(([sale, record]) => ({
      sale,
      season: record.season,
    }))
    .sort((a, b) => Number(b.sale) - Number(a.sale)); // Sort by sale descending

  return (
    <Box sx={{ mt: 4 }}>
      {uniqueSales.map(({ sale, season }) => (
        <Paper
          key={sale}
          elevation={2}
          onClick={() => handleOpenModal(sale)}
          sx={{
            display: 'flex',
            alignItems: 'center',
            px: 3,
            py: 2,
            mb: 2,
            borderRadius: 2,
            cursor: 'pointer',
            backgroundColor: '#fff',
            borderLeft: '6px solid #2196f3',
            transition: 'box-shadow 0.3s ease',
            '&:hover': { boxShadow: 4 },
          }}
        >
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="subtitle1" fontWeight="bold" color="primary">
              Sale {sale}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <Chip
              label={`Season ${season}`}
              size="small"
              sx={{
                backgroundColor: '#e3f2fd',
                color: '#0d47a1',
                fontSize: '0.75rem',
                fontWeight: 600,
              }}
            />
            <IconButton size="small" sx={{ color: '#888' }}>
              <ChevronRightIcon />
            </IconButton>
          </Box>
        </Paper>
      ))}

      <CatalogueModalSummary
        open={openModal}
        onClose={() => setOpenModal(false)}
        groupedData={groupedByMark} // Pass grouped by mark
        sale={selectedSale}
        title={`Catalogue Summary for Sale ${selectedSale}`}
      />
    </Box>
  );
};

export default CatalogueCardRow;