import Home from "./pages/home/Home.tsx";
import './App.css'
import {Route, BrowserRouter, Routes} from "react-router-dom";
import React, {useEffect} from "react";
import Login from "./pages/login/Login.tsx";
import Signup from "./pages/signup/Signup.tsx";
import Dashboard from "./pages/dashboard/Dashboard.tsx";
import {applyTheme} from "./util/userUtils.tsx";
import UserRoutes from "./pages/user/UserRoutes.tsx";

const App: React.FC = () => {

    const theme = localStorage.getItem('theme');
    useEffect(() => {
        applyTheme();
    }, [theme]);

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/user/*" element={<UserRoutes />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App
