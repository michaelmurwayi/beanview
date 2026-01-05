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
  sale,
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
    "T", "TT", "C", "AB", "PB", "E", "AA", "SB", "HE",
    "UG3", "UG2", "UG1", "UG", "NL", "ML",
  ];

  /** ---------------------- BULKING ---------------------- */
  const handleBulking = (recordsList) => {
    if (!Array.isArray(recordsList) || recordsList.length === 0) return [];

    const safeNumber = (v) => (isNaN(Number(v)) ? 0 : Number(v));
    const groups = {};

    // Normalize and group
    recordsList.forEach((rec) => {
      const outturn = rec.outturn?.trim().toUpperCase();
      const grade = rec.grade?.trim().toUpperCase();
      const key = `${outturn}-${grade}`;
      if (!groups[key]) groups[key] = [];
      groups[key].push(rec);
    });

    const finalList = [];

    Object.values(groups).forEach((group) => {
      const base = group[0];
      if (group.length === 1) {
        // Only one record, no bulking
        finalList.push(base);
      } else {
        // Multiple records -> bulk
        const totalWeight = group.reduce((sum, r) => sum + safeNumber(r.weight), 0);
        const totalBags = Math.ceil(totalWeight / 60);

        finalList.push({
          ...base,
          weight: totalWeight,
          bags: totalBags,
          mark: `${base.grade} / Bulk`,
          bulked: true,
          pockets: base.pockets,
          type: base.type,
          sale: base.sale,
          season: base.season,
          certificate: base.certificate,
          mill: base.mill,
          warehouse: base.warehouse,
          price: base.price,
          buyer: base.buyer,
          status: base.status,
        });
      }
    });

    return finalList;
  };

  /** ---------------------- useEffect ---------------------- */
  useEffect(() => {
    if (open && groupedData) {
      const dataArray = Array.isArray(groupedData)
        ? groupedData
        : Object.values(groupedData);

      // Sort by grade order
      const sortedArray = dataArray.slice().sort((a, b) => {
        const aIndex = GRADE_ORDER.indexOf(a.grade?.trim().toUpperCase());
        const bIndex = GRADE_ORDER.indexOf(b.grade?.trim().toUpperCase());
        return (aIndex === -1 ? Infinity : aIndex) -
               (bIndex === -1 ? Infinity : bIndex);
      });

      const bulked = handleBulking(sortedArray);
      setLocalRecords(sortedArray);
    }
  }, [open, groupedData]);

  /** ---------------------- Helpers ---------------------- */
  const getUpdatedRecords = () =>
    localRecords.map((rec, index) => ({
      ...rec,
      lot: 7301 + index,
      agent_code: 49,
    }));

  /** ---------------------- GENERATE FILES ---------------------- */
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
        const blob = new Blob([data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
        const url = window.URL.createObjectURL(blob);
        const filename = headers["content-disposition"]?.match(/filename="?(.+?)"?$/)?.[1] || "catalogue.xlsx";
        const link = document.createElement("a");
        link.href = url;
        link.download = filename;
        link.click();
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error("Error downloading catalogue:", error);
    }
  };

  const handleGenerateAuction = async () => {
    try {
      const updated = getUpdatedRecords();
      const res = await dispatch(generateAuctionFile(updated));
      if (generateAuctionFile.fulfilled.match(res)) {
        setFeedback({ open: true, message: "Auction files generated.", severity: "success" });
      } else throw new Error(res.payload || "Auction failed");
    } catch (err) {
      console.error(err);
      setFeedback({ open: true, message: "Failed to generate auction file.", severity: "error" });
    }
  };

  const handleGenerateSaleFile = async () => {
    try {
      const resultAction = await dispatch(generateSaleFile({ "sale number": sale }));
      if (generateSaleFile.fulfilled.match(resultAction)) {
        const { data, headers } = resultAction.payload;
        const blob = new Blob([data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
        const url = window.URL.createObjectURL(blob);
        const filename = headers["content-disposition"]?.match(/filename="?(.+?)"?$/)?.[1] || "sale_summary.xlsx";
        const link = document.createElement("a");
        link.href = url;
        link.download = filename;
        link.click();
        window.URL.revokeObjectURL(url);
      }
    } catch (err) {
      console.error("Sale summary error:", err);
    }
  };

  const handleDelete = (rec) => {
    setLocalRecords(localRecords.filter((r) => r.id !== rec.id));
    setFeedback({ open: true, message: "Item removed.", severity: "success" });
  };

  /** ---------------------- UI ---------------------- */
  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="xl" fullWidth>
        <DialogTitle sx={{ bgcolor: "#121330", color: "#fff", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          {title}
          <IconButton onClick={onClose} size="small" sx={{ color: "white" }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers sx={{ backgroundColor: "#f5f5f5" }}>
          <Box display="flex" gap={1} mb={2}>
            <Button variant="outlined" onClick={generateCatalogue} size="small">Generate Catalogue</Button>
            <Button variant="outlined" onClick={handleGenerateAuction} size="small">Generate Auction File</Button>
            <Button variant="outlined" onClick={handleGenerateSaleFile} size="small" sx={{ backgroundColor: "#FFA500", color: "white" }}>Generate Sale Summary</Button>
          </Box>

          {loading ? (
            <Box display="flex" justifyContent="center" minHeight="200px">
              <CircularProgress />
            </Box>
          ) : (
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Lot</TableCell>
                  <TableCell>Outturn</TableCell>
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
                </TableRow>
              </TableHead>

              <TableBody>
                {localRecords.map((rec, index) => (
                  <TableRow key={rec.id || index}>
                    <TableCell>{7301 + index}</TableCell>
                    <TableCell>{rec.outturn}</TableCell>
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
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </DialogContent>
      </Dialog>

      <Snackbar open={feedback.open} autoHideDuration={3000} onClose={() => setFeedback({ ...feedback, open: false })}>
        <Alert severity={feedback.severity} onClose={() => setFeedback({ ...feedback, open: false })}>
          {feedback.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default CatalogueModalSummary;
