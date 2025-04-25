import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../styles/Navbar";
import {
  TextField,
  Button,
  Typography,
  Box,
  Card,
  CardContent,
  Radio,
  RadioGroup,
  FormControlLabel,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Checkbox,
  ListItemText,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const organOptions = [
  "Heart", "Liver", "Kidney", "Lungs", "Pancreas", "Intestines", 
  "Cornea", "Skin", "Bone Marrow", "Tissue"
];

const urgencyLevels = ["Low", "Moderate", "High", "Critical"];

const Register = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState("donor");

  // Donor state: organType is an array.
  const [donorData, setDonorData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    gender: "",
    dob: "",
    city: "",
    state: "",
    country: "",
    organType: [],
    medicalHistory: "",
  });

  // Recipient state: use organRequired as a string.
  const [recipientData, setRecipientData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    gender: "",
    dob: "",
    city: "",
    state: "",
    country: "",
    organRequired: "",
    urgencyLevel: "",
    doctorContact: "",
  });

  const [agree, setAgree] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (role === "donor") {
      setDonorData((prev) => ({ ...prev, [name]: value }));
    } else {
      setRecipientData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Updated handleOrganChange:
  const handleOrganChange = (event) => {
    const value = event.target.value;
    if (role === "donor") {
      // For donor, value must be an array.
      setDonorData((prev) => ({ ...prev, organType: typeof value === "string" ? value.split(",") : value }));
    } else {
      // For recipient, it's a single select; store as string.
      setRecipientData((prev) => ({ ...prev, organRequired: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!agree) {
      alert("Please agree to the Terms and Conditions.");
      return;
    }

    const backendUrl = "http://localhost:5000";
    const apiUrl = role === "donor" 
      ? `${backendUrl}/api/donors/register` 
      : `${backendUrl}/api/recipients/register`;

    const userData = role === "donor" ? donorData : recipientData;

    console.log("Submitting data to:", apiUrl);
    console.log("User Data:", userData);

    if (!userData.fullName || !userData.email || !userData.phone || !userData.password) {
      alert("Please fill in all required fields.");
      return;
    }

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Registration failed");
      }
      localStorage.setItem("userToken", result.token);         // Token
      localStorage.setItem("user", JSON.stringify(result.recipient));  // Full recipient details
      
      alert("Registration Successful!");

      setDonorData({
        fullName: "", email: "", phone: "", password: "", gender: "", dob: "",
        city: "", state: "", country: "", organType: [], medicalHistory: "",
      });

      setRecipientData({
        fullName: "", email: "", phone: "", password: "", gender: "", dob: "",
        city: "", state: "", country: "", organRequired: "", urgencyLevel: "", doctorContact: "",
      });
      setAgree(false);

      navigate("/login"); 
    } catch (error) {
      alert(`Error: ${error.message}`);
      console.error("Error:", error);
    }
  };

  return (
    <Box sx={{
      width: "100vw",
      height: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background: "linear-gradient(to right, #2E7D32, #A5D6A7)",
      paddingTop: "80px",
    }}>
      <Card sx={{
        width: "90%",
        maxWidth: "700px",
        borderRadius: 3,
        textAlign: "center",
        boxShadow: 5,
        overflow: "hidden",
      }}>
        <CardContent sx={{ backgroundColor: "#1B5E20", color: "white", padding: 3 }}>
          <Typography variant="h5" fontWeight="bold">
            "Every donor is a hero. Save lives today."
          </Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            Register now and make a difference!
          </Typography>
        </CardContent>
        <Navbar/>
        <CardContent sx={{ padding: 3, backgroundColor: "white", maxHeight: "500px", overflowY: "auto" }}>
          <Typography variant="h4" sx={{ color: "green", mb: 2 }}>
            Register as {role === "donor" ? "Donor" : "Recipient"}
          </Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <RadioGroup row value={role} onChange={(e) => { setRole(e.target.value); setAgree(false); }}>
              <FormControlLabel value="donor" control={<Radio />} label="Donor" />
              <FormControlLabel value="recipient" control={<Radio />} label="Recipient" />
            </RadioGroup>

            <TextField label="Full Name" variant="outlined" fullWidth name="fullName" value={role === "donor" ? donorData.fullName : recipientData.fullName} onChange={handleInputChange} required />
            <TextField label="Email Address" variant="outlined" fullWidth name="email" value={role === "donor" ? donorData.email : recipientData.email} onChange={handleInputChange} required />
            <TextField
              label="Password"
              variant="outlined"
              fullWidth
              type={showPassword ? "text" : "password"}
              name="password"
              value={role === "donor" ? donorData.password : recipientData.password}
              onChange={handleInputChange}
              required
              autoComplete="new-password"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <TextField label="Phone Number" variant="outlined" fullWidth name="phone" value={role === "donor" ? donorData.phone : recipientData.phone} onChange={handleInputChange} required />

            <Box sx={{ display: "flex", gap: 1 }}>
              <FormControl fullWidth>
                <InputLabel>Gender</InputLabel>
                <Select name="gender" value={role === "donor" ? donorData.gender : recipientData.gender} onChange={handleInputChange} required>
                  <MenuItem value="Male">Male</MenuItem>
                  <MenuItem value="Female">Female</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </Select>
              </FormControl>
              <TextField label="Date of Birth" type="date" variant="outlined" fullWidth name="dob" value={role === "donor" ? donorData.dob : recipientData.dob} onChange={handleInputChange} InputLabelProps={{ shrink: true }} required />
            </Box>

            <TextField label="City" variant="outlined" fullWidth name="city" value={role === "donor" ? donorData.city : recipientData.city} onChange={handleInputChange} required />
            <TextField label="State" variant="outlined" fullWidth name="state" value={role === "donor" ? donorData.state : recipientData.state} onChange={handleInputChange} required />
            <TextField label="Country" variant="outlined" fullWidth name="country" value={role === "donor" ? donorData.country : recipientData.country} onChange={handleInputChange} required />

            <FormControl fullWidth>
              <InputLabel>{role === "donor" ? "Organ Type(s) Available" : "Organ Required"}</InputLabel>
              <Select
                multiple={role === "donor"}
                value={role === "donor" ? donorData.organType : recipientData.organRequired}
                onChange={handleOrganChange}
                renderValue={(selected) =>
                  role === "donor" ? selected.join(", ") : selected
                }
              >
                {organOptions.map((organ) => (
                  <MenuItem key={organ} value={organ}>
                    {role === "donor" ? (
                      <>
                        <Checkbox checked={donorData.organType.includes(organ)} />
                        <ListItemText primary={organ} />
                      </>
                    ) : (
                      organ
                    )}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {role === "donor" && (
              <TextField label="Medical History (Optional)" variant="outlined" fullWidth name="medicalHistory" value={donorData.medicalHistory} onChange={handleInputChange} multiline rows={3} />
            )}

            {role === "recipient" && (
              <>
                <FormControl fullWidth>
                  <InputLabel>Urgency Level</InputLabel>
                  <Select name="urgencyLevel" value={recipientData.urgencyLevel} onChange={handleInputChange} required>
                    {urgencyLevels.map((level) => (
                      <MenuItem key={level} value={level}>{level}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <TextField label="Doctor's Contact (Optional)" variant="outlined" fullWidth name="doctorContact" value={recipientData.doctorContact} onChange={handleInputChange} />
              </>
            )}

            <FormControlLabel control={<Checkbox checked={agree} onChange={(e) => setAgree(e.target.checked)} />} label="I agree to the Terms and Conditions" />
            <Button type="submit" variant="contained" fullWidth sx={{ backgroundColor: "green", "&:hover": { backgroundColor: "#1B5E20" } }}>
              Register
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Register;
