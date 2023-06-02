import React, {useEffect, useState} from 'react';
import { useParams } from 'react-router-dom';
import useAuthentication from "../../setup/useAuthentication.tsx";
import {getChessSessionWithId} from "../../util/games/chessapi.tsx";
import Chessboard from "../../common/Components/Game/Chessboard.tsx";

const ChessGame: React.FC = () => {
    useAuthentication();
    let { session } = useParams<{ session: string }>();
    const [color, setColor] = useState('');

    const [myTurn, setMyTurn] = useState<boolean>(false);

    useEffect(() => {
        const fetchSession = async () => {
            const sessionData = await getChessSessionWithId(parseInt(session || '0'));
            if (sessionData){
                if (sessionData.whitePlayer === localStorage.getItem('username')){
                    setColor('WHITE');
                    setMyTurn(true);
                } else if (sessionData.blackPlayer === localStorage.getItem('username')){
                    setColor('BLACK');
                }
            }
        }

        fetchSession();

    }, [session]);

    return (
        <div className="content">
            <div className="player top-player"></div>
            <div className="chess-board">
                {(color ==='WHITE' || color === 'BLACK') ? <Chessboard userColor={color}/> : <p>Waiting for opponent...</p>}
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