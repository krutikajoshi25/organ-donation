import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom"; // To check current route
import { Box, List, ListItem, ListItemText, IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { Link } from "react-router-dom";

const Sidebar = () => {
  const [open, setOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const location = useLocation(); // Get current route

  useEffect(() => {
    // Check if user is logged in by verifying if the token exists
    const userToken = localStorage.getItem("userToken");
    if (userToken) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  // Hide sidebar if user is not logged in or is on Sign In/Sign Up pages
  if (!isLoggedIn || location.pathname === "/signin" || location.pathname === "/signup") {
    return null;
  }

  return (
    <>
      {/* Menu Button */}
      <IconButton
        onClick={() => setOpen(!open)}
        sx={{
          position: "fixed",
          top: 20,
          left: 20,
          zIndex: 2000, // Ensure button is above everything
          backgroundColor: "white",
          borderRadius: "50%",
        }}
      >
        {open ? <CloseIcon sx={{ color: "#2E7D32" }} /> : <MenuIcon sx={{ color: "#2E7D32" }} />}
      </IconButton>

      {/* Sidebar */}
      <Box
        sx={{
          position: "fixed",
          top: 70,
          left: open ? 0 : "-250px", // Slide effect
          width: "250px",
          height: "100vh",
          backgroundColor: "rgba(46, 125, 50, 0.8)", // Transparent Green
          paddingTop: "20px",
          transition: "left 0.3s ease-in-out",
          zIndex: 1900, // Higher than slider
          boxShadow: open ? "4px 0px 10px rgba(0,0,0,0.2)" : "none",
        }}
      >
        <List>
        <ListItem
        button
        component={Link}
        to="/dashboard"
        sx={{
          "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.2)" },
        }}
      >
        <ListItemText
          primary="Dashboard"
          sx={{ fontWeight: "bold", color: "white" }}
        />
      </ListItem>

      <ListItem
        button
        component={Link}
        to="/profile"
        sx={{
          "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.2)" },
        }}
      >
        <ListItemText
          primary="My Profile"
          sx={{ fontWeight: "bold", color: "white" }}
        />
      </ListItem>

      <ListItem
        button
        component={Link}
        to="/donation-request"
        sx={{
          "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.2)" },
        }}
      >
        <ListItemText
          primary="Donation Request"
          sx={{ fontWeight: "bold", color: "white" }}
        />
      </ListItem>
        </List>
      </Box>
    </>
  );
};

export default Sidebar;
