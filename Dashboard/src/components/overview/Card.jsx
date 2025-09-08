import React from "react";
import { Card, CardContent, Typography, Box } from "@mui/material";

const StatCard = ({ header, stat, text }) => {
  return (
    <Card
      sx={{
        minWidth: 250,
        borderRadius: 3,
        boxShadow: 3,
        bgcolor: "#ffffff",
        backgroundImage:
          "url(https://i.pinimg.com/736x/d1/73/b5/d173b5f9086434078208a8ecb43fef99.jpg)",
      }}
    >
      <CardContent>
        <Typography
          variant="h5"
          color="#00C2FF"
          gutterBottom
          mt={1}
          textAlign={"center"}
        >
          {header}
        </Typography>

        <Typography
          variant="h4"
          sx={{
            fontWeight: "bold",
            fontSize: "1.2rem",
            color: "orange",
            textAlign: "center",
          }}
        >
          {stat}
        </Typography>

        <Typography
          variant="body2"
          color="white"
          sx={{ textAlign: "center", fontWeight: "" }}
        >
          {text}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default StatCard;
