import React, { useEffect, useState } from 'react';
import {friendsList} from "../../util/api/userapi.tsx";
import './style.css'
import {sendGameInvite} from "../../util/games/gameinviteapi.tsx";
import {getChessSession} from "../../util/games/chessapi.tsx";
import {useChessInvites} from "../../util/games/useChessInvites.tsx";

const Chess: React.FC = () => {
    const [friends, setFriends] = useState<Array<{username: string, profilePic: string, online: string}>>([]);
    const [search, setSearch] = useState('');
    const [chessboard, setChessboard] = useState<Array<{piece: string, color: string}>>([]);
    const [selectedPiece, setSelectedPiece] = useState(0);
    const [activeInvite, setActiveInvite] = useState<{username: string, sessionIntervalId: NodeJS.Timeout | null}>({username: '', sessionIntervalId: null});
    const [inviteBtn, setInviteBtn] = useState('Invite');
    const inviteState = useChessInvites('/chessgame');


    useEffect(() => {
        console.log(inviteState);
        const intervalId = setInterval(async () => {
            if(activeInvite.username) {
                const sessionDataString = await getChessSession(activeInvite.username);
                if(sessionDataString !== 'No game open between users yet') {
                    const sessionData = JSON.parse(sessionDataString);
                    if (sessionData.gameStatus === 'IN_PROGRESS') {
                        localStorage.setItem('opponent', activeInvite.username);
                        window.location.href = `/chessgame?sessionId=${sessionData.id}`;
                    }
                }
            }
        }, 1000);
        return () => clearInterval(intervalId);
    }, [activeInvite, inviteState]);

    const handleInvite = async (username: string) => {
        const postData = async() => {
            await sendGameInvite(username, 'CHESS');
            setInviteBtn('✅');
        }
        await postData();

        setActiveInvite(prev => ({
            username: username,
            sessionIntervalId: prev.sessionIntervalId
        }));

        const sessionTimeoutId = setTimeout(() => {
            if(activeInvite.sessionIntervalId) {
                clearInterval(activeInvite.sessionIntervalId);
                setActiveInvite({username: '', sessionIntervalId: null});
            }
        }, 16000);
    };

    useEffect(() => {
        return () => {
            if(activeInvite.sessionIntervalId) {
                clearInterval(activeInvite.sessionIntervalId);
            }
        }
    }, []);
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

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
    };

    const displayedFriends = friends.filter(friend =>
        friend.username.toLowerCase().includes(search.toLowerCase())
    );

    const handleTileClick = (i: number) => {
        setSelectedPiece(i);
    };

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
                        onClick={() => handleTileClick(i)}
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
                            <button className="invite-btn" onClick={() => handleInvite(friend.username)}>{inviteBtn}</button>
                        </div>
                    ))}
                    {friends.length === 0 && <span>You have no friends😢</span>}
                </div>
            </div>
        </div>
    );
};

export default Chess;