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

  // Donor State (Now includes Password & Medical History)
  const [donorData, setDonorData] = useState({
    fullName: "", email: "", phone: "", password: "", gender: "", dob: "",
    city: "", state: "", country: "", organType: [], medicalHistory: "",
  });

  // Recipient State (Now includes Password, Urgency, Doctor Contact)
  const [recipientData, setRecipientData] = useState({
    fullName: "", email: "", phone: "", password: "", gender: "", dob: "",
    city: "", state: "", country: "", organType: [],
    urgencyLevel: "", doctorContact: "",
  });

  const [agree, setAgree] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Handles input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (role === "donor") {
      setDonorData((prev) => ({ ...prev, [name]: value }));
    } else {
      setRecipientData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Handles organ selection
  const handleOrganChange = (event) => {
    const value = event.target.value;
    if (role === "donor") {
      setDonorData((prev) => ({ ...prev, organType: value }));
    } else {
      setRecipientData((prev) => ({ ...prev, organType: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!agree) {
      alert("Please agree to the Terms and Conditions.");
      return;
    }
  
    const backendUrl = "http://localhost:5000"; // Change this to your backend port
    const apiUrl = role === "donor" 
      ? `${backendUrl}/api/donors/register` 
      : `${backendUrl}/api/recipients/register`;
  
    const userData = role === "donor" ? donorData : recipientData;
  
    console.log("Submitting data to:", apiUrl); // Debugging
    console.log("User Data:", userData); // Debugging
  
    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });
  
      const result = await response.json(); // ✅ Parse as JSON
  
      if (!response.ok) {
        throw new Error(result.message || "Registration failed");
      }
  
      alert("Registration Successful!");
  
      // Reset form after successful registration
      setDonorData({
        fullName: "", email: "", phone: "", password: "", gender: "", dob: "",
        city: "", state: "", country: "", organType: "", medicalHistory: "", // ✅ Added medicalHistory
      });
  
      setRecipientData({
        fullName: "", email: "", phone: "", password: "", gender: "", dob: "",
        city: "", state: "", country: "", organType: "", urgencyLevel: "", doctorContact: "",
      });
      setAgree(false);

            // ✅ Navigate to Login Page
            navigate("/login"); 
  
    } catch (error) {
      alert(`Error: ${error.message}`);
      console.error("Error:", error);
    }
  };
  

  return (
    
    <Box
      sx={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(to right, #2E7D32, #A5D6A7)",
         paddingTop: "80px", 
      }}
    >
      <Card
        sx={{
          width: "90%",
          maxWidth: "700px",
          borderRadius: 3,
          textAlign: "center",
          boxShadow: 5,
          overflow: "hidden",
        }}
      >
        {/* Quote Section */}
        <CardContent sx={{ backgroundColor: "#1B5E20", color: "white", padding: 3 }}>
          <Typography variant="h5" fontWeight="bold">
            "Every donor is a hero. Save lives today."
          </Typography>
          
          <Typography variant="body2" sx={{ mt: 1 }}>
            Register now and make a difference!
          </Typography>
        </CardContent>
        <Navbar/>
        {/* Registration Form */}
        <CardContent sx={{ padding: 3, backgroundColor: "white", maxHeight: "500px", overflowY: "auto" }}>
          <Typography variant="h4" sx={{ color: "green", mb: 2 }}>
            Register as {role === "donor" ? "Donor" : "Recipient"}
          </Typography>

          <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {/* Role Selection */}
            <RadioGroup row value={role} onChange={(e) => { setRole(e.target.value); setAgree(false); }}>
              <FormControlLabel value="donor" control={<Radio />} label="Donor" />
              <FormControlLabel value="recipient" control={<Radio />} label="Recipient" />
            </RadioGroup>

            {/* Full Name & Email */}
            <TextField label="Full Name" variant="outlined" fullWidth name="fullName" value={role === "donor" ? donorData.fullName : recipientData.fullName} onChange={handleInputChange} required />
            <TextField label="Email Address" variant="outlined" fullWidth name="email" value={role === "donor" ? donorData.email : recipientData.email} onChange={handleInputChange} required />

            {/* Password Field with Toggle Visibility */}
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

            {/* Phone Number */}
            <TextField label="Phone Number" variant="outlined" fullWidth name="phone" value={role === "donor" ? donorData.phone : recipientData.phone} onChange={handleInputChange} required />

            {/* Gender & Date of Birth */}
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

            {/* City, State, Country */}
            <TextField label="City" variant="outlined" fullWidth name="city" value={role === "donor" ? donorData.city : recipientData.city} onChange={handleInputChange} required />
            <TextField label="State" variant="outlined" fullWidth name="state" value={role === "donor" ? donorData.state : recipientData.state} onChange={handleInputChange} required />
            <TextField label="Country" variant="outlined" fullWidth name="country" value={role === "donor" ? donorData.country : recipientData.country} onChange={handleInputChange} required />

            {/* Organ Selection */}
            <FormControl fullWidth>
              <InputLabel>{role === "donor" ? "Organ Type(s) Available" : "Organ Required"}</InputLabel>
              <Select multiple value={role === "donor" ? donorData.organType : recipientData.organType} onChange={handleOrganChange} renderValue={(selected) => selected.join(", ")}>
                {organOptions.map((organ) => (
                  <MenuItem key={organ} value={organ}>
                    <Checkbox checked={(role === "donor" ? donorData.organType : recipientData.organType).includes(organ)} />
                    <ListItemText primary={organ} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Additional Donor Field: Medical History */}
            {role === "donor" && <TextField label="Medical History (Optional)" variant="outlined" fullWidth name="medicalHistory" value={donorData.medicalHistory} onChange={handleInputChange} multiline rows={3} />}

            {/* Additional Recipient Fields */}
            {role === "recipient" && (
              <>
                <FormControl fullWidth>
                  <InputLabel>Urgency Level</InputLabel>
                  <Select name="urgencyLevel" value={recipientData.urgencyLevel} onChange={handleInputChange} required>
                    {urgencyLevels.map((level) => <MenuItem key={level} value={level}>{level}</MenuItem>)}
                  </Select>
                </FormControl>
                <TextField label="Doctor's Contact (Optional)" variant="outlined" fullWidth name="doctorContact" value={recipientData.doctorContact} onChange={handleInputChange} />
              </>
            )}

            <FormControlLabel control={<Checkbox checked={agree} onChange={(e) => setAgree(e.target.checked)} />} label="I agree to the Terms and Conditions" />
            <Button type="submit" variant="contained" fullWidth sx={{ backgroundColor: "green", "&:hover": { backgroundColor: "#1B5E20" } }}>Register</Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Register;
