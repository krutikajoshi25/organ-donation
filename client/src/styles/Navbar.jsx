import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Modal, Box, Typography, Button } from "@mui/material";

const Navbar = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const userToken = localStorage.getItem("userToken");
    const storedUser = localStorage.getItem("userName"); // Fetch stored user name
    if (userToken) {
      setIsLoggedIn(true);
      setUserName(storedUser || "User"); // Default name if not found
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    localStorage.removeItem("userName"); // Remove stored user name
    setIsLoggedIn(false);
    setUserName("");
    navigate("/");
  };

  const handleFindDonorsClick = (e) => {
    if (!isLoggedIn) {
      e.preventDefault(); // Prevent navigation
      setShowModal(true); // Show login required popup
    } else {
      navigate("/find-donors"); // Redirect if logged in
    }
  };

  return (
    <nav style={navbarStyle}>
      <div style={containerStyle}>
        {/* Logo and Tagline */}
        <div style={logoContainerStyle}>
          <h1 style={logoTextStyle}>
            <span style={redTextStyle}>Organ</span> <span style={whiteTextStyle}>Lives</span>
          </h1>
          <span style={taglineStyle}>Give the Gift of Life</span>
        </div>

        {/* Navigation Links */}
        <ul style={navLinksStyle}>
          <li><Link to="/" style={navLinkStyle}>Home</Link></li>
          <li>
            <Link to="/find-donors" style={{ ...navLinkStyle, opacity: isLoggedIn ? 1 : 0.5 }} onClick={handleFindDonorsClick}>
              Find Donors
            </Link>
          </li>
          <li><Link to="/notifications" style={navLinkStyle}>Notifications</Link></li>

          {!isLoggedIn ? (
            <>
              <li><Link to="/register" style={signUpButtonStyle}>Sign Up</Link></li>
              <li><Link to="/login" style={signInButtonStyle}>Sign In</Link></li>
            </>
          ) : (
            <>
              <li style={userInfoStyle}>Welcome, {userName}!</li>
              <li>
                <button onClick={handleLogout} style={logoutButtonStyle}>
                  Logout
                </button>
              </li>
            </>
          )}
        </ul>
      </div>

      {/* Modal for Login Required */}
      <Modal open={showModal} onClose={() => setShowModal(false)}>
        <Box sx={modalStyle}>
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>Login Required</Typography>
          <Typography sx={{ marginTop: "10px" }}>
            You must be logged in to access the Find Donors page.
          </Typography>
          <Button variant="contained" sx={loginButtonStyle} onClick={() => navigate("/login")}>
            Go to Login
          </Button>
        </Box>
      </Modal>
    </nav>
  );
};

export default Navbar;

/* Styles */
const navbarStyle = { backgroundColor: "#2E8B57", width: "100%", position: "fixed", top: 0, left: 0, zIndex: 1000, padding: "12px 0", boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)", fontFamily: "'Poppins', sans-serif" };
const containerStyle = { width: "90%", maxWidth: "1200px", margin: "auto", display: "flex", justifyContent: "space-between", alignItems: "center" };
const logoContainerStyle = { display: "flex", flexDirection: "column", alignItems: "flex-start" };
const logoTextStyle = { fontSize: "28px", fontWeight: "bold", margin: 0, textShadow: "2px 2px 4px rgba(0, 0, 0, 0.3)" };
const redTextStyle = { color: "red" };
const whiteTextStyle = { color: "white" };
const taglineStyle = { fontSize: "14px", color: "white", fontStyle: "italic", opacity: 0.9, marginTop: "-5px", fontFamily: "'Dancing Script', cursive", letterSpacing: "1px" };
const navLinksStyle = { listStyle: "none", display: "flex", gap: "15px", margin: 0, padding: 0, alignItems: "center" };
const navLinkStyle = { textDecoration: "none", color: "white", fontWeight: "bold", padding: "8px 12px", borderRadius: "5px", transition: "0.3s ease-in-out", fontSize: "16px" };
const signUpButtonStyle = { padding: "8px 16px", borderRadius: "20px", fontWeight: "bold", textDecoration: "none", backgroundColor: "white", color: "#2E8B57", border: "2px solid white" };
const signInButtonStyle = { padding: "8px 16px", borderRadius: "20px", fontWeight: "bold", textDecoration: "none", backgroundColor: "#3CB371", color: "white", border: "2px solid #3CB371" };
const logoutButtonStyle = { backgroundColor: "#FF4500", color: "white", padding: "8px 14px", borderRadius: "15px", fontWeight: "bold", fontSize: "16px", border: "2px solid rgb(14, 131, 6)", cursor: "pointer", transition: "0.3s" };
const userInfoStyle = { color: "white", fontWeight: "bold", fontSize: "16px", marginRight: "10px" };
const modalStyle = { position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "300px", bgcolor: "white", boxShadow: 24, p: 4, textAlign: "center", borderRadius: "8px" };
const loginButtonStyle = { marginTop: "15px", backgroundColor: "#2E8B57", color: "white", fontWeight: "bold", textTransform: "none" };
