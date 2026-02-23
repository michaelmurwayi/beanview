import React, { useState, useMemo, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  TablePagination,
  IconButton,
  TextField
} from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const TableDisplay = ({
  data = [],
  columns = [],
  error = null,
  onEdit = () => {},
  onDelete = () => {},
}) => {
  const [page, setPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const rowsPerPage = 65;

  // Reset page when data or search changes
  useEffect(() => setPage(0), [data, searchTerm]);

  // Flatten nested fields for safe access
  const flattenedData = useMemo(() => {
    if (!Array.isArray(data)) return [];
    return data.map((row) => ({
      ...row,
      mark: row.farmer?.mark || '--',
      farmer_name: row.farmer?.name || '--',
      county: row.farmer?.County || '--',
    }));
  }, [data]);

  // Filter data based on search term
  const filteredData = useMemo(() => {
    if (!searchTerm.trim()) return flattenedData;
    const lowerSearch = searchTerm.toLowerCase();
    return flattenedData.filter((row) =>
      String(row.mark).toLowerCase().includes(lowerSearch)
    );
  }, [flattenedData, searchTerm]);

  const extendedColumns = [...columns, { field: 'actions', headerName: 'Actions', isAction: true }];
  const hasData = filteredData.length > 0;

  const handleChangePage = (_, newPage) => setPage(newPage);

  return (
    <Paper elevation={3} sx={{ width: '100%', overflow: 'hidden' }}>
      {/* Search Input */}
      {/* Error Display */}
      {error ? (
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          height="300px"
        >
          <InfoOutlinedIcon sx={{ fontSize: 48, color: 'error.main' }} />
          <Typography variant="h6" mt={2} color="error">
            Failed to load data
          </Typography>
          <Typography variant="body2" color="text.secondary">{error}</Typography>
        </Box>
      ) : hasData ? (
        <>
          {/* Table */}
          <TableContainer
            sx={{
              maxHeight: '75vh',
              scrollbarWidth: 'none',
              '&::-webkit-scrollbar': { display: 'none' },
            }}
          >
            <Table stickyHeader size="small">
              <TableHead>
                <TableRow>
                  {extendedColumns.map((col) => (
                    <TableCell
                      key={col.field}
                      sx={{
                        fontWeight: 'bold',
                        fontSize: '0.75rem',
                        backgroundColor: '#121330',
                        color: 'white',
                        padding: '6px',
                      }}
                    >
                      {col.headerName}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>

              <TableBody>
                {filteredData
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, idx) => (
                    <TableRow
                      key={row.id || idx}
                      hover
                      sx={{ '&:hover': { backgroundColor: '#ACCAFD' } }}
                    >
                      {columns.map((col) => (
                        <TableCell
                          key={col.field}
                          sx={{ fontSize: '0.7rem', padding: '6px' }}
                        >
                          {row[col.field] ?? '--'}
                        </TableCell>
                      ))}

                      {/* Actions */}
                      <TableCell>
                        <IconButton color="primary" size="small" onClick={() => onEdit(row)}>
                          <EditIcon fontSize="inherit" />
                        </IconButton>
                        <IconButton color="error" size="small" onClick={() => onDelete(row)}>
                          <DeleteIcon fontSize="inherit" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pagination */}
          <TablePagination
            component="div"
            count={filteredData.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            rowsPerPageOptions={[]}
          />
        </>
      ) : (
        /* No Data */
        <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="300px">
          <InfoOutlinedIcon sx={{ fontSize: 48, color: '#999' }} />
          <Typography variant="h6" mt={2}>No information to display</Typography>
          <Typography variant="body2" color="text.secondary">No records found</Typography>
        </Box>
      )}
    </Paper>
  );
};

export default TableDisplay;