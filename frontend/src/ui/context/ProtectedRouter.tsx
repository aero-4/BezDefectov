import React from 'react';
import {useAuth} from "./AuthContext.tsx";
import {Navigate, Outlet} from "react-router-dom";

function ProtectedRouter() {
    const {isAuthenticated, user} = useAuth();

    if (isAuthenticated && user.id) {
        return <Outlet/>;
    }

    return <Navigate to={"/login"} state={{from: location}} replace />

}

export default ProtectedRouter;