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
  Snackbar,
  Alert,
} from '@mui/material';
import { useDispatch } from 'react-redux';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useEffect, useState } from 'react';
import { generateSummaryFile } from '../../store/slices/Coffee/coffeeActions';

const CatalogueSummary = ({
  open,
  onClose,
  groupedData,
  loading,
  onEdit = () => {},
}) => {
  const dispatch = useDispatch();
  const [localGroupedData, setLocalGroupedData] = useState({});
  const [feedback, setFeedback] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    if (open && groupedData) {
      setLocalGroupedData(JSON.parse(JSON.stringify(groupedData))); // Deep clone
    }
  }, [open, groupedData]);

  const MILL_MAP = {
    1: "ICM", 2: "BU", 3: "HM", 4: "TY", 5: "IM", 6: "KF", 7: "RF",
    8: "TK", 9: "KM", 10: "LE", 11: "nan", 12: "KK", 13: "US", 14: "FH", 15: "GR",
  };

  const handleExport = () => {
    const summaries = Object.entries(localGroupedData).map(([mark, records]) => ({
      mark,
      records,
    }));
    dispatch(generateSummaryFile(summaries));
  };

  const handleDelete = (rec) => {
    if (!rec?.id) return;
    if (window.confirm('Are you sure you want to remove this item from catalogue?')) {
      const updated = { ...localGroupedData };

      Object.entries(updated).forEach(([group, records]) => {
        updated[group] = records
          .map(r => r.id === rec.id ? { ...r, sale: '' } : r)
          .filter(r => r.id !== rec.id);
      });

      setLocalGroupedData(updated);
      setFeedback({ open: true, message: 'Item removed from catalogue.', severity: 'success' });
    }
  };

  return (
    <>
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
          Catalogue Preview
          <IconButton onClick={onClose} size="small" sx={{ color: 'white' }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers sx={{ backgroundColor: '#f5f5f5' }}>
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
          ) : (
            Object.entries(localGroupedData).map(([mark, records]) => (
              <Box key={mark} mb={4}>
                <Typography variant="h6" sx={{ color: '#1976d2', fontWeight: 600 }}>
                  {mark}
                </Typography>
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
                      <TableCell>Actions</TableCell>
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
                        <TableCell sx={{ whiteSpace: 'nowrap' }}>
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => onEdit(rec)}
                            sx={{ mr: 1 }}
                          >
                            <EditIcon fontSize="inherit" />
                          </IconButton>
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleDelete(rec)}
                          >
                            <DeleteIcon fontSize="inherit" />
                          </IconButton>
                        </TableCell>
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

      <Snackbar
        open={feedback.open}
        autoHideDuration={3000}
        onClose={() => setFeedback({ ...feedback, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setFeedback({ ...feedback, open: false })} severity={feedback.severity}>
          {feedback.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default CatalogueSummary;
