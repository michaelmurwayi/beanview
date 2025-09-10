import { useEffect, useState, useMemo } from 'react';
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
} from '@mui/material';
import Sidebar from '../components/sidebar/Sidebar';
import Table from '../components/table/CoffeeTable';
import {
  fetchCoffee,
  updateCoffee,
  deleteCoffee,
} from '../store/slices/Coffee/coffeeActions';
import { useDispatch, useSelector } from 'react-redux';
import CatalogueModal from '../components/summary/CatalogueModal';

const CreateCatalogue = () => {
  const dispatch = useDispatch();
  const { coffeeRecords: coffee, loading, error } = useSelector((state) => state.coffee);
  const [selectedRecord, setSelectedRecord] = useState({});
  const [showEditModal, setShowEditModal] = useState(false);
  const [feedback, setFeedback] = useState({ open: false, message: '', severity: 'success' });
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [filters, setFilters] = useState({ grade: '', mark: '', outturn: '', weight: '' });
  const [catalogueData, setCatalogueData] = useState({});

  useEffect(() => {
    dispatch(fetchCoffee());
  }, [dispatch]);

  const handleCatalogue = () => {
    const userInput = prompt("Enter Sale Number:");
    if (!userInput || !userInput.trim()) {
      alert("Sale number is required.");
      return;
    }
    const saleNumber = userInput.trim();

    const updatedGroupedData = Object.entries(summaryGroups).reduce((acc, [mark, records]) => {
      acc[mark] = records.map((rec) => ({
        ...rec,
        sale: saleNumber,
      }));
      return acc;
    }, {});

    setCatalogueData(updatedGroupedData);
    setShowSummaryModal(true);
  };

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

  const checkBulkOutturn = (rows) => {
    const bulked = [];
    const groupedMap = new Map();
    const mergedRecords = [];

    rows.forEach((record) => {
      const bulkoutturn = record.bulkoutturn?.trim();
      const grade = record.grade?.trim();

      if (!bulkoutturn) {
        bulked.push(record); // Missing bulkoutturn
        return;
      }

      const key = `${bulkoutturn}_${grade}`;

      if (!groupedMap.has(key)) {
        groupedMap.set(key, []);
      }

      groupedMap.get(key).push(record);
    });

    // Merge grouped records
    groupedMap.forEach((records, key) => {
      const [bulkoutturn, grade] = key.split('_');
      const totalWeight = records.reduce((sum, r) => sum + parseFloat(r.weight || 0), 0);
      const bags = Math.floor(totalWeight / 50);
      const pockets = Math.round(totalWeight % 50);

      const base = records[0]; // take fields from first record

      const merged = {
        ...base,
        outturn: bulkoutturn,
        mark: `${grade}/Bulk`,
        weight: totalWeight.toFixed(2),
        bags,
        pockets,
      };

      mergedRecords.push(merged);
    });

    // Combine mergedRecords and bulked into filtered records
    const filteredRecords = [...mergedRecords, ...bulked];

    return {
      mergedRecords,
      bulked,
      filteredRecords,
    };
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const resetFilters = () => {
    setFilters({ grade: '', mark: '', outturn: '', weight: '' });
  };

  // First filter based on user input
  const filteredData = useMemo(() => {
    return coffee.filter((row) => {
      console.log(row)
      return (
        row.status === "2" &&
        (filters.grade === '' || row.grade === filters.grade) &&
        (filters.mark === '' || row.mark === filters.mark) &&
        (filters.outturn === '' || row.outturn === filters.outturn) &&
        (filters.weight === '' || parseFloat(row.weight) >= parseFloat(filters.weight))
      );
    });
  }, [coffee, filters]);

  // Then merge and bulk with checkBulkOutturn
  const { filteredRecords } = useMemo(() => checkBulkOutturn(filteredData), [filteredData]);

  const gradeOrder = [
    "T", "TT", "C", "AB", "PB", "E", "AA", "SB", "HE", "UG3",
    "UG2", "UG1", "UG", "NL", "ML"
  ];

  const summaryGroups = useMemo(() => {
    const sorted = [...filteredData].sort((a, b) => {
      const gradeA = gradeOrder.indexOf(a.grade);
      const gradeB = gradeOrder.indexOf(b.grade);
      return gradeA - gradeB;
    });
    return { "Catalogue Summary": sorted };
  }, [filteredData]);

  const columns = [
    { field: 'mark', headerName: 'Mark' },
    { field: 'outturn', headerName: 'Outturn' },
    { field: 'bulkoutturn', headerName: 'Bulkoutturn' },
    { field: 'grade', headerName: 'Grade' },
    { field: 'type', headerName: 'Type' },
    { field: 'bags', headerName: 'Bags' },
    { field: 'pockets', headerName: 'Pockets' },
    { field: 'weight', headerName: 'Weight' },
    { field: 'warehouse', headerName: 'Warehouse' },
    { field: 'mill', headerName: 'Mill' },
    { field: 'sale', headerName: 'Sale' },
    { field: 'price', headerName: 'Price' },
    { field: 'season', headerName: 'Season' },
    { field: 'status', headerName: 'Status' },
    { field: 'buyer', headerName: 'Buyer' },
  ];

  return (
    <Box sx={{ display: 'flex', height: '100vh', bgcolor: '#f4f6f8' }}>
      
      <Sidebar />

      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', p: 2 }}>
        <Paper
          sx={{
            p: 2,
            mb: 2,
            backgroundColor: '#fff',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 2,
          }}
        >
          {[{ key: 'grade', label: 'Grade' }, { key: 'mark', label: 'Mark' }].map(({ key, label }) => {
            const uniqueOptions = [...new Set(coffee.map((item) => item[key]).filter(Boolean))];
            return (
              <TextField
                select
                key={key}
                name={key}
                label={label}
                value={filters[key]}
                onChange={handleFilterChange}
                size="small"
                sx={{ minWidth: 150, '& .MuiInputBase-input': { fontSize: '0.7rem' }, '& label': { fontSize: '0.7rem' } }}
              >
                <MenuItem value="">All</MenuItem>
                {uniqueOptions.map((option) => (
                  <MenuItem key={option} value={option} sx={{ fontSize: '0.7rem' }}>
                    {option}
                  </MenuItem>
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
            sx={{ minWidth: 150, '& input': { fontSize: '0.7rem' }, '& label': { fontSize: '0.7rem' } }}
          />

          <TextField
            name="weight"
            label="Min Weight"
            type="number"
            value={filters.weight}
            onChange={handleFilterChange}
            size="small"
            sx={{ minWidth: 150, '& input': { fontSize: '0.7rem' }, '& label': { fontSize: '0.7rem' } }}
          />

          <Button variant="outlined" onClick={resetFilters} size="small" sx={{ fontSize: '0.7rem', backgroundColor: '#f0f0f0', color: '#121330' }}>
            Reset
          </Button>
          <Button variant="contained" onClick={handleCatalogue} size="small" sx={{ fontSize: '0.7rem', backgroundColor: '#121331', color: 'white' }}>
            Add to Catalogue
          </Button>
        </Paper>

        <Box sx={{ flex: 1, overflow: 'auto', bgcolor: '#fff', borderRadius: 1, boxShadow: 1 }}>
          <Table
            data={filteredRecords} // <-- use merged and bulked data here
            columns={columns}
            loading={loading}
            error={error}
            onEdit={handleEditClick}
            onDelete={(row) => handleDelete(row)}
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
              sx={{
                mb: 2,
                '& input': { fontSize: '0.75rem', color: 'grey' },
                '& label': { fontSize: '0.7rem', color: '#121330' },
                '& .MuiInputBase-root': { backgroundColor: '#f9f9f9' },
              }}
              disabled={['id', '', 'certificate', 'created_at', 'created_by', 'file', 'farmer'].includes(key)}
            />
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowEditModal(false)} sx={{ color: 'red' }}>
            Cancel
          </Button>
          <Button onClick={handleUpdate} variant="contained" color="primary">
            Update
          </Button>
        </DialogActions>
      </Dialog>

      <CatalogueModal
        open={showSummaryModal}
        onClose={() => setShowSummaryModal(false)}
        groupedData={catalogueData}
        onEdit={(record) => console.log('Edit', record)}
        onDelete={(record) => console.log('Delete', record)}
      />

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

export default CreateCatalogue;
