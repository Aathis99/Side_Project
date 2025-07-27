// frontend/src/components/ProtectedRoute.js

import React from "react";
import { Navigate, Outlet } from "react-router-dom";
// ไม่ต้อง import { jwtDecode } ที่นี่แล้ว เพราะ App.jsx เป็นคนจัดการ userRole แล้ว

// รับ props มาจาก App.jsx
const ProtectedRoute = ({ isAuthenticated, userRole, allowedRoles }) => {
  // 1. ตรวจสอบว่ามี Token หรือไม่ (จาก isAuthenticated prop)
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // 2. ตรวจสอบ Role ของผู้ใช้เทียบกับ Role ที่ได้รับอนุญาต
  // ถ้า allowedRoles ถูกกำหนด และ Role ของผู้ใช้ไม่ได้อยู่ในรายการที่อนุญาต
  if (
    allowedRoles &&
    allowedRoles.length > 0 &&
    !allowedRoles.includes(userRole)
  ) {
    return <Navigate to="/" replace />; // หรือ Redirect ไปหน้า Unauthorized (ถ้ามี)
  }

  // ถ้าทุกอย่างผ่าน
  return <Outlet />;
};

export default ProtectedRoute;
