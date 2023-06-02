import React, { useEffect, useState } from 'react';
import {friendsList} from "../../util/api/userapi.tsx";
import './style.css'
import {getChessSession} from "../../util/games/chessapi.tsx";
import {deleteGameInvite, sendGameInvite} from "../../util/games/gameinviteapi.tsx";
import {useNavigate} from "react-router-dom";


const Chess: React.FC = () => {
    const [friends, setFriends] = useState<Array<{username: string, profilePic: string, online: string}>>([]);
    const [search, setSearch] = useState('');
    const [chessboard, setChessboard] = useState<Array<{piece: string, color: string}>>([]);
    const [activeInvite, setActiveInvite] = useState<{username: string}>({username: ''});
    const [inviteBtn, setInviteBtn] = useState('Invite');
    const navigate = useNavigate();
    function getPieceType(piece: string) {
        if (piece === '♜' || piece === '♖') {
            return 'rook';
        } else if (piece === '♞' || piece === '♘') {
            return 'knight';
        } else if (piece === '♝' || piece === '♗') {
            return 'bishop';
        } else if (piece === '♛' || piece === '♕') {
            return 'queen';
        } else if (piece === '♚' || piece === '♔') {
            return 'king';
        } else if (piece === '♟' || piece === '♙') {
            return 'pawn';
        } else {
            return '';
        }
    }

    function getPieceTeam(piece: string) {
        return (piece === '♔' || piece === '♕' || piece === '♖' ||
            piece === '♗' || piece === '♘' || piece === '♙') ?
            'white' : 'black';
    }

    const pieces = [
        '♜', '♞', '♝', '♛', '♚', '♝', '♞', '♜',
        '♟', '♟', '♟', '♟', '♟', '♟', '♟', '♟',
        '',   '',   '',   '',   '',   '',   '',   '',
        '',   '',   '',   '',   '',   '',   '',   '',
        '',   '',   '',   '',   '',   '',   '',   '',
        '',   '',   '',   '',   '',   '',   '',   '',
        '♙', '♙', '♙', '♙', '♙', '♙', '♙', '♙',
        '♖', '♘', '♗', '♕', '♔', '♗', '♘', '♖'
    ];

    useEffect(() => {
        let board = [];
        for (let i = 0; i < 64; i++) {
            const isLight = (Math.floor(i / 8) % 2 === 0) ? (i % 2 === 0) : (i % 2 === 1);
            const piece = pieces[i];
            board.push({piece: piece, color: isLight ? 'light' : 'dark'});
        }
        setChessboard(board);
    }, []);

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
                {chessboard.map((tile, i) => (
                    <div
                        key={i}
                        id={`tile-${i + 1}`}
                        className={`tile ${tile.color}`}
                        data-color={tile.color}
                        data-num={i + 1}
                        data-piece={tile.piece ? getPieceType(tile.piece) : ''}
                        data-team={tile.piece ? getPieceTeam(tile.piece) : ''}
                        style={{
                            backgroundColor: `var(--${tile.color}-tile)`,
                            cursor: tile.piece ? 'pointer' : 'default'
                        }}
                    >
                        {tile.piece &&
                            <div
                                data-moved="false"
                                className="piece"
                                data-piece-type={getPieceType(tile.piece)}
                                data-team={getPieceTeam(tile.piece)}
                            >
                                <img src={`src/pages/chess/assets/${getPieceTeam(tile.piece)}${getPieceType(tile.piece)}.png`}  alt={`${getPieceTeam(tile.piece)} ${getPieceType(tile.piece)}`}/>
                            </div>
                        }
                    </div>
                ))}
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