// frontend/src/components/ProtectedRoute.js

import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ allowedRoles }) => {
    const isAuthenticated = localStorage.getItem('token');
    const userRole = localStorage.getItem('role');

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(userRole)) {
        return <Navigate to="/" replace />; // หรือแสดงหน้า Unauthorized
    }

    return <Outlet />;
};

export default ProtectedRoute;