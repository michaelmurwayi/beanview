import { useEffect, useState, useMemo, useCallback } from "react";
import {
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
} from "@mui/material";
import Sidebar from "../components/sidebar/Sidebar";
import TableDisplay from "../components/table/CoffeeTable";
import Summary from "../components/summary/Summary";
import StockSummaryModal from "../components/summary/SummaryModal";
import {
  fetchCoffee,
  updateCoffee,
  deleteCoffee,
} from "../store/slices/Coffee/coffeeActions";
import { useDispatch, useSelector } from "react-redux";

const ViewCoffee = () => {
  const dispatch = useDispatch();
  const { coffeeRecords: coffee, loading, error } = useSelector(
    (state) => state.coffee
  );

  // State
  const [selectedRecord, setSelectedRecord] = useState({});
  const [showEditModal, setShowEditModal] = useState(false);
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [feedback, setFeedback] = useState({ open: false, message: "", severity: "success" });

  const [filters, setFilters] = useState({
    grade: "",
    code: "",
    mark: "",
    status_id: "",
    outturn: "",
    sale: "",
  });

  // Fetch coffee data on mount
  useEffect(() => {
    dispatch(fetchCoffee());
  }, [dispatch]);

  // --- Flatten data for table and filters ---
  const processedData = useMemo(() => {
    if (!Array.isArray(coffee)) return [];
    return coffee.map((row) => ({
      ...row,
      mark: row.farmer?.mark || "--",
      farmer_name: row.farmer?.name || "--",
      county: row.farmer?.County || "--",
    }));
  }, [coffee]);

  // --- Filtered Data ---
  const filteredData = useMemo(() => {
    return processedData.filter((row) =>
      (filters.grade === "" || row.grade === filters.grade) &&
      (filters.code === "" || row.code === filters.code) &&
      (filters.mark === "" || row.mark === filters.mark) &&
      (filters.status_id === "" || row.status_id === filters.status_id) &&
      (filters.outturn === "" || row.outturn === filters.outturn) &&
      (filters.sale === "" || row.sale === filters.sale)
    );
  }, [processedData, filters]);

  // --- Summary Groups ---
  const summaryGroups = useMemo(() => {
    return filteredData.reduce((acc, rec) => {
      const growerCode = rec.code || "Unmarked";
      acc[growerCode] = acc[growerCode] || [];
      acc[growerCode].push(rec);
      return acc;
    }, {});
  }, [filteredData]);

  // --- Handlers ---
  const handleFilterChange = useCallback((e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({ grade: "", code: "", mark: "", status_id: "", outturn: "", sale: "" });
  }, []);

  const handleEditClick = useCallback((record) => {
    setSelectedRecord(record);
    setShowEditModal(true);
  }, []);

  const handleDelete = useCallback(async (row) => {
    if (!window.confirm("Are you sure you want to delete this record?")) return;
    try {
      await dispatch(deleteCoffee(row.id)).unwrap();
      setFeedback({ open: true, message: "Record deleted successfully.", severity: "success" });
      dispatch(fetchCoffee());
    } catch {
      setFeedback({ open: true, message: "Failed to delete record.", severity: "error" });
    }
  }, [dispatch]);

  const handleUpdate = useCallback(async () => {
    try {
      await dispatch(updateCoffee(selectedRecord)).unwrap();
      setFeedback({ open: true, message: "Record updated successfully.", severity: "success" });
      setShowEditModal(false);
      dispatch(fetchCoffee());
    } catch {
      setFeedback({ open: true, message: "Failed to update record.", severity: "error" });
    }
  }, [dispatch, selectedRecord]);

  // --- Table Columns ---
  const columns = useMemo(() => [
    { field: "mark", headerName: "Mark" },
    { field: "outturn", headerName: "Outturn" },
    { field: "bulkoutturn", headerName: "Bulkoutturn" },
    { field: "grade", headerName: "Grade" },
    { field: "type", headerName: "Type" },
    { field: "bags", headerName: "Bags" },
    { field: "pockets", headerName: "Pockets" },
    { field: "warehouse", headerName: "Warehouse" },
    { field: "mill", headerName: "Mill" },
    { field: "sale", headerName: "Sale" },
    { field: "price", headerName: "Price" },
    { field: "season", headerName: "Season" },
    { field: "status_id", headerName: "Status" },
    { field: "buyer", headerName: "Buyer" },
  ], []);

  return (
    <Box sx={{ display: "flex", height: "100vh", bgcolor: "#f4f6f8" }}>
      <Sidebar />
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", p: 2 }}>
        <Summary data={filteredData} />

        {/* Filters */}
        <Paper sx={{ p: 2, mb: 2, backgroundColor: "#121330", display: "flex", flexWrap: "wrap", gap: 2, justifyContent: "center" }}>
          {["grade", "code", "mark", "status_id", "sale"].map((key) => {
            const uniqueOptions = [...new Set(processedData.map(item => item[key]).filter(Boolean))];
            return (
              <TextField
                select
                key={key}
                name={key}
                label={key.charAt(0).toUpperCase() + key.slice(1)}
                value={filters[key]}
                onChange={handleFilterChange}
                size="small"
                sx={{ minWidth: 150, "& .MuiInputBase-input": { fontSize: "0.7rem" }, "& label": { fontSize: "0.7rem" }, backgroundColor: "white", borderRadius: "15px" }}
              >
                <MenuItem value="">All</MenuItem>
                {uniqueOptions.map(option => (
                  <MenuItem key={option} value={option} sx={{ fontSize: "0.7rem" }}>{option}</MenuItem>
                ))}
              </TextField>
            );
          })}

          <TextField
            name="outturn"
            label="Outturn"
            value={filters.outturn}
            onChange={handleFilterChange}
            size="small"
            sx={{ minWidth: 150, "& input": { fontSize: "0.7rem" }, "& label": { fontSize: "0.7rem" }, backgroundColor: "white", borderRadius: "15px" }}
          />

          <Button variant="outlined" onClick={resetFilters} size="small" sx={{ fontSize: "0.7rem", backgroundColor: "red", color: "white", fontWeight: "bold" }}>
            Reset
          </Button>
          <Button variant="contained" onClick={() => setShowSummaryModal(true)} size="small" sx={{ fontSize: "0.7rem", fontWeight: "bold" }}>
            Generate Stock Summary
          </Button>
        </Paper>

        {/* Table */}
        <Box sx={{ flex: 1, overflow: "auto", bgcolor: "#fff", borderRadius: 1, boxShadow: 1 }}>
          <TableDisplay
            data={filteredData}
            columns={columns}
            error={error}
            loading={loading}
            onEdit={handleEditClick}
            onDelete={handleDelete}
          />
        </Box>
      </Box>

      {/* Edit Dialog */}
      <Dialog open={showEditModal} onClose={() => setShowEditModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ backgroundColor: "#121330", color: "white" }}>Edit Coffee Record</DialogTitle>
        <DialogContent dividers>
          {Object.entries(selectedRecord).map(([key, value]) => (
            <TextField
              key={key}
              label={key.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase())}
              name={key}
              value={value}
              onChange={handleEditChange}
              fullWidth
              margin="dense"
              size="small"
              sx={{ mb: 2, "& input": { fontSize: "0.75rem", color: "grey" }, "& label": { fontSize: "0.7rem", color: "#121330" }, "& .MuiInputBase-root": { backgroundColor: "#f9f9f9" } }}
              disabled={["id", "", "certificate", "created_at", "created_by", "file", "farmer"].includes(key)}
            />
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowEditModal(false)} sx={{ color: "red" }}>Cancel</Button>
          <Button onClick={handleUpdate} variant="contained" color="primary">Update</Button>
        </DialogActions>
      </Dialog>

      <StockSummaryModal open={showSummaryModal} onClose={() => setShowSummaryModal(false)} groupedData={summaryGroups} />

      {/* Feedback */}
      <Snackbar
        open={feedback.open}
        autoHideDuration={4000}
        onClose={() => setFeedback(prev => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={() => setFeedback(prev => ({ ...prev, open: false }))} severity={feedback.severity} sx={{ width: "100%" }}>
          {feedback.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ViewCoffee;