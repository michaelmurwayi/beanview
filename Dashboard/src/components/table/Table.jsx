import React from 'react';
import {
  Table as MuiTable,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  CircularProgress,
} from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

const formatCellValue = (value) => {
  if (value === null || value === undefined) return '--';
  if (typeof value === 'object') return JSON.stringify(value); // Safely show objects
  return String(value); // Ensures it's renderable
};

const Table = ({ data = [], columns = [], loading, error }) => {
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" p={3}>
        <Typography color="error" variant="h6">
          ❌ Failed to load data
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {error}
        </Typography>
      </Box>
    );
  }

  const hasData = Array.isArray(data) && data.length > 0;

  return (
    <TableContainer component={Paper} elevation={2} sx={{ height: '100%', p: 2 }}>
      {hasData ? (
        <MuiTable>
          <TableHead>
            <TableRow>
              {columns.map((col) => (
                <TableCell key={col.field} sx={{ fontWeight: 'bold', backgroundColor: '#f1f5f9' }}>
                  {col.headerName}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row, idx) => (
              <TableRow key={idx}>
                {columns.map((col) => (
                  <TableCell key={col.field}>
                    {formatCellValue(row[col.field])}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </MuiTable>
      ) : (
        <Box
          height="100%"
          display="flex"
          alignItems="center"
          justifyContent="center"
          textAlign="center"
          flexDirection="column"
          sx={{ bgcolor: '#f5f5f5', borderRadius: 2, p: 4 }}
        >
          <InfoOutlinedIcon sx={{ fontSize: 48, color: '#999' }} />
          <Typography variant="h6" color="textSecondary" mt={1}>
            No information to display
          </Typography>
          <Typography variant="body2" color="text.secondary" maxWidth={400}>
            🤷‍♂️ It seems there’s currently no data available. Please check again later or contact support.
          </Typography>
        </Box>
      )}
    </TableContainer>
  );
};

export default Table;
