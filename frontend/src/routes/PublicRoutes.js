import React from 'react';

import { Navigate, Outlet } from 'react-router-dom';
import instance from 'utils/AuthHelpers';

const useAuth = () => {
    const user = instance.getUserInfo();
    if (user) {
        return true;
    } else {
        return false;
    }
};
const PublicRoutes = (props) => {
    const auth = useAuth();
    return auth ? <Navigate to="/" /> : <Outlet />;
};

export default PublicRoutes;
