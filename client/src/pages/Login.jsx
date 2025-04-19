import React, { useState } from "react";
import { TextField, Button, Typography, Box, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom"; // ✅ Import useNavigate

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const navigate = useNavigate(); // ✅ Initialize useNavigate
  
  

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    let isValid = true;

    // Email Validation
    if (!email.trim()) {
      setEmailError("⚠ Email is required");
      isValid = false;
    } else if (!email.includes("@")) {
      setEmailError("⚠ Enter a valid email (must contain '@')");
      isValid = false;
    } else {
      setEmailError(""); // Clear error if valid
    }

    // Password Validation
    if (!password.trim()) {
      setPasswordError("⚠ Password is required");
      isValid = false;
    } else {
      setPasswordError(""); // Clear error if valid
    }

    if (!isValid) return; // Stop form submission if validation fails

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        alert("Login Successful!");
        console.log("Token:", data.token); // Store the token for authentication
        localStorage.setItem("userToken", data.token);
        localStorage.setItem("user", JSON.stringify(data.recipient)); // ✅ Add this

        navigate("/");

      } else {
        alert(data.message); // Show error message
      }
    } catch (error) {
      console.error("Login Error:", error);
      alert("Something went wrong! Please try again.");
    }
  
    setEmail("");
    setPassword("");
  };
  

  return (
    <Box
      sx={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(to right, #2E7D32, #A5D6A7)", // Green Gradient Background
      }}
    >
      <Paper
        elevation={5}
        sx={{
          display: "flex",
          width: "80%",
          maxWidth: "800px",
          height: "400px",
          borderRadius: 3,
          overflow: "hidden",
        }}
      >
        {/* Left Side - Quote */}
        <Box
          sx={{
            flex: 1,
            backgroundColor: "#1B5E20",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            color: "white",
            padding: 3,
            textAlign: "center",
          }}
        >
          <Typography variant="h5" fontWeight="bold">
            "Saving lives, one donation at a time."
          </Typography>
          <Typography variant="body1" sx={{ mt: 1 }}>
            Join our mission and make a difference.
          </Typography>
        </Box>

        {/* Right Side - Login Form */}
        <Box sx={{ flex: 1, padding: 4, backgroundColor: "white" }}>
          <Typography variant="h4" sx={{ textAlign: "center", color: "green", mb: 3 }}>
            Login
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: "flex", flexDirection: "column", gap: 2 }}
            autoComplete="off"
          >
            <TextField
              label="Email"
              variant="outlined"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={Boolean(emailError)}
              helperText={emailError}
             
              autoComplete="new-email"
              inputProps={{ autoCorrect: "off", spellCheck: "false" }}
            />
            <TextField
              label="Password"
              type="password"
              variant="outlined"
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={Boolean(passwordError)}
              helperText={passwordError}              
              autoComplete="new-password"
              inputProps={{ autoCorrect: "off", spellCheck: "false" }}
            />
            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{
                backgroundColor: "green",
                color: "white",
                "&:hover": { backgroundColor: "#1B5E20" },
              }}
            >
              Login
            </Button>
          </Box>
          <Typography variant="body2" sx={{ textAlign: "center", mt: 2 }}>
    Don't have an account?{" "}
    <Button
      sx={{ color: "green", textTransform: "none", fontWeight: "bold" }}
      onClick={() => navigate("/register")}
    >
      Sign Up
    </Button>
  </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default Login;
