import React, {useEffect} from 'react';
import {useAuth} from "../context/AuthContext.tsx";

function Logout() {

    const {logout} = useAuth();

    useEffect(() => {
        (async () => {
            await logout();
        })();
    }, []);

    return window.location.assign("/")
}

export default Logout;