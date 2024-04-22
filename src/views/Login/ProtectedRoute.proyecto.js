import { Navigate, Outlet } from "react-router-dom";
import React from "react";
import PropTypes from "prop-types";

const ProtectedRoute = ({
    canActivate, redirectPath = '/login'
}) => {
    if (!canActivate) {
        return <Navigate to={redirectPath} replace />
    }   
    return <Outlet />
}

ProtectedRoute.propTypes = {
    canActivate: PropTypes.bool.isRequired,
    redirectPath: PropTypes.string
};

export default ProtectedRoute