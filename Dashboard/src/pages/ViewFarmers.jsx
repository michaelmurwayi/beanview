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
} from '@mui/material';
import Sidebar from '../components/sidebar/Sidebar';
import Table from '../components/table/Table'; // ← rename here if needed
import { fetchFarmers, deleteFarmer } from '../store/slices/Farmers/farmerActions';
import { useDispatch, useSelector } from 'react-redux';

const ViewFarmers = () => {
  const dispatch = useDispatch();
  const { farmers, loading, error } = useSelector((state) => state.farmer);

  const [selectedRecord, setSelectedRecord] = useState({});
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    dispatch(fetchFarmers());
  }, [dispatch]);

  const handleEditClick = (record) => {
    setSelectedRecord({ ...record });
    setShowEditModal(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setSelectedRecord((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = () => {
    updateFarmer([selectedRecord]);
    setShowEditModal(false);
    dispatch(fetchFarmers());
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      deleteFarmer(id);
      dispatch(fetchFarmers());
    }
  };

  const columns =
    Array.isArray(farmers) && farmers.length > 0
      ? Object.keys(farmers[0]).map((key) => ({
          field: key,
          headerName: key.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase()),
        }))
      : [];

  return (
    <Box sx={{ display: 'flex', height: '100vh', bgcolor: '#f4f6f8' }}>
      {/* Sidebar */}
      <Box
        sx={{
          width: { xs: '100%', sm: '30%', md: '25%', lg: '18%' },
          maxWidth: 280,
          bgcolor: '#121330',
          height: '100%',
        }}
      >
        <Sidebar />
      </Box>

      {/* Main content */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          p: 2,
        }}
      >
        <Box
          sx={{
            flex: 1,
            overflow: 'auto',
            bgcolor: '#fff',
            borderRadius: 1,
            boxShadow: 1,
          }}
        >
          <Table
            data={farmers}
            columns={columns}
            loading={loading}
            error={error}
            onEdit={handleEditClick}
            onDelete={(row) => handleDelete(row.id)}
          />
        </Box>
      </Box>

      {/* Edit Modal */}
      <Dialog open={showEditModal} onClose={() => setShowEditModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Farmer Record</DialogTitle>
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
              disabled={key === 'id'} // prevent editing primary key
            />
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowEditModal(false)}>Cancel</Button>
          <Button onClick={handleUpdate} variant="contained" color="primary">
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ViewFarmers;
