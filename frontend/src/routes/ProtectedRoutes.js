import React from 'react';

import { Navigate, Outlet, useLocation } from 'react-router-dom';
import instance from 'utils/AuthHelpers';

function ProtectedRoutes({ roleRequired }) {
    const user = instance.getUserInfo();
    const location = useLocation();
    if (user && instance.getAccessToken()) {
        if (roleRequired === user?.role) {
            return <Outlet />;
        } else {
            return user.role === 0 ? (
                <Navigate to="/schedule/show" />
            ) : user.role === 1 ? (
                <Navigate to="manager/dashboard" />
            ) : (
                <Navigate to="chain-manager/dashboard" />
            );
        }
    } else {
        instance.clearStorage();
        return <Navigate to="/login" state={{ from: location }} replace />;
    }
}

export default ProtectedRoutes;
