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
import { updateCoffee } from '../../store/slices/Coffee/coffeeActions';

const CatalogueModalSummary = ({
  open,
  onClose,
  groupedData = [],
  loading = false,
  onEdit = () => {},
  title = 'Catalogue Summary',
}) => {
  const dispatch = useDispatch();
  const [localRecords, setLocalRecords] = useState([]);
  const [feedback, setFeedback] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
  if (open && groupedData) {
    const serialized = JSON.stringify(groupedData);
    setLocalRecords(JSON.parse(serialized));
  }
}, [open, JSON.stringify(groupedData)]);

  const MILL_MAP = {
    1: "ICM", 2: "BU", 3: "HM", 4: "TY", 5: "IM", 6: "KF", 7: "RF",
    8: "TK", 9: "KM", 10: "LE", 11: "nan", 12: "KK", 13: "US", 14: "FH", 15: "GR",
  };

  const GRADE_ORDER = ['AA', 'AB', 'PB', 'C', 'E', 'TT', 'UG', 'UG1', 'UG2', 'UG3', 'UGL', 'UGMT'];

  const confirmCatalogue = async () => {
    for (const rec of localRecords) {
      const updatedRec = { ...rec, status: 'CATALOGUED', status_id: 2 };
      try {
        await dispatch(updateCoffee(updatedRec)).unwrap();
      } catch (err) {
        console.error(`Failed to update record ID ${rec.id}:`, err);
      }
    }

    setFeedback({ open: true, message: 'Records updated to CATALOGUED.', severity: 'success' });
  };

  const handleDelete = (rec) => {
    const updated = localRecords.filter((r) => r.id !== rec.id);
    setLocalRecords(updated);
    setFeedback({ open: true, message: 'Item removed.', severity: 'success' });
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
          {title}
          <IconButton onClick={onClose} size="small" sx={{ color: 'white' }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers sx={{ backgroundColor: '#f5f5f5' }}>
          <Button
            variant="outlined"
            onClick={confirmCatalogue}
            size="small"
            sx={{ fontSize: '0.7rem', backgroundColor: '#f0f0f0', color: '#121330', mb: 2 }}
          >
            Confirm Catalogue
          </Button>

          {loading ? (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
              <CircularProgress />
            </Box>
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
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {localRecords
                  .slice()
                  .sort((a, b) => {
                    const aIndex = GRADE_ORDER.indexOf(a.grade);
                    const bIndex = GRADE_ORDER.indexOf(b.grade);
                    return (aIndex === -1 ? Infinity : aIndex) - (bIndex === -1 ? Infinity : bIndex);
                  })
                  .map((rec, index) => (
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
                      <TableCell>
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
          )}
        </DialogContent>
      </Dialog>

      <Snackbar
        open={feedback.open}
        autoHideDuration={3000}
        onClose={() => setFeedback({ ...feedback, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setFeedback({ ...feedback, open: false })}
          severity={feedback.severity}
          sx={{ width: '100%' }}
        >
          {feedback.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default CatalogueModalSummary;
