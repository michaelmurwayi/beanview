import React, { useState } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper, Typography, Box, TablePagination
} from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

const TableDisplay = ({ data = [], columns = [], loading = false, error = null }) => {
  const hasData = Array.isArray(data) && data.length > 0;

  const [page, setPage] = useState(0);
  const rowsPerPage = 70;

  const handleChangePage = (_, newPage) => {
    setPage(newPage);
  };

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
          <TableContainer sx={{ overflowX: 'auto', maxHeight: '600px' }}>
            <Table stickyHeader sx={{ minWidth: 1000 }}>
              <TableHead>
                <TableRow>
                  {columns.map((col) => (
                    <TableCell
                      key={col.field}
                      sx={{
                        fontWeight: 'bold',
                        fontSize: '0.75rem',
                        backgroundColor: '#f0f0f0',
                        color: '#333',
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
                {data
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
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            component="div"
            count={data.length}
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
