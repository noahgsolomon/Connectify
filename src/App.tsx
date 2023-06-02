import Home from "./pages/home/Home.tsx";
import './App.css'
import {Route, BrowserRouter, Routes, Outlet} from "react-router-dom";
import React, {useEffect, useState} from "react";
import Login from "./pages/login/Login.tsx";
import Signup from "./pages/signup/Signup.tsx";
import Dashboard from "./pages/dashboard/Dashboard.tsx";
import {applyTheme} from "./util/userUtils.tsx";
import UserRoutes from "./pages/user/UserRoutes.tsx";
import {getTheme, onlineHeartbeat} from "./util/api/userapi.tsx";
import Inbox from "./pages/Inbox/Inbox.tsx";
import Profile from "./pages/profile/Profile.tsx";
import Settings from "./pages/settings/Settings.tsx";
import Header from "./common/Components/Header/Header.tsx";
import Chess from "./pages/chess/Chess.tsx";
import {getGameInvites} from "./util/games/gameinviteapi.tsx";
import ChessGame from "./pages/chess/ChessGame.tsx";
import InviteHandler from "./common/Components/InviteHandler.tsx";

const username = localStorage.getItem('username');
const App: React.FC = () => {

    const [invite, setInvite] = useState<{inviter: string}>({inviter: ''});
    const jwtToken = localStorage.getItem('jwtToken');

    useEffect(() => {
        let heartbeat: NodeJS.Timeout;
        let inviteInterval: NodeJS.Timeout;

            if (jwtToken){
                heartbeat = setInterval(async () => {
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
                inviteInterval = setInterval(async () => {
                        const gameInviteFetch = await getGameInvites();
                        if (gameInviteFetch.length > 0 && gameInviteFetch[0].invited === username) {
                            console.log('invited');
                            setInvite({inviter: gameInviteFetch[0].inviter});
                        }
                    }, 4000);


                return () => {
                    clearInterval(heartbeat);
                    clearInterval(inviteInterval);
                }
    }


    }, []);

    return (
        <BrowserRouter>
            <InviteHandler invite={invite} setInvite={setInvite} />
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
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/chess" element={<Chess />}/>
                    <Route path="/chess-live/:session" element={<ChessGame />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

type HeaderType = {
    page: 'app' | 'auth';
}
const HeaderWrapper: React.FC<HeaderType> = ({page}) => {

    return (
    <>
        <Header page={page}/>
        <Outlet/>
    </>
);
}


export default App
