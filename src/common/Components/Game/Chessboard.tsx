import React, {useEffect, useState} from "react";

import {getValidMoves as getRookValidMoves} from "../../../util/games/chesspiecelogic/rook.ts";
import {getValidMoves as getPawnValidMoves} from "../../../util/games/chesspiecelogic/pawn.ts";
import {getValidMoves as getKnightValidMoves} from "../../../util/games/chesspiecelogic/knight.ts";
import {getValidMoves as getQueenValidMoves} from "../../../util/games/chesspiecelogic/queen.ts";
import {getValidMoves as getKingValidMoves} from "../../../util/games/chesspiecelogic/king.ts";
import {getValidMoves as getBishopValidMoves} from "../../../util/games/chesspiecelogic/bishop.ts";

import whitequeen from '../../../pages/chess/assets/whitequeen.png';
import whiteking from '../../../pages/chess/assets/whiteking.png';
import whitebishop from '../../../pages/chess/assets/whitebishop.png';
import whiteknight from '../../../pages/chess/assets/whiteknight.png';
import whiterook from '../../../pages/chess/assets/whiterook.png';
import whitepawn from '../../../pages/chess/assets/whitepawn.png';
import blackqueen from '../../../pages/chess/assets/blackqueen.png';
import blackking from '../../../pages/chess/assets/blackking.png';
import blackbishop from '../../../pages/chess/assets/blackbishop.png';
import blackknight from '../../../pages/chess/assets/blackknight.png';
import blackrook from '../../../pages/chess/assets/blackrook.png';
import blackpawn from '../../../pages/chess/assets/blackpawn.png';
import {getChessSessionWithId, postMove} from "../../../util/games/chessapi.tsx";

type ChessboardProps = {
    myTeam: Team,
    sessionId?: number
}

type PieceType = 'KNIGHT' | 'BISHOP' | 'ROOK' | 'QUEEN' | 'KING' | 'PAWN' | '';

type Team = 'WHITE' | 'BLACK' | '';

type Piece = {
    moved: boolean,
    type: PieceType,
    team: Team
};

type Tile = {
    piece: Piece | null,
    color: string,
    id: number
}

type GameStatus = 'IN_PROGRESS' | 'WHITE_WON' | 'BLACK_WON' | 'STALEMATE' | 'DRAW';

type ChessSession = {
    id: number,
    whitePlayer: string,
    blackPlayer: string,
    turn: Team,
    gameStatus: GameStatus,
    recentMove: {
        piece: PieceType,
        startPosition: number,
        endPosition: number,
        isCapture: boolean,
        isCheck: boolean,
        isCheckmate: boolean,
    },
    updatedAt: Date
}

const Chessboard: React.FC<ChessboardProps> = ({ myTeam, sessionId }) => {

    const [chessboard, setChessboard] = useState<Tile[]>([]);
    const [selectedTile, setSelectedTile] = useState<null | Tile>(null);
    const [chessSession, setChessSession] = useState<ChessSession | null>(null);
    const [turn, setTurn] = useState<Team>('WHITE');
    const [latestMove, setLatestMove] = useState<{startPosition: number, endPosition: number} | null>(null);
    function getPieceType(piece: string) : PieceType{
        if (piece === '♜' || piece === '♖') {
            return 'ROOK';
        } else if (piece === '♞' || piece === '♘') {
            return 'KNIGHT';
        } else if (piece === '♝' || piece === '♗') {
            return 'BISHOP';
        } else if (piece === '♛' || piece === '♕') {
            return 'QUEEN';
        } else if (piece === '♚' || piece === '♔') {
            return 'KING';
        } else if (piece === '♟' || piece === '♙') {
            return 'PAWN';
        } else {
            return '';
        }
    }



    function getPieceTeam(piece: string) : Team {
        return (piece === '♔' || piece === '♕' || piece === '♖' ||
            piece === '♗' || piece === '♘' || piece === '♙') ?
            'WHITE' : 'BLACK';
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

        if (myTeam && myTeam.toUpperCase() === 'BLACK') {
            let isLight = true;
            let board: Tile[] = [];
            for (let i = 63; i >= 0; i--) {
                isLight = !isLight;
                if ((i + 1) % 8 === 0) {
                    isLight = !isLight;
                }
                const piece:Piece = {
                    moved: false,
                    type: getPieceType(pieces[i]),
                    team: getPieceTeam(pieces[i]),
                };
                const tile: Tile = {
                    id: i,
                    color: isLight ? 'light' : 'dark',
                    piece: piece.type === '' ? null : piece
                };
                board.push(tile);
            }
            setChessboard(board);
        }
        else{
            let isLight = true;
            let board: Tile[] = [];
            for (let i = 0; i <= 63; i++) {
                const piece:Piece = {
                    moved: false,
                    type: getPieceType(pieces[i]),
                    team: getPieceTeam(pieces[i]),
                };
                const tile: Tile = {
                    id: i,
                    color: isLight ? 'light' : 'dark',
                    piece: piece.type === '' ? null : piece
                };
                board.push(tile);
                isLight = !isLight;
                if ((i + 1) % 8 === 0) {
                    isLight = !isLight;
                }
            }
            setChessboard(board);
        }

    }, [myTeam]);

    useEffect(() => {
        if (!sessionId) {
            return;
        }

        console.log(latestMove);

        const boardUpdateInterval = setInterval(() => {
            const fetchData = async () => {
                const newSessionState = await getChessSessionWithId(sessionId);

                console.log(newSessionState);
                console.log(latestMove);

                if (
                    newSessionState &&
                    (
                        newSessionState.recentMove.startPosition !== latestMove?.startPosition ||
                        newSessionState.recentMove.endPosition !== latestMove?.endPosition
                    )
                ) {
                    setChessSession(newSessionState);
                }
            };

            fetchData();
        }, 3000);

        return () => clearInterval(boardUpdateInterval);
    }, [sessionId, latestMove]);

    useEffect(() => {
        if (chessSession === null || !setTurn) {
            return;
        }

        if (chessSession.recentMove) {
            const recentMove = chessSession.recentMove;
            console.log(recentMove);
            movePiece(recentMove.startPosition, recentMove.endPosition);
            setLatestMove({startPosition: recentMove.startPosition, endPosition: recentMove.endPosition});
            setTurn(chessSession.turn);
        }

    }, [chessSession]);



    function isCheckmate(team: Team, boardState: Tile[]) {
        for (let i = 0; i < boardState.length; i++) {
            if (boardState[i].piece === null){
                continue;
            }
            if (boardState[i] && boardState[i].piece?.team === team) {
                let validMoves:number[] = [];
                switch(boardState[i].piece?.type) {
                    case 'KING':
                        validMoves = getKingValidMoves(boardState[i].id, boardState);
                        break;
                    case 'QUEEN':
                        validMoves = getQueenValidMoves(boardState[i].id, boardState);
                        break;
                    case 'ROOK':
                        validMoves = getRookValidMoves(boardState[i].id, boardState);
                        break;
                    case 'BISHOP':
                        validMoves = getBishopValidMoves(boardState[i].id, boardState);
                        break;
                    case 'KNIGHT':
                        validMoves = getKnightValidMoves(boardState[i].id, boardState);
                        break;
                    case 'PAWN':
                        validMoves = getPawnValidMoves(boardState[i].id, boardState);
                        break;
                }
                for (let move of validMoves) {
                    let hypotheticalBoardState = JSON.parse(JSON.stringify(chessboard)) as Tile[];
                    hypotheticalBoardState[move] = hypotheticalBoardState[i];
                    hypotheticalBoardState[i].piece = null;
                    if (!isKingInCheck(team, hypotheticalBoardState)) {
                        return false;
                    }
                }
            }
        }
        return true;
    }

    function isKingInCheck(team: Team, boardState: Tile[]) {
        let kingPosition = chessboard.findIndex(({piece}) => piece && piece.type === 'KING' && piece.team === myTeam);

        const opposingTeam = team.toUpperCase() === 'WHITE' ? 'BLACK' : 'WHITE';

        console.log(boardState);
        for (let i = 0; i < boardState.length; i++) {
            let validMoves;
            if (boardState[i] && boardState[i].color.toUpperCase() === opposingTeam) {
                if (boardState[i].piece?.type === 'KNIGHT'){
                    validMoves = getKnightValidMoves(boardState[i].id, boardState);
                } else if (boardState[i].piece?.type === 'BISHOP'){
                    validMoves = getBishopValidMoves(boardState[i].id, boardState);
                }else if (boardState[i].piece?.type === 'PAWN'){
                    validMoves = getPawnValidMoves(boardState[i].id, boardState);
                }else if (boardState[i].piece?.type === 'QUEEN'){
                    validMoves = getQueenValidMoves(boardState[i].id, boardState);
                } else if (boardState[i].piece?.type === 'ROOK'){
                    validMoves = getRookValidMoves(boardState[i].id, boardState);
                }
                else if (boardState[i].piece?.type === 'KING'){
                    validMoves = getKingValidMoves(boardState[i].id, boardState);
                }
                if (validMoves && validMoves.includes(Number(kingPosition))) {
                    return true;
                }
            }
        }
        return false;
    }

    function canMove(fromTile: number, toTile: number, pieceType: PieceType, boardState: Tile[]) {

        let hypotheticalBoardState = JSON.parse(JSON.stringify(chessboard)) as Tile[];

        hypotheticalBoardState[toTile].piece = hypotheticalBoardState[fromTile].piece;

        hypotheticalBoardState[fromTile].piece = null;

        let kingPosition = chessboard.findIndex(({piece}) => piece && piece.type === 'KING' && piece.team === myTeam);

        let kingTile = boardState[kingPosition];

        if (isKingInCheck(myTeam, hypotheticalBoardState)) {
            console.log('cant move there')
            return false;
        }
        else {
            if (kingTile.color === 'light'){
                // kingTile.style.backgroundColor = 'var(--light-tile)';
            }
            else {
                // kingTile.style.backgroundColor = 'var(--dark-tile)';
            }
        }


        switch (pieceType) {
            case 'ROOK':
                const validRookMoves = getRookValidMoves(fromTile, boardState);
                return validRookMoves.includes(Number(toTile));

            case 'KNIGHT':
                const validKnightMoves = getKnightValidMoves(fromTile, boardState);
                return validKnightMoves.includes(Number(toTile));

            case 'BISHOP':
                const validBishopMoves = getBishopValidMoves(fromTile, boardState);
                return validBishopMoves.includes(Number(toTile));

            case 'QUEEN':
                const validQueenMoves = getQueenValidMoves(fromTile, boardState);
                return validQueenMoves.includes(Number(toTile));

            case 'KING':
                const validKingMoves = getKingValidMoves(fromTile, boardState);
                return validKingMoves.includes(Number(toTile)) || canCastle(fromTile, toTile, boardState);
            case 'PAWN':
                const validPawnMoves = getPawnValidMoves(fromTile, boardState);
                return validPawnMoves.includes(Number(toTile));
            default:
                return false;
        }
    }

    function canCastle(fromTile: number, toTile: number, boardState: Tile[]) {
        const from = Number(fromTile);
        const to = Number(toTile);
        const king = boardState[from];

        if (!king.piece){
            console.log('you shouldnt be calling can castle u have no king in the from position')
            return;
        }

        if (king?.piece.moved || isKingInCheck(king?.piece.team, boardState)) {
            return false;
        }

        if (to === from + 2) {

            const rook = boardState[from + 3].piece;
            if (rook && rook.type === 'ROOK' && !rook.moved) {
                if (!boardState[from + 1] && !boardState[from + 2]) {
                    for (let i = 0; i <= 2; i++) {
                        const intermediatePosition = from + i;
                        const intermediateBoardState = boardState.map((tile, i) => {
                            if (i === from) {
                                tile.piece = null;
                                return tile;
                            } else if (i === intermediatePosition) {
                                return king;
                            } else {
                                return tile;
                            }
                        });
                        if (isKingInCheck(king.piece.team, intermediateBoardState)) {
                            return false;
                        }
                    }
                    return true;
                }
            }
        }

        if (to === from - 2) {

            const rook = boardState[from - 4].piece;
            if (rook && rook.type === 'ROOK' && !rook.moved) {
                if (!boardState[from - 1] && !boardState[from - 2] && !boardState[from - 3]) {
                    for (let i = 0; i >= -2; i--) {
                        const intermediatePosition = from + i;
                        const intermediateBoardState = boardState.map((tile, i) => {
                            if (i === from) {
                                tile.piece = null;
                                return tile;
                            } else if (i === intermediatePosition) {
                                return king;
                            } else {
                                return tile;
                            }
                        });
                        if (isKingInCheck(king.piece.team, intermediateBoardState)) {
                            return false;
                        }
                    }
                    return true;
                }
            }
        }

        return false;
    }

    const movePiece = (fromTile: number, toTile: number) => {
        const fromTileNumber = Number(fromTile);
        const toTileNumber = Number(toTile);
        const newChessBoard = JSON.parse(JSON.stringify(chessboard)) as Tile[];
        const fromIndex = newChessBoard.findIndex(tile => tile.id === fromTileNumber);
        const toIndex = newChessBoard.findIndex(tile => tile.id === toTileNumber);

        console.log(`fromTile: ${fromTileNumber}, toTile: ${toTileNumber}`);
        console.log(`fromIndex: ${fromIndex}, toIndex: ${toIndex}`);

        if (fromIndex >= 0 && toIndex >= 0) {
            newChessBoard[toIndex].piece = newChessBoard[fromIndex].piece;
            newChessBoard[fromIndex].piece = null;
        }

        console.log(newChessBoard);
        setChessboard(newChessBoard);
    }

    const handleClickTile = async (tile: Tile) => {

        if (!sessionId || myTeam !== turn){
            return;
        }
        if (tile.piece && !selectedTile?.piece) {
            if (tile.piece.team !== turn) {
                return;
            }

            setSelectedTile(tile);
        }
        else {
            //if there is a piece selected, and the piece type can move to the tapped tile, and the tile is occupied by a different
            //colored piece or no piece
            if (!selectedTile){
                return;
            }
            if (selectedTile.piece){
                console.log(selectedTile.piece.type);
            console.log(canMove(selectedTile.id, tile.id, selectedTile.piece.type, chessboard));
            }
            if (selectedTile.piece && (tile.piece === null || (tile.piece.team !== selectedTile.piece.team))
                && canMove(selectedTile.id, tile.id, selectedTile.piece.type, chessboard)) {

                if (tile.piece) {
                        //update moved status of piece
                }

                if (selectedTile.piece.type.toUpperCase() === 'PAWN'){
                    if (selectedTile.piece.team.toUpperCase() === 'WHITE'){
                        if (tile.id <= 7){
                            //Promotion logic for white pawn
                            setSelectedTile({...selectedTile, piece: {type: 'QUEEN', team: 'WHITE', moved: true}});
                        }
                    }
                    else if (selectedTile.piece.team.toUpperCase() === 'BLACK'){
                        if (tile.id >= 56){
                            //Promotion logic for black pawn
                            setSelectedTile({...selectedTile, piece: {type: 'QUEEN', team: 'BLACK', moved: true}});
                        }
                    }
                }

                await postMove(sessionId, selectedTile.id, tile.id, selectedTile.piece.type);

                setSelectedTile(null);
            } else if (tile.id === selectedTile.id) {
                setSelectedTile(null);
            }
            else if (selectedTile.piece && tile.piece && tile.piece.team === selectedTile.piece.team) {
                setSelectedTile(tile);
            }
        }
    };

    // useEffect(() => {
    //     let board = [];
    //     for (let i = 0; i < 64; i++) {
    //         const isLight = (Math.floor(i / 8) % 2 === 0) ? (i % 2 === 0) : (i % 2 === 1);
    //         const piece = pieces[i];
    //         board.push({tile: {piece: getPieceType(piece), color: isLight ? 'light' : 'dark', id: i + 1}, piece: {moved: false, type: getPieceType(piece), team: getPieceTeam(piece)}});
    //     }
    //     setChessboard(board);
    // }, []);

    function getPieceImage(team: Team, piece: PieceType) {
        if (team === 'WHITE') {
            switch (piece) {
                case 'QUEEN':
                    return whitequeen;
                case 'KING':
                    return whiteking;
                case 'BISHOP':
                    return whitebishop;
                case 'KNIGHT':
                    return whiteknight;
                case 'ROOK':
                    return whiterook;
                case 'PAWN':
                    return whitepawn;
                default:
                    return null;
            }
        } else if (team === 'BLACK') {
            switch (piece) {
                case 'QUEEN':
                    return blackqueen;
                case 'KING':
                    return blackking;
                case 'BISHOP':
                    return blackbishop;
                case 'KNIGHT':
                    return blackknight;
                case 'ROOK':
                    return blackrook;
                case 'PAWN':
                    return blackpawn;
                default:
                    return null;
            }
        }
    }

    return (
        <>
        {chessboard.map((tile) => (
                <div onClick={() => handleClickTile(tile)}
                    key={tile.id}
                    className={`tile ${tile.color}`}
                    style={{
                        backgroundColor: (selectedTile?.id === tile.id) ? 'red' : `var(--${tile.color}-tile)`,
                        cursor: tile.piece ? 'pointer' : 'default'
                    }}
                >
                    {tile.piece &&
                        <div
                            data-moved="false"
                            className="piece"
                            data-piece-type={getPieceType(tile.piece.type)}
                            data-team={getPieceTeam(tile.piece.type)}
                        >
                            <img
                                src={getPieceImage(tile.piece.team, tile.piece.type)}
                                alt={`${tile.piece.team} ${getPieceType(tile.piece.type)}`}
                            />
                        </div>
                    }
                </div>
            ))}
        </>
    )
}

export default Chessboard;