import React from 'react';
import {useAuth} from "./AuthContext.tsx";
import {Navigate, Outlet} from "react-router-dom";

function ProtectedRouter() {
    const {isAuthenticated, user} = useAuth();

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