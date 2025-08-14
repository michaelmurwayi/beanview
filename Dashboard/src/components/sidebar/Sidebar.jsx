import React, { useState } from "react";
import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Box,
} from "@mui/material";
import { Home, Coffee, Logout, Login } from "@mui/icons-material"; // example icons
import LogoutButton from "../auth/LogoutButton"; // adjust path

const drawerWidth = 240;

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  const navItems = [
    { label: "Home", icon: <Home />, path: "/" },
    { label: "Coffee", icon: <Coffee />, path: "/coffee" },
  ];

  const isAuthenticated = false; // Replace with actual auth state

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: collapsed ? 72 : drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: collapsed ? 72 : drawerWidth,
          boxSizing: "border-box",
          backgroundColor: "#121330",
          color: "white",
        },
      }}
    >
      <Toolbar />
      <Box sx={{ flexGrow: 1, overflowY: "auto", mt: 1 }}>
        <List>
          {navItems.map((item, index) => (
            <ListItemButton
              key={index}
              sx={{
                color: "white",
                "&:hover": { backgroundColor: "#1c1d47" },
              }}
            >
              <ListItemIcon sx={{ color: "white" }}>{item.icon}</ListItemIcon>
              {!collapsed && <ListItemText primary={item.label} />}
            </ListItemButton>
          ))}

          {/* Auth Buttons */}
          {!isAuthenticated ? (
            <ListItemButton
              sx={{
                mt: 2,
                color: "white",
                "&:hover": { backgroundColor: "#1c1d47" },
              }}
            >
              <ListItemIcon sx={{ color: "white" }}>
                <Login />
              </ListItemIcon>
              {!collapsed && <ListItemText></ListItemText>}
            </ListItemButton>
          ) : (
            <ListItemButton
              sx={{
                mt: 2,
                color: "white",
                "&:hover": { backgroundColor: "#1c1d47" },
              }}
            >
              <ListItemIcon sx={{ color: "white" }}></ListItemIcon>
              {!collapsed && (
                <ListItemText>
                  <LogoutButton />
                </ListItemText>
              )}
            </ListItemButton>
          )}
        </List>
      </Box>
      <Logout />
    </Drawer>
  );
}
