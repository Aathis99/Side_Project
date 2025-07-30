// frontend/src/App.jsx
import React, { useState, useEffect } from "react"; // << เพิ่ม useState, useEffect
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; // << นำเข้า jwtDecode
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProductManagementPage from "./pages/ProductManagementPage";
import ProductTypeManagementPage from "./pages/ProductTypeManagementPage";
import SearchProductsPage from "./pages/SearchProductsPage";
import SearchUsersPage from "./pages/SearchUsersPage";

import "bootstrap-icons/font/bootstrap-icons.css";
import { ThemeProvider } from "./contexts/ThemeContext"; // << นำเข้า ThemeProvider
import "./styles/themes.css"; // << นำเข้า CSS สำหรับธีม

function App() {
  // State สำหรับเก็บสถานะการ Login และ Role
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);

  // ฟังก์ชันสำหรับอัปเดตสถานะการ Login
  const handleLoginSuccess = (token) => {
    localStorage.setItem("token", token);
    try {
      const decoded = jwtDecode(token);
      setIsAuthenticated(true);
      setUserRole(decoded.role);
    } catch (error) {
      console.error("Failed to decode token on login success:", error);
      setIsAuthenticated(false);
      setUserRole(null);
    }
  };

  // ฟังก์ชันสำหรับจัดการ Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user"); // ถ้ามีเก็บไว้
    localStorage.removeItem("role"); // ถ้ามีเก็บไว้
    setIsAuthenticated(false);
    setUserRole(null);
    // ไม่ต้อง navigate ตรงนี้ เดี๋ยว App.jsx จัดการ redirect ผ่าน ProtectedRoute
  };

  // ตรวจสอบสถานะการ Login เมื่อ App โหลดครั้งแรก
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        // ตรวจสอบ Token หมดอายุ
        if (decoded.exp * 1000 < Date.now()) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          localStorage.removeItem("role");
          setIsAuthenticated(false);
          setUserRole(null);
        } else {
          setIsAuthenticated(true);
          setUserRole(decoded.role);
        }
      } catch (error) {
        console.error("Invalid token on app load:", error);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("role");
        setIsAuthenticated(false);
        setUserRole(null);
      }
    }
  }, []); // รันแค่ครั้งเดียวเมื่อ App Component ถูก Mount

  return (
    <ThemeProvider>
      <Router>
        {/* ส่ง props ไปยัง Navbar */}
        <Navbar
          isAuthenticated={isAuthenticated}
          userRole={userRole}
          onLogout={handleLogout} // ส่งฟังก์ชัน logout ไปให้ Navbar ด้วย
        />
        <div className="container mt-4">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            {/* ส่ง onLoginSuccess ไปยัง LoginPage */}
            <Route
              path="/login"
              element={<LoginPage onLoginSuccess={handleLoginSuccess} />}
            />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/search-products" element={<SearchProductsPage />} />

            {/* Protected routes */}
            <Route
              element={
                <ProtectedRoute
                  isAuthenticated={isAuthenticated}
                  userRole={userRole}
                  allowedRoles={["seller", "admin"]}
                />
              }
            >
              <Route
                path="/product-management"
                element={<ProductManagementPage />}
              />
              <Route
                path="/product-type-management"
                element={<ProductTypeManagementPage />}
              />
            </Route>

            <Route
              element={
                <ProtectedRoute
                  isAuthenticated={isAuthenticated}
                  userRole={userRole}
                  allowedRoles={["admin"]}
                />
              }
            >
              <Route path="/search-users" element={<SearchUsersPage />} />
            </Route>

            <Route
              path="*"
              element={<h1 className="text-center mt-5">404 Not Found</h1>}
            />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
