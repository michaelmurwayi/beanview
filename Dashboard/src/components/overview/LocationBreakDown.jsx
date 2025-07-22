import React, { useMemo, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
} from '@mui/material';

const CoffeeLocationBreakdownTable = ({ filteredRecords, onUniqueLocationsExtracted }) => {
  const breakdown = useMemo(() =>
    filteredRecords.reduce((acc, record) => {
      const location = record?.farmer?.County || 'Unknown';
      if (!acc[location]) {
        acc[location] = { bags: 0, weight: 0 };
      }
      acc[location].bags += record.bags || 0;
      acc[location].weight += parseFloat(record.weight) || 0;
      return acc;
    }, {}), [filteredRecords]);

  const locations = Object.keys(breakdown);

  useEffect(() => {
    if (typeof onUniqueLocationsExtracted === 'function') {
      onUniqueLocationsExtracted(locations);
    }
  }, [locations, onUniqueLocationsExtracted]);

  const rows = locations.map(location => ({
    location,
    bags: breakdown[location].bags,
    weight: breakdown[location].weight,
  }));

  return (
    <Paper elevation={3} sx={{ p: 2, mt: 2, width: '50%', height: '50vh', display: 'flex', flexDirection: 'column' }}>
      <Typography
        variant="h6"
        gutterBottom
        sx={{ backgroundColor: '#121330', color: '#fff', px: 2, py: 1, borderRadius: 1 }}
      >
        Coffee Breakdown by Location
      </Typography>

      <TableContainer sx={{ flex: 1, overflowY: 'auto' }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#121330' }}>
              <TableCell sx={{ color: '#121330' }}><strong>Location (County)</strong></TableCell>
              <TableCell align="right" sx={{ color: '#121330' }}><strong>Bags</strong></TableCell>
              <TableCell align="right" sx={{ color: '#121330' }}><strong>Total Weight (kg)</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.length > 0 ? (
              rows.map((row) => (
                <TableRow key={row.location}>
                  <TableCell>{row.location}</TableCell>
                  <TableCell align="right">{row.bags}</TableCell>
                  <TableCell align="right">{row.weight.toFixed(2)}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} align="center">
                  No data available.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default CoffeeLocationBreakdownTable;
