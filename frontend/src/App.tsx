import {useState, Suspense} from 'react'
import './App.css'
import './fonts.css'
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
                            <Route path="/types" element={<Types/>}/>
                            <Route path="/lessons/:type" element={<Lessons/>}/>
                            <Route path="/lesson/:id" element={<Lesson/>}/>

                            <Route path="/profile" element={<Profile/>}/>
                        </Route>
                    </Routes>
                </Suspense>
            </BrowserRouter>
        </>
    )
}

export default App
