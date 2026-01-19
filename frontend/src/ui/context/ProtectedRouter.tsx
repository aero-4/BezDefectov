import React from 'react';
import {useAuth} from "./AuthContext.tsx";
import {Navigate, Outlet} from "react-router-dom";
import Loader from "../loaders/Loader.tsx";

function ProtectedRouter() {
    const {isAuthenticated, user, loading} = useAuth();

    if (loading) {
        return <Loader/>;
    }

    if (isAuthenticated && user.id) {
        return <Outlet/>;
    }

    return (
        <div className="flex flex-col gap-24 h-full w-full">
            <span>Вы должны авторизоваться</span>
            <button
                className="action_btn"
                onClick={() => (window.location.assign('/login'))}
            >
                Войти
            </button>
        </div>
    );

}

export default ProtectedRouter;