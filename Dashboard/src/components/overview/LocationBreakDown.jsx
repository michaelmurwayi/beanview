import React, { useMemo, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

const CoffeeLocationBreakdownTable = ({
  filteredRecords,
  onUniqueLocationsExtracted,
}) => {
  // Aggregate coffee data by county
  const breakdown = useMemo(
    () =>
      filteredRecords.reduce((acc, record) => {
        const location = record?.farmer?.County || "Unknown";
        if (!acc[location]) {
          acc[location] = { bags: 0, weight: 0 };
        }
        acc[location].bags += record.bags || 0;
        acc[location].weight += parseFloat(record.weight) || 0;
        return acc;
      }, {}),
    [filteredRecords]
  );

  // Get unique counties
  const locations = Object.keys(breakdown);

  // Notify parent component of the extracted unique locations
  useEffect(() => {
    if (typeof onUniqueLocationsExtracted === "function") {
      onUniqueLocationsExtracted(locations);
    }
  }, [locations, onUniqueLocationsExtracted]);

  // Prepare rows for rendering
  const rows = locations.map((location) => ({
    location,
    bags: breakdown[location].bags,
    weight: breakdown[location].weight,
  }));

  return (
    <Paper
      elevation={3}
      sx={{
        p: 0,
        mt: 2,
        width: "100%",
        borderRadius: "0px",
        height: "50vh",
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
                  textAlign: "right",
                  fontWeight: "bold",
                }}
              >
                Coffee Breakdown by Location
              </TableCell>
            </TableRow>
            <TableRow sx={{ backgroundColor: "#121330" }}>
              <TableCell sx={{ color: "#121330", fontWeight: "bold" }}>
                County
              </TableCell>
              <TableCell
                align="right"
                sx={{ color: "#121330", fontWeight: "bold" }}
              >
                Bags
              </TableCell>
              <TableCell
                align="right"
                sx={{ color: "#121330", fontWeight: "bold" }}
              >
                Total Weight (kg)
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.length > 0 ? (
              rows.map((row) => (
                <TableRow key={row.location}>
                  <TableCell>{row.location}</TableCell>
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

export default CoffeeLocationBreakdownTable;
