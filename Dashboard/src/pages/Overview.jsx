import React, { useState } from 'react';
import {
  AppBar,
  Box,
  CssBaseline,
  IconButton,
  Toolbar,
  Typography,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Sidebar from '../components/sidebar/Sidebar';
import Card from '../components/overview/Card';
import { Grid } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';



const Overview = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const dispatch = useDispatch();
  const { coffeeRecords } = useSelector((state) => state.coffee);
  

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <CssBaseline />

      {/* Sidebar */}
      <Sidebar
        mobileOpen={mobileOpen}
        handleDrawerToggle={handleDrawerToggle}
      />

        {/* Main Content */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            bgcolor: '#f5f5f5',
            overflow: 'auto',
          }}
        >
        <Grid container spacing={15}>
          <Grid item xs={12} sm={6} md={4}>
            <Card header="Number of Farmers" stat="3.2M" text="Co-operatives, Small & large Estates" />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card header="Number of Bags" stat="1,024" text="Total number of all bags Recieved" />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card header="Total Weight" stat="76" text="Total weight of all coffee Recieved" />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card header="Number of Sales" stat="76" text="All sales attended to date" />
          </Grid>
        </Grid> 
        </Box>
      </Box>
    
  );
};

export default Overview;
