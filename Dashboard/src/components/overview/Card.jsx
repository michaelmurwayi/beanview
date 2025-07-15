import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';

const StatCard = ({ header, stat, text }) => {
  return (
    <Card
      sx={{
        minWidth: 300,
        borderRadius: 3,
        boxShadow: 3,
        bgcolor: '#ffffff',
        backgroundImage: 'url(https://i.pinimg.com/736x/d1/73/b5/d173b5f9086434078208a8ecb43fef99.jpg)',
      }}
    >
      <CardContent>
        <Typography
          variant="subtitle2"
          color="#00C2FF"
          gutterBottom
          mt={1}
        >
          {header}
        </Typography>

        <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'white' }}>
          {stat}
        </Typography>

        <Typography variant="body2" color="white">
          {text}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default StatCard;
