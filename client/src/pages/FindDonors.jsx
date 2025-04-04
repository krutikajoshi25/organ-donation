import axios from "axios";
import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  MenuItem,
  Button,
  Grid,
  Card,
  CardContent,
  Container,
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
const locations = ["New York", "Los Angeles", "Chicago", "Houston", "Miami"];

const FindDonors = () => {
  const [searchCriteria, setSearchCriteria] = useState({
    organType: "",
    city: "",
    state: "",
    country: "",
  });

  const [donors, setDonors] = useState([]);
  const [searched, setSearched] = useState(false);
  const handleChange = (e) => {
    setSearchCriteria({ ...searchCriteria, [e.target.name]: e.target.value });
  };

  const handleSearch = async () => {
  try {
    const response = await axios.get("http://localhost:5000/api/donors/search", {
      params: {
        organType: searchCriteria.organType,
        city: searchCriteria.city,
        state: searchCriteria.state,
        country: searchCriteria.country,
      },
    });

    console.log("Response Data:", response.data);

    const filteredDonors = response.data.donors
      .filter((donor) => donor.organType.includes(searchCriteria.organType)) // Ensure only searched organ type is shown
      .map((donor) => ({
        fullName: donor.fullName,
        phone: donor.phone,
        gender: donor.gender,
        dob: new Date(donor.dob).toLocaleDateString(),
        city: donor.city,
        state: donor.state,
        country: donor.country,
        organType: searchCriteria.organType, // Only show the searched organ
        medicalHistory: donor.medicalHistory || "No medical history provided",
      }));

    setDonors(filteredDonors);
    setSearched(true);
  } catch (error) {
    console.error("Error fetching donors:", error);
  }
};

  useEffect(() => {
    console.log("Updated Donors State:", donors);
  }, [donors]);

  return (
    <Box
      sx={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        background: "linear-gradient(to bottom, #2E7D32, #1B5E20)",
        padding: 4,
      }}
    >
      <Typography variant="h4" sx={{ color: "white", fontWeight: "bold", marginBottom: 3 }}>
        Find a Donor
      </Typography>
      <Navbar />
      
      {/* Search Card */}
      <Card
        sx={{
          padding: 4,
          borderRadius: 3,
          background: "white",
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.2)",
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
            <TextField label="City" name="city" value={searchCriteria.city} onChange={handleChange} sx={{ width: 200 }} />
          </Grid>

          <Grid item>
            <TextField label="State" name="state" value={searchCriteria.state} onChange={handleChange} sx={{ width: 200 }} />
          </Grid>

          <Grid item>
            <TextField select label="Country" name="country" value={searchCriteria.country} onChange={handleChange} sx={{ width: 200 }}>
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
                paddingX: 4,
                fontWeight: "bold",
                borderRadius: 2,
                "&:hover": { background: "#1B5E20" },
              }}
            >
              Search
            </Button>
          </Grid>
        </Grid>
      </Card>

      {/* Donor Results */}
      <Container sx={{ marginTop: 4 }}>
        <Grid container spacing={3} justifyContent="center">
          {donors.length > 0 ? (
            donors.map((donor, index) => (
              <Grid key={index} xs={12} sm={6} md={4}>
                <Card
                  sx={{
                    background: "white",
                    textAlign: "center",
                    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.3)",
                    borderRadius: 3,
                    transition: "transform 0.3s ease-in-out",
                    "&:hover": { transform: "scale(1.05)" },
                  }}
                >
                  <CardContent>
                    <Typography variant="h6" sx={{ fontWeight: "bold", color: "#2E7D32" }}>
                      {donor.fullName}
                    </Typography>
                    <Typography variant="body1" sx={{ marginTop: 1 }}>
                      <strong>Phone:</strong> {donor.phone}
                    </Typography>
                    <Typography variant="body1" sx={{ marginTop: 1 }}>
                      <strong>Gender:</strong> {donor.gender}
                    </Typography>
                    <Typography variant="body1" sx={{ marginTop: 1 }}>
                      <strong>DOB:</strong> {donor.dob}
                    </Typography>
                    <Typography variant="body1" sx={{ marginTop: 1 }}>
                      <strong>City:</strong> {donor.city}
                    </Typography>
                    <Typography variant="body1" sx={{ marginTop: 1 }}>
                      <strong>State:</strong> {donor.state}
                    </Typography>
                    <Typography variant="body1" sx={{ marginTop: 1 }}>
                      <strong>Country:</strong> {donor.country}
                    </Typography>
                    <Typography variant="body1" sx={{ marginTop: 1 }}>
                      <strong>Organ Type:</strong> {donor.organType}
                    </Typography>
                    <Typography variant="body1" sx={{ marginTop: 1, color: "red" }}>
                      <strong>Medical History:</strong> {donor.medicalHistory}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))
          ) : searched ? ( // Show "No donors found" only if search has been performed
            <Typography variant="h6" sx={{ width: "100%", marginTop: 2, color: "red", textAlign: "center" }}>
              No donors found
            </Typography>
          ) : null}
        </Grid>
      </Container>
    </Box>
  );
};

export default FindDonors;
