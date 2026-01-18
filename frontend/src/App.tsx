import {Suspense} from 'react'
import './App.css'
import './fonts.css'
import React from 'react';
import {Routes, Route, BrowserRouter} from "react-router-dom";
import Loader from "./ui/loaders/Loader.tsx";
import Layout from "./ui/components/Layout.tsx";
import Home from "./ui/pages/Home.tsx";
import Register from "./ui/pages/Register.tsx";
import Login from "./ui/pages/Login.tsx";
import FAQ from "./ui/pages/FAQ.tsx";
import Lessons from "./ui/pages/Lessons.tsx";
import Types from "./ui/pages/Types.tsx";
import Profile from "./ui/pages/Profile.tsx";
import Lesson from "./ui/pages/Lesson.tsx";
import Admin from "./ui/pages/Admin.tsx";
import ProtectedRouter from "./ui/context/ProtectedRouter.tsx";
function App(): JSX.Element {
    return (
        <Suspense fallback={<Loader/>}>
            <Routes>
                <Route path="/" element={<Layout/>}>
                    <Route index element={<Home/>}/>
                    <Route path="register" element={<Register/>}/>
                    <Route path="login" element={<Login/>}/>
                    <Route path="faq" element={<FAQ/>}/>

                    <Route element={<ProtectedRouter/>}>
                        <Route path="types" element={<Types/>}/>
                        <Route path="lessons/:type" element={<Lessons/>}/>
                        <Route path="lesson/:id" element={<Lesson/>}/>
                        <Route path="profile" element={<Profile/>}/>
                        <Route path="admin" element={<Admin/>}/>
                    </Route>
                </Route>
            </Routes>
        </Suspense>
    )
}

export default App
