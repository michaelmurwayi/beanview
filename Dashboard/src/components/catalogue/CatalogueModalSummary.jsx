import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Box,
  Typography,
  IconButton,
  Divider,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const MILL_MAP = {
  1: 'ICM', 2: 'BU', 3: 'HM', 4: 'TY', 5: 'IM', 6: 'KF',
  7: 'RF', 8: 'TK', 9: 'KM', 10: 'LE', 11: 'nan', 12: 'KK',
  13: 'US', 14: 'FH', 15: 'GR',
};

const CatalogueModalSummary = ({ open, onClose, records = [], title = '' }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xl" fullWidth>
      <DialogTitle
        sx={{
          bgcolor: '#121330',
          color: '#fff',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        {title}
        <IconButton onClick={onClose} size="small" sx={{ color: 'white' }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ backgroundColor: '#f5f5f5' }}>
        {records.length === 0 ? (
          <Typography>No records available for this sale.</Typography>
        ) : (
          <Table size="small" sx={{ mt: 1, backgroundColor: '#fff' }}>
            <TableHead>
              <TableRow>
                <TableCell>Lot</TableCell>
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
              {records.map((rec, index) => (
                <TableRow key={rec.id || index}>
                  <TableCell>{7301 + index}</TableCell>
                  <TableCell>{rec.outturn}</TableCell>
                  <TableCell>{rec.bulkoutturn}</TableCell>
                  <TableCell>{rec.mark}</TableCell>
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
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CatalogueModalSummary;
