// frontend/src/components/Navbar.js

import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from '../contexts/ThemeContext'; // <<<<<< นำเข้า useTheme

// รับ props มาจาก App.jsx
const Navbar = ({ isAuthenticated, userRole, onLogout }) => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme(); // <<<<<< ดึง theme และ toggleTheme จาก Context

  // ใช้ onLogout ที่รับมา
  const handleLogout = () => {
    onLogout(); // เรียกฟังก์ชัน logout จาก App.jsx
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark ">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          My Management System
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link" to="/search-products">
                สินค้า
              </Link>
            </li>

            {/* เมนูสำหรับจัดการสินค้า/ประเภทสินค้า (Seller และ Admin) */}
            {isAuthenticated &&
              (userRole === "seller" || userRole === "admin") && (
                <>
                  <li className="nav-item">
                    <Link className="nav-link" to="/product-management">
                      จัดการสินค้า
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/product-type-management">
                      จัดการประเภทสินค้า
                    </Link>
                  </li>
                </>
              )}

            {/* เมนูสำหรับค้นหาผู้ใช้ (เฉพาะ Admin) */}
            {isAuthenticated && userRole === "admin" && (
              <li className="nav-item">
                <Link className="nav-link" to="/search-users">
                  ค้นหาผู้ใช้
                </Link>
              </li>
            )}
          </ul>

          <ul className="navbar-nav">
            {/* ปุ่มสลับโหมดกลางคืน/กลางวัน */}
            <li className="nav-item me-2"> {/* เพิ่ม margin ขวาเล็กน้อย */}
              <button
                className="btn btn-outline-info" // หรือใช้ btn-outline-light/dark ตามความเหมาะสม
                onClick={toggleTheme} // << เรียก toggleTheme เมื่อคลิก
              >
                {/* แสดงไอคอนและข้อความตามโหมดปัจจุบัน */}
                {theme === 'light' ? (
                  <>
                    <i class="bi bi-moon-fill"></i> 
                  </>
                ) : (
                  <>
                    <i class="bi bi-brightness-high-fill"></i> 
                  </>
                )}
              </button>
            </li>

            {isAuthenticated ? (
              <li className="nav-item">
                <button
                  className="btn btn-outline-danger"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </li>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">
                    Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/register">
                    Register
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;