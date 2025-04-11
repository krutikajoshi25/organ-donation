import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box,
  Typography,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Paper,
  Avatar,
} from '@mui/material';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch notifications on component mount
  useEffect(() => {
    fetchNotifications();
  }, []);

  // Function to fetch notifications from the backend
  // const fetchNotifications = async () => {
  //   try {
  //     const res = await axios.get('http://localhost:5000/api/notifications/user', {
  //       headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }, // Assuming token is stored in localStorage
  //     });
  //     const fetchedNotifications = res.data;
  //     setNotifications(fetchedNotifications); // Store the fetched notifications
  //     setLoading(false); // Set loading to false after data is fetched
  //   } catch (err) {
  //     console.error('Failed to fetch notifications:', err);
  //     setError('Failed to fetch notifications'); // Set error message if fetching fails
  //     setLoading(false); // Set loading to false even on error
  //   }
  // };


  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('userToken'); // From login
  
      // Log the token to check if it's being retrieved correctly
      console.log("Fetched token:", token);
  
      // Check if the token exists before making the request
      if (!token) {
        throw new Error("Token is missing. Please log in again.");
      }
  
      // Send the request to the correct backend endpoint to fetch notifications
      const res = await axios.get('http://localhost:5000/api/donation-requests/notifications', {
        
        headers: {
          Authorization: `Bearer ${token}`, // Pass the token in the Authorization header
        },
      });
  
      // Log the response to see if the data is fetched correctly
      console.log("Notifications data:", res.data);
  
      // Assuming you want to set the notifications data here
      setNotifications(res.data); // Set the fetched notifications data
      setLoading(false); // Stop loading state when data is received
    } catch (err) {
      // Log the full error to the console for better debugging
      console.error('Failed to fetch notifications:', err);
  
      // Check if the error response has a message or not
      if (err.response) {
        console.error("Error Response:", err.response.data);
        // Check if the error is due to token expiration (401 Unauthorized)
        if (err.response.status === 401) {
          setError("Session expired. Please log in again.");
          // Optionally, you can redirect the user to the login page
          // window.location.href = '/login';
        } else {
          setError(`Error: ${err.response.data.message || "Failed to fetch notifications"}`);
        }
      } else {
        // General error handling if no response exists
        setError("An unexpected error occurred. Please try again.");
      }
  
      setLoading(false); // Stop loading state even in case of an error
    }
  };
  
  
  
  
  
  

  return (
    <Box
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: '#1B5E20',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 20px',
        overflowY: 'auto',
      }}
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: '900px',
          padding: '30px',
          backgroundColor: '#ffffff',
          borderRadius: '20px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontWeight: 'bold',
            mb: 4,
            color: '#388E3C',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <NotificationsActiveIcon sx={{ mr: 1, color: '#66BB6A' }} />
          Notifications
        </Typography>

        {loading ? (
          <CircularProgress color="success" />
        ) : error ? (
          <Typography sx={{ color: 'red' }}>{error}</Typography>
        ) : notifications.length === 0 ? (
          <Typography>No notifications yet.</Typography>
        ) : (
          <List>
            {notifications.map((notif, index) => (
              <Paper
                key={notif._id || index} // Use a unique ID if possible
                elevation={3}
                sx={{
                  mb: 2,
                  padding: 2,
                  borderRadius: '12px',
                  backgroundColor: notif.isRead ? '#E8F5E9' : '#C8E6C9',
                  transition: '0.3s',
                  ':hover': {
                    transform: 'scale(1.01)',
                    boxShadow: '0 6px 16px rgba(56,142,60,0.3)',
                  },
                }}
              >
                <ListItem disablePadding>
                  <Avatar
                    sx={{
                      bgcolor: notif.isRead ? '#66BB6A' : '#388E3C',
                      mr: 2,
                    }}
                  >
                    <NotificationsActiveIcon sx={{ color: '#fff' }} />
                  </Avatar>
                  <ListItemText
                    primary={
                      <Typography
                        variant="body1"
                        sx={{
                          fontWeight: notif.isRead ? '500' : 'bold',
                          color: '#2E7D32',
                        }}
                      >
                        {notif.message}
                      </Typography>
                    }
                    secondary={
                      <Typography variant="caption" color="textSecondary">
                        {new Date(notif.createdAt).toLocaleString()}
                      </Typography>
                    }
                  />
                </ListItem>
              </Paper>
            ))}
          </List>
        )}
      </Box>
    </Box>
  );
};

export default Notifications;
