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


const Overview = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

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
            <Card header="Total Sales" stat="Ksh 3.2M" text="Compared to last month" />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card header="Active Users" stat="1,024" text="Up 12% from yesterday" />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card header="Pending Orders" stat="76" text="Updated 1 hour ago" />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card header="Pending Orders" stat="76" text="Updated 1 hour ago" />
          </Grid>
        </Grid> 
        </Box>
      </Box>
    
  );
};

export default Overview;
