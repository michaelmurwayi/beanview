import { useState } from "react";
import {
  ListItem,
  ListItemText,
  Collapse,
  List,
  ListItemButton,
  Tooltip,
} from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import "./NavItem.css";

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

  const isActive =
    location.pathname === link ||
    (dropdown && dropdown.some((item) => location.pathname === item.link));

  const handleMouseEnter = () => !collapsed && dropdown && setOpen(true);
  const handleMouseLeave = () => !collapsed && dropdown && setOpen(false);

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
    <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <Tooltip title={collapsed ? name : ""} placement="center" arrow>
        <ListItem
          button
          component={link ? Link : "div"}
          to={link || "#"}
          onClick={handleClick}
          className={`sidebar-item ${isActive ? "active" : ""}`}
          sx={{
            backgroundColor: isActive ? "#1e1e1e" : "#121330",
            color: "#fff",

            borderLeft: isActive
              ? "4px solid #00e676"
              : "4px solid transparent",
            "&:hover": {
              backgroundColor: "#00e676",
              borderLeft: "4px solid #00e676",
            },
            display: "flex",
            alignItems: "center",
            justifyContent: collapsed ? "center" : "flex-start",
            margin: "10px",
            width: "inherit",
            marginTop: "10%",
          }}
        >
          {emoji && (
            <span
              style={{ fontSize: "1.2rem", marginRight: collapsed ? 0 : 8 }}
            >
              {emoji}
            </span>
          )}
          {!collapsed && (
            <ListItemText
              primary={name}
              primaryTypographyProps={{ fontWeight: "bold" }}
            />
          )}
        </ListItem>
      </Tooltip>

      {dropdown && (open || !collapsed) && (
        <Collapse in={open} timeout="auto" unmountOnExit>
          <List
            component="div"
            disablePadding
            sx={{
              backgroundColor: "#121330",
              borderRadius: "0px",
              boxShadow: "inset 0 1px 3px green",
            }}
          >
            {dropdown.map((subItem, idx) => {
              const isSubActive = location.pathname === subItem.link;
              return (
                <ListItemButton
                  key={idx}
                  component={Link}
                  to={subItem.link}
                  sx={{
                    pl: 2,
                    py: 1,
                    color: subItem.name.includes("Add") ? "white" : "white",
                    backgroundColor: isSubActive ? "#121330" : "inherit",
                    borderRadius: "0px",
                    borderLeft: isSubActive
                      ? "4px solid #00e676"
                      : "4px solid transparent",
                    "&:hover": {
                      backgroundColor: "#121330",
                    },
                    boxShadow: "inset 0px 0px  1px 3px #121330",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    fontSize: "1.8rem",
                  }}
                >
                  <ListItemText
                    primary={subItem.name}
                    primaryTypographyProps={{
                      fontSize: "0.8rem",
                      fontWeight: 900,
                    }}
                  />
                  <span style={{ fontSize: "1.2rem", marginLeft: 8 }}>
                    {subItem.icon}
                  </span>
                </ListItemButton>
              );
            })}
          </List>
        </Collapse>
      )}
    </div>
  );
};

export default SidebarNavItem;
