import React, { useEffect, useState } from 'react';
import axios from 'axios';

function AdminHome() {
  const [requests, setRequests] = useState([]);
  const [updatedRequests, setUpdatedRequests] = useState({});


  // Fetch donation requests from backend
  
  const handleStatusChange = async (requestId, status) => {
    try {
      setUpdatedRequests(prev => ({ ...prev, [requestId]: 'updating' }));
  
      const response = await fetch(`http://localhost:5000/api/donation-requests/${requestId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error updating status:", errorData.message);
        alert(errorData.message || "Failed to update request status.");
        setUpdatedRequests(prev => ({ ...prev, [requestId]: undefined }));
        return;
      }
  
      const updatedRequest = await response.json();
  
      setRequests((prevRequests) =>
        prevRequests.map((request) =>
          request._id === updatedRequest._id ? updatedRequest : request
        )
      );
      console.log("Sending notification with organ:", updatedRequest.organ);


      await axios.post('http://localhost:5000/api/notifications', {
        recipientEmail: updatedRequest.email,
        message: `Your donation request for ${updatedRequest.organ?.join(", ") || "organ"} has been ${status}`,

        status: status,
        organ: updatedRequest.organ,
      });
  
      setUpdatedRequests(prev => ({ ...prev, [requestId]: 'done' }));
      alert(`Request ${status} successfully!`);
  
    } catch (error) {
      console.error('❌ Error updating request status:', error);
      alert("Something went wrong!");
      setUpdatedRequests(prev => ({ ...prev, [requestId]: undefined }));
    }
  };
  
  



  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/donation-requests');
      setRequests(res.data);
    } catch (err) {
      console.error('Failed to fetch requests:', err);
    }
  };
 
  // Handle Accept/Reject status change
  // const handleStatusChange = async (id, newStatus) => {
  //   try {
  //     await axios.put(`http://localhost:5000/api/donation-requests/${id}`, {
  //       status: newStatus
  //     });

  //     // await createNotification(id, newStatus);

  //     alert(`Request ${newStatus}`);
  //     fetchRequests(); // Refresh list after update
  //   } catch (error) {
  //     console.error("Error updating status:", error);
  //     alert("Failed to update request status.");
  //   }
  // };

  
  
  

  
  

  
  
  return (
    <div style={outerWrapper}>
      <div style={innerWrapper}>
        <h2 style={{ color: "white", textAlign: "center" }}>Welcome, Admin 👋</h2>
        <p style={{ color: "#c0ffc0", textAlign: "center" }}>This is your dashboard.</p>

        {/* Donation Requests */}
        <div style={cardStyle}>
          <h3 style={{ color: "green", textAlign: "center" }}>Donation Requests</h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={tableStyle}>
              <thead>
                <tr style={{ backgroundColor: "#e0ffe0" }}>
                  <th style={thStyle}>Name</th>
                  <th style={thStyle}>Phone</th>
                  <th style={thStyle}>Email</th>
                  <th style={thStyle}>Gender</th>
                  <th style={thStyle}>DOB</th>
                  <th style={thStyle}>City</th>
                  <th style={thStyle}>State</th>
                  <th style={thStyle}>Country</th>
                  <th style={thStyle}>Organ</th>
                  <th style={thStyle}>Medical History</th>
                  <th style={thStyle}>Date Requested</th>
                  <th style={thStyle}>Status</th>
                  <th style={thStyle}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((req, index) => (
                  <tr key={index}>
                    <td style={tdStyle}>{req.name}</td>
                    <td style={tdStyle}>{req.phone}</td>
                    <td style={tdStyle}>{req.email}</td>
                    <td style={tdStyle}>{req.gender}</td>
                    <td style={tdStyle}>{new Date(req.dob).toLocaleDateString()}</td>
                    <td style={tdStyle}>{req.city}</td>
                    <td style={tdStyle}>{req.state}</td>
                    <td style={tdStyle}>{req.country}</td>
                    <td style={tdStyle}>{req.organ}</td>
                    <td style={tdStyle}>{req.medicalHistory}</td>
                    <td style={tdStyle}>{new Date(req.requestedAt).toLocaleDateString()}</td>
                    <td style={tdStyle}>
                      <span style={{ color: req.status === 'Accepted' ? 'green' : req.status === 'Rejected' ? 'red' : 'orange' }}>
                        {req.status}
                      </span>
                    </td>
                    <td style={tdStyle}>
                    <div style={{ display: "flex", gap: "0.5rem", justifyContent: "center", alignItems: "center", minHeight: "40px" }}>
  {updatedRequests[req._id] === 'done' ? (
    <span style={{ color: 'green', fontWeight: 'bold' }}>✅ Status Updated</span>
  ) : (
    <>
      <button
  style={{
    ...acceptBtn,
    opacity:
      updatedRequests[req._id] || req.status === 'Accepted' || req.status === 'Rejected'
        ? 0.6
        : 1,
  }}
  onClick={() => handleStatusChange(req._id, 'Accepted')}
  disabled={
    !!updatedRequests[req._id] || req.status === 'Accepted' || req.status === 'Rejected'
  }
>
  Accept
</button>
<button
  style={{
    ...rejectBtn,
    opacity:
      updatedRequests[req._id] || req.status === 'Accepted' || req.status === 'Rejected'
        ? 0.6
        : 1,
  }}
  onClick={() => handleStatusChange(req._id, 'Rejected')}
  disabled={
    !!updatedRequests[req._id] || req.status === 'Accepted' || req.status === 'Rejected'
  }
>
  Reject
</button>

    </>
  )}
</div>

                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

// Styles
const outerWrapper = {
  backgroundColor: "#064d1f",
  minHeight: "100vh",
  width: "100vw",
  display: "flex",
  justifyContent: "center",
  alignItems: "flex-start",
  padding: "2rem",
  boxSizing: "border-box",
};

const innerWrapper = {
  width: "100%",
  maxWidth: "1200px"
};

const cardStyle = {
  backgroundColor: "white",
  padding: "1.5rem",
  borderRadius: "10px",
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
  marginTop: "2rem",
  overflowX: "auto"
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  marginTop: "1rem"
};

const thStyle = {
  padding: "0.6rem",
  border: "1px solid #ccc",
  textAlign: "center",
  fontWeight: "bold"
};

const tdStyle = {
  padding: "0.6rem",
  border: "1px solid #ccc",
  textAlign: "center"
};

const acceptBtn = {
  padding: "0.4rem 0.9rem",
  backgroundColor: "green",
  color: "white",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer"
};

const rejectBtn = {
  padding: "0.4rem 0.9rem",
  backgroundColor: "red",
  color: "white",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer"
};

export default AdminHome;
