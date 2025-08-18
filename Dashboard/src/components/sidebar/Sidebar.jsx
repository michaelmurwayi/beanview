// src/components/layout/Sidebar.jsx
import React, { useState } from "react";
import { Drawer, Toolbar, Box, List, useMediaQuery } from "@mui/material";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { useTheme } from "@mui/material/styles";
import SidebarNavItem from "../navitem/NavItem";
import LogoutButton from "../auth/LogoutButton";

const drawerWidth = 240;
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
      <Box sx={{ flexGrow: 1, overflowY: "auto", mt: 1 }}>
        <List
          disablePadding
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "8px", // space between items
            "& .MuiListItem-root": {
              paddingTop: "10px",
              paddingBottom: "10px",
              lineHeight: "1.6", // better readability
            },
            "& .MuiListItemButton-root": {
              minHeight: "48px",
            },
          }}
        >
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
                <SidebarNavItem
                  name="Login"
                  collapsed={collapsed}
                  emoji="🔑"
                  link="#"
                  onExpandSidebar={() => setCollapsed(false)}
                  dropdown={[
                    {
                      name: "Sign In",
                      link: "#",
                      icon: "➡️",
                      onClick: handleLogin,
                    },
                  ]}
                />
              ) : (
                <SidebarNavItem
                  name={user?.name || "Logout"}
                  collapsed={collapsed}
                  emoji="🚪"
                  link="#"
                  onExpandSidebar={() => setCollapsed(false)}
                  dropdown={[
                    {
                      name: "",
                      link: "#",
                      icon: <LogoutButton />,
                    },
                  ]}
                />
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
