import { Box, Typography, Grid, Divider, colors } from '@mui/material';

const SummaryBox = ({ data }) => {
  const totalBags = data.reduce((sum, row) => sum + (parseInt(row.bags) || 0), 0);
  const totalWeight = data.reduce((sum, row) => sum + (parseFloat(row.weight) || 0), 0);

  const gradeBreakdown = data.reduce((acc, row) => {
    const grade = row.grade || 'Unknown';
    const weight = parseFloat(row.weight) || 0;
    acc[grade] = (acc[grade] || 0) + weight;
    return acc;
  }, {});

  return (
    <Box
      sx={{
        backgroundColor: '#121331',
        color: '#ffffff',
        p: 4,
        borderRadius: 2,
        mt: 2,
        mb: 2,
        maxWidth: 900,
        width: '100%',
        mx: 'auto',
      }}
    >
      <Typography variant="h6" gutterBottom align="center" sx={{ fontWeight: 600 }}>
        Stock Summary
      </Typography>

      <Grid container spacing={3} justifyContent="center" alignItems="center">
        <Grid item xs={6} md={3}>
          <Typography variant="subtitle2" gutterBottom>Total Bags</Typography>
          <Typography variant="body1">{totalBags}</Typography>
        </Grid>

        <Grid item xs={6} md={3}>
          <Typography variant="subtitle2" gutterBottom>Total Weight (kg)</Typography>
          <Typography variant="body1">{totalWeight.toFixed(2)}</Typography>
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography variant="subtitle2" gutterBottom>Weight Breakdown by Grade</Typography>
          <Divider sx={{ backgroundColor: '#ffffff20', mb: 1 }} />
          <Grid container spacing={1}>
            {Object.entries(gradeBreakdown).map(([grade, weight]) => (
              <Grid item xs={6} key={grade}>
                <Typography variant="caption">
                  <b style={{ color: "brown" }}>{grade}: </b>{weight.toFixed(2)} 
                </Typography>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SummaryBox;
