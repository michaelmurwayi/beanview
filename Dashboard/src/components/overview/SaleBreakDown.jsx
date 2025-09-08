import React, { useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

const CoffeeSaleNumberBreakdownTable = ({ filteredRecords }) => {
  // Aggregate coffee data by sale number
  const breakdown = useMemo(() => {
    return filteredRecords.reduce((acc, record) => {
      const saleNumber = record?.sale || "Unknown";
      if (!acc[saleNumber]) {
        acc[saleNumber] = { bags: 0, weight: 0 };
      }
      acc[saleNumber].bags += record.bags || 0;
      acc[saleNumber].weight += parseFloat(record.weight) || 0;
      return acc;
    }, {});
  }, [filteredRecords]);

  // Generate rows from breakdown
  const rows = Object.entries(breakdown).map(([saleNumber, data]) => ({
    saleNumber,
    bags: data.bags,
    weight: data.weight,
  }));

  return (
    <Paper
      elevation={3}
      sx={{
        p: 0,
        mt: 2,
        width: "100%",
        height: "50vh",
        borderRadius: "0px",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <TableContainer
        sx={{
          flex: 1,
          overflowY: "scroll",
          "&::-webkit-scrollbar": { display: "none" }, // Chrome, Safari
          scrollbarWidth: "none", // Firefox
          msOverflowStyle: "none", // Edge & IE
        }}
      >
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell
                colSpan={3}
                sx={{
                  backgroundColor: "#121330",
                  color: "orange",
                  fontWeight: "bold",
                  textAlign: "right",
                }}
              >
                Coffee Breakdown by Sale Number
              </TableCell>
            </TableRow>
            <TableRow sx={{ backgroundColor: "" }}>
              <TableCell sx={{ color: "black", fontWeight: "bold" }}>
                Sale Number
              </TableCell>
              <TableCell
                align="right"
                sx={{ color: "black", fontWeight: "bold" }}
              >
                Bags
              </TableCell>
              <TableCell
                align="right"
                sx={{ color: "black", fontWeight: "bold" }}
              >
                Total Weight (kg)
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.length > 0 ? (
              rows.map((row) => (
                <TableRow key={row.saleNumber}>
                  <TableCell>{row.saleNumber}</TableCell>
                  <TableCell align="right">{row.bags}</TableCell>
                  <TableCell align="right">{row.weight.toFixed(2)}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} align="center">
                  No data available.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default CoffeeSaleNumberBreakdownTable;
