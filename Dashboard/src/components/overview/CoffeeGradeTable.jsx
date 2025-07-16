import React from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
} from '@mui/material';

const CoffeeGradeTable = ({ coffeeRecords = [] }) => {
  const gradeSummary = {};

  // Aggregate coffee data by grade
  coffeeRecords.forEach(record => {
    const { grade, weight, bags } = record;
    if (!grade) return;

    if (!gradeSummary[grade]) {
      gradeSummary[grade] = { totalWeight: 0, totalBags: 0 };
    }

    gradeSummary[grade].totalWeight += parseFloat(weight) || 0;
    gradeSummary[grade].totalBags += parseInt(bags) || 0;
  });

  const rows = Object.entries(gradeSummary).map(([grade, values]) => ({
    grade,
    totalWeight: values.totalWeight,
    totalBags: values.totalBags,
  }));

  return (
    <Box sx={{ width: '100%', height: 'auto', mt: 4 }}>
      <TableContainer
        component={Paper}
        elevation={4}
        sx={{
          borderRadius: 3,
          overflow: 'hidden',
        }}
      >
        <Typography
          variant="h6"
          sx={{
            p: 2,
            bgcolor: '#121330',
            color: '#fff',
            fontWeight: 'bold',
          }}
        >Grade Breakdown
        </Typography>

        <Table size="small">
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f0f0f0' }}>
              <TableCell
                sx={{
                  fontWeight: 'bold',
                  width: '120px',
                  whiteSpace: 'nowrap',
                }}
              >
                Grade
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                Total Weight (kg)
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                Total Bags
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, index) => (
              <TableRow
                key={row.grade}
                sx={{
                  backgroundColor: index % 2 === 0 ? '#fff' : '#f9f9f9',
                  '&:hover': {
                    backgroundColor: '#f1f1f1',
                  },
                }}
              >
                <TableCell>{row.grade}</TableCell>
                <TableCell align="right">
                  {row.totalWeight.toLocaleString()}
                </TableCell>
                <TableCell align="right">
                  {row.totalBags.toLocaleString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default CoffeeGradeTable;
