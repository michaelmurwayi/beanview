import React, { useState, useEffect } from "react";
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
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import Sidebar from "../components/sidebar/Sidebar";
import Card from "../components/overview/Card";
import CoffeeGradeTable from "../components/overview/CoffeeGradeTable";
import CoffeeSalesChart from "../components/overview/CoffeeSalesChart";
import CoffeeLocationBreakdownTable from "../components/overview/LocationBreakDown";
import CoffeeSaleBreakdownTable from "../components/overview/SaleBreakDown";

import { fetchFarmers } from "../store/slices/Farmers/farmerActions";
import { fetchCoffee } from "../store/slices/Coffee/coffeeActions";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#f44336"];

// ==============================
// Coffee Status Pie Chart Component
// ==============================
const CoffeeStatusPieChart = ({ coffeeRecords }) => {
  const statusCounts = coffeeRecords.reduce((acc, record) => {
    const status = record.status || "Unknown";
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  const data = Object.keys(statusCounts).map((status) => ({
    name: status,
    value: statusCounts[status],
  }));

  return (
    <Box
      sx={{
        bgcolor: "white",
        p: 2,
        borderRadius: "15px",
        boxShadow: 3,
        height: "100%",
      }}
    >
      <h3 style={{ textAlign: "center", marginBottom: "10px" }}>
        Coffee Records Status
      </h3>
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={80}
            fill="#8884d8"
            label
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip />
          <Legend verticalAlign="bottom" height={36} />
        </PieChart>
      </ResponsiveContainer>
    </Box>
  );
};

const Overview = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const dispatch = useDispatch();

  const farmers = useSelector((state) => state.farmer.farmers || []);
  const coffeeRecords = useSelector(
    (state) => state.coffee.coffeeRecords || []
  );

  const [filters, setFilters] = useState({
    sale: "",
    grade: "",
    mark: "",
    status: "",
    outturn: "",
  });

  const [summary, setSummary] = useState({
    farmerCount: 0,
    totalBags: 0,
    totalWeight: 0,
    totalSales: 0,
    uniqueGrades: 0,
  });

  const [filteredRecords, setFilteredRecords] = useState([]);

  // ==============================
  // Fetch Farmers and Coffee Records
  // ==============================
  useEffect(() => {
    dispatch(fetchFarmers());
    dispatch(fetchCoffee());
  }, [dispatch]);

  // ==============================
  // Filter Coffee Records
  // ==============================
  useEffect(() => {
    if (!Array.isArray(farmers) || !Array.isArray(coffeeRecords)) return;

    let records = [...coffeeRecords];

    // Apply filters dynamically
    Object.keys(filters).forEach((key) => {
      if (filters[key]) {
        records = records.filter((r) => r[key] === filters[key]);
      }
    });

    setFilteredRecords(records);

    // Update summary values
    const farmerCount = filters.mark ? 1 : farmers.length;
    const totalBags = records.reduce((sum, r) => sum + (r.bags || 0), 0);
    const totalWeight = records.reduce(
      (sum, r) => sum + (parseFloat(r.weight) || 0),
      0
    );
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

  // ==============================
  // Handlers
  // ==============================
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleResetFilters = () => {
    setFilters({
      sale: "",
      grade: "",
      mark: "",
      status: "",
      outturn: "",
    });
  };

  // ==============================
  // Helper to Get Unique Filter Options
  // ==============================
  const unique = (key) => [
    ...new Set(coffeeRecords.map((r) => r[key]).filter(Boolean)),
  ];

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      <CssBaseline />
      <Sidebar
        mobileOpen={mobileOpen}
        handleDrawerToggle={handleDrawerToggle}
      />

      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3, bgcolor: "#f5f5f5", overflow: "auto" }}
      >
        {/* 📊 Summary Cards */}
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={4}>
            <Card
              header="Farmers"
              stat={summary.farmerCount.toLocaleString()}
              text="Co-operatives, Small & Large Estates"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card
              header="Bags"
              stat={summary.totalBags.toLocaleString()}
              text="Total number of all bags received"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card
              header="Weight"
              stat={`${summary.totalWeight.toLocaleString()} kg`}
              text="Total weight of all coffee received"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card
              header="Sales"
              stat={summary.totalSales.toLocaleString()}
              text="Number of sales attended"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card
              header="Unique Grades"
              stat={summary.uniqueGrades.toLocaleString()}
              text="Different grades of coffee recorded"
            />
          </Grid>
        </Grid>

        {/* 🔍 Filter Panel */}
        <Paper
          elevation={3}
          sx={{
            mt: 4,
            p: 2,
            borderRadius: "25px",
            backgroundColor: "#121330",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              flexWrap: "wrap",
              gap: 2,
            }}
          >
            {/* Grade Filter */}
            <FormControl
              sx={{
                minWidth: { xs: 120, sm: 150, md: 180 },
                height: { xs: "36px", sm: "40px", md: "44px" },
              }}
            >
              <InputLabel
                sx={{
                  top: "-6px",
                  fontSize: { xs: "0.75rem", sm: "0.8rem", md: "0.9rem" },
                  color: "white",
                }}
              >
                Grade
              </InputLabel>
              <Select
                name="grade"
                value={filters.grade}
                onChange={handleFilterChange}
                sx={{
                  height: { xs: "36px", sm: "40px", md: "44px" },
                  fontSize: { xs: "0.75rem", sm: "0.8rem", md: "0.9rem" },
                  color: "white",
                  backgroundColor: "#1c1c3c",
                }}
              >
                <MenuItem value="">All</MenuItem>
                {unique("grade").map((value) => (
                  <MenuItem
                    sx={{ backgroundColor: "white", color: "#121330" }}
                    key={value}
                    value={value}
                  >
                    {value}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Mark Filter */}
            <FormControl
              sx={{
                minWidth: { xs: 120, sm: 150, md: 180 },
                height: { xs: "36px", sm: "40px", md: "44px" },
              }}
            >
              <InputLabel
                sx={{
                  top: "-6px",
                  fontSize: { xs: "0.75rem", sm: "0.8rem", md: "0.9rem" },
                  color: "white",
                }}
              >
                Mark
              </InputLabel>
              <Select
                name="mark"
                value={filters.mark}
                onChange={handleFilterChange}
                sx={{
                  height: { xs: "36px", sm: "40px", md: "44px" },
                  fontSize: { xs: "0.75rem", sm: "0.8rem", md: "0.9rem" },
                  color: "white",
                  backgroundColor: "#1c1c3c",
                }}
              >
                <MenuItem value="">All</MenuItem>
                {unique("mark").map((value) => (
                  <MenuItem key={value} value={value}>
                    {value}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Status Filter */}
            <FormControl sx={{ minWidth: 180 }}>
              <InputLabel
                sx={{
                  top: "-6px",
                  fontSize: { xs: "0.75rem", sm: "0.8rem", md: "0.9rem" },
                  color: "white",
                }}
              >
                Status
              </InputLabel>
              <Select
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
                sx={{
                  height: { xs: "36px", sm: "40px", md: "44px" },
                  fontSize: { xs: "0.75rem", sm: "0.8rem", md: "0.9rem" },
                  color: "white",
                  backgroundColor: "#1c1c3c",
                }}
              >
                <MenuItem value="">All</MenuItem>
                {unique("status").map((value) => (
                  <MenuItem key={value} value={value}>
                    {value}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Outturn Filter */}
            <FormControl sx={{ minWidth: 180 }}>
              <InputLabel
                sx={{
                  top: "-6px",
                  fontSize: { xs: "0.75rem", sm: "0.8rem", md: "0.9rem" },
                  color: "white",
                }}
              >
                Outturn
              </InputLabel>
              <Select
                name="outturn"
                value={filters.outturn}
                onChange={handleFilterChange}
                sx={{
                  height: { xs: "36px", sm: "40px", md: "44px" },
                  fontSize: { xs: "0.75rem", sm: "0.8rem", md: "0.9rem" },
                  color: "white",
                  backgroundColor: "#1c1c3c",
                }}
              >
                <MenuItem value="">All</MenuItem>
                {unique("outturn").map((value) => (
                  <MenuItem key={value} value={value}>
                    {value}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Sale Filter */}
            <FormControl sx={{ minWidth: 180 }}>
              <InputLabel
                sx={{
                  top: "-6px",
                  fontSize: { xs: "0.75rem", sm: "0.8rem", md: "0.9rem" },
                  color: "white",
                }}
              >
                Sale
              </InputLabel>
              <Select
                name="sale"
                value={filters.sale}
                onChange={handleFilterChange}
                sx={{
                  height: { xs: "36px", sm: "40px", md: "44px" },
                  fontSize: { xs: "0.75rem", sm: "0.8rem", md: "0.9rem" },
                  color: "white",
                  backgroundColor: "#1c1c3c",
                }}
              >
                <MenuItem value="">All</MenuItem>
                {unique("sale").map((value) => (
                  <MenuItem key={value} value={value}>
                    {value}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Reset Button */}
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Button
                variant="contained"
                color="error"
                onClick={handleResetFilters}
              >
                Reset
              </Button>
            </Box>
          </Box>
        </Paper>

        {/* 📈 Main Layout */}
        <Box sx={{ mt: 2, width: "100%" }}>
          <Grid container spacing={2}>
            {/* ===== LEFT COLUMN ===== */}
            <Grid item xs={12} md={6}>
              <Box display="flex" flexDirection="column" gap={2}>
                {/* Top: Sales Chart */}
                <CoffeeSalesChart coffeeRecords={filteredRecords} />

                {/* Bottom: Grade Table */}
                <CoffeeGradeTable coffeeRecords={filteredRecords} />
              </Box>
            </Grid>

            {/* ===== RIGHT COLUMN ===== */}
            <Grid item xs={12} md={6}>
              <Box display="flex" flexDirection="column" gap={2}>
                {/* Top: Location Breakdown */}
                <CoffeeLocationBreakdownTable
                  filteredRecords={filteredRecords}
                />

                {/* Middle: Sale Breakdown */}
                <CoffeeSaleBreakdownTable filteredRecords={filteredRecords} />

                {/* Bottom: Coffee Status Pie Chart */}
                <CoffeeStatusPieChart coffeeRecords={filteredRecords} />
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Box>
  );
};

export default Overview;
