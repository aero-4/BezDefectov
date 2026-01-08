import {useState, Suspense} from 'react'
import './App.css'
import {Routes, Route, BrowserRouter} from "react-router-dom";
import Loader from "./ui/loaders/Loader.tsx";
import Layout from "./ui/components/Layout.tsx";
import Home from "./ui/pages/Home.tsx";
import Register from "./ui/pages/Register.tsx";
import Login from "./ui/pages/Login.tsx";
import FAQ from "./ui/pages/FAQ.tsx";

function App() {
    return (
        <>
            <BrowserRouter>
                <Suspense fallback={<Loader/>}>
                    <Routes>
                        <Route path="/" element={<Layout/>}>
                            <Route index element={<Home/>}/>
                            <Route path="/register" element={<Register/>}/>
                            <Route path="/login" element={<Login/>}/>
                            <Route path="/faq" element={<FAQ/>}/>
                        </Route>
                    </Routes>
                </Suspense>
            </BrowserRouter>
        </>
    )
}

export default App
