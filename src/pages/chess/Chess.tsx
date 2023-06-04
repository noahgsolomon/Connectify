import React, { useEffect, useState } from 'react';
import {friendsList} from "../../util/api/userapi.tsx";

import {getChessSession} from "../../util/games/chessapi.tsx";
import {deleteGameInvite, sendGameInvite} from "../../util/games/gameinviteapi.tsx";
import {useNavigate} from "react-router-dom";
import Chessboard from "../../common/Components/Game/Chessboard.tsx";
import './style.css'

const Chess: React.FC = () => {
    const [friends, setFriends] = useState<Array<{username: string, profilePic: string, online: string}>>([]);
    const [search, setSearch] = useState('');
    const [activeInvite, setActiveInvite] = useState<{username: string}>({username: ''});
    const [inviteBtn, setInviteBtn] = useState('Invite');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchFriends = async () => {
            const friendList = await friendsList();
            setFriends(friendList);
        };
        fetchFriends();
    }, []);

    const handleInvite = (e: React.MouseEvent<HTMLButtonElement>) => {
        if(activeInvite.username !== ''){
            return;
        }
        const username = e.currentTarget.parentElement?.querySelector('span')?.textContent;
        if(username) {
            sendGameInvite(username.slice(3), 'CHESS').then(r => console.log(r));
            setActiveInvite({username: username.slice(3)});
            setInviteBtn('✅');
            const fetchSessionInterval = setInterval(async () => {
                const chessSessionFetch = await getChessSession(username.slice(3));
                if (chessSessionFetch){
                    await deleteGameInvite(localStorage.getItem('username') || 'null');
                    localStorage.setItem('opponent', username.slice(3));
                    navigate('/chess-live/' + chessSessionFetch.id);
                }
            }, 2000);
            setTimeout(() => {
                setInviteBtn('Invite');
                setActiveInvite({username: ''});
                clearInterval(fetchSessionInterval);
            }, 15000);
        }
    }

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
    };

    const displayedFriends = friends.filter(friend =>
        friend.username.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="content">
            <div className="chess-board">
                <Chessboard myTeam={'WHITE'}/>
            </div>
            <div className="friends-panel">
                <input type="text" className="friends-search" placeholder="Search..." onChange={handleSearch}/>
                <div className="friends-list">
                    {displayedFriends.map((friend, index) => (
                        <div className="friend-item" key={index}>
                            <span>{friend.profilePic} {friend.username}</span>
                            {friend.online.toLowerCase() === 'true' &&
                                <div className="online-indicator">
                                    <span className="blink"></span>
                                </div>
                            }
                            <button className="invite-btn" onClick={handleInvite}>{inviteBtn}</button>
                        </div>
                    ))}
                    {friends.length === 0 && <span>You have no friends😢</span>}
                </div>
            </div>
        </div>
    );
};

export default Chess;