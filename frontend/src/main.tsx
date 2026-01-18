import {createRoot} from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import React from 'react';
import {AuthProvider} from "./ui/context/AuthContext.tsx";
import {BrowserRouter} from "react-router-dom";

createRoot(document.getElementById('root')!).render(
    <AuthProvider>
        <BrowserRouter>
            <App/>
        </BrowserRouter>
    </AuthProvider>
);
