import React, { useState, useEffect } from 'react';
import {
  Box,
  CssBaseline,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Paper,
  Typography,
} from '@mui/material';
import Sidebar from '../components/sidebar/Sidebar';
import Card from '../components/overview/Card';
import CoffeeGradeTable from '../components/overview/CoffeeGradeTable';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFarmers } from '../store/slices/Farmers/farmerActions';
import { fetchCoffee } from '../store/slices/Coffee/coffeeActions';
import CoffeeSalesChart from '../components/overview/CoffeeSalesChart';

const Overview = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const dispatch = useDispatch();

  const farmers = useSelector((state) => state.farmer.farmers || []);
  const coffeeRecords = useSelector((state) => state.coffee.coffeeRecords || []);

  const [filters, setFilters] = useState({
    grade: '',
    mark: '',
    status: '',
    outturn: '',
  });

  const [summary, setSummary] = useState({
    farmerCount: 0,
    totalBags: 0,
    totalWeight: 0,
    totalSales: 0,
    uniqueGrades: 0,
  });

  const [filteredRecords, setFilteredRecords] = useState([]);

  useEffect(() => {
    dispatch(fetchFarmers());
    dispatch(fetchCoffee());
  }, [dispatch]);

  useEffect(() => {
    if (!Array.isArray(farmers) || !Array.isArray(coffeeRecords)) return;

    let records = [...coffeeRecords];

    if (filters.grade) {
      records = records.filter((r) => r.grade === filters.grade);
    }
    if (filters.mark) {
      records = records.filter((r) => r.mark === filters.mark);
    }
    if (filters.status) {
      records = records.filter((r) => r.status === filters.status);
    }
    if (filters.outturn) {
      records = records.filter((r) => r.outturn === filters.outturn);
    }

    setFilteredRecords(records);

    const farmerCount = filters.mark ? 1 : farmers.length;
    const totalBags = records.reduce((sum, r) => sum + (r.bags || 0), 0);
    const totalWeight = records.reduce((sum, r) => sum + (parseFloat(r.weight) || 0), 0);
    const totalSales = new Set(records.map((r) => r.sale)).size;
    const uniqueGrades = new Set(records.map((r) => r.grade)).size;

    setSummary({
      farmerCount,
      totalBags,
      totalWeight,
      totalSales,
      uniqueGrades,
    });
  }, [farmers, coffeeRecords, filters]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleResetFilters = () => {
    setFilters({
      grade: '',
      mark: '',
      status: '',
      outturn: '',
    });
  };

  const unique = (key) =>
    [...new Set(coffeeRecords.map((r) => r[key]).filter(Boolean))];

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <CssBaseline />
      <Sidebar mobileOpen={mobileOpen} handleDrawerToggle={handleDrawerToggle} />

      <Box component="main" sx={{ flexGrow: 1, p: 3, bgcolor: '#f5f5f5', overflow: 'auto' }}>
        {/* 📊 Summary Cards */}
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={4}>
            <Card header="Number of Farmers" stat={summary.farmerCount.toLocaleString()} text="Co-operatives, Small & large Estates" />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card header="Number of Bags" stat={summary.totalBags.toLocaleString()} text="Total number of all bags received" />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card header="Total Weight" stat={`${summary.totalWeight.toLocaleString()} kg`} text="Total weight of all coffee received" />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card header="Number of Sales" stat={summary.totalSales.toLocaleString()} text="All sales attended to date" />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card header="Unique Grades" stat={summary.uniqueGrades.toLocaleString()} text="Different grades of coffee recorded" />
          </Grid>
        </Grid>

        {/* 🔍 Filter Panel */}
        <Paper elevation={3} sx={{ mt: 4, p: 2, borderRadius: 2, backgroundColor: '#ffffff' }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 4 }}>
            <FormControl sx={{ minWidth: 180 }}>
              <InputLabel>Grade</InputLabel>
              <Select name="grade" value={filters.grade} label="Grade" onChange={handleFilterChange}>
                <MenuItem value="">All</MenuItem>
                {unique('grade').map((value) => (
                  <MenuItem key={value} value={value}>{value}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl sx={{ minWidth: 180 }}>
              <InputLabel>Mark</InputLabel>
              <Select name="mark" value={filters.mark} label="Mark" onChange={handleFilterChange}>
                <MenuItem value="">All</MenuItem>
                {unique('mark').map((value) => (
                  <MenuItem key={value} value={value}>{value}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl sx={{ minWidth: 180 }}>
              <InputLabel>Status</InputLabel>
              <Select name="status" value={filters.status} label="Status" onChange={handleFilterChange}>
                <MenuItem value="">All</MenuItem>
                {unique('status').map((value) => (
                  <MenuItem key={value} value={value}>{value}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl sx={{ minWidth: 180 }}>
              <InputLabel>Outturn</InputLabel>
              <Select name="outturn" value={filters.outturn} label="Outturn" onChange={handleFilterChange}>
                <MenuItem value="">All</MenuItem>
                {unique('outturn').map((value) => (
                  <MenuItem key={value} value={value}>{value}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Button variant="contained" sx={{ color: 'white' }} onClick={handleResetFilters}>
                Reset
              </Button>
            </Box>
          </Box>
        </Paper>

        {/* 📋 Grade Breakdown Table */}
        <Grid container spacing={2} sx={{ mt: 2 }}>
          <Grid item xs={12} md={6}>
            <CoffeeGradeTable coffeeRecords={filteredRecords} />
          </Grid>
          <Grid item xs={12} md={6}>
            <CoffeeSalesChart coffeeRecords={filteredRecords} />
          </Grid>
        </Grid>

      </Box>
    </Box>
  );
};

export default Overview;
