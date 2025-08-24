import {
  Dialog,
  DialogTitle,
  DialogContent,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Box,
  CircularProgress,
  Button,
  Snackbar,
  Alert,
} from "@mui/material";
import { useDispatch } from "react-redux";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useEffect, useState } from "react";
import { updateCoffee } from "../../store/slices/Coffee/coffeeActions";
import {
  generateCatalogueFile,
  generateAuctionFile,
  generateSaleFile,
} from "../../store/slices/Catalogue/catalogueActions";

const CatalogueModalSummary = ({
  open,
  onClose,
  groupedData,
  loading = false,
  onEdit = () => {},
  title = "Catalogue Summary",
}) => {
  const dispatch = useDispatch();
  const [localRecords, setLocalRecords] = useState([]);
  const [feedback, setFeedback] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const MILL_MAP = {
    1: "ICM",
    2: "BU",
    3: "HM",
    4: "TY",
    5: "IM",
    6: "KF",
    7: "RF",
    8: "TK",
    9: "KM",
    10: "LE",
    11: "nan",
    12: "KK",
    13: "US",
    14: "FH",
    15: "GR",
  };

  const GRADE_ORDER = [
    "T",
    "TT",
    "C",
    "AB",
    "PB",
    "E",
    "AA",
    "SB",
    "HE",
    "UG3",
    "UG2",
    "UG1",
    "UG",
    "NL",
    "ML",
  ];

  useEffect(() => {
    if (open && groupedData) {
      const dataArray = Array.isArray(groupedData)
        ? groupedData
        : Object.values(groupedData);

      const sortedArray = dataArray.slice().sort((a, b) => {
        const aIndex = GRADE_ORDER.indexOf(a.grade);
        const bIndex = GRADE_ORDER.indexOf(b.grade);
        return (
          (aIndex === -1 ? Infinity : aIndex) -
          (bIndex === -1 ? Infinity : bIndex)
        );
      });

      setLocalRecords(sortedArray);
    }
  }, [open, groupedData]);

  // Shared helper for both functions
  const getUpdatedRecords = () =>
    localRecords.map((rec, index) => ({
      ...rec,
      lot: 7301 + index,
      agent_code: 49,
    }));

  const generateCatalogue = async () => {
    try {
      const updated = getUpdatedRecords();

      for (const rec of updated) {
        try {
          await dispatch(updateCoffee(rec)).unwrap();
        } catch (err) {
          console.error(`Failed to update record ID ${rec.id}:`, err);
        }
      }

      const resultAction = await dispatch(generateCatalogueFile(updated));

      if (generateCatalogueFile.fulfilled.match(resultAction)) {
        const { data, headers } = resultAction.payload;

        const blob = new Blob([data], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });

        const url = window.URL.createObjectURL(blob);
        const disposition = headers["content-disposition"];
        const match = disposition?.match(/filename="?(.+?)"?$/);
        const filename = match ? match[1] : "catalogue.xlsx";

        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", filename);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
      } else {
        console.error("Catalogue generation failed:", resultAction.payload);
      }
    } catch (error) {
      console.error("Error downloading catalogue:", error);
    }
  };

  const handleGenerateAuction = async () => {
    try {
      const updated = getUpdatedRecords();

      const result = await dispatch(generateAuctionFile(updated));
      if (generateAuctionFile.fulfilled.match(result)) {
        setFeedback({
          open: true,
          message: "Auction files generated and downloaded.",
          severity: "success",
        });
      } else {
        throw new Error(result.payload || "Auction file generation failed");
      }
    } catch (err) {
      console.error("Auction generation error:", err);
      setFeedback({
        open: true,
        message: "Failed to generate auction file.",
        severity: "error",
      });
    }
  };
  const handleGenerateSaleFile = () => {
    const saleNumber = "31";
    dispatch(generateSaleFile(saleNumber));
  };

  const handleDelete = (rec) => {
    const updated = localRecords.filter((r) => r.id !== rec.id);
    setLocalRecords(updated);
    setFeedback({ open: true, message: "Item removed.", severity: "success" });
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="xl" fullWidth>
        <DialogTitle
          sx={{
            bgcolor: "#121330",
            color: "#fff",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {title}
          <IconButton onClick={onClose} size="small" sx={{ color: "white" }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers sx={{ backgroundColor: "#f5f5f5" }}>
          <Box display="flex" gap={1} mb={2}>
            <Button
              variant="outlined"
              onClick={generateCatalogue}
              size="small"
              sx={{
                fontSize: "0.7rem",
                backgroundColor: "#f0f0f0",
                color: "#121330",
                textTransform: "none",
              }}
            >
              Generate Catalogue
            </Button>

            <Button
              variant="outlined"
              onClick={handleGenerateAuction}
              size="small"
              sx={{
                fontSize: "0.7rem",
                backgroundColor: "#e3f2fd",
                color: "#121330",
                textTransform: "none",
              }}
            >
              Generate Auction File
            </Button>
            <Button
              variant="outlined"
              onClick={handleGenerateSaleFile}
              size="small"
              sx={{
                fontSize: "0.7rem",
                backgroundColor: "orange",
                color: "white",
                fontWeight: "bold",
                textTransform: "none",
              }}
            >
              Generate Sale File
            </Button>
          </Box>

          {loading ? (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              minHeight="200px"
            >
              <CircularProgress />
            </Box>
          ) : (
            <Table size="small" sx={{ mt: 1, backgroundColor: "#fff" }}>
              <TableHead>
                <TableRow>
                  <TableCell>Lot</TableCell>
                  <TableCell>Outturn</TableCell>
                  <TableCell>Bulkoutturn</TableCell>
                  <TableCell>Mark</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Grade</TableCell>
                  <TableCell>Bags</TableCell>
                  <TableCell>Pockets</TableCell>
                  <TableCell>Weight</TableCell>
                  <TableCell>Sale</TableCell>
                  <TableCell>Season</TableCell>
                  <TableCell>Certificate</TableCell>
                  <TableCell>Mill</TableCell>
                  <TableCell>Warehouse</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>Buyer</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {localRecords.map((rec, index) => (
                  <TableRow key={rec.id || index}>
                    <TableCell>{7301 + index}</TableCell>
                    <TableCell>{rec.outturn}</TableCell>
                    <TableCell>{rec.bulkoutturn}</TableCell>
                    <TableCell>{rec.mark}</TableCell>
                    <TableCell>{rec.type}</TableCell>
                    <TableCell>{rec.grade}</TableCell>
                    <TableCell>{rec.bags}</TableCell>
                    <TableCell>{rec.pockets}</TableCell>
                    <TableCell>{rec.weight}</TableCell>
                    <TableCell>{rec.sale}</TableCell>
                    <TableCell>{rec.season}</TableCell>
                    <TableCell>{rec.certificate}</TableCell>
                    <TableCell>{MILL_MAP[rec.mill] || rec.mill}</TableCell>
                    <TableCell>{rec.warehouse}</TableCell>
                    <TableCell>{rec.price}</TableCell>
                    <TableCell>{rec.buyer}</TableCell>
                    <TableCell>{rec.status}</TableCell>
                    <TableCell>
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => onEdit(rec)}
                        sx={{ mr: 1 }}
                      >
                        <EditIcon fontSize="inherit" />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDelete(rec)}
                      >
                        <DeleteIcon fontSize="inherit" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </DialogContent>
      </Dialog>

      <Snackbar
        open={feedback.open}
        autoHideDuration={3000}
        onClose={() => setFeedback({ ...feedback, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setFeedback({ ...feedback, open: false })}
          severity={feedback.severity}
          sx={{ width: "100%" }}
        >
          {feedback.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default CatalogueModalSummary;
