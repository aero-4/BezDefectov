import React from 'react';
import {Outlet} from "react-router-dom";
import Footer from "./Footer.tsx";

function Layout(props) {
    return (
        <div className="flex flex-col mx-auto min-h-screen max-w-screen-lg">

            <main className="flex-1 overflow-auto p-4">
                <div className="w-full h-full">
                    <Outlet/>
                </div>
            </main>

            <Footer/>

        </div>
    );
}

export default Layout;