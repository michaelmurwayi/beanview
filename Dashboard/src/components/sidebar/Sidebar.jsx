import { useState } from "react";
import { useSelector } from "react-redux";
import {
  Drawer,
  List,
  CssBaseline,
  IconButton,
  Box,
  Divider,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
  Slide,
  Fade,
} from "@mui/material";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import MenuIcon from "@mui/icons-material/Menu";
import SidebarNavItem from "../navitem/NavItem";
import PeopleIcon from "@mui/icons-material/People";
import AddIcon from "@mui/icons-material/Add";
import ListIcon from "@mui/icons-material/ListAlt";
import KeyboardCommandKeyIcon from '@mui/icons-material/KeyboardCommandKey';
import FileIcon from "@mui/icons-material/Description";

const iconMap = {
  farmers: <PeopleIcon />, 
  add: <AddIcon />, 
  list: <ListIcon />,
  file: <FileIcon />,
};

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navItems = useSelector((state) => state.navigation.items);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const toggleSidebar = () => setCollapsed(prev => !prev);
  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  const drawerWidth = collapsed ? 70 : 240;

  const mapIcons = (item) => ({
    ...item,
    icon: iconMap[item.iconKey],
    emoji: item.emoji,
    dropdown: item.dropdown?.map((subItem) => ({
      ...subItem,
      icon: iconMap[subItem.iconKey],
    })),
  });

  const drawerContent = (
    <Slide direction="right" in mountOnEnter unmountOnExit>
      <Box
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          transition: 'all 0.3s ease',
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'center', px: 1, pt: 2 }}>
          <Tooltip
            title={collapsed ? "Expand" : "Collapse"}
            placement="right"
            arrow
          >
            <IconButton
              onClick={toggleSidebar}
              size="small"
              sx={{
                color: 'white',
                border: '1px solid #121330',
                borderRadius: '8px',
                width: 40,
                p: 0.5,
                '&:hover': {
                  backgroundColor: '#1c1d47',
                },
                transition: 'all 0.3s ease',
              }}
            >
              {collapsed ? <MenuIcon /> : <MenuOpenIcon />}
            </IconButton>
          </Tooltip>
        </Box>

        <Fade in>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: collapsed ? 'center' : 'space-between',
              px: collapsed ? 0 : 3,
              py: 4,
              transition: 'all 0.3s ease',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <KeyboardCommandKeyIcon sx={{ color:"brown",mr: collapsed ? 0 : 1 }} />
              {!collapsed && (
                <Typography variant="h6" noWrap>
                  BREWLYSTICS
                </Typography>
              )}
            </Box>
          </Box>
        </Fade>

        <Divider sx={{ borderColor: '#333' }} />

        <Box sx={{ flexGrow: 1, overflowY: 'auto', mt: 1 }}>
          <List>
            {navItems.map((item, index) => (
              <SidebarNavItem
              key={index}
              {...mapIcons(item)}
              collapsed={collapsed}
              onExpandSidebar={() => setCollapsed(false)} // 👈 Pass this prop
            />
            ))}
          </List>
        </Box>

        <Divider sx={{ borderColor: '#333' }} />

        <Fade in>
          <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: collapsed ? 'center' : 'flex-start', textAlign: collapsed ? 'center' : 'left' }}>
            {!collapsed && (
              <Typography variant="body2" color="brown" sx={{ fontSize: '0.6rem', textAlign: 'center' }}>
                Copywrites © 2024 Brewlystics. All rights reserved.
              </Typography>
            )}
          </Box>
        </Fade>
      </Box>
    </Slide>
  );

  return (
    <>
      <CssBaseline />
      {isMobile ? (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            [`& .MuiDrawer-paper`]: {
              width: drawerWidth,
              boxSizing: 'border-box',
              backgroundColor: '#121330',
              color: '#fff',
              transition: 'width 0.3s ease',
            },
          }}
        >
          {drawerContent}
        </Drawer>
      ) : (
        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: {
              width: drawerWidth,
              boxSizing: 'border-box',
              backgroundColor: '#121330',
              color: '#fff',
              transition: 'width 0.3s ease',
              overflowX: 'hidden',
            },
          }}
        >
          {drawerContent}
        </Drawer>
      )}
    </>
  );
};

export default Sidebar;
