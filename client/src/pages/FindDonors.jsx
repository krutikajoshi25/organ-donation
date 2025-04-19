import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  TextField,
  MenuItem,
  Button,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import Navbar from "../styles/Navbar";

const organTypes = [
  "Heart",
  "Liver",
  "Kidney",
  "Lungs",
  "Pancreas",
  "Intestine",
  "Cornea",
  "Skin",
  "Bone Marrow",
  "Tissue",
];

const FindDonors = () => {
  const [searchCriteria, setSearchCriteria] = useState({
    organType: "",
    city: "",
    state: "",
    country: "India",
  });

  const [donors, setDonors] = useState([]);
  const [searched, setSearched] = useState(false);
  const [requestedDonors, setRequestedDonors] = useState([]);
  const [requestStatus, setRequestStatus] = useState({});
  const [recipientId, setRecipientId] = useState("");

  useEffect(() => {
   
  }, []);

  const handleChange = (e) => {
    setSearchCriteria({ ...searchCriteria, [e.target.name]: e.target.value });
  };

  const handleSearch = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/donors/search", {
        params: searchCriteria,
      });

      const filtered = res.data.donors
  .filter((donor) => donor.organType.includes(searchCriteria.organType))
  .map((donor) => ({
    ...donor,
    donorId: donor._id, // Add this key while keeping everything else
  }));


setDonors(filtered);
      setSearched(true);
    } catch (err) {
      console.error("Error fetching donors:", err);
    }
  };

  const handleRequest = async (donor) => {
  try {
    console.log('Donor object passed:', donor);

    const donorId = donor.donorId || donor._id;
    if (!donorId) {
      alert("Donor information missing.");
      return;
    }

    const token = localStorage.getItem("userToken");
    if (!token) {
      alert("Please log in to make a donation request.");
      return;
    }

    // Decode token to extract recipient ID
    let recipientId, createdBy;
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      recipientId = payload.id || payload.userId;
      createdBy = recipientId;
    } catch (decodeErr) {
      console.warn("Invalid token.", decodeErr);
      alert("Invalid session. Please log in again.");
      return;
    }

    // Get recipient details from localStorage
    const user = JSON.parse(localStorage.getItem("user")) || {};
    console.log("User from localStorage:", user);

    if (!user.fullName || !user.phone || !user.gender || !user.dob) {
      alert("Incomplete recipient data. Please re-login.");
      return;
    }

    const organToSend = Array.isArray(donor.organType)
      ? donor.organType[0]
      : donor.organType;

    const requestBody = {
      donorId: donorId,
      organ: [organToSend], // as array of strings
      message: "Donation request sent.",
      recipientId,
      createdBy,
      name: user.fullName || "",
      phone: user.phone || "",
      gender: user.gender || "",
      dob: user.dob ? new Date(user.dob) : null,
      city: user.city || "",
      state: user.state || "",
      country: user.country || "",
      medicalHistory: user.medicalHistory || "",
    };

    console.log("📤 Sending payload:", requestBody);

    const response = await axios.post(
      "http://localhost:5000/api/donation-requests",
      requestBody,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    alert("Request sent successfully!");

    // Update request status to prevent repeated requests
    const key = `${donorId}_${organToSend}`;
    setRequestStatus((prev) => {
      const updated = { ...prev, [key]: "Request sent. You will be notified shortly." };
      localStorage.setItem("requestStatus", JSON.stringify(updated));
      return updated;
    });

  } catch (err) {
    console.error("❌ Request failed:", err?.response?.data || err);
    alert(err?.response?.data?.message || "Failed to send request.");
  }
};

 
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("requestStatus")) || {};
    setRequestStatus(stored);
  }, []);

  return (
    <Box
      sx={{
        width: "100vw",
        minHeight: "100vh",
        background: "linear-gradient(to bottom, #2E7D32, #1B5E20)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: 4,
      }}
    >
      <Typography variant="h4" sx={{ color: "white", fontWeight: "bold", mb: 3 }}>
        Find a Donor
      </Typography>
<Navbar/>
      <Box
        sx={{
          backgroundColor: "white",
          borderRadius: 3,
          padding: 4,
          boxShadow: 3,
          width: "90%",
          maxWidth: 1000,
        }}
      >
        <Grid container spacing={2} justifyContent="center">
          <Grid item>
            <TextField
              select
              label="Organ Type"
              name="organType"
              value={searchCriteria.organType}
              onChange={handleChange}
              sx={{ width: 200 }}
            >
              {organTypes.map((organ) => (
                <MenuItem key={organ} value={organ}>
                  {organ}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item>
            <TextField
              label="City"
              name="city"
              value={searchCriteria.city}
              onChange={handleChange}
              sx={{ width: 200 }}
            />
          </Grid>
          <Grid item>
            <TextField
              label="State"
              name="state"
              value={searchCriteria.state}
              onChange={handleChange}
              sx={{ width: 200 }}
            />
          </Grid>
          <Grid item>
            <TextField
              select
              label="Country"
              name="country"
              value={searchCriteria.country}
              onChange={handleChange}
              sx={{ width: 200 }}
            >
              <MenuItem value="India">India</MenuItem>
            </TextField>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              onClick={handleSearch}
              sx={{
                background: "#2E7D32",
                color: "white",
                px: 4,
                fontWeight: "bold",
                borderRadius: 2,
                "&:hover": { background: "#1B5E20" },
              }}
            >
              Search
            </Button>
          </Grid>
        </Grid>
      </Box>

      {/* Donor Table */}
      <Box sx={{ mt: 5, width: "90%", maxWidth: 1000 }}>
        {donors.length > 0 ? (
          <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
            <Table>
              <TableHead sx={{ backgroundColor: "#E8F5E9" }}>
                <TableRow>
                  <TableCell><strong>Donor ID</strong></TableCell>
                  <TableCell><strong>Organ</strong></TableCell>
                  <TableCell><strong>Name</strong></TableCell>
                  <TableCell><strong>Phone</strong></TableCell>
                  <TableCell><strong>Gender</strong></TableCell>
                  {/* <TableCell><strong>Recipient ID</strong></TableCell> */}
                  <TableCell><strong>Action</strong></TableCell>

                </TableRow>
              </TableHead>
              <TableBody>
                {donors.map((donor) => (
                  <TableRow key={donor.donorId}>
                    <TableCell>{donor.donorId}</TableCell>
                    <TableCell>{searchCriteria.organType}</TableCell>
                    <TableCell>{donor.fullName}</TableCell>
                    <TableCell>{donor.phone}</TableCell>
                    <TableCell>{donor.gender}</TableCell>

                    {/* <TableCell>{recipientId || "Not logged in"}</TableCell> */}
                    <TableCell>
  <Button
    variant="contained"
    size="small"
    color="secondary"
    onClick={() => handleRequest(donor)}
    disabled={
      requestStatus[`${donor._id}_${donor.organType}`] === "Request sent. You will be notified shortly."
    }
  >
    {requestStatus[`${donor._id}_${donor.organType}`] || "Request"}
  </Button>
</TableCell>


                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : searched ? (
          <Typography variant="h6" sx={{ color: "red", textAlign: "center", mt: 3 }}>
            No donors found
          </Typography>
        ) : null}
      </Box>
    </Box>
  );
};

export default FindDonors;
