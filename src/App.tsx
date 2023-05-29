import Home from "./pages/home/Home.tsx";
import './App.css'
import {Route, BrowserRouter, Routes, Outlet} from "react-router-dom";
import React, {useEffect} from "react";
import Login from "./pages/login/Login.tsx";
import Signup from "./pages/signup/Signup.tsx";
import Dashboard from "./pages/dashboard/Dashboard.tsx";
import {applyTheme} from "./util/userUtils.tsx";
import UserRoutes from "./pages/user/UserRoutes.tsx";
import {getTheme, onlineHeartbeat} from "./util/api/userapi.tsx";
import Inbox from "./pages/Inbox/Inbox.tsx";
import Profile from "./pages/profile/Profile.tsx";
import Header from "./common/Components/Header/Header.tsx";

const App: React.FC = () => {

    useEffect(() => {
        const heartbeat = setInterval(async () => {
            await onlineHeartbeat();
        }, 1000 * 60 * 2);

        const fetchTheme = async () => {
            const fetchedTheme = await getTheme();
            if (fetchedTheme){
                localStorage.setItem('theme', fetchedTheme);
                console.log(fetchedTheme);
                applyTheme(fetchedTheme);
            }
        }

       fetchTheme();

        return () => {
            clearInterval(heartbeat);
        }
    }, []);

    return (
        <BrowserRouter>
            <Routes>
                <Route path="" element={<HeaderWrapper page={'auth'}/>}>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                </Route>
                <Route path="" element={<HeaderWrapper page={'app'}/>}>
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/user/*" element={<UserRoutes />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/inbox" element={<Inbox />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

type HeaderType = {
    page: 'app' | 'auth';
}
const HeaderWrapper: React.FC<HeaderType> = ({page}) => (
    <>
        <Header page={page}/>
       <Outlet/>
    </>
);

export default App
