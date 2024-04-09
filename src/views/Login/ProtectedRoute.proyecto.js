import { Navigate, Outlet } from "react-router-dom";
import React from "react";

const ProtectedRoute = ({
    canActivate, redirectPath = '/login'
}) => {
    if (!canActivate) {
        return <Navigate to={redirectPath} replace />
    }
    return <Outlet />
}

export default ProtectedRoute