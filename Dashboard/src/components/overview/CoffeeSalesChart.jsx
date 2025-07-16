import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from 'recharts';
import { Paper, Typography, Box, useTheme } from '@mui/material';

const CoffeeSalesChart = ({ coffeeRecords = [] }) => {
  const theme = useTheme(); // Optional: for consistent MUI theming

  // Group by sale and sum weights
  const salesSummary = {};

  coffeeRecords.forEach(({ sale, weight }) => {
    if (!sale) return;
    if (!salesSummary[sale]) {
      salesSummary[sale] = 0;
    }
    salesSummary[sale] += parseFloat(weight) || 0;
  });

  const data = Object.entries(salesSummary).map(([sale, totalWeight]) => ({
    sale,
    totalWeight: parseFloat(totalWeight.toFixed(2)),
  }));

  return (
    <Box sx={{ width: '100%', mt: 4, display: 'flex', justifyContent: 'center' }}>
      <Paper
        elevation={6}
        sx={{
          p: 3,
          borderRadius: 4,
          height: '70vh',
          width: '100vw',
          maxWidth: '1000px',
          backgroundColor: '#ffffff',
          boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
        }}
      >
        <Typography
          variant="h6"
          sx={{
            mb: 2,
            fontWeight: 700,
            color: theme.palette.primary.main,
            textTransform: 'uppercase',
            letterSpacing: 0.5,
          }}
        >
          Total Weight by Sale
        </Typography>

        {data.length === 0 ? (
          <Typography sx={{ mt: 4, color: 'text.secondary' }}>
            No data available for chart
          </Typography>
        ) : (
          <Box sx={{ flexGrow: 1, width: '100%', height: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data}
                margin={{ top: 20, right: 30, left: 10, bottom: 50 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="sale"
                  angle={-35}
                  textAnchor="end"
                  interval={0}
                  height={80}
                  tick={{ fontSize: 12 }}
                />
                <YAxis
                  tick={{ fontSize: 12 }}
                  label={{
                    value: 'Weight (kg)',
                    angle: -90,
                    position: 'insideLeft',
                    fontSize: 13,
                    fill: '#555',
                  }}
                />
                <Tooltip
                  contentStyle={{ backgroundColor: '#f9f9f9', borderRadius: 8 }}
                  labelStyle={{ fontWeight: 'bold' }}
                />
                <Legend
                  verticalAlign="top"
                  height={36}
                  iconType="circle"
                  formatter={(value) => (
                    <span style={{ color: '#333', fontSize: 13 }}>{value}</span>
                  )}
                />
                <Bar
                  dataKey="totalWeight"
                  fill={theme.palette.primary.main}
                  barSize={45}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default CoffeeSalesChart;
