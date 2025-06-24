import { useEffect } from 'react';
import { Grid, Box, Container } from '@mui/material';
import Sidebar from '../components/sidebar/Sidebar';
import Table from '../components/table/Table';
import { fetchFarmers } from '../store/slices/Farmers/farmerActions';
import { useDispatch, useSelector } from 'react-redux';

const ViewFarmers = () => {
  const dispatch = useDispatch();
  const { farmers, loading, error } = useSelector((state) => state.farmer);

  useEffect(() => {
    dispatch(fetchFarmers());
  }, [dispatch]);

  const columns =
    Array.isArray(farmers) && farmers.length > 0
      ? Object.keys(farmers[0]).map((key) => ({
          field: key,
          headerName: key
            .replace(/_/g, ' ')
            .replace(/\b\w/g, (char) => char.toUpperCase()),
        }))
      : [];

  return (
    <Box sx={{ flexGrow: 1, height: '100vh', bgcolor: '#f4f6f8' }}>
      <Grid container spacing={0} sx={{ height: '100%' }}>
        {/* Sidebar */}
        <Grid item xs={12} sm={4} md={3} lg={2} sx={{ bgcolor: '#121330', height: '100vh' }}>
          <Sidebar />
        </Grid>

        {/* Main Content */}
        <Grid item xs={12} sm={8} md={9} lg={10}>
          <Container maxWidth="lg" sx={{ py: 4 }}>
            <Box display="flex" justifyContent="center">
              <Box width="100%" maxWidth="100%">
                <Table data={farmers} columns={columns} loading={loading} error={error} />
              </Box>
            </Box>
          </Container>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ViewFarmers;
