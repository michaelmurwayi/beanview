import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Box,
  Divider,
  CircularProgress,
  Button,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useDispatch } from 'react-redux';
import { generateSummaryFile } from '../../store/slices/Coffee/coffeeActions';

const StockSummaryModal = ({ open, onClose, groupedData = {}, loading = false }) => {
  const dispatch = useDispatch();

  // Mapping mill codes to short names
  const MILL_MAP = {
    1: 'ICM',
    2: 'BU',
    3: 'HM',
    4: 'TY',
    5: 'IM',
    6: 'KF',
    7: 'RF',
    8: 'TK',
    9: 'KM',
    10: 'LE',
    11: 'nan',
    12: 'KK',
    13: 'US',
    14: 'FH',
    15: 'GR',
  };

  // Export handler
  const handleExport = () => {
    const summaries = Object.entries(groupedData).map(([growerCode, records]) => ({
      growerCode,
      records,
    }));
    console.log('Exporting summaries:', summaries);
    dispatch(generateSummaryFile(summaries));
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xl" fullWidth>
      {/* Modal header */}
      <DialogTitle
        sx={{
          bgcolor: '#121330',
          color: '#fff',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        Stock Summary Preview
        <IconButton onClick={onClose} size="small" sx={{ color: 'white' }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ backgroundColor: '#f5f5f5' }}>
        {/* Export Button */}
        <Button
          variant="outlined"
          onClick={handleExport}
          size="small"
          sx={{ fontSize: '0.7rem', backgroundColor: '#f0f0f0', color: '#121330', mb: 2 }}
        >
          Export Excel
        </Button>

        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
            <CircularProgress />
          </Box>
        ) : Object.keys(groupedData).length === 0 ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
            <Typography>No records to display</Typography>
          </Box>
        ) : (
          // Render grouped tables
          Object.entries(groupedData).map(([growerCode, records]) => (
            <Box key={growerCode} mb={4}>
              {/* Header shows actual farmer mark */}
              <Typography variant="h6" sx={{ color: '#1976d2', fontWeight: 600 }}>
                {records[0]?.farmer?.mark || growerCode}
              </Typography>

              <Table size="small" sx={{ mt: 1, backgroundColor: '#fff' }}>
                <TableHead>
                  <TableRow>
                    <TableCell>Outturn</TableCell>
                    <TableCell>Bulkoutturn</TableCell>
                    <TableCell>Mark</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Grade</TableCell>
                    <TableCell>Bags</TableCell>
                    <TableCell>Pockets</TableCell>
                    <TableCell>Weight</TableCell>
                    <TableCell>Sale</TableCell>
                    <TableCell>Season</TableCell>
                    <TableCell>Certificate</TableCell>
                    <TableCell>Mill</TableCell>
                    <TableCell>Warehouse</TableCell>
                    <TableCell>Price</TableCell>
                    <TableCell>Buyer</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {records.map((rec) => (
                    <TableRow key={rec.id}>
                      <TableCell>{rec.outturn}</TableCell>
                      <TableCell>{rec.bulkoutturn}</TableCell>
                      <TableCell>{rec.farmer?.mark}</TableCell> {/* Correct mark */}
                      <TableCell>{rec.type}</TableCell>
                      <TableCell>{rec.grade}</TableCell>
                      <TableCell>{rec.bags}</TableCell>
                      <TableCell>{rec.pockets}</TableCell>
                      <TableCell>{rec.weight}</TableCell>
                      <TableCell>{rec.sale}</TableCell>
                      <TableCell>{rec.season}</TableCell>
                      <TableCell>{rec.certificate}</TableCell>
                      <TableCell>{MILL_MAP[rec.mill] || rec.mill}</TableCell>
                      <TableCell>{rec.warehouse}</TableCell>
                      <TableCell>{rec.price}</TableCell>
                      <TableCell>{rec.buyer}</TableCell>
                      <TableCell>{rec.status}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <Divider sx={{ mt: 2 }} />
            </Box>
          ))
        )}
      </DialogContent>
    </Dialog>
  );
};

export default StockSummaryModal;