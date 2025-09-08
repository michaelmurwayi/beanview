import React, { useState } from "react";
import {
  ListItem,
  ListItemText,
  Collapse,
  List,
  ListItemButton,
  Tooltip,
  Box,
} from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import "./NavItem.css"; // Import CSS file

const SidebarNavItem = ({
  name,
  link,
  dropdown,
  collapsed = false,
  emoji,
  onExpandSidebar,
}) => {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  // Determine if top-level item is active
  const isActive =
    location.pathname === link ||
    (dropdown && dropdown.some((item) => location.pathname === item.link));

  // --- Handlers ---
  const handleMouseEnter = () => {
    if (!collapsed && dropdown) setOpen(true);
  };

  const handleMouseLeave = () => {
    if (!collapsed && dropdown) setOpen(false);
  };

  const handleClick = (e) => {
    if (!link || (collapsed && dropdown)) {
      e.preventDefault();

      if (collapsed && typeof onExpandSidebar === "function") {
        onExpandSidebar();
        setTimeout(() => setOpen(true), 150);
      } else {
        setOpen((prev) => !prev);
      }
    }
  };

  return (
    <Box
      className="sidebar-nav-box"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Top-level navigation item */}
      <Tooltip
        title={collapsed ? name : ""} // Show tooltip only when collapsed
        placement="right"
        arrow
      >
        <ListItem
          button
          component={link ? Link : "div"}
          to={link || "#"}
          onClick={handleClick}
          className={`sidebar-item ${isActive ? "active" : ""} ${
            collapsed ? "collapsed" : ""
          }`}
        >
          {/* Icon or emoji */}
          {emoji && <span className="sidebar-emoji">{emoji}</span>}

          {/* Show text only when sidebar is not collapsed */}
          {!collapsed && (
            <ListItemText
              primary={name}
              primaryTypographyProps={{
                fontWeight: "bold",
                fontSize: "0.9rem",
                noWrap: true, // Prevent text from wrapping to next line
                sx: {
                  overflow: "hidden",
                  textOverflow: "ellipsis", // Adds "..." if text is too long
                  whiteSpace: "nowrap",
                },
              }}
            />
          )}
        </ListItem>
      </Tooltip>

      {/* Dropdown menu */}
      {dropdown && (open || !collapsed) && (
        <Collapse in={open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding className="dropdown-container">
            {dropdown.map((subItem, idx) => {
              const isSubActive = location.pathname === subItem.link;
              return (
                <ListItemButton
                  key={idx}
                  component={Link}
                  to={subItem.link}
                  className={`dropdown-item ${isSubActive ? "active" : ""}`}
                >
                  <ListItemText
                    primary={subItem.name}
                    primaryTypographyProps={{
                      fontSize: "0.8rem",
                      fontWeight: 900,
                    }}
                  />
                  {subItem.icon && (
                    <span className="dropdown-icon">{subItem.icon}</span>
                  )}
                </ListItemButton>
              );
            })}
          </List>
        </Collapse>
      )}
    </Box>
  );
};

SidebarNavItem.propTypes = {
  name: PropTypes.string.isRequired,
  link: PropTypes.string,
  dropdown: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      link: PropTypes.string.isRequired,
      icon: PropTypes.node,
    })
  ),
  collapsed: PropTypes.bool,
  emoji: PropTypes.node,
  onExpandSidebar: PropTypes.func,
};

export default SidebarNavItem;
