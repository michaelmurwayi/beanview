import React from 'react';
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

const CoffeeLocationBreakdownTable = ({ filteredRecords }) => {
  // Aggregate totals by county
  const breakdown = filteredRecords.reduce((acc, record) => {
    const location = record?.farmer?.county || 'Unknown';
    if (!acc[location]) {
      acc[location] = { bags: 0, weight: 0 };
    }
    acc[location].bags += record.bags || 0;
    acc[location].weight += parseFloat(record.weight) || 0;
    return acc;
  }, {});

  // Extract unique locations
  const locations = Object.keys(breakdown);

  // Convert to row format
  const rows = locations.map(location => ({
    location,
    bags: breakdown[location].bags,
    weight: breakdown[location].weight,
  }));

  return (
    <Paper elevation={3} sx={{ p: 2, mt: 2 }}>
      <Typography variant="h6" gutterBottom>
        Coffee Breakdown by Location
      </Typography>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Location (County)</strong></TableCell>
              <TableCell align="right"><strong>Bags</strong></TableCell>
              <TableCell align="right"><strong>Total Weight (kg)</strong></TableCell>
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
