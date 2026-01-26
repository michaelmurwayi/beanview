import { useEffect, useState, useMemo } from "react";
import {
  Grid,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
  useMediaQuery,
  Divider,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Sidebar from "../components/sidebar/Sidebar";
import Table from "../components/table/Table";
import {
  fetchFarmers,
  deleteFarmer,
  updateFarmer,
} from "../store/slices/Farmers/farmerActions";
import { useDispatch, useSelector } from "react-redux";

const ViewFarmers = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const { farmers, loading, error } = useSelector((state) => state.farmer);

  const [selectedRecord, setSelectedRecord] = useState({});
  const [showEditModal, setShowEditModal] = useState(false);

  /** Filters */
  const [filters, setFilters] = useState({
    town: "",
    mark: "",
    code: "",
    county: "",
  });

  /** Fetch Farmers on Mount */
  useEffect(() => {
    dispatch(fetchFarmers());
  }, [dispatch]);

  /** Handle Filter Change */
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /** Reset Filters */
  const handleResetFilters = () => {
    setFilters({
      town: "",
      mark: "",
      code: "",
      county: "",
    });
  };

  /** Unique helper for dropdowns */
  const unique = (key) => {
    if (!farmers || !Array.isArray(farmers)) return [];
    return [...new Set(farmers.map((item) => item[key]).filter(Boolean))];
  };

  /** Filtered Farmers */
  const filteredFarmers = useMemo(() => {
    return farmers.filter((farmer) => {
      return (
        (filters.town === "" || farmer.town === filters.town) &&
        (filters.mark === "" || farmer.mark === filters.mark) &&
        (filters.code === "" || farmer.code === filters.code) &&
        (filters.county === "" || farmer.county === filters.county)
      );
    });
  }, [farmers, filters]);

  /** Handle Edit Click */
  const handleEditClick = (record) => {
    setSelectedRecord({ ...record });
    setShowEditModal(true);
  };

  /** Handle Edit Form Change */
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setSelectedRecord((prev) => ({ ...prev, [name]: value }));
  };

  /** Update Farmer */
  const handleUpdate = () => {
    (selectedRecord.id)
    if (!selectedRecord.id) return;
    dispatch(updateFarmer([selectedRecord]));
    setShowEditModal(false);
    dispatch(fetchFarmers());
  };

  /** Delete Farmer */
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this record?")) {
      dispatch(deleteFarmer(id));
      dispatch(fetchFarmers());
    }
  };

  /** Table Columns - Dynamically Generated */
  const columns =
    Array.isArray(farmers) && farmers.length > 0
      ? Object.keys(farmers[0]).map((key) => ({
          field: key,
          headerName: key
            .replace(/_/g, " ")
            .replace(/\b\w/g, (char) => char.toUpperCase()),
        }))
      : [];

  return (
    <Box sx={{ display: "flex", height: "100vh", bgcolor: "#f4f6f8" }}>
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          p: { xs: 1, sm: 2 },
        }}
      >
        <Typography
          variant="h4"
          sx={{
            mb: 2,
            fontWeight: "bold",
            color: "#121330",
            textAlign: "center", // Align text to the far right
            width: "100%", // Ensure it spans full width
          }}
        >
          Farmer Records
        </Typography>

        {/* 🌱 Farmer Filter Panel */}
        <Paper
          elevation={3}
          sx={{
            mt: 2,
            mb: 3,
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
            {/* Town Filter */}
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
                Town
              </InputLabel>
              <Select
                name="town"
                value={filters.town}
                onChange={handleFilterChange}
                sx={{
                  height: { xs: "36px", sm: "40px", md: "44px" },
                  fontSize: { xs: "0.75rem", sm: "0.8rem", md: "0.9rem" },
                  color: "white",
                  backgroundColor: "#1c1c3c",
                }}
              >
                <MenuItem value="">All</MenuItem>
                {unique("town").map((value) => (
                  <MenuItem key={value} value={value}>
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

            {/* Grower Code Filter */}
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
                Grower Code
              </InputLabel>
              <Select
                name="code"
                value={filters.code}
                onChange={handleFilterChange}
                sx={{
                  height: { xs: "36px", sm: "40px", md: "44px" },
                  fontSize: { xs: "0.75rem", sm: "0.8rem", md: "0.9rem" },
                  color: "white",
                  backgroundColor: "#1c1c3c",
                }}
              >
                <MenuItem value="">All</MenuItem>
                {unique("code").map((value) => (
                  <MenuItem key={value} value={value}>
                    {value}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* County Filter */}
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
                County
              </InputLabel>
              <Select
                name="county"
                value={filters.county}
                onChange={handleFilterChange}
                sx={{
                  height: { xs: "36px", sm: "40px", md: "44px" },
                  fontSize: { xs: "0.75rem", sm: "0.8rem", md: "0.9rem" },
                  color: "white",
                  backgroundColor: "#1c1c3c",
                }}
              >
                <MenuItem value="">All</MenuItem>
                {unique("county").map((value) => (
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

        {/* Table Container */}
        <Box
          sx={{
            flex: 1,
            overflow: "auto",
            bgcolor: "#fff",
            borderRadius: 2,
            boxShadow: 2,
            p: { xs: 1, sm: 2 },
            scrollbarWidth: "thin",
            scrollbarColor: "transparent transparent",
            "&::-webkit-scrollbar": {
              display: "none",
            },
          }}
        >
          <Table
            data={filteredFarmers}
            columns={columns}
            loading={loading}
            error={error}
            onEdit={handleEditClick}
            onDelete={(row) => handleDelete(row.id)}
          />
        </Box>
      </Box>

      {/* Edit Modal */}
      <Dialog
        open={showEditModal}
        onClose={() => setShowEditModal(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle
          sx={{
            backgroundColor: "#121330",
            color: "white",
            textAlign: "center",
            fontSize: "1.2rem",
            fontWeight: "bold",
          }}
        >
          Edit Farmer Record
        </DialogTitle>

        <DialogContent dividers>
          <Grid container spacing={2}>
            {Object.entries(selectedRecord).map(([key, value]) => (
              <Grid item xs={12} sm={6} key={key}>
                <TextField
                  label={key
                    .replace(/_/g, " ")
                    .replace(/\b\w/g, (c) => c.toUpperCase())}
                  name={key}
                  value={value || ""}
                  onChange={handleEditChange}
                  fullWidth
                  size="small"
                  disabled={key === "id"}
                  sx={{
                    "& input": {
                      fontSize: "0.85rem",
                    },
                    "& label": {
                      fontSize: "0.8rem",
                      color: "#121330",
                    },
                  }}
                />
              </Grid>
            ))}
          </Grid>
        </DialogContent>

        <Divider />

        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={() => setShowEditModal(false)}
            variant="outlined"
            color="error"
            size={isMobile ? "small" : "medium"}
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpdate}
            variant="contained"
            color="primary"
            size={isMobile ? "small" : "medium"}
          >
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ViewFarmers;
