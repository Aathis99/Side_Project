// frontend/src/App.jsx

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProductManagementPage from './pages/ProductManagementPage';
import ProductTypeManagementPage from './pages/ProductTypeManagementPage';
import SearchProductsPage from './pages/SearchProductsPage';
import SearchUsersPage from './pages/SearchUsersPage';

function App() {
  return (
    <Router>
      <Navbar />
      <div className="container mt-4">
        <Routes>
          {/* แก้ไขบรรทัดนี้: เพิ่ม element prop สำหรับ HomePage */}
          <Route path="/" element={<HomePage />} />
          {/* แก้ไขบรรทัดนี้: เพิ่ม element prop สำหรับ LoginPage */}
          <Route path="/login" element={<LoginPage />} />
          {/* แก้ไขบรรทัดนี้: เพิ่ม element prop สำหรับ RegisterPage */}
          <Route path="/register" element={<RegisterPage />} />
          {/* แก้ไขบรรทัดนี้: เพิ่ม element prop สำหรับ SearchProductsPage */}
          <Route path="/search-products" element={<SearchProductsPage />} />

          {/* Protected routes for Seller */}
          <Route element={<ProtectedRoute allowedRoles={['seller']} />}>
            {/* แก้ไขบรรทัดนี้: เพิ่ม element prop สำหรับ ProductManagementPage */}
            <Route path="/product-management" element={<ProductManagementPage />} />
            {/* แก้ไขบรรทัดนี้: เพิ่ม element prop สำหรับ ProductTypeManagementPage */}
            <Route path="/product-type-management" element={<ProductTypeManagementPage />} />
          </Route>

          {/* Protected route for Admin/Authorized Users (adjust roles as needed) */}
          <Route element={<ProtectedRoute allowedRoles={['customer', 'seller']} />}>
            {/* แก้ไขบรรทัดนี้: เพิ่ม element prop สำหรับ SearchUsersPage */}
            <Route path="/search-users" element={<SearchUsersPage />} />
          </Route>

          {/* Fallback route for 404 Not Found */}
          {/* แก้ไขบรรทัดนี้: เพิ่ม element prop สำหรับ 404 */}
          <Route path="*" element={<h1 className="text-center mt-5">404 Not Found</h1>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;