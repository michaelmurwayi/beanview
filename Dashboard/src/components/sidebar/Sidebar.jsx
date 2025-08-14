// src/components/layout/Sidebar.jsx
import React, { useState } from "react";
import { Drawer, Toolbar, Box, List } from "@mui/material";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import SidebarNavItem from "../navitem/NavItem";
import LogoutButton from "../auth/LogoutButton";

const drawerWidth = 240;

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  // Get nav items from Redux state (navigationSlice)
  const navItems = useSelector((state) => state.navigation.items);

  // Auth0 state
  const {
    isAuthenticated,
    isLoading,
    loginWithRedirect,
    logout,
    user,
  } = useAuth0();

  const handleLogin = () => loginWithRedirect();
  const handleLogout = () =>
    logout({ logoutParams: { returnTo: window.location.origin } });

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
          overflowX: "hidden",
          transition: "width 0.3s ease",
        },
      }}
    >
      <Toolbar />
      <Box sx={{ flexGrow: 1, overflowY: "auto", mt: 1 }}>
        <List disablePadding>
          {navItems.map((item, idx) => (
            <SidebarNavItem
              key={idx}
              name={item.name}
              link={item.link}
              dropdown={item.dropdown}
              collapsed={collapsed}
              emoji={item.emoji}
              onExpandSidebar={() => setCollapsed(false)}
              isActive={item.isActive(location.pathname)}
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
    </Drawer>
  );
}
