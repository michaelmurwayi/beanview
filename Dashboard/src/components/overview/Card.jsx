import React from "react";
import { Card, CardContent, Typography, Box } from "@mui/material";

const StatCard = ({ header, stat, text }) => {
  return (
    <Card
      sx={{
        minWidth: 250,
        borderRadius: 4,
        boxShadow: "0 4px 15px rgba(0, 0, 0, 0.3)",
        background: "linear-gradient(135deg, #121330 0%, #1e1f47 100%)",
        color: "white",
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
        "&:hover": {
          transform: "translateY(-5px)",
          boxShadow: "0 8px 25px rgba(0, 0, 0, 0.4)",
        },
      }}
    >
      <CardContent>
        {/* Header */}
        <Typography
          variant="subtitle2"
          sx={{
            textTransform: "uppercase",
            letterSpacing: "1px",
            color: "#00C2FF",
            fontWeight: 600,
            textAlign: "center",
            mb: 1,
          }}
        >
          {header}
        </Typography>

        {/* Main Statistic */}
        <Typography
          variant="h4"
          sx={{
            fontWeight: "bold",
            fontSize: {
              xs: "1.6rem",
              sm: "1.8rem",
              md: "2rem",
            },
            textAlign: "center",
            color: "orange",
            mb: 1,
          }}
        >
          {stat}
        </Typography>

        {/* Description */}
        <Typography
          variant="body2"
          sx={{
            textAlign: "center",
            fontSize: "0.9rem",
            color: "rgba(255, 255, 255, 0.8)",
          }}
        >
          {text}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default StatCard;
