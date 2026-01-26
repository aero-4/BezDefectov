import React from 'react';
import {useAuth} from "./AuthContext.tsx";
import {Navigate, Outlet, useNavigate} from "react-router-dom";
import Loader from "../loaders/Loader.tsx";

function ProtectedRouter() {
    const {isAuthenticated, user, loading} = useAuth();
    const navigate = useNavigate();


    if (isAuthenticated && user.email) {
        return <Outlet/>;
    }

    return (
        <div className="flex flex-col gap-24 h-full w-full">
            <span>Вы должны авторизоваться</span>

            <button
                className="action_btn"
                onClick={() => navigate('/login', { replace: true })}
            >
                Войти
            </button>
        </div>
    );

}

export default ProtectedRouter;