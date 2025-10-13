import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Button } from "@mui/material";

const LogoutButton = () => {
  const { logout } = useAuth0();
  console.log(window.location.origin);

  return (
    <Button
      variant="contained"
      color="primary"
      sx={{
        borderRadius: 2,
        textTransform: "none",
        px: 3,
        py: 1,
        fontWeight: "bold",
        fontSize: "16px",
        backgroundColor: "error.main",
        "&:hover": {
          backgroundColor: "error.dark",
        },
        margin: "10%",
      }}
      onClick={() =>
        logout({
          logoutParams: { returnTo: "https://cebba.ke/cebba" },
        })
      }
    >
      Log Out
    </Button>
  );
};

export default LogoutButton;
