import {useParams} from "react-router-dom";
import React from "react";

const ChessGame: React.FC = () => {

    let { session } = useParams();

    return (
        <div>
            <h1>Chess Game</h1>
            <p>Session: {session}</p>
        </div>
    );
}

export default ChessGame;
