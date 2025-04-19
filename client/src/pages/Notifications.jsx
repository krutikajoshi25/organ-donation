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

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('userToken');

      if (!token) throw new Error("Token is missing. Please log in again.");

      const res = await axios.get('http://localhost:5000/api/donation-requests/notifications', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setNotifications(res.data);
      setLoading(false);
    } catch (err) {
      console.error('Failed to fetch notifications:', err);

      if (err.response) {
        if (err.response.status === 401) {
          setError("Session expired. Please log in again.");
        } else {
          setError(`Error: ${err.response.data.message || "Failed to fetch notifications"}`);
        }
      } else {
        setError("An unexpected error occurred. Please try again.");
      }

      setLoading(false);
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
                key={notif._id || index}
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
                      bgcolor:
                        notif.status === 'Accepted'
                          ? '#2E7D32'
                          : notif.status === 'Rejected'
                          ? '#D32F2F'
                          : '#FBC02D',
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
      color:
        notif.status === 'Accepted'
          ? 'green'
          : notif.status === 'Rejected'
          ? 'red'
          : '#f57c00',
    }}
  >
    {notif.message}
 

                      </Typography>
                    }
                    secondary={
                      <>
                        <Typography variant="caption" color="textSecondary">
                          {notif.message}
                        </Typography>
                        <br />
                        <Typography variant="caption" color="textSecondary">
                          {new Date(notif.createdAt).toLocaleString()}
                        </Typography>
                      </>
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
