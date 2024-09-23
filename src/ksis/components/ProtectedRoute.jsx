// src/components/ProtectedRoute.jsx
import React from "react";
import { Navigate, Outlet } from "react-router-dom";

function ProtectedRoute() {
    const accessToken = localStorage.getItem('accessToken');

    if (!accessToken) {
        return <Navigate to="/downloadApp" />;
    }

    return <Outlet />; // 보호된 경로의 자식 요소들을 렌더링
}

export default ProtectedRoute;
