// src/components/layout/Sidebar.jsx
import React, { useState } from "react";
import {
  Drawer,
  Toolbar,
  Box,
  List,
  useMediaQuery,
  Typography,
} from "@mui/material";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { useTheme } from "@mui/material/styles";
import SidebarNavItem from "../navitem/NavItem";
import LoginButton from "../auth/LoginButton";
import LogoutButton from "../auth/LogoutButton";
import { Divider } from "@mui/material";
import { Avatar } from "@mui/material";

const drawerWidth = 340;
const collapsedWidth = 72;

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Redux nav items
  const navItems = useSelector((state) => state.navigation.items);

  // Auth0 state
  const { isAuthenticated, isLoading, loginWithRedirect, logout, user } =
    useAuth0();

  const handleLogin = () => loginWithRedirect();
  const handleLogout = () =>
    logout({ logoutParams: { returnTo: window.location.origin } });

  const drawerContent = (
    <>
      <Toolbar />
      <Box sx={{ textAlign: "center", py: 2 }}>
        <Typography variant="h5" sx={{ mb: 1, fontWeight: "bold" }}>
          SMART MUG
        </Typography>
        {/* Display logged-in user info if authenticated */}
        {isAuthenticated && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 1,
              mt: 1,
              color: "orange",
            }}
          >
            {/* User Avatar */}
            <Avatar
              alt={user?.name}
              src={user?.picture}
              sx={{ width: 32, height: 32 }}
            />

            {/* User Name */}
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              {user?.name}
            </Typography>
          </Box>
        )}
      </Box>

      <Divider sx={{ width: "50%", mx: "auto", borderColor: "primary.main" }} />

      <Box sx={{ flexGrow: 1, overflowY: "auto", mt: 5 }}>
        <List
          disablePadding
          sx={{
            display: "flex",
            width: "auto",
            flexDirection: "column",
            gap: "8px", // space between items
            "& .MuiListItem-root": {
              paddingTop: "20px",
              paddingBottom: "10px",
              lineHeight: "1.6", // better readability
            },
            "& .MuiListItemButton-root": {
              minHeight: "48px",
            },
          }}
        >
          {/* Normal navigation items from Redux */}
          {navItems.map((item, idx) => (
            <SidebarNavItem
              key={idx}
              name={item.name}
              link={item.link}
              dropdown={item.dropdown}
              collapsed={collapsed}
              emoji={item.emoji}
              onExpandSidebar={() => setCollapsed(false)}
              isActive={
                typeof item.isActive === "function"
                  ? item.isActive(location.pathname)
                  : location.pathname.startsWith(item.link)
              }
            />
          ))}

          {/* Auth Menu Item */}
          {!isLoading && (
            <>
              {!isAuthenticated ? (
                // 🔐 Login Item
                <LoginButton />
              ) : (
                // 🚪 Logout Item
                <LogoutButton />
              )}
            </>
          )}
        </List>
      </Box>
    </>
  );

  return (
    <Drawer
      variant={isMobile ? "temporary" : "permanent"}
      open={!isMobile || !collapsed}
      onClose={() => setCollapsed(true)}
      ModalProps={{
        keepMounted: true, // Better performance on mobile
      }}
      sx={{
        width: collapsed ? collapsedWidth : drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: collapsed ? collapsedWidth : drawerWidth,
          boxSizing: "border-box",
          backgroundColor: "#121330",
          color: "white",
          overflowX: "hidden",
          transition: "width 0.3s ease",
          margin: isMobile ? 0 : "16px 0 16px 16px",
          borderRadius: isMobile ? 0 : "12px",
          height: isMobile ? "100%" : "calc(100% - 32px)",
        },
      }}
    >
      {drawerContent}
    </Drawer>
  );
}
