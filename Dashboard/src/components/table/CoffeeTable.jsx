import React, { useState } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper, Typography, Box, TablePagination, IconButton, TextField
} from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const TableDisplay = ({
  data = [],
  columns = [],
  loading = false,
  error = null,
  onEdit = () => {},
  onDelete = () => {}
}) => {
  const [page, setPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const rowsPerPage = 65;

  const handleChangePage = (_, newPage) => {
    setPage(newPage);
  };
  console.log('Data:', data);
  // Filter data by 'mark'
  const filteredData = Array.isArray(data)
  ? data.filter((row) =>
      row.mark?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  : [];

  // Add Actions column
  const extendedColumns = [
    ...columns,
    {
      field: 'actions',
      headerName: 'Actions',
      isAction: true
    }
  ];

  const hasData = Array.isArray(filteredData) && filteredData.length > 0;

  return (
    <Paper elevation={3} sx={{ width: '100%', overflow: 'hidden', m: 0, p: 0 }}>
      {loading ? (
        <Typography align="center" py={4}>Loading data...</Typography>
      ) : error ? (
        <Typography align="center" color="error" py={4}>
          Failed to load data: {error}
        </Typography>
      ) : hasData ? (
        <>
          <TableContainer
            sx={{
              overflow: 'auto',
              maxHeight: '100%',
              scrollbarWidth: 'none',
              '&::-webkit-scrollbar': { display: 'none' },
            }}
          >
            <Table stickyHeader sx={{ minWidth: 1000 }}>
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
                        whiteSpace: 'nowrap',
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
                      key={idx}
                      hover
                      sx={{
                        '&:hover': {
                          backgroundColor: '#ACCAFD',
                          cursor: 'pointer',
                        },
                      }}
                    >
                      {columns.map((col) => (
                        <TableCell
                          key={col.field}
                          sx={{ fontSize: '0.65rem', padding: '6px', whiteSpace: 'nowrap' }}
                        >
                          {row[col.field] ?? '--'}
                        </TableCell>
                      ))}
                      <TableCell sx={{ whiteSpace: 'nowrap' }}>
                        <IconButton
                          color="primary"
                          size="small"
                          onClick={() => onEdit(row)}
                          sx={{ mr: 1 }}
                        >
                          <EditIcon fontSize="inherit" />
                        </IconButton>
                        <IconButton
                          color="error"
                          size="small"
                          onClick={() => onDelete(row)}
                        >
                          <DeleteIcon fontSize="inherit" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
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
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          height="300px"
          width="100%"
          m={0}
        >
          <InfoOutlinedIcon sx={{ fontSize: 48, color: '#999' }} />
          <Typography variant="h6" mt={2} color="textSecondary">
            No information to display
          </Typography>
          <Typography variant="body2" color="text.secondary" maxWidth={400}>
            🤷‍♂️ It seems there’s currently no data available. Please contact the system administrator or try again later.
          </Typography>
        </Box>
      )}
    </Paper>
  );
};

export default TableDisplay;