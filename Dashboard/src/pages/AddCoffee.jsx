import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Grid,
} from '@mui/material';
import Sidebar from '../components/sidebar/Sidebar';
import { useDispatch } from 'react-redux';
import { addCoffeeRecord } from '../store/slices/Coffee/coffeeActions';
import { toast } from 'react-toastify';

const AddCoffee = () => {
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    mark: '',
    grade: '',
    weight: '',
    season: '',
    mill: '',
    warehouse: '',
    price: '',
    buyer: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      const response = await dispatch(addCoffeeRecord(formData));
      if (response?.type.includes('Success')) {
        toast.success('Coffee record added successfully!');
        setFormData({
          mark: '', grade: '', weight: '', season: '',
          mill: '', warehouse: '', price: '', buyer: ''
        });
      } else {
        toast.error('Failed to add coffee record.');
      }
    } catch (error) {
      toast.error('An error occurred while saving.');
    }
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh', bgcolor: '#f4f6f8' }}>
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

      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          p: 3,
        }}
      >
        <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 3 }}>
          <Typography variant="h6" gutterBottom>
            Add Coffee Record
          </Typography>
          <Grid container spacing={2}>
            {Object.entries(formData).map(([key, value]) => (
              <Grid item xs={12} sm={6} md={4} key={key}>
                <TextField
                  label={key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
                  name={key}
                  value={value}
                  onChange={handleChange}
                  fullWidth
                  size="small"
                  sx={{
                    '& input': { fontSize: '0.75rem', color: '#333' },
                    '& label': { fontSize: '0.7rem' },
                  }}
                />
              </Grid>
            ))}
          </Grid>

          <Box mt={3} display="flex" justifyContent="flex-end">
            <Button onClick={handleSubmit} variant="contained" color="primary">
              Save Record
            </Button>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default AddCoffee;
