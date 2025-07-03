import { Box, Typography, Grid, Divider, Button } from '@mui/material';
import React, { useState } from 'react';
import StockSummaryModal from './SummaryModal'; // Make sure path is correct

const SummaryBox = ({ data }) => {
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [summaryGroups, setSummaryGroups] = useState({});

  const totalBags = data.reduce((sum, row) => sum + (parseInt(row.bags) || 0), 0);
  const totalWeight = data.reduce((sum, row) => sum + (parseFloat(row.weight) || 0), 0);

  const gradeBreakdown = data.reduce((acc, row) => {
    const grade = row.grade || 'Unknown';
    const weight = parseFloat(row.weight) || 0;
    acc[grade] = (acc[grade] || 0) + weight;
    return acc;
  }, {});

  const handleShowModal = () => {
    const grouped = {};
    data.forEach((item) => {
      if (!grouped[item.mark]) grouped[item.mark] = [];
      grouped[item.mark].push(item);
    });
    setSummaryGroups(grouped);
    setShowSummaryModal(true);
  };

  return (
    <Box
      sx={{
        backgroundColor: '#121331',
        color: '#ffffff',
        p: 4,
        borderRadius: 2,
        mt: 2,
        mb: 2,
        maxWidth: 900,
        width: '100%',
        mx: 'auto',
      }}
    >
      <Typography variant="h6" gutterBottom align="center" sx={{ fontWeight: 600 }}>
        Stock Summary
      </Typography>

      <Grid container spacing={3} justifyContent="center" alignItems="center">
        <Grid item xs={6} md={3}>
          <Typography variant="subtitle2" gutterBottom>Total Bags</Typography>
          <Typography variant="body1">{totalBags}</Typography>
        </Grid>

        <Grid item xs={6} md={3}>
          <Typography variant="subtitle2" gutterBottom>Total Weight (kg)</Typography>
          <Typography variant="body1">{totalWeight.toFixed(0)}</Typography>
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography variant="subtitle2" gutterBottom>Weight Breakdown by Grade</Typography>
          <Divider sx={{ backgroundColor: '#ffffff20', mb: 1 }} />
          <Grid container spacing={1}>
            {Object.entries(gradeBreakdown).map(([grade, weight]) => (
              <Grid item xs={6} key={grade}>
                <Typography variant="caption">
                  <b style={{ color: "#fdd835" }}>{grade}:</b> {weight.toFixed(0)} kg
                </Typography>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>

      <Box mt={3} display="flex" justifyContent="center">
        <Button
          variant="outlined"
          onClick={handleShowModal}
          sx={{ color: '#fff', borderColor: '#fff', textTransform: 'none' }}
        >
          View Detailed Summary
        </Button>
      </Box>

      <StockSummaryModal
        open={showSummaryModal}
        onClose={() => setShowSummaryModal(false)}
        groupedData={summaryGroups}
      />
    </Box>
  );
};

export default SummaryBox;
