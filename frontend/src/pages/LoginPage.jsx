// frontend/src/pages/LoginPage.jsx (ตัวอย่างโค้ด)

import React, { useState } from "react";
import { useNavigate,Link } from "react-router-dom";
import api from "../services/api"; // สมมติว่าคุณมี service สำหรับเรียก API

// รับ onLoginSuccess จาก App.jsx
const LoginPage = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/auth/login", { email, password });
      const { token } = response.data;

      // เมื่อ Login สำเร็จ ให้เรียก onLoginSuccess
      onLoginSuccess(token); // << ส่ง token ไปให้ App.jsx จัดการ

      navigate("/"); // ไปยังหน้าหลัก
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
      console.error("Login error:", err);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header text-center">Login</div>
            <div className="card-body">
              {error && <div className="alert alert-danger">{error}</div>}
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="emailInput" className="form-label">
                    Email address
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="emailInput"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="passwordInput" className="form-label">
                    Password
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="passwordInput"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary w-100">
                  Login
                </button>
              </form>

              <div className="mt-3 text-center">
                <p>
                  Don't have an account?{" "}
                  <Link to="/register">Register here</Link>{" "}
                  {/* << ปลด Comment */}
                </p>
                <p>
                  <Link to="/forgot-password">Forgot Password?</Link>{" "}
                  {/* << ปลด Comment */}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
