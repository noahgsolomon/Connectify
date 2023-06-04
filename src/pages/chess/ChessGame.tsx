import React, {useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import useAuthentication from "../../setup/useAuthentication.tsx";
import {chessHeartbeat, getChessSessionWithId, updateGameStatus} from "../../util/games/chessapi.tsx";
import Chessboard from "../../common/Components/Game/Chessboard.tsx";
import './style.css';
import './chessgame.css';

const ChessGame: React.FC = () => {

    const [color, setColor] = useState('');
    const [resignClicked, setResignClicked] = useState(false);
    const [showGameResult, setShowGameResult] = useState(false);
    const [gameResult, setGameResult] = useState('');

    useAuthentication();

    const navigate = useNavigate();

    let { session } = useParams<{ session: string }>();
    let sessionId = parseInt(session || '0');
    if (!session){
        navigate('/chess');
    }

    useEffect(() => {

        chessHeartbeat(sessionId);
        const fetchSession = async () => {
            const sessionData = await getChessSessionWithId(sessionId);
            if (sessionData){
                if (sessionData.whitePlayer === localStorage.getItem('username')){
                    setColor('WHITE');
                } else if (sessionData.blackPlayer === localStorage.getItem('username')){
                    setColor('BLACK');
                }
            }
        }

        const sendChessHeartbeat = setInterval(async () => {
            await chessHeartbeat(sessionId);
        }, 60000);

        fetchSession();

        return () => clearInterval(sendChessHeartbeat);

    }, [session]);

    const handleResignClick = () => {
        setResignClicked(true);
    }

    const handleResignConfirm = async () => {
        setResignClicked(false);
        const whoWon = color === 'WHITE' ? 'BLACK' : 'WHITE';
        await updateGameStatus(sessionId, `${whoWon}_WON_BY_RESIGNATION`);
    }

    return (
        <div className="content">
            <div className="player top-player">{localStorage.getItem('opponent')}</div>
            <div className="chess-board-live">
                {(color ==='WHITE' || color === 'BLACK') ? <Chessboard myTeam={color} sessionId={sessionId}
                                                          setShowGameResult={setShowGameResult} setGameResult={setGameResult}/> : <></>}
            </div>
            <div className="bottom-wrapper">
                <div className="player bottom-player">{localStorage.getItem('emoji')} {localStorage.getItem('username')}</div>
                <button className="resign-btn" onClick={handleResignClick}>Resign 🏳️</button>
            </div>
            <div id="gameResultModal" className="modal" style={{display: showGameResult ? 'block' : 'none'}}>
                <div className="modal-content">
                    <span className="close">&times;</span>
                    <p id="gameResultText">{gameResult.replaceAll('_', ' ')}</p>
                </div>
            </div>

            <div id="resignConfirmationModal" className="modal"
                 style={{display: resignClicked ? 'block' : 'none'}}>
                <div className="modal-content">
                    <span className="close" onClick={() => setResignClicked(false)}>&times;</span>
                    <p>Are you sure you want to resign?</p>
                    <div className={'resign-buttons'}>
                        <button id="confirmResign" onClick={handleResignConfirm}>Yes</button>
                        <button id="cancelResign" onClick={() => setResignClicked(false)}>No</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ChessGame;