import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false); // optional loading state
  const navigate = useNavigate();

  useEffect(() => {
    setEmail("");
    setPassword("");
    setMsg("");
    setErrors({});
  }, []);

  const validate = () => {
    const newErrors = {};
    if (!email) newErrors.email = "Email is required.";
    else if (!email.includes("@")) newErrors.email = "Enter a valid email.";

    if (!password) newErrors.password = "Password is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setLoading(true);
      const res = await axios.post("http://localhost:5000/api/auth/admin/login", {
        email,
        password,
      });

      const token = res.data.token;
      localStorage.setItem("adminToken", token);

      setMsg("Login Successful ✅");
      setTimeout(() => {
        navigate("/adminhome");
      }, 1000);
    } catch (err) {
      setMsg("Invalid email or password ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        backgroundColor: "green",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        margin: 0,
        padding: 0,
      }}
    >
      <div
        style={{
          display: "flex",
          backgroundColor: "white",
          borderRadius: "12px",
          boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
          overflow: "hidden",
          maxWidth: "900px",
          width: "100%",
        }}
      >
        {/* Left side message */}
        <div
          style={{
            backgroundColor: "#004d00",
            color: "white",
            padding: "2rem",
            flex: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize: "1.4rem",
            textAlign: "center",
          }}
        >
          "Secure Admin Access to Manage Everything!"
        </div>

        {/* Right side login form */}
        <div style={{ flex: 1, padding: "2rem" }}>
          <h2 style={{ textAlign: "center", color: "green" }}>Admin Login</h2>
          <form onSubmit={handleLogin} noValidate>
            <div style={{ marginBottom: "1rem" }}>
              <input
                type="email"
                placeholder="Admin Email"
                value={email}
                autoComplete="off"
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "5px",
                  border: errors.email ? "1px solid red" : "1px solid #ccc",
                }}
              />
              {errors.email && (
                <p style={{ color: "red", marginTop: "5px", fontSize: "0.9rem" }}>
                  {errors.email}
                </p>
              )}
            </div>

            <div style={{ marginBottom: "1rem" }}>
              <input
                type="password"
                placeholder="Admin Password"
                value={password}
                autoComplete="new-password"
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "5px",
                  border: errors.password ? "1px solid red" : "1px solid #ccc",
                }}
              />
              {errors.password && (
                <p style={{ color: "red", marginTop: "5px", fontSize: "0.9rem" }}>
                  {errors.password}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                padding: "10px",
                backgroundColor: loading ? "gray" : "green",
                color: "white",
                fontWeight: "bold",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              {loading ? "Logging in..." : "Login as Admin"}
            </button>
          </form>

          {msg && (
            <p
              style={{
                marginTop: "1rem",
                textAlign: "center",
                color: msg.includes("✅") ? "green" : "red",
              }}
            >
              {msg}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
