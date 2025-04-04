import React from "react";
import Navbar from "../styles/Navbar";
import { Box, Typography, Card, CardContent, Grid, Container } from "@mui/material";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Sidebar from "./Sidebar";

const Dashboard = () => {
  
  const imageUrls = [
    "/images/image1.jpg",
    "/images/image2.jpg",
    "/images/image3.jpg",
    "/images/image4.jpg",
    "/images/image5.jpg",
  ];

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false,
    pauseOnHover: false,
  };

  const features = [
    { title: "User Registration", description: "Register as a donor or recipient with medical details." },
    { title: "Find a Donor", description: "Search for donors by organ type, blood group, and location." },
    { title: "Donation Requests", description: "Submit and manage donation requests with ease." },
    { title: "Notifications", description: "Get instant alerts when a matching donor is available." },
    { title: "Admin Panel", description: "Admins verify donors, manage users, and oversee operations." },
    { title: "Privacy & Security", description: "Strong encryption and authentication to protect data." },
  ];

  return (
    <>
    
      <Navbar />
      <Sidebar/>
      

      {/* Prevent Overlap of Navbar & Slider */}
      <Box sx={{ width: "100vw", height: "50vh", overflow: "hidden", mt: 10}}>
        <Slider {...sliderSettings}>
          {imageUrls.map((img, index) => (
            <Box key={index} sx={{ width: "100%", height: "50vh", overflow: "hidden" }}>
              <img
                src={img}
                alt={`Slide ${index + 1}`}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </Box>
          ))}
        </Slider>
      </Box>

      {/* Welcome Section */}
      <Box sx={{ textAlign: "center", padding: 4 }}>
        <Typography variant="h4" sx={{ color: "#2E7D32", fontWeight: "bold" }}>
          Welcome to the Organ Donation Dashboard
        </Typography>
        <Typography variant="body1" sx={{ marginTop: 2, color: "#555" }}>
          Connect with donors and recipients to save lives.
        </Typography>
      </Box>

      {/* Features Section (Same Card Size) */}
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Grid container spacing={3} justifyContent="center">
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card
                sx={{
                  backgroundColor: "#E8F5E9",
                  color: "#2E7D32",
                  borderRadius: 2,
                  boxShadow: 3,
                  width: "250px",
                  height: "180px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  textAlign: "center",
                  transition: "transform 0.2s",
                  "&:hover": { transform: "scale(1.05)" },
                }}
              >
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#555" }}>
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Updated Footer */}
      <Box sx={{ backgroundColor: "#2E7D32", color: "#FFFFFF", py: 3, mt: 5 }}>
        <Container maxWidth="lg">
          <Grid container spacing={3} justifyContent="space-between" alignItems="center">
            {/* About Section */}
            <Grid item xs={12} sm={6}>
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                About Us
              </Typography>
              <Typography variant="body2" sx={{ mt: 1, color: "#E0E0E0" }}>
                We aim to connect donors and recipients seamlessly, <br />
                 ensuring lifesaving organ transplants happen efficiently.
              </Typography>
            </Grid>

            {/* Contact Info */}
            <Grid item xs={12} sm={6} sx={{ textAlign: { xs: "left", sm: "right" } }}>
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                Contact Us
              </Typography>
              <Typography variant="body2" sx={{ mt: 1, color: "#E0E0E0" }}>
                📞 +1 234 567 890  
              </Typography>
              <Typography variant="body2" sx={{ color: "#E0E0E0" }}>
                ✉️ support@organdonation.com
              </Typography>
            </Grid>
          </Grid>

          {/* Copyright */}
          <Box sx={{ textAlign: "center", mt: 3 }}>
            <Typography variant="body2" sx={{ color: "#E0E0E0" }}>
              © {new Date().getFullYear()} Organ Donation. All Rights Reserved.
            </Typography>
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default Dashboard;
