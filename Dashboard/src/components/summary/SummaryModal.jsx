import {
    Dialog,
    DialogTitle,
    DialogContent,
    Typography,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    IconButton,
    Box,
    Divider,
    CircularProgress,
    Button
  } from '@mui/material';
  import CloseIcon from '@mui/icons-material/Close';
  import { generateSummaryExcel } from "../../utils/generateStockSummaryExcel"

  const StockSummaryModal = ({ open, onClose, groupedData, loading }) => {
    return (
      <Dialog open={open} onClose={onClose} maxWidth="xl" fullWidth>
        <DialogTitle
          sx={{
            bgcolor: '#121330',
            color: '#fff',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          Stock Summary Preview
          <IconButton onClick={onClose} size="small" sx={{ color: 'white' }}>
            <CloseIcon />
          </IconButton>

        </DialogTitle>
  
        <DialogContent dividers sx={{ backgroundColor: '#f5f5f5' }}>
            <Button
            variant="outlined"
            onClick={() => generateSummaryExcel(groupedData)}
            size="small"
            sx={{ fontSize: '0.7rem', backgroundColor: '#f0f0f0', color: '#121330' }}
            >
            Export Excel
            </Button>

          {loading ? (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
              <CircularProgress />
            </Box>
          ) : (
            Object.entries(groupedData).map(([mark, records]) => (
              <Box key={mark} mb={4}>
                <Typography variant="h6" sx={{ color: '#1976d2', fontWeight: 600 }}>
                  {mark}
                </Typography>
                <Table size="small" sx={{ mt: 1, backgroundColor: '#fff' }}>
                  <TableHead>
                    <TableRow>
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
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {records.map((rec) => (
                      <TableRow key={rec.id}>
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
                        <TableCell>{rec.mill}</TableCell>
                        <TableCell>{rec.warehouse}</TableCell>
                        <TableCell>{rec.price}</TableCell>
                        <TableCell>{rec.buyer}</TableCell>
                        <TableCell>{rec.status}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <Divider sx={{ mt: 2 }} />
              </Box>
            ))
          )}
        </DialogContent>
      </Dialog>
    );
  };
  
  export default StockSummaryModal;
  