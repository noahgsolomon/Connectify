import React, {useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import useAuthentication from "../../setup/useAuthentication.tsx";
import {chessHeartbeat, getChessSessionWithId} from "../../util/games/chessapi.tsx";
import Chessboard from "../../common/Components/Game/Chessboard.tsx";
import './style.css';

const ChessGame: React.FC = () => {

    const [color, setColor] = useState('');
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

    return (
        <div className="content">
            <div className="player top-player"></div>
            <div className="chess-board">
                {(color ==='WHITE' || color === 'BLACK') ? <Chessboard myTeam={color} sessionId={sessionId}/> : <p>Waiting for opponent...</p>}
            </div>
            <div className="bottom-wrapper">
                <div className="player bottom-player"></div>
                <button className="resign-btn">Resign 🏳️</button>
            </div>
            <div id="gameResultModal" className="chess-modal">
                <div className="chess-modal-content">
                    <span className="close">&times;</span>
                    <p id="gameResultText"></p>
                </div>
            </div>
            <div id="resignConfirmationModal" className="modal" style={{ display: 'none' }}>
                <div className="modal-content">
                    <span className="close">&times;</span>
                    <p>Are you sure you want to resign?</p>
                    <button id="confirmResign">Yes</button>
                    <button id="cancelResign">No</button>
                </div>
            </div>
        </div>
    );
}

export default ChessGame;