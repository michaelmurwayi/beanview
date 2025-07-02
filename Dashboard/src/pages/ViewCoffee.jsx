import { useEffect, useState } from 'react';
import {
  Grid,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Snackbar,
  Alert,
  Paper,
  MenuItem,
} from '@mui/material';
import Sidebar from '../components/sidebar/Sidebar';
import Table from '../components/table/CoffeeTable';
import {
  fetchCoffee,
  updateCoffee,
  deleteCoffee,
} from '../store/slices/Coffee/coffeeActions';
import { useDispatch, useSelector } from 'react-redux';
import Summary from '../components/summary/Summary'; // Adjust the import path as needed

const ViewCoffee = () => {
  const dispatch = useDispatch();
  const { coffeeRecords: coffee, loading, error } = useSelector((state) => state.coffee);
  const [selectedRecord, setSelectedRecord] = useState({});
  const [showEditModal, setShowEditModal] = useState(false);
  const [feedback, setFeedback] = useState({ open: false, message: '', severity: 'success' });

  const [filters, setFilters] = useState({ grade: '', mark: '', status_id: '', outturn: '' });

  useEffect(() => {
    dispatch(fetchCoffee());
  }, [dispatch]);

  const handleEditClick = (record) => {
    setSelectedRecord({ ...record });
    setShowEditModal(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setSelectedRecord((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    try {
      await dispatch(updateCoffee(selectedRecord)).unwrap();
      setFeedback({ open: true, message: 'Record updated successfully.', severity: 'success' });
      setShowEditModal(false);
      dispatch(fetchCoffee());
    } catch (err) {
      setFeedback({ open: true, message: 'Failed to update record.', severity: 'error' });
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      try {
        await dispatch(deleteCoffee(id)).unwrap();
        setFeedback({ open: true, message: 'Record deleted successfully.', severity: 'success' });
        dispatch(fetchCoffee());
      } catch (error) {
        setFeedback({ open: true, message: 'Failed to delete record.', severity: 'error' });
      }
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const resetFilters = () => {
    setFilters({ grade: '', mark: '', status_id: '', outturn: '' });
  };

  const filteredData = coffee.filter((row) => {
    return (
      (filters.grade === '' || row.grade === filters.grade) &&
      (filters.mark === '' || row.mark === filters.mark) &&
      (filters.status_id === '' || row.status_id === filters.status_id) &&
      (filters.outturn === '' || row.outturn === filters.outturn)
    );
  });

  const columns = [
    { field: 'mark', headerName: 'Mark' },
    { field: 'outturn', headerName: 'Outturn' },
    { field: 'bulkoutturn', headerName: 'Bulkoutturn' },
    { field: 'grade', headerName: 'Grade' },
    { field: 'type', headerName: 'Type' },
    { field: 'bags', headerName: 'Bags' },
    { field: 'pockets', headerName: 'Pockets' },
    { field: 'warehouse', headerName: 'Warehouse' },
    { field: 'mill', headerName: 'Mill' },
    { field: 'sale', headerName: 'Sale' },
    { field: 'price', headerName: 'Price' },
    { field: 'season', headerName: 'Season' },
    { field: 'status_id', headerName: 'Status' },
    { field: 'buyer', headerName: 'Buyer' },
  ];

  return (
    <Box sx={{ display: 'flex', height: '100vh', bgcolor: '#f4f6f8' }}>
      <Box sx={{ width: { xs: '100%', sm: '30%', md: '25%', lg: '18%' }, maxWidth: 280, bgcolor: '#121330', height: '100%' }}>
        <Sidebar />
      </Box>

      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', p: 2 }}>
        <Summary data={filteredData} />
        <Paper sx={{ p: 2, mb: 2, backgroundColor: '#fff', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
          {['grade', 'mark', 'status_id', 'outturn'].map((key) => (
            <TextField
              key={key}
              name={key}
              label={key.charAt(0).toUpperCase() + key.slice(1).replace('_', ' ')}
              value={filters[key]}
              onChange={handleFilterChange}
              size="small"
              sx={{ minWidth: 150, '& input': { fontSize: '0.7rem' }, '& label': { fontSize: '0.7rem' } }}
            />
          ))}
          <Button variant="outlined" onClick={resetFilters} size="small" sx={{ fontSize: '0.7rem' }}>
            Reset
          </Button>
          <Button variant="contained" color="secondary" size="small" sx={{ fontSize: '0.7rem' }}>
            Generate Stock Summary
          </Button>
        </Paper>

        <Box sx={{ flex: 1, overflow: 'auto', bgcolor: '#fff', borderRadius: 1, boxShadow: 1 }}>
          <Table
            data={filteredData}
            columns={columns}
            loading={loading}
            error={error}
            onEdit={handleEditClick}
            onDelete={(row) => handleDelete(row.id)}
          />
        </Box>
      </Box>

      <Dialog open={showEditModal} onClose={() => setShowEditModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ backgroundColor: '#121330', color: 'white' }}>Edit Coffee Record</DialogTitle>
        <DialogContent dividers>
          {Object.entries(selectedRecord).map(([key, value]) => (
            <TextField
              key={key}
              label={key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
              name={key}
              value={value}
              onChange={handleEditChange}
              fullWidth
              margin="dense"
              size="small"
              sx={{ mb: 2, '& input': { fontSize: '0.75rem', color: 'grey' }, '& label': { fontSize: '0.7rem', color: '#121330' }, '& .MuiInputBase-root': { backgroundColor: '#f9f9f9' } }}
              disabled={['id', '', 'certificate', 'created_at', 'created_by', 'file', 'farmer'].includes(key)}
            />
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowEditModal(false)} sx={{ color: 'red' }}>Cancel</Button>
          <Button onClick={handleUpdate} variant="contained" color="primary">Update</Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={feedback.open}
        autoHideDuration={4000}
        onClose={() => setFeedback((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setFeedback((prev) => ({ ...prev, open: false }))}
          severity={feedback.severity}
          sx={{ width: '100%' }}
        >
          {feedback.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ViewCoffee;
