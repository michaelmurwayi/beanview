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
import Table from '../components/table/CoffeeTable';
import { fetchFarmers, deleteFarmer, updateFarmer } from '../store/slices/Farmers/farmerActions';
import { fetchCoffee, updateCoffee, deleteCoffee } from '../store/slices/Coffee/coffeeActions';
import { useDispatch, useSelector } from 'react-redux';

const ViewCoffee = () => {
  const dispatch = useDispatch();
  const { coffeeRecords: coffee, loading, error } = useSelector((state) => state.coffee);
  const [selectedRecord, setSelectedRecord] = useState({});
  const [showEditModal, setShowEditModal] = useState(false);

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

  const handleUpdate = () => {
    console.log('Updating record:', selectedRecord);
    dispatch(updateCoffee([selectedRecord])); // ✅ dispatch the thunk
    setShowEditModal(false);
    dispatch(fetchCoffee()); // Refresh if needed, or use fetchCoffee if relevant
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      dispatch(deleteFarmer(id)); // ✅ dispatch the thunk
      dispatch(fetchFarmers());
    }
  };

  const columns = [{field: 'outturn', headerName: 'Outturn'}, {field:'bulkoutturn', headerName:'Bulkoutturn'}, {field: 'grade', headerName: 'Grade'},{field: 'type', headerName: 'Type'},{field:'bags',headerName:'Bags'},{field:'pockets',headerName:'Pockets'},{field:'warehouse', headerName:'Warehouse'},{field:'mill', headerName:'Mill'},{field:'sale', headerName:'Sale'}, {field:'status_id', headerName:'Status'}];
    console.log('Columns:', columns);
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
            mt: 2,
          }}
        >
          <Table
            data={coffee}
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
        <DialogTitle sx={{ backgroundColor: "#121330", color: "white" }}>
          Edit Coffee Record
        </DialogTitle>
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
              sx={{
                mb: 2,
                '& input': {
                  fontSize: '0.75rem',
                  color: 'grey',
                },
                '& label': {
                  fontSize: '0.7rem',
                  color: '#121330',
                },
                '& .MuiInputBase-root': {
                  backgroundColor: '#f9f9f9',
                },
              }}
              disabled={['id', '', 'certificate', 'created_at', 'created_by', 'file', 'farmer'].includes(key)}
            />
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowEditModal(false)} sx={{ color: "red" }}>
            Cancel
          </Button>
          <Button onClick={handleUpdate} variant="contained" color="primary">
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ViewCoffee;
